import {
  DataTypes,
  Model,
  Optional,
  Association,
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
import { LanguageCode } from '@/types/common';
import { LibrarySectionPermission } from './librarySectionPermission';

/** Interface for the models attributes */
interface UserAttributes {
  id: number;
  name: string;
  hashed_password: string | null;
  salt: string | null;
  default_audio_language: LanguageCode;
  default_subtitle_language: LanguageCode;
  auto_select_audio: boolean;
  auto_select_subtitle: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/** Interface for the model's creation attributes */
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

/**
 * @brief User model class
 * @description This class represents a user in the system. It extends the Sequelize Model class.
 */
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  /** Model attributes */
  declare id: number;
  declare name: string;
  declare hashed_password: string | null;
  declare salt: string | null;
  declare default_audio_language: LanguageCode;
  declare default_subtitle_language: LanguageCode;
  declare auto_select_audio: boolean;
  declare auto_select_subtitle: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  /** Model options */
  declare readonly librarySectionPermissions?: LibrarySectionPermission[];

  /** Associations */
  declare static associations: {
    librarySectionPermissions: Association<User, LibrarySectionPermission>;
  };

  /** Has many library section permissions */
  declare getLibrarySectionPermissions: HasManyGetAssociationsMixin<LibrarySectionPermission>;
  declare addLibrarySectionPermission: HasManyAddAssociationMixin<LibrarySectionPermission, number>;
  declare addLibrarySectionPermissions: HasManyAddAssociationsMixin<LibrarySectionPermission, number>;
  declare setLibrarySectionPermissions: HasManySetAssociationsMixin<LibrarySectionPermission, number>;
  declare removeLibrarySectionPermission: HasManyRemoveAssociationMixin<LibrarySectionPermission, number>;
  declare removeLibrarySectionPermissions: HasManyRemoveAssociationsMixin<LibrarySectionPermission, number>;
  declare hasLibrarySectionPermission: HasManyHasAssociationMixin<LibrarySectionPermission, number>;
  declare hasLibrarySectionPermissions: HasManyHasAssociationsMixin<LibrarySectionPermission, number>;
  declare countLibrarySectionPermissions: HasManyCountAssociationsMixin;
  declare createLibrarySectionPermission: HasManyCreateAssociationMixin<LibrarySectionPermission>;
}

/**
 * @brief Initialize the User model.
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the User model by defining its attributes and associations.
 */
export const initUserModel = (sequelize: Sequelize) => {
  /** Initialize the User model */
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      hashed_password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      default_audio_language: {
        type: DataTypes.ENUM(...Object.values(LanguageCode)),
        allowNull: false
      },
      default_subtitle_language: {
        type: DataTypes.ENUM(...Object.values(LanguageCode)),
        allowNull: false
      },
      auto_select_audio: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      auto_select_subtitle: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
};
