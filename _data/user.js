const REGISTER_USER_BODY_SCHEMA = {
	type: "object",
	required: ["email", "password", "profile_pic", "dob", "phone_no", "address", "username"],
	properties: {
		email: {
			type: "string",
			pattern: "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*"
		},
		password: {
			type: "string"
		},
		profile_pic: {
			type: "string"
		},
		dob: {
			type: "string",
			pattern: ""
		},
		phone_no: {
			type: "string",
			pattern: "[+]*[0-9]{0,3}[0-9]{10}"
		},
		address: {
			type: "string"
		},
		username: {
			type: "string"
		}
	}
};

const TRIM_USER_REGISTER_SCHEMA = {
	required: ["email", "password", "profile_pic", "dob", "phone_no", "address", "username"]
};
const TRIM_USER_LOGIN_SCHEMA = {
	required: ["email", "password"]
};
const LOGIN_USER_BODY_SCHEMA = {
	type: "object",
	required: ["email", "password"],
	properties: {
		email: {
			type: "string",
			pattern: "[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*"
		},
		password: {
			type: "string"
		}
	}
};

module.exports = {
	REGISTER_USER_BODY_SCHEMA,
	LOGIN_USER_BODY_SCHEMA,
	TRIM_USER_REGISTER_SCHEMA,
	TRIM_USER_LOGIN_SCHEMA
};
