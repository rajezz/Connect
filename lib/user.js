function trimObject(obj, schema) {
	if (!schema.hasOwnProperty("required")) {
		return obj;
	}
	const trimmedObj = schema.required.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
	return trimmedObj;
}

module.exports = { trimObject }