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
      ]
    })
    .then(function(dir) {
      db.dir.findAll({
          where: {
            parent: dir.path,
            time: dir.time
          },
          order: [
            ['path']
          ]
        })
        .then(function(children) {
          var payload = {
            dirs: []
          };
          console.log(children);
          var dirData = dir.dataValues;
          dirData.children = children.map(function(child) {
            return child.dataValues.id;
          });
          dirData.id = 1;
          payload.dirs.push(dirData);
          res.send(payload);
        });
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
      ]
    })
    .then(function(dir) {
      db.dir.find({
          where: {
            path: dir.parent,
            time: dir.time
          },
          order: [
            ['path']
          ]
        })
        .then(function(parent) {
          db.dir.findAll({
              where: {
                parent: dir.path,
                time: dir.time
              },
              order: [
                ['path']
              ]
            })
            .then(function(children) {
              var payload = {
                dirs: []
              };
              console.log(children);
              var dirData = dir.dataValues;
              dirData.children = children.map(function(child) {
                return child.dataValues.id;
              });
              dirData.parent = parent ? parent.dataValues.id : null;
              payload.dirs.push(dirData);
              res.send(payload);
            });
        });
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
