import jwt from "jsonwebtoken";

const reject = (res) => {
	res.status(405).send("You need to login to access this page !");
	throw new Error("You need to login to access this page !");
}

const isAuth = (req, res, next) => {
	if (typeof req.headers.authorization !== undefined) {
		const token = req.headers.authorization.split(" ")[1];
		jwt.verify(token, "secretpass", { algorithm: 'HS256'}, (err, dec) => {
			if (err)
				reject(res);
			if (dec.expiresAt < Date.now())
				reject(res);
			return next();
		});
	}
	else {
		reject(res);
	}
}

export default isAuth;