import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
	userId: {
		type: Number,
		required: true,
	},
	date: {
		type: Date,
		default: () => new Date()
	},
	content: {
		type: String,
		required: true
	},
});

export default mongoose.model("message", messageSchema);