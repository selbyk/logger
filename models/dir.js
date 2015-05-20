/**
 * Model for an Filesystem logs.
 *
 * @class Sequelize Image Model
 * @constructor
 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("dir", {
    time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hostname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    /*hooks: {
      afterBulkCreate: function(instances, options, fn) {
        sequelize.query("UPDATE dir AS d " +
            "JOIN dir AS p ON d.path REGEXP CONCAT('^', p.path, '/?[^/]+$') AND d.time = p.time " +
            "SET d.parent = p.id;")
          .spread(function(results, metadata) {
            // Results will be an empty array and metadata will contain the number of affected rows.
            fn(null, instances);
          });
      }
    }*/
  });
};
