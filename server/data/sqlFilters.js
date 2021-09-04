module.exports = () => ({
	public: `SELECT * FROM memes WHERE private = false`,
	today: `SELECT * FROM memes WHERE datetime >= datetime('now', 'start of day') AND datetime < datetime('now', 'start of day', '+1 day')`,
	lastweek: `SELECT * FROM memes WHERE datetime >= datetime('now', 'start of day') AND datetime < datetime('now', 'start of day', '+7 day')`,
	private: `SELECT * FROM memes WHERE private = true AND creator_name = ?`,
})
