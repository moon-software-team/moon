import {
  DataTypes,
  Model,
  Optional,
  Association,
  ForeignKey,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  Sequelize
} from 'sequelize';
import { LibrarySection } from './librarySection';
import { User } from './user';

/** Interface for the models attributes */
interface LibrarySectionPermissionAttributes {
  id: number;
  library_section_id: number;
  user_id: number;
  read: boolean;
  write: boolean;
  delete: boolean;
  admin: boolean;
}

/** Interface for the model's creation attributes */
interface LibrarySectionPermissionCreationAttributes extends Optional<LibrarySectionPermissionAttributes, 'id'> {}

/**
 * @brief Model for library section permissions.
 * @description This model represents the permissions associated with a library section.
 */
export class LibrarySectionPermission
  extends Model<LibrarySectionPermissionAttributes, LibrarySectionPermissionCreationAttributes>
  implements LibrarySectionPermissionAttributes
{
  /** Model attributes */
  declare id: number;
  declare library_section_id: ForeignKey<LibrarySection['id']>;
  declare user_id: ForeignKey<User['id']>;
  declare read: boolean;
  declare write: boolean;
  declare delete: boolean;
  declare admin: boolean;

  /** Model options */
  declare readonly librarySection?: LibrarySection;
  declare readonly user?: User;

  /** Associations */
  declare static associations: {
    librarySection: Association<LibrarySectionPermission, LibrarySection>;
    user: Association<LibrarySectionPermission, User>;
  };

  /** Belongs to library section */
  declare getLibrarySection: BelongsToGetAssociationMixin<LibrarySection>;
  declare setLibrarySection: BelongsToSetAssociationMixin<LibrarySection, number>;
  declare createLibrarySection: BelongsToCreateAssociationMixin<LibrarySection>;

  /** Belongs to user */
  declare getUser: BelongsToGetAssociationMixin<User>;
  declare setUser: BelongsToSetAssociationMixin<User, number>;
  declare createUser: BelongsToCreateAssociationMixin<User>;
}

/**
 * @brief Initialize the LibrarySectionPermission model.
 * @param sequelize - The Sequelize instance to use for the model.
 * @returns The initialized LibrarySectionPermission model.
 */
export const initLibrarySectionPermissionModel = (sequelize: Sequelize) => {
  /** Initialize the LibrarySection model */
  LibrarySectionPermission.init(
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      write: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      delete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'LibrarySectionPermission',
      tableName: 'library_section_permissions',
      timestamps: false
    }
  );
};
