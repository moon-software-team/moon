/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Association,
  BelongsToManyAddAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyHasAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  Sequelize
} from 'sequelize';
import { TagType } from '@/types/common';
import { MetadataItem } from './metadataItem';

/** Interface for the models attributes */
interface TagAttributes {
  id: number;
  tag_type: TagType;
  tag: string;
}

/** Interface for the model's creation attributes */
interface TagCreationAttributes extends Optional<TagAttributes, 'id'> {}

/**
 * @brief Tag model class
 * @description This class represents a tag in the system. It extends the Sequelize Model class.
 */
export class Tag extends Model<TagAttributes, TagCreationAttributes> implements TagAttributes {
  /** Model attributes */
  declare id: number;
  declare tag_type: TagType;
  declare tag: string;

  /** Model options */
  declare readonly metadataItems?: MetadataItem[];

  /** Associations */
  declare static associations: {
    metadataItems: Association<Tag, MetadataItem>;
  };

  /** Belongs to many metadata items */
  declare getMetadataItems: BelongsToManyGetAssociationsMixin<MetadataItem>;
  declare addMetadataItem: BelongsToManyAddAssociationMixin<MetadataItem, number>;
  declare addMetadataItems: BelongsToManyAddAssociationsMixin<MetadataItem, number>;
  declare setMetadataItems: BelongsToManySetAssociationsMixin<MetadataItem, number>;
  declare removeMetadataItem: BelongsToManyRemoveAssociationMixin<MetadataItem, number>;
  declare removeMetadataItems: BelongsToManyRemoveAssociationsMixin<MetadataItem, number>;
  declare hasMetadataItem: BelongsToManyHasAssociationMixin<MetadataItem, number>;
  declare hasMetadataItems: BelongsToManyHasAssociationsMixin<MetadataItem, number>;
  declare countMetadataItems: BelongsToManyCountAssociationsMixin;
  declare createMetadataItem: BelongsToManyCreateAssociationMixin<MetadataItem>;
}

/**
 * @brief Initialize the Tag model
 * @param sequelize - The Sequelize instance.
 * @description This function initializes the Tag model with its attributes and associations.
 */
export const initTagModel = (sequelize: Sequelize): void => {
  /** Define the model */
  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tag_type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'tags',
      timestamps: false
    }
  );
};

/** Export the model */
export default Tag;
