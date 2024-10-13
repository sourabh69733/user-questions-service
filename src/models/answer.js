const Datastore = require('@seald-io/nedb');
const db = new Datastore({ filename: './data/answers.db', autoload: true });

module.exports = db;
