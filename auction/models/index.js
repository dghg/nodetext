const Sequelize = require('sequelize');

const env = process.env.NODE_ENV;
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Good = require('./good')(sequelize, Sequelize);
db.Auction = require('./auction')(sequelize, Sequelize);

db.Good.belongsTo(db.User, { as : 'owner'}); // user can put on auction many goods
db.Good.belongsTo(db.User, {as : 'sold'}); // user can get many goods on auction

db.Good.hasMany(db.Auction); // A good can has many auction bidding
db.User.hasMany(db.Auction); // A user can has many auction bidding

db.Auction.belongsTo(db.Good);
db.Auction.belongsTo(db.User);

module.exports = db;
