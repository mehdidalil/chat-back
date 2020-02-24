import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
	content: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: () => new Date()
	},
});

export default mongoose.model("message", messageSchema);