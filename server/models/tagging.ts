/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  Association,
  Sequelize
} from 'sequelize';
import { Tag } from './tag';
import { MetadataItem } from './metadataItem';

/** Interface for the models attributes */
interface TaggingAttributes {
  id: number;
  tag_id: number;
  metadata_item_id: number;
  created_at?: Date;
  updated_at?: Date;
}

/** Interface for the model's creation attributes */
interface TaggingCreationAttributes extends Optional<TaggingAttributes, 'id'> {}

/**
 * @brief Tagging model class
 * @description This class represents a tagging relationship between tags and metadata items.
 * It extends the Sequelize Model class.
 */
export class Tagging extends Model<TaggingAttributes, TaggingCreationAttributes> implements TaggingAttributes {
  /** Model attributes */
  declare id: number;
  declare tag_id: ForeignKey<Tag['id']>;
  declare metadata_item_id: ForeignKey<MetadataItem['id']>;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  /** Model options */
  declare readonly metadataItem?: MetadataItem;
  declare readonly tag?: Tag;

  /** Associations */
  declare static associations: {
    metadataItem: Association<Tagging, MetadataItem>;
    tag: Association<Tagging, Tag>;
  };

  /** Belongs to tag */
  declare getTag: BelongsToGetAssociationMixin<Tag>;
  declare setTag: BelongsToSetAssociationMixin<Tag, number>;
  declare createTag: BelongsToCreateAssociationMixin<Tag>;

  /** Belongs to metadata item */
  declare getMetadataItem: BelongsToGetAssociationMixin<MetadataItem>;
  declare setMetadataItem: BelongsToSetAssociationMixin<MetadataItem, number>;
  declare createMetadataItem: BelongsToCreateAssociationMixin<MetadataItem>;
}

/**
 * @brief Initialize the Tagging model
 * @param sequelize - The Sequelize instance.
 * @description This function initializes the Tagging model with its attributes and associations.
 */
export const initTaggingModel = (sequelize: Sequelize) => {
  /** Initialize the model */

  Tagging.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tags',
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
      }
    },
    {
      sequelize,
      modelName: 'Tagging',
      tableName: 'taggings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['tag_id', 'metadata_item_id']
        }
      ]
    }
  );
};

/** Export the Tagging model */
export default Tagging;
