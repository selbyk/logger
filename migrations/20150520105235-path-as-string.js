"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.changeColumn(
      'dir',
      'parent',
      {
        type: DataTypes.STRING,
        allowNull: true
      }
    );
    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.changeColumn(
      'dir',
      'parent',
      {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    );
    done();
  }
};
