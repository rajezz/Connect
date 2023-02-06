const { validate } = require("jsonschema");
const { sendResonse } = require("../lib/HttpResponse");
const { HttpStatusAndCode } = require("../lib/HttpStatus");

function validateUser(schema) {
	return function (req, res, next) {
		try {
			const validatorResult = validate(req.body, schema);

			console.log("validatorResult: ", validatorResult);

			if (validatorResult?.errors?.length > 0) {
				return sendResonse(res, HttpStatusAndCode.VALIDATION_ERROR, "Bad Request body", {
					errorList: validatorResult.errors
				});
            }

            next();
        } catch (error) {
            console.error("Error thrown while validating the User request body", error);
			return sendResonse(
				res,
				HttpStatusAndCode.SERVER_ERROR,
				"Error thrown while validating the User request body",
				{ error }
			);
        }
	};
}

module.exports = { validateUser }