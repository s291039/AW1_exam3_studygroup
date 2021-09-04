const sqlite3 = require('sqlite3');


// open the database
const db = new sqlite3.Database('db.sqlite', (err) => {
	if (err)
		throw err;
});

db.run("PRAGMA foreign_keys = ON"); // enables foreign keys db support
module.exports = db;
