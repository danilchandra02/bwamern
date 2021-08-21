/** @format */

const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
	imageUrl: {
		type: String,
		required: true,
	},
})

module.exports = mongose.model("Image", imageSchema)
