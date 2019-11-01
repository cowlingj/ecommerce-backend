exports.create = {
	User: JSON.parse(process.env.USERS ? process.env.USERS : '[]')
}
