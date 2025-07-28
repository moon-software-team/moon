const socket = io();

const ENDPOINT = 'http://192.168.1.102:32400/';
const TOKEN = 'ggJok5-cxQDXtbKGycLD';

// Fullscreen functionality
function enterFullscreen() {
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen().catch((err) => {
      console.log('Failed to enter fullscreen:', err);
    });
  } else if (element.webkitRequestFullscreen) {
    // Safari
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    // Safari
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE/Edge
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  }
}

function toggleFullscreen() {
  if (
    !document.fullscreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement &&
    !document.mozFullScreenElement
  ) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

// Auto-enter fullscreen on load
function initializeFullscreen() {
  // Request fullscreen after user interaction (due to browser security policies)
  const autoEnterFullscreen = () => {
    enterFullscreen();
    // Remove the event listeners after first interaction
    document.removeEventListener('click', autoEnterFullscreen);
    document.removeEventListener('touchstart', autoEnterFullscreen);
    document.removeEventListener('keydown', autoEnterFullscreen);
  };

  // Try to enter fullscreen immediately (may fail in some browsers)
  enterFullscreen();

  // If immediate fullscreen fails, wait for user interaction
  document.addEventListener('click', autoEnterFullscreen, { once: true });
  document.addEventListener('touchstart', autoEnterFullscreen, { once: true });
  document.addEventListener('keydown', autoEnterFullscreen, { once: true });
}

// Lazy loading configuration
const ITEMS_PER_BATCH = 20; // Number of items to load per batch
let currentBatch = 0;
let allItems = [];
let isLoading = false;

// Search state
let filteredItems = [];
let isSearchActive = false;
let searchQuery = '';
let searchTimeout = null;

async function plex(endpoint, params = {}) {
  const url = new URL(endpoint, ENDPOINT);

  url.search = new URLSearchParams({
    ...params,
    'X-Plex-Token': TOKEN
  });

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

const SECTION_CONTAINER = document.querySelector('.section__container');
const SECTION_CONTENT_CONTAINER = document.querySelector('.section-content__container');
const LOADER_CONTAINER = document.querySelector('.loader__container');
const SEARCH = document.querySelector('.search');
const SEARCH_INPUT = document.querySelector('.search-input');
const SEARCH_BUTTON = document.querySelector('.search-button');
const SEARCH_CLEAR = document.querySelector('.search-clear');

// Modal elements
const MODAL_OVERLAY = document.getElementById('movieModal');
const MODAL_CLOSE = document.querySelector('.modal-close');
const MODAL_POSTER = document.getElementById('modalPoster');
const MODAL_TITLE = document.getElementById('modalTitle');
const MODAL_YEAR = document.getElementById('modalYear');
const MODAL_DURATION = document.getElementById('modalDuration');
const MODAL_RATING = document.getElementById('modalRating');
const MODAL_SUMMARY = document.getElementById('modalSummary');
const MODAL_GENRES = document.getElementById('modalGenres');
const PLAY_BUTTON = document.getElementById('playButton');

// Store current movie data for play functionality
let currentMovieData = null;
let availableAudioTracks = [];
let availableSubtitleTracks = [];

// Create intersection observer for lazy loading
let intersectionObserver;

function createIntersectionObserver() {
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoading) {
          loadNextBatch();
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '100px'
    }
  );
}

function createMetadataItem(item) {
  const itemElement = document.createElement('div');
  itemElement.className = 'metadata-item';
  itemElement.innerHTML = `
    <div class="thumbnail">
        <img src="" data-src="http://192.168.1.102:32400${item.thumb}?X-Plex-Token=ggJok5-cxQDXtbKGycLD" alt="${item.title}">
    </div>
    <div class="info">
        <div class="title">${item.title}</div>
        <div class="year">${item.year}</div>
    </div>`;
  itemElement.id = item.key;

  itemElement.addEventListener('click', () => {
    showMovieModal(item);
  });

  return itemElement;
}

