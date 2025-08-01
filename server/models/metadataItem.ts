/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Association,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  Sequelize
} from 'sequelize';
import { MediaItem } from './mediaItem';
import { Tag } from './tag';
import { MetadataType } from '@/types/common';

/** Interface for the models attributes */
interface MetadataItemAttributes {
  id: number;
  metadata_type: MetadataType;
  guid: string;
  media_item_count: number;
  title: string;
  title_sort: string;
  original_title: string;
  studio: string;
  rating: number;
  rating_count: number;
  tagline: string;
  summary: string;
  trivia: string;
  quotes: string;
  content_rating: string;
  content_rating_age: number;
  duration: number;
  user_thumb_url: string;
  user_art_url: string;
  user_banner_url: string;
  user_music_url: string;
  user_fields: string;
  originally_available_at: Date;
  available_at: Date;
  expires_at: Date;
  refreshed_at: Date;
  year: number;
  extra_data: string;
  audience_rating: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

/** Interface for the model's creation attributes */
interface MetadataItemCreationAttributes extends Optional<MetadataItemAttributes, 'id'> {}

/**
 * @brief MetadataItem model class
 * @description This class represents a metadata item in the application. It extends the Sequelize Model class.
 */
export class MetadataItem
  extends Model<MetadataItemAttributes, MetadataItemCreationAttributes>
  implements MetadataItemAttributes
{
  /** Model attributes */
  declare id: number;
  declare metadata_type: MetadataType;
  declare guid: string;
  declare media_item_count: number;
  declare title: string;
  declare title_sort: string;
  declare original_title: string;
  declare studio: string;
  declare rating: number;
  declare rating_count: number;
  declare tagline: string;
  declare summary: string;
  declare trivia: string;
  declare quotes: string;
  declare content_rating: string;
  declare content_rating_age: number;
  declare duration: number;
  declare user_thumb_url: string;
  declare user_art_url: string;
  declare user_banner_url: string;
  declare user_music_url: string;
  declare user_fields: string;
  declare originally_available_at: Date;
  declare available_at: Date;
  declare expires_at: Date;
  declare refreshed_at: Date;
  declare year: number;
  declare extra_data: string;
  declare audience_rating: number;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at: Date;

  /** Model options */
  declare readonly mediaItems?: MediaItem[];
  declare readonly tags?: Tag[];

  /** Associations */
  declare static associations: {
    mediaItems: Association<MetadataItem, MediaItem>;
    tags: Association<MetadataItem, Tag>;
  };

  /** Has many media items */
  declare getMediaItems: HasManyGetAssociationsMixin<MediaItem>;
  declare addMediaItem: HasManyAddAssociationMixin<MediaItem, number>;
  declare addMediaItems: HasManyAddAssociationsMixin<MediaItem, number>;
  declare setMediaItems: HasManySetAssociationsMixin<MediaItem, number>;
  declare removeMediaItem: HasManyRemoveAssociationMixin<MediaItem, number>;
  declare removeMediaItems: HasManyRemoveAssociationsMixin<MediaItem, number>;
  declare hasMediaItem: HasManyHasAssociationMixin<MediaItem, number>;
  declare hasMediaItems: HasManyHasAssociationsMixin<MediaItem, number>;
  declare countMediaItems: HasManyCountAssociationsMixin;
  declare createMediaItem: HasManyCreateAssociationMixin<MediaItem>;

  /** Belongs to many tags */
  declare getTags: BelongsToManyGetAssociationsMixin<Tag>;
  declare addTag: BelongsToManyAddAssociationMixin<Tag, number>;
  declare addTags: BelongsToManyAddAssociationsMixin<Tag, number>;
  declare setTags: BelongsToManySetAssociationsMixin<Tag, number>;
  declare removeTag: BelongsToManyRemoveAssociationMixin<Tag, number>;
  declare removeTags: BelongsToManyRemoveAssociationsMixin<Tag, number>;
  declare hasTag: BelongsToManyHasAssociationMixin<Tag, number>;
  declare hasTags: BelongsToManyHasAssociationsMixin<Tag, number>;
  declare countTags: BelongsToManyCountAssociationsMixin;
  declare createTag: BelongsToManyCreateAssociationMixin<Tag>;
}

/**
 * @brief Initialize the MetadataItem model.
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the MetadataItem model by defining its attributes and associations.
 * It is typically called after the database connection has been established.
 */
export const initMetadataItemModel = (sequelize: Sequelize) => {
  /** Initialize the MetadataItem model */
  MetadataItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      metadata_type: {
        type: DataTypes.INTEGER
      },
      guid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4(),
        allowNull: false
      },
      media_item_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING
      },
      title_sort: {
        type: DataTypes.STRING
      },
      original_title: {
        type: DataTypes.STRING
      },
      studio: {
        type: DataTypes.STRING
      },
      rating: {
        type: DataTypes.FLOAT
      },
      rating_count: {
        type: DataTypes.INTEGER
      },
      tagline: {
        type: DataTypes.STRING
      },
      summary: {
        type: DataTypes.TEXT
      },
      trivia: {
        type: DataTypes.STRING
      },
      quotes: {
        type: DataTypes.STRING
      },
      content_rating: {
        type: DataTypes.STRING
      },
      content_rating_age: {
        type: DataTypes.INTEGER
      },
      duration: {
        type: DataTypes.INTEGER
      },
      user_thumb_url: {
        type: DataTypes.STRING
      },
      user_art_url: {
        type: DataTypes.STRING
      },
      user_banner_url: {
        type: DataTypes.STRING
      },
      user_music_url: {
        type: DataTypes.STRING
      },
      user_fields: {
        type: DataTypes.STRING
      },
      originally_available_at: {
        type: DataTypes.DATE
      },
      available_at: {
        type: DataTypes.DATE
      },
      expires_at: {
        type: DataTypes.DATE
      },
      refreshed_at: {
        type: DataTypes.DATE
      },
      year: {
        type: DataTypes.INTEGER
      },
      extra_data: {
        type: DataTypes.TEXT
      },
      audience_rating: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'MetadataItem',
      tableName: 'metadata_items',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at'
    }
  );
};

/** Export the model */
export default MetadataItem;
