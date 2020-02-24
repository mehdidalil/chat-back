import assert from 'assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import "babel-polyfill";
import chaiHttp from 'chai-http';
import chai, { expect, assert as assertChai } from 'chai';
import { app, pgClient } from '../src/config';
import { Message } from '../src/models';
import { UserEntity } from '../src/entities';
import jwt from 'jsonwebtoken';
import { checkToken } from '../src/middleware';

const should = chai.should();
dotenv.config()

chai.use(chaiHttp);
let token = false;
let userId = 0;

const user = {
	valid: {
		username: "mehdi",
		mail: "dalil.mahdi@gmail.com",
		password: "24041993abc",
	},
	usernameAlreadyExisting: {
		username: "mehdi",
		mail: "another.mail@gmail.com",
		password: "24041993abc",
	},
	mailAlreadyExisting: {
		username: "anotheruser",
		mail: "dalil.mahdi@gmail.com",
		password: "24041993abc",
	},
	invalidUsername: {
		username: ")))#$   edeadea",
		mail: "dalil.mahdi@gmail.com",
		password: "24041993abc",
	},
	invalidMail: {
		username: "mehdi",
		mail: "@gmail.com",
		password: "24041993abc",
	},
	invalidPassword: {
		username: "mehdi",
		mail: "dalil.mahdi@gmail.com",
		password: "24041993",
	},
	notExisting: {
		mail: "yoshikage.kira@morio.jp",
		password: "kiraqueen2332",
	},
	falsePassword: {
		mail: "dalil.mahdi@gmail.com",
		password: "24041993def",
	},
};

before(done => {
	pgClient.connect()
		.then(() => {
			console.log("PostgreSQL: connnection OK !");
			pgClient.query(`DELETE FROM "user";`);
			mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
			.then(() => {
				console.log('MongoDB: connnection OK !');
				Message.deleteMany({}, err => {});
				done();
			})
			.catch((e) => {
				console.log(`Unable to connect MongoDB: ${e}`);
			});
		})
		.catch((e) => {
			console.log(`Unable to connect PostgreSQL: ${e}`);
		});
});

describe("User", function () {
	describe("UserEntity", function () {
		describe("create", function () {
			it("should create a user", async function () {
				const response = await UserEntity.add(user.valid);
				const id = parseInt(response.id);
				id.should.be.an("number");
				userId = id;
			});
			it("bad username should throw an error", async function () {
				await assert.rejects(UserEntity.add(user.invalidUsername), {
					name: "Error",
					message: "username not valid !"
				});
			});
			it("bad mail should throw an error", async function () {
				await assert.rejects(UserEntity.add(user.invalidMail), {
					name: "Error",
					message: "mail not valid !"
				});
			});
			it("bad password should throw an error", async function () {
				await assert.rejects(UserEntity.add(user.invalidPassword), {
					name: "Error",
					message: "password not valid !"
				});
			});
			it("username already existing should throw an error", async function () {
				await assert.rejects(UserEntity.add(user.usernameAlreadyExisting), {
					name: "Error",
					message:"Key (username)=(mehdi) already exists."
				});
			});
			it("mail already existing should throw an error", async function () {
				await assert.rejects(UserEntity.add(user.mailAlreadyExisting), {
					name: "Error",
					message: "Key (mail)=(dalil.mahdi@gmail.com) already exists."
				});
			});
		});
		describe("login", function () {
			it("should reject non existing user", async function () {
				await assert.rejects(UserEntity.login(user.notExisting), {
					name: "Error",
					message: "Wrong mail or password."
				});
			});
			it("should reject bad password", async function () {
				await assert.rejects(UserEntity.login(user.falsePassword), {
					name: "Error",
					message: "Wrong mail or password."
				});
			});
			it("bad token should be rejected", async function () {
				await assert.rejects(checkToken(user.token), {
					name: "Error",
					message: "Invalid token !",
				});
			});
			it("should login existing user", async function () {
				token = await UserEntity.login(user.valid);
				const dec = await checkToken(token);
				dec.should.have.property("username");
				dec.username.should.be.equal("mehdi");
			});
			it("should delete user", async function () {
				const response = await UserEntity.deleteUser(userId);
				response.should.be.equal(true);
			});
		})
	});
	describe("UserAPI", function () {
		describe("/POST /user", function () {
			it("/POST should create a user", function (done) {
				chai.request(app)
				.post("/user")
				.send(user.valid)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("id");
					res.body.id.should.be.a('number');
					userId = res.body.id;
					done();
				});
			});
		});
		describe("/GET /user/:id", function () {
			it("/GET should return user by id", function (done) {
				chai.request(app)
				.get(`/user/${userId}`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("id");
					res.body.id.should.be.a('number');
					done();
				});
			});
		});
		describe("/GET /user/:id", function () {
			it("/GET with a bad id should return 400", function (done) {
				chai.request(app)
				.get(`/user/0`)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
			});
		});
		describe("/GET /user", function () {
			it("/GET should return all users", function (done) {
				chai.request(app)
				.get(`/user`)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.should.be.lengthOf(1);
					done();
				});
			});
		});
		describe("/POST /user/modifyAvatar", function () {
			it("/POST should change user avatar", function (done) {
				chai.request(app)
				.post(`/user/modifyAvatar`)
				.set('Authorization', `Bearer ${token}`)
				.send({ avatarId: 5 })
				.end((err, res) => {
					console.log(res.body);
					res.should.have.status(200);
					done();
				});
			});
		});
	});
});

describe("Message", function () {
	describe("MessageModel", function () {
		describe("create", function () {
			it("should return the message content when created", async function () {
				const body = { content: "MessageModel - test 1", userId: "1" };
				const message = new Message(body);
				const { content, userId } = await message.save();
				expect({ content, userId }).to.be.eql(body);
			});
			it("should return a ValidationError", async function () {
				const body = { content: "TEST" };
				const message = new Message(body);
				await assert.rejects(message.save(), { name: "ValidationError" });
			});
		});
		describe("get", function () {
			it("should return an array length 1", async function () {
				const messages = await Message.find({});
				expect(messages).to.have.lengthOf(1);
			});
		});
	});
	describe("MessageAPI", function () {
		describe("/GET /message", function () {
			it("it should GET all the messages", function (done) {
				chai.request(app)
				.get("/message")
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('array');
					res.body.should.be.lengthOf(1);
					done();
				});
			});
		});
		describe("/POST /message", function () {
			it("it should create a message", function (done) {
				chai.request(app)
				.post("/message")
				.set('Authorization', `Bearer ${token}`)
				.send({ content: "MessageAPI - test 2", userId: 56 })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("content");
					res.body.content.should.be.equal("MessageAPI - test 2");
					done();
				});
			});
		});
	});
});

after(done => {
	mongoose.disconnect();
	pgClient.end();
	done();
});