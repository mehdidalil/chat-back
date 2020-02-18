const REGEX_NAME = /^(?=.*$)[a-zA-Z]+(?:['_.\-\s][a-zA-Z]+)*$/;
const REGEX_MAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
const REGEX_PASSWORD = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9\-]*)$/;
const REGEX_USERNAME = /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9])*[a-zA-Z0-9]$/;

const userSchema = {
	username: {
		type: "string",
		required: "true",
		length: {
			min: 3,
			max: 32
		},
		match: REGEX_USERNAME
	},
	password: {
		type: "string",
		required: "true",
		length: {
			min: 8,
			max: 32
		},
		match: REGEX_PASSWORD
	},
	mail: {
		type: "string",
		required: "true",
		match: REGEX_MAIL
	},
};

export default userSchema;