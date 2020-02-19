import { userSchema } from "../schemes";
import { futaba } from 'futaba';
import { pgClient } from '../config';
import jwt from 'jsonwebtoken';

class UserEntity {
	constructor() {
		this.scheme = userSchema;
	}

	add(user) {
		return new Promise((res, rej) => {
			try {
				futaba(this.scheme, user);
			}
			catch (e) {
				rej(e);
			}
			const { username, password, mail } = user;
		
			pgClient
			.query(`INSERT INTO "user" ("username", "password", "mail") VALUES ('${username}', '${password}', '${mail}') RETURNING "id";`)
			.then(response => res(response.rows[0]))
			.catch(e => rej(e.detail));
		});
	}

	getById(id) {
		return new Promise((res, rej) => {
			pgClient
			.query(`SELECT id, username, mail FROM "user" WHERE id = '${id}';`)
			.then(response => {
				const user = response.rowCount != 0 ? response.rows[0] : {};
				res(user);
			})
			.catch(rej);
		});
	}

	login(user) {
		return new Promise((res, rej) => {
			const { username, password } = user;

			pgClient
			.query(`SELECT id, username, mail FROM "user" WHERE "username" = '${username}' AND "password" = '${password}';`)
			.then(response => {
				if (response.rowCount == 0)
					rej("Wrong username or password.");
				else
				{
					const { id, username, mail } = response.rows[0];
					const token = jwt.sign({ id, username, mail, expiresAt: Date.now() + 30 * 1000 }, "secretpass", { algorithm: 'HS256'});
					res(token);
				}
			})
			.catch(rej);
		});
	}
}

export default new UserEntity();