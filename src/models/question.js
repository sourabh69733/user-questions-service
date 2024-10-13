const Datastore = require('@seald-io/nedb');
const db = new Datastore({ filename: './data/questions.db', autoload: true });

module.exports = db;
