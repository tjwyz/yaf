unexpected = (description) => {
	description = description || "Unexpected token";
	throw (description);
}
export {unexpected}