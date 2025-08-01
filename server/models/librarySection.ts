/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Sequelize,
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
  HasManyGetAssociationsMixin
} from 'sequelize';
import { LanguageCode, SectionType } from '@/types/common';
import { SectionLocation } from './sectionLocation';
import { LibrarySectionPermission } from './librarySectionPermission';
import { MediaItem } from './mediaItem';

/** Interface for the models attributes */
interface LibrarySectionAttributes {
  id: number;
  section_type: SectionType;
  language: LanguageCode;
  public: boolean;
  uuid: string;
  created_at?: Date;
  updated_at?: Date;
}

/** Interface for the model's creation attributes */
interface LibrarySectionCreationAttributes extends Optional<LibrarySectionAttributes, 'id'> {}

/**
 * @brief LibrarySection model class
 * @description This class represents a section in the library. It extends the Sequelize Model class.
 */
export class LibrarySection
  extends Model<LibrarySectionAttributes, LibrarySectionCreationAttributes>
  implements LibrarySectionAttributes
{
  /** Model attributes */
  declare id: number;
  declare section_type: SectionType;
  declare language: LanguageCode;
  declare public: boolean;
  declare uuid: string;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  /** Model options */
  declare readonly mediaItems?: MediaItem[];
  declare readonly sectionLocations?: SectionLocation[];
  declare readonly librarySectionPermissions?: LibrarySectionPermission[];

  /** Associations */
  declare static associations: {
    mediaItems: Association<LibrarySection, MediaItem>;
    sectionLocations: Association<LibrarySection, SectionLocation>;
    librarySectionPermissions: Association<LibrarySection, LibrarySectionPermission>;
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

  /** Has many section locations */
  declare getSectionLocations: HasManyGetAssociationsMixin<SectionLocation>;
  declare addSectionLocation: HasManyAddAssociationMixin<SectionLocation, number>;
  declare addSectionLocations: HasManyAddAssociationsMixin<SectionLocation, number>;
  declare setSectionLocations: HasManySetAssociationsMixin<SectionLocation, number>;
  declare removeSectionLocation: HasManyRemoveAssociationMixin<SectionLocation, number>;
  declare removeSectionLocations: HasManyRemoveAssociationsMixin<SectionLocation, number>;
  declare hasSectionLocation: HasManyHasAssociationMixin<SectionLocation, number>;
  declare hasSectionLocations: HasManyHasAssociationsMixin<SectionLocation, number>;
  declare countSectionLocations: HasManyCountAssociationsMixin;
  declare createSectionLocation: HasManyCreateAssociationMixin<SectionLocation>;

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
 * @brief Initialize the LibrarySection model
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the LibrarySection model with its attributes and options.
 */
export const initLibrarySectionModel = (sequelize: Sequelize) => {
  /** Initialize the LibrarySection model */
  LibrarySection.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      section_type: {
        type: DataTypes.ENUM(...Object.values(SectionType)),
        allowNull: false
      },
      language: {
        type: DataTypes.ENUM(...Object.values(LanguageCode)),
        allowNull: false,
        defaultValue: 'en'
      },
      public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      }
    },
    {
      sequelize,
      modelName: 'LibrarySection',
      tableName: 'library_sections',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
};

/** Export the LibrarySection model */
export default LibrarySection;