function formatDuration(durationMs) {
  if (!durationMs) return '';

  const totalMinutes = Math.floor(durationMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatRating(rating) {
  if (!rating) return '';
  return `${parseFloat(rating).toFixed(1)}`;
}

async function showMovieModal(item) {
  // Show modal immediately with basic info
  MODAL_TITLE.textContent = item.title;
  MODAL_YEAR.textContent = item.year || 'N/A';
  MODAL_POSTER.src = `http://192.168.1.102:32400${item.thumb}?X-Plex-Token=ggJok5-cxQDXtbKGycLD`;
  MODAL_POSTER.alt = item.title;

  // Clear previous detailed info
  MODAL_DURATION.textContent = item.duration ? formatDuration(item.duration) : 'N/A';
  MODAL_RATING.textContent = item.rating
    ? formatRating(item.rating)
    : item.audienceRating
    ? formatRating(item.audienceRating)
    : 'N/A';
  MODAL_SUMMARY.textContent = item.summary || 'No summary available.';
  MODAL_GENRES.innerHTML = '';

  // Store basic item data
  currentMovieData = item;

  // If we don't have detailed media info, fetch it
  if (!item.Media || !item.Media[0] || !item.Media[0].Part || !item.Media[0].Part[0].Stream) {
    try {
      const detailedResult = await plex(`/library/metadata/${item.ratingKey}`);
      if (detailedResult.MediaContainer.Metadata && detailedResult.MediaContainer.Metadata[0]) {
        currentMovieData = detailedResult.MediaContainer.Metadata[0];
      }
    } catch (error) {
      console.error('Error fetching detailed media info:', error);
    }
  }

  // Reset scroll position to top
  MODAL_OVERLAY.scrollTop = 0;
  const modalBody = document.querySelector('.modal-body');
  if (modalBody) {
    modalBody.scrollTop = 0;
  }

  // Show modal
  MODAL_OVERLAY.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function extractMediaTracks(movieData) {
  availableAudioTracks = [];
  availableSubtitleTracks = [];

  if (!movieData.Media || !movieData.Media[0] || !movieData.Media[0].Part || !movieData.Media[0].Part[0].Stream) {
    return;
  }

  const streams = movieData.Media[0].Part[0].Stream;

  streams.forEach((stream, index) => {
    if (stream.streamType === 2) {
      // Audio track
      const trackInfo = {
        index: index,
        id: stream.id,
        codec: stream.codec || 'Unknown',
        language: stream.language || stream.languageTag || 'Unknown',
        title: stream.title || '',
        channels: stream.channels || '',
        default: stream.default || false,
        selected: stream.selected || false
      };

      let displayName = `${trackInfo.language}`;
      if (trackInfo.codec) {
        displayName += ` (${trackInfo.codec.toUpperCase()})`;
      }
      if (trackInfo.channels) {
        displayName += ` ${trackInfo.channels}ch`;
      }
      if (trackInfo.title) {
        displayName += ` - ${trackInfo.title}`;
      }
      if (trackInfo.default) {
        displayName += ' [Default]';
      }

      trackInfo.displayName = displayName;
      availableAudioTracks.push(trackInfo);
    } else if (stream.streamType === 3) {
      // Subtitle track
      const trackInfo = {
        index: index,
        id: stream.id,
        codec: stream.codec || 'Unknown',
        language: stream.language || stream.languageTag || 'Unknown',
        title: stream.title || '',
        default: stream.default || false,
        forced: stream.forced || false,
        selected: stream.selected || false
      };

      let displayName = `${trackInfo.language}`;
      if (trackInfo.codec) {
        displayName += ` (${trackInfo.codec.toUpperCase()})`;
      }
      if (trackInfo.title) {
        displayName += ` - ${trackInfo.title}`;
      }
      if (trackInfo.forced) {
        displayName += ' [Forced]';
      }
      if (trackInfo.default) {
        displayName += ' [Default]';
      }

      trackInfo.displayName = displayName;
      availableSubtitleTracks.push(trackInfo);
    }
  });
}

function populateTrackSelectors() {
  // Clear existing options
  AUDIO_TRACK_SELECT.innerHTML = '<option value="-1">Default</option>';
  SUBTITLE_TRACK_SELECT.innerHTML = '<option value="-1">Off</option>';

  // Populate audio tracks
  availableAudioTracks.forEach((track, index) => {
    const option = document.createElement('option');
    option.value = index; // Use array index for VLC track selection
    option.textContent = track.displayName;
    if (track.selected || track.default) {
      option.selected = true;
    }
    AUDIO_TRACK_SELECT.appendChild(option);
  });

  // Populate subtitle tracks
  availableSubtitleTracks.forEach((track, index) => {
    const option = document.createElement('option');
    option.value = index; // Use array index for VLC track selection
    option.textContent = track.displayName;
    if (track.selected || track.default) {
      option.selected = true;
    }
    SUBTITLE_TRACK_SELECT.appendChild(option);
  });
}

function hideMovieModal() {
  MODAL_OVERLAY.classList.add('hidden');
  document.body.style.overflow = '';
  currentMovieData = null;
}

function playMovie() {
  if (currentMovieData) {
    // Extract track information before playing
    extractMediaTracks(currentMovieData);

    // Get the movie file path from Media array
    let moviePath = currentMovieData.key;

    // If detailed data is available, try to get the file path
    if (currentMovieData.Media && currentMovieData.Media.length > 0) {
      const media = currentMovieData.Media[0];
      if (media.Part && media.Part.length > 0) {
        moviePath = media.Part[0].file || moviePath;
      }
    }

    socket.emit('watch', {
      title: currentMovieData.title,
      uri: currentMovieData.Media[0].Part[0].file,
      audioTracks: availableAudioTracks,
      subtitleTracks: availableSubtitleTracks
    });

    hideMovieModal();
  }
}

// Create initial section elements
const MOVIE_ICON = `<svg aria-hidden="true" class="section-icon" fill="currentColor" height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 3H42C42.7957 3 43.5587 3.31607 44.1213 3.87868C44.6839 4.44129 45 5.20435 45 6V42C45 42.7957 44.6839 43.5587 44.1213 44.1213C43.5587 44.6839 42.7957 45 42 45H6C5.20435 45 4.44129 44.6839 3.87868 44.1213C3.31607 43.5587 3 42.7957 3 42V6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3ZM6 42H9L9 38H6V42ZM36 42H12V25H36V42ZM39 42H42V38H39V42ZM39 35H42V30H39V35ZM39 27H42V22H39V27ZM39 19H42V14H39V19ZM39 11H42V6H39V11ZM36 6L12 6L12 22H36V6ZM6 6L9 6V11H6L6 6ZM6 14H9V19H6L6 14ZM6 22H9V27H6L6 22ZM6 30H9V35H6L6 30Z" fill="currentColor" fill-rule="evenodd"></path></svg>`;
const TV_ICON = `<svg aria-hidden="true" class="section-icon" fill="currentColor" height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M6 5H42C42.7957 5 43.5587 5.31607 44.1213 5.87868C44.6839 6.44129 45 7.20435 45 8V34C45 34.7957 44.6839 35.5587 44.1213 36.1213C43.5587 36.6839 42.7957 37 42 37H6C5.20435 37 4.44129 36.6839 3.87868 36.1213C3.31607 35.5587 3 34.7957 3 34V8C3 7.20435 3.31607 6.44129 3.87868 5.87868C4.44129 5.31607 5.20435 5 6 5ZM6 34H42V8H6V34Z" fill="currentColor" fill-rule="evenodd"></path><path d="M36 43V40H12V43H36Z" fill="currentColor"></path></svg>`;

async function main() {
  const result = await plex('/library/sections');

  result.MediaContainer.Directory.forEach((section) => {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'section';
    sectionElement.innerHTML = `${section.type === 'movie' ? MOVIE_ICON : TV_ICON} <span>${section.title}</span>`;
    sectionElement.id = section.key;
    SECTION_CONTAINER.appendChild(sectionElement);
    sectionElement.addEventListener('click', () => {
      SECTION_CONTAINER.classList.add('hidden');
      LOADER_CONTAINER.classList.remove('hidden');
      fetchSectionContent(section.key);
    });
  });
}

main().catch((error) => {
  console.error('Error:', error);
  document.body.innerHTML = `<pre>Error: ${error.message}</pre>`;
});

// Search functionality
function performSearch(query) {
  searchQuery = query.toLowerCase().trim();

  if (!searchQuery) {
    clearSearch();
    return;
  }

  isSearchActive = true;

  // Filter items based on search query
  filteredItems = allItems.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchQuery) ||
      (item.year && item.year.toString().includes(searchQuery)) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery))
    );
  });

  // Clear current display
  SECTION_CONTENT_CONTAINER.innerHTML = '';

  // Display filtered results
  filteredItems.forEach((item, index) => {
    const itemElement = createMetadataItem(item);
    SECTION_CONTENT_CONTAINER.appendChild(itemElement);

    // Trigger animation after a short delay
    setTimeout(() => {
      itemElement.classList.add('loaded');

      // Setup image lazy loading
      const img = itemElement.querySelector('img');
      const thumbnail = itemElement.querySelector('.thumbnail');
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.onload = () => {
              image.classList.add('loaded');
              thumbnail.classList.add('loaded');
            };
            imgObserver.unobserve(image);
          }
        });
      });
      imgObserver.observe(img);
    }, index * 50);
  });

  // Show clear button
  SEARCH_CLEAR.classList.remove('hidden');
}

