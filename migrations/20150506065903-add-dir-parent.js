"use strict";

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn(
      'dir',
      'parent', {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    );
    migration.addIndex(
      'dir', ['parent'], {
        indexName: 'parentIndex'
      }
    );
    done();
  },

  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeIndex('dir', 'parentIndex');
    migration.removeColumn('dir', 'parent');
    done();
  }
};