/**
 * Model for an Image.
 *
 * @class Sequelize Image Model
 * @constructor
 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("image", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    album_id: DataTypes.INTEGER,
    album_position: DataTypes.INTEGER,
    path: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pending', 'processing', 'ready', 'error'],
      allowNull: false,
      defaultValue: 'pending'
    },
    tries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    url: DataTypes.STRING,
    etag: DataTypes.STRING,
    sha: DataTypes.STRING,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    owner_type: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true
    },
    privacy_setting: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 3
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    tableName: 'image',
    instanceMethods: {
      toApiArray: function() {
        return {
          id: this.getDataValue('id'),
          name: this.getDataValue('name'),
          album: this.getDataValue('album_id'),
          default_album: this.getDataValue('album_id'),
          album_position: this.getDataValue('album_position'),
          is_default: this.getDataValue('album_position') == 1,
          url: this.getDataValue('url'),
          sm: this.getDataValue('url'),
          md: this.getDataValue('url'),
          lg: this.getDataValue('url'),
          etag: this.getDataValue('etag'),
          width: this.getDataValue('width'),
          height: this.getDataValue('height')
        };
      }
    }
  });
};