function clearSearch() {
  isSearchActive = false;
  searchQuery = '';
  SEARCH_INPUT.value = '';
  SEARCH_CLEAR.classList.add('hidden');

  // Clear any pending search timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
    searchTimeout = null;
  }

  // Reset to original view with lazy loading
  SECTION_CONTENT_CONTAINER.innerHTML = '';
  currentBatch = 0;
  loadNextBatch();
}

function debouncedSearch(query) {
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Set a new timeout to delay the search
  searchTimeout = setTimeout(() => {
    performSearch(query);
    searchTimeout = null;
  }, 300); // 300ms delay
}

// Add search event listeners
SEARCH_INPUT.addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length >= 2) {
    debouncedSearch(query);
  } else if (query.length === 0) {
    // Clear search immediately when input is empty
    clearSearch();
  }
});

SEARCH_INPUT.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    performSearch(e.target.value);
  }
});

SEARCH_BUTTON.addEventListener('click', () => {
  performSearch(SEARCH_INPUT.value);
});

SEARCH_CLEAR.addEventListener('click', () => {
  clearSearch();
});

// Modal event listeners
MODAL_CLOSE.addEventListener('click', hideMovieModal);
PLAY_BUTTON.addEventListener('click', playMovie);

// Close modal when clicking outside
MODAL_OVERLAY.addEventListener('click', (e) => {
  if (e.target === MODAL_OVERLAY) {
    hideMovieModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !MODAL_OVERLAY.classList.contains('hidden')) {
    hideMovieModal();
  }
});

