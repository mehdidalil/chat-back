import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
	},
	avatarId: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: () => new Date()
	},
});

export default mongoose.model("message", messageSchema);