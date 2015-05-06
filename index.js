global.config = require('./config.json');

var _ = require('lodash'),
  Promise = require('promise'),
  db = require('./models'),
  express = require('express'),
  cors = require('cors'),
  json = require('express-json'),
  bodyParser = require('body-parser'); // Sequelize!

var app = express()
  .use(cors())
  .use(bodyParser.urlencoded({
    extended: false
  }))
  .use(bodyParser.json())
  .use(json());

app.get('/dirs', function(req, res) {
  db.dir.find({
      where: {
        path: '/'
      },
      order: [
        ['time', 'DESC']
      ],
      include: [{
        model: global.db.dir,
        as: 'children',
        include: {
          model: global.db.dir,
          as: 'children',
          attributes: ['id']
        }
      }]
    })
    .then(function(dir) {
      var payload = {
        dirs: []
      };
      var dirData = dir.dataValues;
      dirData.children.forEach(function(child) {
        var newchild = child.dataValues;
        newchild.children = [];
        var newchildren = child.children.forEach(function(grandchild) {
          newchild.children.push(grandchild.id);
        });
        payload.dirs.push(newchild);
      });
      dirData.children = dirData.children.map(function(child) {
        return child.id;
      });
      dirData.id = 1;
      payload.dirs.push(dirData);
      res.send(payload);
      /*if (dir) {
        var dirData = dir.dataValues;
        dirData.id = 1;
        dirData.children = [];
        db.sequelize.query("SELECT * FROM dir WHERE path REGEXP '^" +
            dirData.path + "[^/]+$' AND time = " + dirData.time + ";", db.dir)
          .then(function(dirs) {
            for (var i = 0; i < dirs.length; ++i) {
              dirData.children.push(dirs[i].dataValues.id);
              payload.dirs.push(dirs[i].dataValues);
            }
            payload.dirs.push(dirData);
            res.send(payload);
          });
      }*/
    });
});

app.get('/dirs/:id', function(req, res) {
  var where;
  if (req.params.id == 1) {
    where = {
      path: '/'
    };
  } else {
    where = {
      id: req.params.id
    };
  }
  db.dir.find({
      where: where,
      order: [
        ['time', 'DESC']
      ],
      include: [{
        model: global.db.dir,
        as: 'children',
        include: {
          model: global.db.dir,
          as: 'children',
          attributes: ['id']
        }
      }, {
        model: global.db.dir,
        as: 'parentModel',
        include: {
          model: global.db.dir,
          as: 'children',
          attributes: ['id']
        }
      }]
    })
    .then(function(dir) {
      var payload = {
        dirs: []
      };
      var dirData = _.omit(dir.dataValues, ['parentModel']);
      if (dir.dataValues.parentModel) {
        var parent = dir.dataValues.parentModel.dataValues;
        parent.children = parent.children.map(function(child) {
          return child.id;
        });
        payload.dirs.push(parent);
      }
      dirData.children.forEach(function(child) {
        var newchild = child.dataValues;
        newchild.children = [];
        var newchildren = child.children.forEach(function(grandchild) {
          newchild.children.push(grandchild.id);
        });
        payload.dirs.push(newchild);
      });
      dirData.children = dirData.children.map(function(child) {
        return child.id;
      });
      dirData.id = req.params.id;
      payload.dirs.push(dirData);
      res.send(payload);
      /*if (dir) {
        var dirData = dir.dataValues;
        dirData.id = Number.parseInt(req.params.id);
        dirData.children = [];
        db.sequelize.query("SELECT * FROM dir WHERE path REGEXP '^" +
            dirData.path + "/?[^/]+$' AND time = " + dirData.time + ";", db.dir)
          .then(function(dirs) {
            for (var i = 0; i < dirs.length; ++i) {
              dirData.children.push(dirs[i].dataValues.id);
              payload.dirs.push(dirs[i].dataValues);
            }
            payload.dirs.push(dirData);
            res.send(payload);
          });
      }*/
    });
});

app.post('/dirs', function(req, res) {
  db.dir.bulkCreate(req.body.dirs)
    .catch(function(err) {
      console.log(err);
      res.send(err);
    })
    .then(function(dirs) {
      console.log('Sucess!');
      if (req.body.silent) {
        res.send('Sucess!');
      } else {
        res.send(dirs);
      }
    });
});

// Sync the database and start start listening so we can respond to requests
db.sequelize.sync()
  .catch(function(err) {
    if (err) throw JSON.stringify(err.message);
  })
  .then(function() {
    console.log('hey');
    app.listen(5005);
  });