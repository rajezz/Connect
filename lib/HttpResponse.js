function sendResonse(res, { status, code }, message, data) {
	res.status(status).json({
		code,
		message,
		data
	});
}

module.exports = { sendResonse };
