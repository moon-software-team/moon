/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Association,
  ForeignKey,
  BelongsToGetAssociationMixin,
  Sequelize
} from 'sequelize';
import { Directory } from './directory';
import { MediaItem } from './mediaItem';

/** Interface for the models attributes */
interface MediaPartAttributes {
  id: number;
  media_item_id: number;
  directory_id: number;
  hash: string;
  open_subtitle_hash: string;
  file: string;
  size: number;
  duration: number;
  extra_data: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

/** Interface for the model's creation attributes */
interface MediaPartCreationAttributes extends Optional<MediaPartAttributes, 'id'> {}

/**
 * @brief MediaPart model class
 * @description This class represents a part of a media item, such as a file or segment
 */
export class MediaPart extends Model<MediaPartAttributes, MediaPartCreationAttributes> implements MediaPartAttributes {
  /** Model attributes */
  declare id: number;
  declare media_item_id: ForeignKey<MediaItem['id']>;
  declare directory_id: ForeignKey<Directory['id']>;
  declare hash: string;
  declare open_subtitle_hash: string;
  declare file: string;
  declare size: number;
  declare duration: number;
  declare extra_data: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date;

  /** Model options */
  declare readonly mediaItem?: MediaItem;
  declare readonly directory?: Directory;

  /** Associations */
  declare static associations: {
    mediaItem: Association<MediaPart, MediaItem>;
    directory: Association<MediaPart, Directory>;
  };

  /** Belongs to media item */
  declare getMediaItem: BelongsToGetAssociationMixin<MediaItem>;

  /** Belongs to directory */
  declare getDirectory: BelongsToGetAssociationMixin<Directory>;
}

/**
 * @brief Initialize the MediaPart model
 * @param sequelize - The Sequelize instance to use for the model
 * @description This function initializes the MediaPart model with its attributes and associations.
 */
export const initMediaPartModel = (sequelize: Sequelize) => {
  /** Initialize the MediaPart model */
  MediaPart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      media_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'media_items',
          key: 'id'
        }
      },
      directory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'directories',
          key: 'id'
        }
      },
      hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      open_subtitle_hash: {
        type: DataTypes.STRING
      },
      file: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      duration: {
        type: DataTypes.NUMBER
      },
      extra_data: {
        type: DataTypes.TEXT
      }
    },
    {
      sequelize,
      modelName: 'MediaPart',
      tableName: 'media_parts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );
};

export default MediaPart;
