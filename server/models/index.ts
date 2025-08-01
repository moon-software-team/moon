/** Dependencies */
import { Sequelize } from 'sequelize';

/** Models */
import { LibrarySection, initLibrarySectionModel } from './librarySection';
import { Directory, initDirectoryModel } from './directory';
import { LibrarySectionPermission, initLibrarySectionPermissionModel } from './librarySectionPermission';
import { SectionLocation, initSectionLocationModel } from './sectionLocation';
import { User, initUserModel } from './user';
import { MediaItem, initMediaItemModel } from './mediaItem';
import { MediaPart, initMediaPartModel } from './mediaPart';
import { MediaStream, initMediaStreamModel } from './mediaStream';
import { MetadataItem, initMetadataItemModel } from './metadataItem';
import { Tag, initTagModel } from './tag';
import { Tagging, initTaggingModel } from './tagging';

/**
 * @brief Initialize all models in the application.
 * @param sequelize - The Sequelize instance to use for the models.
 * @description This function initializes all models by calling their respective initialization functions.
 * It is typically called after the database connection has been established.
 * This ensures that the models are ready to be used for database operations.
 */
export const initModels = (sequelize: Sequelize) => {
  /** Initialize all models */
  initLibrarySectionModel(sequelize);
  initDirectoryModel(sequelize);
  initLibrarySectionPermissionModel(sequelize);
  initSectionLocationModel(sequelize);
  initUserModel(sequelize);
  initMediaItemModel(sequelize);
  initMediaPartModel(sequelize);
  initMediaStreamModel(sequelize);
  initMetadataItemModel(sequelize);
  initTagModel(sequelize);
  initTaggingModel(sequelize);

  /** Define associations */
  Directory.belongsTo(Directory, {
    foreignKey: 'parent_directory_id',
    as: 'parentDirectory'
  });

  Directory.hasMany(Directory, {
    foreignKey: 'parent_directory_id',
    as: 'childrenDirectories'
  });

  LibrarySection.hasMany(MediaItem, {
    foreignKey: 'library_section_id',
    as: 'mediaItems'
  });

  LibrarySection.hasMany(SectionLocation, {
    foreignKey: 'library_section_id',
    as: 'sectionLocations'
  });

  LibrarySection.hasMany(LibrarySectionPermission, {
    foreignKey: 'library_section_id',
    as: 'librarySectionPermissions'
  });

  MediaItem.belongsTo(LibrarySection, {
    foreignKey: 'library_section_id',
    as: 'librarySection'
  });

  MediaItem.belongsTo(SectionLocation, {
    foreignKey: 'section_location_id',
    as: 'sectionLocation'
  });

  MediaItem.belongsTo(MetadataItem, {
    foreignKey: 'metadata_item_id',
    as: 'metadataItem'
  });

  MediaItem.hasMany(MediaItem, {
    foreignKey: 'media_item_id',
    as: 'mediaStreams'
  });

  MediaItem.belongsTo(MediaItem, {
    foreignKey: 'media_item_id',
    as: 'mediaItem'
  });

  MediaItem.hasMany(MediaPart, {
    foreignKey: 'media_item_id',
    as: 'mediaParts'
  });

  MediaPart.belongsTo(MediaItem, {
    foreignKey: 'media_item_id',
    as: 'mediaItem'
  });

  MediaPart.belongsTo(Directory, {
    foreignKey: 'directory_id',
    as: 'directory'
  });

  MetadataItem.hasMany(MediaItem, {
    foreignKey: 'metadata_item_id',
    as: 'mediaItems'
  });

  MetadataItem.belongsToMany(Tag, {
    through: Tagging,
    foreignKey: 'metadata_item_id',
    otherKey: 'tag_id',
    as: 'tags'
  });

  SectionLocation.hasMany(MediaItem, {
    foreignKey: 'section_location_id',
    as: 'mediaItems'
  });

  SectionLocation.belongsTo(LibrarySection, {
    foreignKey: 'library_section_id',
    as: 'librarySection'
  });

  Tag.belongsToMany(MetadataItem, {
    through: Tagging,
    foreignKey: 'tag_id',
    otherKey: 'metadata_item_id',
    as: 'metadataItems'
  });
};

/** Export the models */
export {
  LibrarySection,
  Directory,
  LibrarySectionPermission,
  SectionLocation,
  User,
  MediaItem,
  MediaPart,
  MediaStream,
  MetadataItem,
  Tag,
  Tagging
};