async function fetchSectionContent(sectionKey) {
  try {
    const result = await plex(`/library/sections/${sectionKey}/all`);
    allItems = result.MediaContainer.Metadata || [];

    LOADER_CONTAINER.classList.add('hidden');
    SECTION_CONTENT_CONTAINER.classList.remove('hidden');
    SEARCH.classList.remove('hidden');

    // Initialize lazy loading
    createIntersectionObserver();

    // Load first batch
    currentBatch = 0;
    loadNextBatch();
  } catch (error) {
    console.error('Error fetching section content:', error);
    LOADER_CONTAINER.classList.add('hidden');
    SECTION_CONTENT_CONTAINER.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">Error loading content: ${error.message}</div>`;
    SECTION_CONTENT_CONTAINER.classList.remove('hidden');
  }
}

function loadNextBatch() {
  if (isLoading || isSearchActive) return;

  const itemsToDisplay = isSearchActive ? filteredItems : allItems;
  const startIndex = currentBatch * ITEMS_PER_BATCH;
  const endIndex = Math.min(startIndex + ITEMS_PER_BATCH, itemsToDisplay.length);

  if (startIndex >= itemsToDisplay.length) return;

  isLoading = true;

  // Remove existing sentinel if any
  const existingSentinel = SECTION_CONTENT_CONTAINER.querySelector('.loading-sentinel');
  if (existingSentinel) {
    existingSentinel.remove();
  }

  // Add items from current batch
  for (let i = startIndex; i < endIndex; i++) {
    const item = itemsToDisplay[i];
    const itemElement = createMetadataItem(item);
    SECTION_CONTENT_CONTAINER.appendChild(itemElement);

    // Trigger animation after a short delay
    setTimeout(() => {
      itemElement.classList.add('loaded');

      // Setup image lazy loading
      const img = itemElement.querySelector('img');
      const thumbnail = itemElement.querySelector('.thumbnail');
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            image.src = image.dataset.src;
            image.onload = () => {
              image.classList.add('loaded');
              thumbnail.classList.add('loaded');
            };
            image.onerror = () => {
              // Handle image load error
              thumbnail.classList.add('loaded');
            };
            imgObserver.unobserve(image);
          }
        });
      });
      imgObserver.observe(img);
    }, (i - startIndex) * 50);
  }

  currentBatch++;
  isLoading = false;

  // Add loading sentinel if there are more items
  if (endIndex < itemsToDisplay.length) {
    const sentinel = document.createElement('div');
    sentinel.className = 'loading-sentinel';
    SECTION_CONTENT_CONTAINER.appendChild(sentinel);
    intersectionObserver.observe(sentinel);
  }
}

