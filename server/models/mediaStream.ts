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
import { LanguageCode, StreamType } from '@/types/common';
import { MediaItem } from './mediaItem';

/** Interface for the models attributes */
interface MediaStreamAttributes {
  id: number;
  media_item_id: number;
  type: StreamType;
  codec: string;
  language: LanguageCode;
  channels: number;
  bitrate: number;
  forced: boolean;
  extra_data: string;
  index: number;
  created_at?: Date;
  updated_at?: Date;
}

/** Interface for the model's creation attributes */
interface MediaStreamCreationAttributes extends Optional<MediaStreamAttributes, 'id'> {}

/**
 * @brief MediaStream model class
 * @description This class represents a media stream associated with a media item.
 * It extends the Sequelize Model class.
 */
export class MediaStream
  extends Model<MediaStreamAttributes, MediaStreamCreationAttributes>
  implements MediaStreamAttributes
{
  /** Model attributes */
  declare id: number;
  declare media_item_id: ForeignKey<MediaItem['id']>;
  declare type: StreamType;
  declare codec: string;
  declare language: LanguageCode;
  declare channels: number;
  declare bitrate: number;
  declare forced: boolean;
  declare extra_data: string;
  declare index: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  /** Model options */
  declare readonly mediaItem?: MediaItem;

  /** Associations */
  declare static associations: {
    mediaItem: Association<MediaStream, MediaItem>;
  };

  /** Belongs to media item */
  declare getMediaItem: BelongsToGetAssociationMixin<MediaItem>;
}

/**
 * @brief Initialize the MediaStream model.
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the MediaStream model by defining its attributes,
 * options, and associations. It is typically called after the database connection has been established.
 */
export const initMediaStreamModel = (sequelize: Sequelize) => {
  /** Initialize the MediaStream model */
  MediaStream.init(
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
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      codec: {
        type: DataTypes.STRING,
        allowNull: false
      },
      language: {
        type: DataTypes.ENUM(...Object.values(LanguageCode)),
        allowNull: true
      },
      channels: {
        type: DataTypes.INTEGER
      },
      bitrate: {
        type: DataTypes.INTEGER
      },
      forced: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      extra_data: {
        type: DataTypes.TEXT
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'MediaStream',
      tableName: 'media_streams',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
};

/** Export the model */
export default MediaStream;
