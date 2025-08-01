/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Association,
  ForeignKey,
  HasManyAddAssociationMixin,
  HasManyAddAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  Sequelize
} from 'sequelize';
import { MediaPart } from './mediaPart';

/** Interface for the models attributes */
interface DirectoryAttributes {
  id: number;
  parent_directory_id: number;
  path: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

/** Interface for the model's creation attributes */
interface DirectoryCreationAttributes extends Optional<DirectoryAttributes, 'id'> {}

/**
 * @brief Directory model class
 * @description This class represents a directory in the file system. It extends the Sequelize Model class.
 */
export class Directory extends Model<DirectoryAttributes, DirectoryCreationAttributes> implements DirectoryAttributes {
  /** Model attributes */
  declare id: number;
  declare parent_directory_id: ForeignKey<Directory['id']>;
  declare path: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;
  declare readonly deleted_at?: Date;

  /** Model options */
  declare readonly parentDirectory?: Directory;
  declare readonly childrenDirectories?: Directory[];
  declare readonly mediaParts?: MediaPart[];

  /** Associations */
  declare static associations: {
    parentDirectory: Association<Directory, Directory>;
    childrenDirectories: Association<Directory, Directory>;
    mediaParts: Association<Directory, MediaPart>;
  };

  /** Belongs to parent directory */
  declare getParentDirectory: BelongsToGetAssociationMixin<Directory>;
  declare setParentDirectory: BelongsToSetAssociationMixin<Directory, number>;
  declare createParentDirectory: BelongsToCreateAssociationMixin<Directory>;

  /** Has many child directories */
  declare getChildrenDirectories: HasManyGetAssociationsMixin<Directory>;
  declare addChildDirectory: HasManyAddAssociationMixin<Directory, number>;
  declare addChildrenDirectories: HasManyAddAssociationsMixin<Directory, number>;
  declare setChildrenDirectories: HasManySetAssociationsMixin<Directory, number>;
  declare removeChildDirectory: HasManyRemoveAssociationMixin<Directory, number>;
  declare removeChildrenDirectories: HasManyRemoveAssociationsMixin<Directory, number>;
  declare hasChildDirectory: HasManyHasAssociationMixin<Directory, number>;
  declare hasChildrenDirectories: HasManyHasAssociationsMixin<Directory, number>;
  declare countChildrenDirectories: HasManyCountAssociationsMixin;
  declare createChildDirectory: HasManyCreateAssociationMixin<Directory>;

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
 * @brief Initialize the Directory model
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the Directory model with its attributes and options.
 */
export const initDirectoryModel = (sequelize: Sequelize) => {
  /** Initialize the Directory model */
  Directory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      parent_directory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'directories',
          key: 'id'
        }
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Directory',
      tableName: 'directories',
      timestamps: true,
      paranoid: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );
};

/** Export the Directory model */
export default Directory;