// Request fullscreen after user interaction (due to browser security policies)
const autoEnterFullscreen = () => {
  enterFullscreen();
  // Remove the event listeners after first interaction
  document.removeEventListener('click', autoEnterFullscreen);
  document.removeEventListener('touchstart', autoEnterFullscreen);
  document.removeEventListener('keydown', autoEnterFullscreen);
};

// Try to enter fullscreen immediately (may fail in some browsers)
enterFullscreen();

// If immediate fullscreen fails, wait for user interaction
document.addEventListener('click', autoEnterFullscreen, { once: true });
document.addEventListener('touchstart', autoEnterFullscreen, { once: true });
document.addEventListener('keydown', autoEnterFullscreen, { once: true });

// Player state management
let isPlayerOpen = false;
let playerStatus = {
  state: 'stopped',
  position: 0,
  length: 0,
  volume: 100,
  currentTime: '00:00',
  totalTime: '00:00'
};
let statusUpdateInterval = null;
let isDragging = false;

// Player control elements
const CONTROL_CONTAINER = document.querySelector('.control__container');
const BACK_BUTTON = document.getElementById('backButton');
const PLAYER_TITLE = document.getElementById('playerTitle');
const CURRENT_TIME = document.getElementById('currentTime');
const TOTAL_TIME = document.getElementById('totalTime');
const PROGRESS_BAR = document.getElementById('progressBar');
const PROGRESS_FILL = document.getElementById('progressFill');
const PROGRESS_HANDLE = document.getElementById('progressHandle');
const PLAY_PAUSE_BTN = document.getElementById('playPauseBtn');
const PLAY_ICON = document.getElementById('playIcon');
const PAUSE_ICON = document.getElementById('pauseIcon');
const SKIP_BACK_BTN = document.getElementById('skipBackBtn');
const SKIP_FORWARD_BTN = document.getElementById('skipForwardBtn');
const VOLUME_BTN = document.getElementById('volumeBtn');
const VOLUME_ICON = document.getElementById('volumeIcon');
const MUTE_ICON = document.getElementById('muteIcon');
const VOLUME_SLIDER = document.getElementById('volumeSlider');
const AUDIO_TRACK_SELECT = document.getElementById('audioTrackSelect');
const SUBTITLE_TRACK_SELECT = document.getElementById('subtitleTrackSelect');
const CLOSE_PLAYER_BTN = document.getElementById('closePlayerBtn');

// Player control functions
function showPlayerControls(movieTitle = 'Unknown Movie') {
  isPlayerOpen = true;
  PLAYER_TITLE.textContent = movieTitle;

  // Hide other containers
  SECTION_CONTAINER.classList.add('hidden');
  SECTION_CONTENT_CONTAINER.classList.add('hidden');
  SEARCH.classList.add('hidden');
  MODAL_OVERLAY.classList.add('hidden');

  // Show player controls
  CONTROL_CONTAINER.classList.remove('hidden');

  // Start status updates
  startStatusUpdates();
}

function hidePlayerControls() {
  isPlayerOpen = false;

  // Hide player controls
  CONTROL_CONTAINER.classList.add('hidden');

  // Show section container (back to main menu)
  SECTION_CONTAINER.classList.remove('hidden');

  // Stop status updates
  stopStatusUpdates();
}

