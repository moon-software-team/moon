/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Association,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Sequelize
} from 'sequelize';
import { LibrarySection } from './librarySection';
import { SectionLocation } from './sectionLocation';
import { MetadataItem } from './metadataItem';
import { MediaStream } from './mediaStream';
import { MediaPart } from './mediaPart';

/** Interface for the models attributes */
interface MediaItemAttributes {
  id: number;
  library_section_id: number;
  section_location_id: number;
  metadata_item_id: number;
  width: number;
  height: number;
  size: number;
  duration: number;
  bitrate: number;
  container: string;
  video_codec: string;
  audio_codec: string;
  display_aspect_ratio: number;
  sample_aspect_ratio: number;
  frames_per_second: number;
  audio_channels: number;
  interlaced: boolean;
  hints: string;
  display_offset: number;
  settings: string;
  begins_at: number;
  ends_at: number;
  color_trc: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

/** Interface for the model's creation attributes */
interface MediaItemCreationAttributes extends Optional<MediaItemAttributes, 'id'> {}

/**
 * @brief MediaItem model class
 * @description This class represents a media item in the library. It extends the Sequelize Model class.
 */
export class MediaItem extends Model<MediaItemAttributes, MediaItemCreationAttributes> implements MediaItemAttributes {
  /** Model attributes */
  declare id: number;
  declare library_section_id: ForeignKey<LibrarySection['id']>;
  declare section_location_id: ForeignKey<SectionLocation['id']>;
  declare metadata_item_id: ForeignKey<MetadataItem['id']>;
  declare width: number;
  declare height: number;
  declare size: number;
  declare duration: number;
  declare bitrate: number;
  declare container: string;
  declare video_codec: string;
  declare audio_codec: string;
  declare display_aspect_ratio: number;
  declare sample_aspect_ratio: number;
  declare frames_per_second: number;
  declare audio_channels: number;
  declare interlaced: boolean;
  declare hints: string;
  declare display_offset: number;
  declare settings: string;
  declare begins_at: number;
  declare ends_at: number;
  declare color_trc: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date;

  /** Model options */
  declare readonly librarySection?: LibrarySection;
  declare readonly sectionLocation?: SectionLocation;
  declare readonly metadataItem?: MetadataItem;
  declare readonly mediaStreams?: MediaStream[];
  declare readonly mediaParts?: MediaPart[];

  /** Associations */
  declare static associations: {
    librarySection: Association<MediaItem, LibrarySection>;
    sectionLocation: Association<MediaItem, SectionLocation>;
    metadataItem: Association<MediaItem, MetadataItem>;
    mediaStreams: Association<MediaItem, MediaStream>;
    mediaParts: Association<MediaItem, MediaPart>;
  };

  /** Belongs to library section */
  declare getLibrarySection: BelongsToGetAssociationMixin<LibrarySection>;
  declare setLibrarySection: BelongsToSetAssociationMixin<LibrarySection, number>;
  declare createLibrarySection: BelongsToCreateAssociationMixin<LibrarySection>;

  /** Belongs to section location */
  declare getSectionLocation: BelongsToGetAssociationMixin<SectionLocation>;
  declare setSectionLocation: BelongsToSetAssociationMixin<SectionLocation, number>;
  declare createSectionLocation: BelongsToCreateAssociationMixin<SectionLocation>;

  /** Belongs to metadata item */
  declare getMetadataItem: BelongsToGetAssociationMixin<MetadataItem>;
  declare setMetadataItem: BelongsToSetAssociationMixin<MetadataItem, number>;
  declare createMetadataItem: BelongsToCreateAssociationMixin<MetadataItem>;

  /** Has many media streams */
  declare getMediaStreams: HasManyGetAssociationsMixin<MediaStream>;
  declare addMediaStream: HasManyAddAssociationMixin<MediaStream, number>;
  declare addMediaStreams: HasManyAddAssociationsMixin<MediaStream, number>;
  declare setMediaStreams: HasManySetAssociationsMixin<MediaStream, number>;
  declare removeMediaStream: HasManyRemoveAssociationMixin<MediaStream, number>;
  declare removeMediaStreams: HasManyRemoveAssociationsMixin<MediaStream, number>;
  declare hasMediaStream: HasManyHasAssociationMixin<MediaStream, number>;
  declare hasMediaStreams: HasManyHasAssociationsMixin<MediaStream, number>;
  declare countMediaStreams: HasManyCountAssociationsMixin;
  declare createMediaStream: HasManyCreateAssociationMixin<MediaStream>;

  /** Has many media parts */
  declare getMediaParts: HasManyGetAssociationsMixin<MediaPart>;
  declare addMediaPart: HasManyAddAssociationMixin<MediaPart, number>;
  declare addMediaParts: HasManyAddAssociationsMixin<MediaPart, number>;
  declare setMediaParts: HasManySetAssociationsMixin<MediaPart, number>;
  declare removeMediaPart: HasManyRemoveAssociationMixin<MediaPart, number>;
  declare removeMediaParts: HasManyRemoveAssociationsMixin<MediaPart, number>;
  declare hasMediaPart: HasManyHasAssociationMixin<MediaPart, number>;
  declare hasMediaParts: HasManyHasAssociationsMixin<MediaPart, number>;
  declare countMediaParts: HasManyCountAssociationsMixin;
  declare createMediaPart: HasManyCreateAssociationMixin<MediaPart>;
}

/**
 * @brief Initialize the MediaItem model.
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the MediaItem model by defining its attributes, options, and associations.
 */
export const initMediaItemModel = (sequelize: Sequelize) => {
  /** Initialize the MediaItem model */
  MediaItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      library_section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'library_sections',
          key: 'id'
        }
      },
      section_location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'section_locations',
          key: 'id'
        }
      },
      metadata_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'metadata_items',
          key: 'id'
        }
      },
      width: {
        type: DataTypes.INTEGER
      },
      height: {
        type: DataTypes.INTEGER
      },
      size: {
        type: DataTypes.INTEGER
      },
      duration: {
        type: DataTypes.INTEGER
      },
      bitrate: {
        type: DataTypes.INTEGER
      },
      container: {
        type: DataTypes.STRING
      },
      video_codec: {
        type: DataTypes.STRING
      },
      audio_codec: {
        type: DataTypes.STRING
      },
      display_aspect_ratio: {
        type: DataTypes.NUMBER
      },
      sample_aspect_ratio: {
        type: DataTypes.NUMBER
      },
      frames_per_second: {
        type: DataTypes.NUMBER
      },
      audio_channels: {
        type: DataTypes.NUMBER
      },
      interlaced: {
        type: DataTypes.BOOLEAN
      },
      hints: {
        type: DataTypes.STRING
      },
      display_offset: {
        type: DataTypes.NUMBER
      },
      settings: {
        type: DataTypes.STRING
      },
      begins_at: {
        type: DataTypes.NUMBER
      },
      ends_at: {
        type: DataTypes.NUMBER
      },
      color_trc: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'MediaItem',
      tableName: 'media_items',
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );
};

/** Export the MediaItem model */
export default MediaItem;
