Models
===

Stores sequelize models

./index.js is responsible for doing:

1. Initializes Sequelize
2. Load Sequelize models in `sparehanger-ember/server/models`
3. ???

It is imported as `db` in `sparehanger-ember/server/index.js`

Core Components
---

### [Sequelize](http://sequelize.readthedocs.org/en/latest/)
- Sequelize is a multi sql dialect object-relationship-mapper
for node.js. It currently supports MySQL, MariaDB, SQLite,
PostgreSQL and MSSQL.

Migrations
---

By default Sequelize creates tables for models if they do not exist,
but if they already exist we have to use migrations to alter the
table instead.

To use migrations, you must install sequelize-cli globally:

`sudo npm install -g sequelize-cli`

### Running Commands

Navigate to `sparehanger-ember/server` with `cd server` and
* Create a new migration with `sequelize migration:create`
* Run all migrations `sequelize db:migrate`
* Undo last migrate `sequelize db:migrate:undo`

For more info, checkout the [Migration Documentation](http://sequelize.readthedocs.org/en/latest/docs/migrations/)

Models
---

### Example Usage

```js
var db = require('./index.js')

db.user.find({
    where: {
      api_token: 'aToken'
    }
  }).success(function(user) {
    console.log("Hey, I found " + user.username + " for you!")
  }).error(function(err) {
    console.log("Error: " + err.message)
  })
```

For more info, checkout the [Model Documentation](http://sequelize.readthedocs.org/en/latest/docs/models/)

### Data Types

```
Sequelize.STRING                      // VARCHAR(255)
Sequelize.STRING(1234)                // VARCHAR(1234)
Sequelize.STRING.BINARY               // VARCHAR BINARY
Sequelize.TEXT                        // TEXT

Sequelize.INTEGER                     // INTEGER
Sequelize.BIGINT                      // BIGINT
Sequelize.BIGINT(11)                  // BIGINT(11)
Sequelize.FLOAT                       // FLOAT
Sequelize.FLOAT(11)                   // FLOAT(11)
Sequelize.FLOAT(11, 12)               // FLOAT(11,12)

Sequelize.DECIMAL                     // DECIMAL
Sequelize.DECIMAL(10, 2)              // DECIMAL(10,2)

Sequelize.DATE                        // DATETIME for mysql / sqlite, TIMESTAMP WITH TIME ZONE for postgres
Sequelize.BOOLEAN                     // TINYINT(1)

Sequelize.ENUM('value 1', 'value 2')  // An ENUM with allowed values 'value 1' and 'value 2'
Sequelize.ARRAY(Sequelize.TEXT)       // Defines an array. PostgreSQL only.

Sequelize.BLOB                        // BLOB (bytea for PostgreSQL)
Sequelize.BLOB('tiny')                // TINYBLOB (bytea for PostgreSQL. Other options are medium and long)
Sequelize.UUID                        // UUID datatype for PostgreSQL and SQLite, CHAR(36) BINARY for MySQL (use defaultValue: Sequelize.UUIDV1 or Sequelize.UUIDV4 to make sequelize generate the ids automatically)
```