function startStatusUpdates() {
  if (statusUpdateInterval) {
    clearInterval(statusUpdateInterval);
  }

  statusUpdateInterval = setInterval(() => {
    if (isPlayerOpen) {
      requestPlayerStatus();
    }
  }, 1000); // Update every second
}

function stopStatusUpdates() {
  if (statusUpdateInterval) {
    clearInterval(statusUpdateInterval);
    statusUpdateInterval = null;
  }
}

function requestPlayerStatus() {
  // The backend will emit player status updates automatically
  // This is just a placeholder for requesting status if needed
}

function updatePlayerUI(status) {
  playerStatus = { ...playerStatus, ...status };

  // Update play/pause button
  if (status.state === 'playing') {
    PLAY_ICON.classList.add('hidden');
    PAUSE_ICON.classList.remove('hidden');
  } else {
    PLAY_ICON.classList.remove('hidden');
    PAUSE_ICON.classList.add('hidden');
  }

  // Update time display
  if (status.length && status.position !== undefined) {
    const currentSeconds = Math.floor(status.position * status.length);
    const totalSeconds = Math.floor(status.length);

    CURRENT_TIME.textContent = formatTime(currentSeconds);
    TOTAL_TIME.textContent = formatTime(totalSeconds);

    // Update progress bar (only if not dragging)
    if (!isDragging && status.length > 0) {
      const progressPercent = status.position * 100;
      PROGRESS_FILL.style.width = `${progressPercent}%`;
      PROGRESS_HANDLE.style.left = `${progressPercent}%`;
    }
  }

  // Update volume
  if (status.volume !== undefined) {
    const volumePercent = Math.round((status.volume / 256) * 100);
    VOLUME_SLIDER.value = volumePercent;

    // Update volume icon
    if (volumePercent === 0) {
      VOLUME_ICON.classList.add('hidden');
      MUTE_ICON.classList.remove('hidden');
    } else {
      VOLUME_ICON.classList.remove('hidden');
      MUTE_ICON.classList.add('hidden');
    }
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function setupProgressBarInteraction() {
  let isProgressDragging = false;

  function handleProgressStart(e) {
    isProgressDragging = true;
    isDragging = true;
    handleProgressMove(e);
  }

  function handleProgressMove(e) {
    if (!isProgressDragging) return;

    const rect = PROGRESS_BAR.getBoundingClientRect();
    const x = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    PROGRESS_FILL.style.width = `${percent}%`;
    PROGRESS_HANDLE.style.left = `${percent}%`;

    // Update time display
    if (playerStatus.length > 0) {
      const newTime = Math.floor((percent / 100) * playerStatus.length);
      CURRENT_TIME.textContent = formatTime(newTime);
    }
  }

  function handleProgressEnd(e) {
    if (!isProgressDragging) return;

    const rect = PROGRESS_BAR.getBoundingClientRect();
    const x = (e.type.includes('touch') ? e.changedTouches[0].clientX : e.clientX) - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));

    // Seek to new position
    socket.emit('seek-percent', percent);

    isProgressDragging = false;
    isDragging = false;
  }

  // Mouse events
  PROGRESS_BAR.addEventListener('mousedown', handleProgressStart);
  document.addEventListener('mousemove', handleProgressMove);
  document.addEventListener('mouseup', handleProgressEnd);

  // Touch events
  PROGRESS_BAR.addEventListener('touchstart', handleProgressStart);
  document.addEventListener('touchmove', handleProgressMove);
  document.addEventListener('touchend', handleProgressEnd);

  // Click to seek
  PROGRESS_BAR.addEventListener('click', (e) => {
    if (!isProgressDragging) {
      const rect = PROGRESS_BAR.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
      socket.emit('seek-percent', percent);
    }
  });
}

// Socket event listeners for player
socket.on('player-opened', (status) => {
  console.log('Player opened with status:', status);
  // Use title from server status instead of client-side movie data
  const movieTitle = status.title || 'Unknown Movie';
  showPlayerControls(movieTitle);
  updatePlayerUI(status);

  // Populate track selectors with available tracks
  populateTrackSelectors();

  // Update track selectors with current selections if provided
  if (status.currentAudioTrack !== undefined) {
    AUDIO_TRACK_SELECT.value = status.currentAudioTrack;
  }
  if (status.currentSubtitleTrack !== undefined) {
    SUBTITLE_TRACK_SELECT.value = status.currentSubtitleTrack;
  }
});

