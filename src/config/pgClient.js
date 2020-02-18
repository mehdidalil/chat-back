import { Client } from 'pg';

const pgClient = new Client({
	user: 'postgres',
	host: '0.0.0.0',
	database: 'postgres',
	password: '123456',
	port: 5432
});

export default pgClient;