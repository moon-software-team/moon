/**
 * @brief Represents the current status of the Moon.
 * @description This type defines the possible states of the Moon application,
 * indicating whether it is off, loading, in ambient mode, playing media, or paused.
 * It is used to track the application's state and manage its behavior accordingly.
 * The status can be used to update the user interface or trigger specific actions
 * based on the current state of the application.
 */
export type MoonStatus = 'off' | 'loading' | 'ambient' | 'playing' | 'paused';
