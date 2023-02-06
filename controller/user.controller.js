const { validate } = require("jsonschema");
const { REGISTER_USER_BODY_SCHEMA, LOGIN_USER_BODY_SCHEMA, TRIM_USER_REGISTER_SCHEMA } = require("../_data/user");

const { sendResonse } = require("../lib/HttpResponse");
const { HttpStatusAndCode } = require("../lib/HttpStatus");
const { trimObject } = require("../lib/user");
const { UserProvider } = require("../model/User");

const userProvider = new UserProvider();

async function login(req, res) {
	try {
		const { email, password } = req.body;

		const [dbFindError, dbFindResult] = await userProvider.findOne({ email, password });

		console.log("dbFindError, dbFindResult", dbFindError, dbFindResult);
		
		if (dbFindResult) {
			return sendResonse(res, HttpStatusAndCode.OK, "Login Successful", {
				foundUser: dbFindResult
			});
		}

		if (dbFindError) {
			return sendResonse(res, HttpStatusAndCode.SERVER_ERROR, "Couldn't find User document", {
				error: dbFindError
			});
		}
		
		return sendResonse(res, HttpStatusAndCode.UNAUTHORIZED, "User doesn't exist", {});
	} catch (error) {
		console.error("Error thrown while logging in User", error);
		return sendResonse(
			res,
			HttpStatusAndCode.SERVER_ERROR,
			"Error thrown while logging in User.",
			{ error }
		);
	}
}

function loginB(req, res) {
	let user_mail = req.query.email;
	let password = req.query.password;

	//method implemented with mongodb
	User.findOne({
		email: user_mail,
		password: password
	})
		.then((document) => {
			if (document) {
				res.send({
					message: "login success",
					user: document
				});
			} else {
				res.send({
					message: "email not exists",
					user: undefined
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
}

async function register(req, res) {
	try {
		const userObj = trimObject(req.body, TRIM_USER_REGISTER_SCHEMA);
		console.log("userObj", userObj);

		const [dbFindError, dbFindResult] = await userProvider.findOne({ email: userObj.email });

		console.log("dbFindError, dbFindResult", dbFindError, dbFindResult);
		if (dbFindError) {
			return sendResonse(res, HttpStatusAndCode.SERVER_ERROR, "Couldn't find User document", {
				error: dbFindError
			});
		}

		if (dbFindResult) {
			return sendResonse(res, HttpStatusAndCode.VALIDATION_ERROR, "User already exists", {
				foundUser: dbFindResult
			});
		}

		const [dbSaveError, dbSaveResult] = await userProvider.save(userObj);

		if (dbSaveError) {
			console.error("dbSaveError:", dbSaveError);
			return sendResonse(
				res,
				HttpStatusAndCode.SERVER_ERROR,
				"Couldn't save document in MongoDB",
				{
					error: dbSaveError
				}
			);
		}

		console.log("dbSaveResult:", dbSaveResult);
		return sendResonse(res, HttpStatusAndCode.CREATED, "User registration success");
	} catch (error) {
		console.error("Error thrown while registering User", error);
		return sendResonse(
			res,
			HttpStatusAndCode.SERVER_ERROR,
			"Error thrown while registering User.",
			{ error }
		);
	}
}

module.exports = {
	login,
	register
};
