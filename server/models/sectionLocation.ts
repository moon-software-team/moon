/** Dependencies */
import {
  DataTypes,
  Model,
  Optional,
  Sequelize,
  Association,
  ForeignKey,
  HasManyGetAssociationsMixin,
  BelongsToGetAssociationMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
  HasManyAddAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyHasAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin
} from 'sequelize';
import { LibrarySection } from './librarySection';
import { MediaItem } from './mediaItem';

/** Interface for the models attributes */
interface SectionLocationAttributes {
  id: number;
  library_section_id: number;
  root_path: string;
  available: boolean;
  created_at?: Date;
  updated_at?: Date;
}

/** Interface for the model's creation attributes */
interface SectionLocationCreationAttributes extends Optional<SectionLocationAttributes, 'id'> {}

/**
 * @brief SectionLocation model class
 * @description This class represents a location of a section in the library. It extends the Sequelize Model class.
 */
export class SectionLocation
  extends Model<SectionLocationAttributes, SectionLocationCreationAttributes>
  implements SectionLocationAttributes
{
  /** Model attributes */
  declare id: number;
  declare library_section_id: ForeignKey<LibrarySection['id']>;
  declare root_path: string;
  declare available: boolean;
  declare readonly created_at: Date;
  declare readonly updated_at: Date;

  /** Model options */
  declare readonly mediaItems?: MediaItem[];
  declare readonly librarySection?: LibrarySection;

  /** Associations */
  declare static associations: {
    mediaItems: Association<SectionLocation, MediaItem>;
    librarySection: Association<SectionLocation, LibrarySection>;
  };

  /** Belongs to library section */
  declare getLibrarySection: BelongsToGetAssociationMixin<LibrarySection>;
  declare setLibrarySection: BelongsToSetAssociationMixin<LibrarySection, number>;
  declare createLibrarySection: BelongsToCreateAssociationMixin<LibrarySection>;

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
}

/**
 * @brief Initialize the SectionLocation model
 * @param sequelize - The Sequelize instance to use for the model.
 * @description This function initializes the SectionLocation model with its attributes and options.
 */
export const initSectionLocationModel = (sequelize: Sequelize) => {
  /** Initialize the Directory model */
  SectionLocation.init(
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
      root_path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'SectionLocation',
      tableName: 'section_locations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );
};

/** Export the SectionLocation model */
export default SectionLocation;
