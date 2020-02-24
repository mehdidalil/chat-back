import checkToken from "./checkToken";

const reject = (res) => {
	res.status(405).send("You need to login to access this page !");
}

const isAuth = (req, res, next) => {
	if (req.headers.authorization !== undefined) {
		const token = req.headers.authorization.split(" ")[1];
		
		checkToken(token)
		.then(tok => {
			next();
		})
		.catch(err => reject(res));
	}
	else {
		return reject(res);
	}
}

export default isAuth;