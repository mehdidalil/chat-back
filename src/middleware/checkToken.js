import jwt from 'jsonwebtoken';

const checkToken = (token) => new Promise((res, rej) => {
	jwt.verify(token, "secretpass", { algorithm: 'HS256'}, (err, dec) => {
		if (err)
			return rej("Invalid token !");
		if (dec.expiresAt < Date.now())
			return rej("Expired !");
		return res(dec);
	});
});

export default checkToken;