socket.on('player-status', (status) => {
  if (isPlayerOpen) {
    updatePlayerUI(status);
    // Update title if it changes or wasn't set before
    if (status.title && PLAYER_TITLE.textContent !== status.title) {
      PLAYER_TITLE.textContent = status.title;
    }

    // Update track selectors if track info changes
    if (status.currentAudioTrack !== undefined && AUDIO_TRACK_SELECT.value !== status.currentAudioTrack.toString()) {
      AUDIO_TRACK_SELECT.value = status.currentAudioTrack;
    }
    if (
      status.currentSubtitleTrack !== undefined &&
      SUBTITLE_TRACK_SELECT.value !== status.currentSubtitleTrack.toString()
    ) {
      SUBTITLE_TRACK_SELECT.value = status.currentSubtitleTrack;
    }
  }
});

socket.on('watch', (success) => {
  if (success) {
    // Don't need to call showPlayerControls here since 'player-opened' will handle it
    // with the correct title from the server
    console.log('Watch successful, waiting for player-opened event');
  }
});

socket.on('close', (success) => {
  if (success) {
    hidePlayerControls();
  }
});

socket.on('player-closed', () => {
  // Handle when player is closed by any client - hide UI controls
  hidePlayerControls();
});

// Player control event listeners
BACK_BUTTON.addEventListener('click', () => {
  socket.emit('close');
});

PLAY_PAUSE_BTN.addEventListener('click', () => {
  socket.emit('toggle-play-pause');
});

SKIP_BACK_BTN.addEventListener('click', () => {
  socket.emit('seek-relative', -10);
});

SKIP_FORWARD_BTN.addEventListener('click', () => {
  socket.emit('seek-relative', 10);
});

VOLUME_BTN.addEventListener('click', () => {
  const currentVolume = parseInt(VOLUME_SLIDER.value);
  if (currentVolume === 0) {
    socket.emit('volume', 100);
    VOLUME_SLIDER.value = 100;
  } else {
    socket.emit('volume', 0);
    VOLUME_SLIDER.value = 0;
  }
});

VOLUME_SLIDER.addEventListener('input', (e) => {
  const volume = parseInt(e.target.value);
  socket.emit('volume', volume);
});

AUDIO_TRACK_SELECT.addEventListener('change', (e) => {
  const trackId = parseInt(e.target.value);
  socket.emit('audio-track', trackId);
});

SUBTITLE_TRACK_SELECT.addEventListener('change', (e) => {
  const trackId = parseInt(e.target.value);
  socket.emit('subtitle-track', trackId);
});

CLOSE_PLAYER_BTN.addEventListener('click', () => {
  socket.emit('close');
});

// Keyboard shortcuts for player
document.addEventListener('keydown', (e) => {
  if (!isPlayerOpen) return;

  switch (e.key) {
    case ' ':
    case 'k':
      e.preventDefault();
      socket.emit('toggle-play-pause');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      socket.emit('seek-relative', -10);
      break;
    case 'ArrowRight':
      e.preventDefault();
      socket.emit('seek-relative', 10);
      break;
    case 'ArrowUp':
      e.preventDefault();
      const currentVol = parseInt(VOLUME_SLIDER.value);
      const newVol = Math.min(100, currentVol + 5);
      VOLUME_SLIDER.value = newVol;
      socket.emit('volume', newVol);
      break;
    case 'ArrowDown':
      e.preventDefault();
      const currentVolDown = parseInt(VOLUME_SLIDER.value);
      const newVolDown = Math.max(0, currentVolDown - 5);
      VOLUME_SLIDER.value = newVolDown;
      socket.emit('volume', newVolDown);
      break;
    case 'm':
      e.preventDefault();
      VOLUME_BTN.click();
      break;
    case 'Escape':
      e.preventDefault();
      hidePlayerControls();
      break;
  }
});

// Initialize progress bar interaction
setupProgressBarInteraction();
