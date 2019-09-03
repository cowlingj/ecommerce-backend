/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		res.sendStatus(403)
	} else {
		next();
	}
};
