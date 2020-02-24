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
				return rej(e);
			}
			const { username, password, mail } = user;
		
			pgClient
			.query(`INSERT INTO "user" ("username", "password", "mail", "avatarId") VALUES ('${username}', '${password}', '${mail}', '0') RETURNING "id";`)
			.then(response => res(response.rows[0]))
			.catch(e => rej(e.detail));
		});
	}

	getById(id) {
		return new Promise((res, rej) => {
			pgClient
			.query(`SELECT id, username, mail, avatarId FROM "user" WHERE id = '${id}';`)
			.then(response => {
				const user = response.rowCount != 0 ? response.rows[0] : {};
				res(user);
			})
			.catch(rej);
		});
	}

	login(user) {
		return new Promise((res, rej) => {
			const { mail, password } = user;

			pgClient
			.query(`SELECT id, username, mail, "avatarId" FROM "user" WHERE "mail" = '${mail}' AND "password" = '${password}';`)
			.then(response => {
				if (response.rowCount == 0)
					rej("Wrong mail or password.");
				else
				{
					const { id, username, mail, avatarId} = response.rows[0];
					const token = jwt.sign(
						{
							id,
							username,
							mail,
							avatarId,
							expiresAt: Date.now() + 10000 * 1000
						},
						"secretpass",
						{ algorithm: 'HS256'}
					);
					res(token);
				}
			})
			.catch(rej);
		});
	}

	modifyAvatar(userId, avatarId) {
		return new Promise((res, rej) => {
			pgClient
			.query(`UPDATE "user" SET "avatarId" = '${avatarId}' WHERE "id" = '${userId}';`)
			.then(response => res(avatarId))
			.catch(rej);
			});
	}
}

export default new UserEntity();