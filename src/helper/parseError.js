const parseError = (error) => {
	if (error.startsWith("Key"))
	{
		const sp = error.split(" ")[1].split("=").map(elem => elem = elem.substring(1, elem.length - 1));
		error = `${sp[0]} '${sp[1]}' already exists !`;
	}
	return (error);
};

export default parseError;