//var ENV = require('../config/environment')();
var _ = require('lodash');

if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize'),
    fs = require('fs'),
    sequelize = null;

  var dbInfo = null;
  try {
    dbInfo = global.config.db;
  } catch (e) {
    console.log(e);
    throw e;
  }

  try {
    if (dbInfo.hasOwnProperty('path')) {
      dbInfo = JSON.parse(dbInfo.path, 'utf8');
    }
  } catch (e) {
    console.log(e);
    throw e;
  }

  sequelize = new Sequelize(dbInfo.database, dbInfo.username, dbInfo.password, {
    // custom host; default: localhost
    host: dbInfo.host,

    // custom port; default: 3306
    port: dbInfo.port,

    // custom protocol
    // - default: 'tcp'
    // - added in: v1.5.0
    // - postgres only, useful for heroku
    //protocol: dbInfo.connectionInfo.protocol,

    // disable logging; default: console.log
    //logging: false,

    // max concurrent database requests; default: 50
    maxConcurrentQueries: 50,

    // the sql dialect of the database
    // - default is 'mysql'
    // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
    dialect: dbInfo.dialect,

    // you can also pass any dialect options to the underlying dialect library
    // - default is empty
    // - currently supported: 'mysql', 'mariadb'
    dialectOptions: {
      socketPath: '/var/run/mysqld/mysqld.sock',
      supportBigNumbers: true,
      bigNumberStrings: true
    },

    // the storage engine for sqlite
    // - default ':memory:'
    storage: dbInfo.storage,

    // disable inserting undefined values as NULL
    // - default: false
    omitNull: true,

    // a flag for using a native library or not.
    // in the case of 'pg' -- set this to true will allow SSL support
    // - default: false
    native: true,

    // Specify options, which are used when sequelize.define is called.
    // The following example:
    //   define: {timestamps: false}
    // is basically the same as:
    //   sequelize.define(name, attributes, { timestamps: false })
    // so defining the timestamps for each model will be not necessary
    // Below you can see the possible keys for settings. All of them are explained on this page
    define: {
      underscored: false,
      freezeTableName: true,
      syncOnAssociation: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
      classMethods: {
        listQuery: function() {
          return {
            include: [{
              all: true,
              nested: true
            }]
          };
        },
        viewQuery: function() {
          return {
            include: [{
              all: true,
              nested: true
            }]
          };
        },
      },
      instanceMethods: {
        serialize: function(list) {
          //console.log('To API!');
          var _this = this;
          var model = _this.dataValues;
          var includedRelations = {};
          var i, k;

          function mergeCustomizer(a, b) {
            if (_.isArray(a)) {
              return a.concat(b);
            } else if (a) {
              //return [a].concat(b);
            } else {
              //return b;
            }
          }

          // Recursively add all relations
          if (_this.options.include) {
            for (i = 0; i < _this.options.include.length; ++i) {
              var relation = _this.options.include[i].as;
              var lowercase = _.camelCase(relation);
              if (_.isArray(_this.dataValues[relation])) {
                if (!model[lowercase]) {
                  model[lowercase] = [];
                }
                var ceiling;
                if (_this.options.include[i].limit) {
                  ceiling = _.min([
                    _this.dataValues[relation].length,
                    _this.options.include[i].limit
                  ]);
                } else {
                  ceiling = _this.dataValues[relation].length;
                }
                for (k = 0; k < ceiling; ++k) {
                  model[lowercase].push(_this.dataValues[relation][k].id);
                  if (_this.options.include[i].attributes.length > 1) {
                    _.merge(
                      includedRelations,
                      _this.dataValues[relation][k].serialize(true),
                      mergeCustomizer
                    );
                  }
                }
              } else if (_.isObject(_this.dataValues[relation])) {
                model[lowercase] = _this.dataValues[relation].id;
                if (_this.options.include[i].attributes.length > 1) {
                  _.merge(
                    includedRelations,
                    _this.dataValues[relation].serialize(true),
                    mergeCustomizer
                  );
                }
              }
            }
          }

          // Add the visible attributes and user permissions
          if (includedRelations[_this.Model.name]) {
            if (_.isArray(includedRelations[_this.Model.name])) {
              return includedRelations[_this.Model.name].unshift(model);
            } else if (_.isObject(includedRelations[_this.Model.name])) {
              includedRelations[_this.Model.name] = [model,
                includedRelations[_this.Model.name]
              ];
              return includedRelations;
            } else {
              throw "What the actual fuck.";
            }
          } else {
            if (list) {
              includedRelations[_this.Model.name] = [model];
            } else {
              includedRelations[_this.Model.name] = model;
            }
            return includedRelations;
          }
        },
        timestamps: true
      }
    },

    // similiar for sync: you can define this to always force sync for models
    sync: {
      force: false
    },

    // sync after each association (see below). If set to false, you need to sync manually after setting all associations. Default: true
    syncOnAssociation: true,

    // use pooling in order to reduce db connection overload and to increase speed
    // currently only for mysql and postgresql (since v1.5.0)
    pool: {
      maxConnections: 5,
      maxIdleTime: 30
    },

    // language is used to determine how to translate words into singular or plural form based on the [lingo project](https://github.com/visionmedia/lingo)
    // options are: en [default], es
    language: 'en'
  });

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    dir: sequelize.import(__dirname + '/dir')
      // add your other models here
  };

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */
}

module.exports = global.db;
