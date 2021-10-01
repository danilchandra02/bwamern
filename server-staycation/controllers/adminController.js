/** @format */

const Category = require("../models/Category")
const Bank = require("../models/Bank")
const Item = require("../models/Item")
const Image = require("../models/Image")
const Feature = require("../models/Feature")
const Activity = require("../models/Activity")
const Users = require("../models/Users")
const fs = require("fs-extra")
const path = require("path")
const bcrypt = require("bcryptjs")

module.exports = {
	viewSignIn: async (req, res) => {
		try {
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			if (req.session.user == null || req.session.user == undefined) {
				res.render("index", {
					alert,
					title: "Staycation | Login",
				})
			} else {
				res.redirect("/admin/dashboard")
			}
		} catch (error) {
			res.redirect("/admin/signin")
		}
	},

	actionSignIn: async (req, res) => {
		console.log("test")
		try {
			const { username, password } = req.body
			const user = await Users.findOne({ username: username })
			if (!user) {
				req.flash("alertMessage", "Invalid username or password !")
				req.flash("alertStatus", "danger")
				res.redirect("/admin/signin")
			}
			const isPasswordMatch = await bcrypt.compare(password, user.password)
			if (!isPasswordMatch) {
				req.flash("alertMessage", "Invalid username or password !")
				req.flash("alertStatus", "danger")
				res.redirect("/admin/signin")
			}

			req.session.user = {
				id: user.id,
				username: user.username,
			}

			res.redirect("/admin/dashboard")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/signin")
		}
	},

	actionLogout: (req, res) => {
		req.session.destroy()
		res.redirect("/admin/signin")
	},

	viewDashboard: (req, res) => {
		try {
			res.render("admin/dashboard/view_dashboard", {
				title: "Staycation | Dashboard",
				user: req.session.user,
			})
		} catch (error) {}
	},

	viewCategory: async (req, res) => {
		try {
			const category = await Category.find()
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			res.render("admin/category/view_category", {
				category,
				alert,
				title: "Staycation | Category",
				user: req.session.user,
			})
		} catch (error) {
			res.redirect("/admin/category")
		}
	},

	addCategory: async (req, res) => {
		try {
			const { name } = req.body
			//console.log(name)
			await Category.create({ name })
			req.flash("alertMessage", "Success added Category")
			req.flash("alertStatus", "success")
			res.redirect("/admin/category")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/category")
		}
	},

	editCategory: async (req, res) => {
		try {
			const { id, name } = req.body
			const category = await Category.findOne({ _id: id })
			// category as an object
			category.name = name
			await category.save()
			req.flash("alertMessage", "Sucess updated Category")
			req.flash("alertStatus", "success")
			res.redirect("/admin/category")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/category")
		}
	},

	deleteCategory: async (req, res) => {
		try {
			const { id } = req.params
			const category = await Category.findOne({ _id: id })
			await category.remove()
			req.flash("alertMessage", "Success deleted Category")
			req.flash("alertStatus", "success")
			res.redirect("/admin/category")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/category")
		}
	},

	viewBank: async (req, res) => {
		try {
			const bank = await Bank.find()
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			res.render("admin/bank/view_bank", {
				bank,
				alert,
				title: "Staycation | Bank",
				user: req.session.user,
			})
		} catch (error) {
			res.redirect("/admin/bank")
		}
	},
	addBank: async (req, res) => {
		try {
			const { name, bankName, accountNumber } = req.body
			console.log("test")
			await Bank.create({
				accountNumber,
				name,
				bankName,
				imageUrl: req.file.filename,
			})
			req.flash("alertMessage", "Success added Bank")
			req.flash("alertStatus", "success")
			res.redirect("/admin/bank")
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/bank")
		}
	},

	editBank: async (req, res) => {
		try {
			const { id, name, bankName, accountNumber } = req.body
			const bank = await Bank.findOne({ _id: id })
			if (req.file != undefined) {
				await fs.unlink(path.join(`public/images/${bank.imageUrl}`))
				bank.imageUrl = req.file.filename
			}
			bank.name = name
			bank.bankName = bankName
			bank.accountNumber = accountNumber
			await bank.save()
			req.flash("alertMessage", "Success Updated Bank")
			req.flash("alertStatus", "success")
			res.redirect("/admin/bank")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/bank")
		}
	},

	deleteBank: async (req, res) => {
		try {
			const { id } = req.params
			const bank = await Bank.findOne({ _id: id })
			await fs.unlink(path.join(`public/images/${bank.imageUrl}`))
			await bank.remove()
			req.flash("alertMessage", "Success Deleted Bank")
			req.flash("alertStatus", "success")
			res.redirect("/admin/bank")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/bank")
		}
	},

	viewItem: async (req, res) => {
		try {
			const item = await Item.find()
				.populate({
					path: "imageId",
					select: "id imageUrl",
				})
				.populate({ path: "categoryId", select: "id name" })
			const category = await Category.find()
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			res.render("admin/item/view_item", {
				title: "Staycation | Item",
				category,
				alert,
				item,
				action: "view",
				user: req.session.user,
			})
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	addItem: async (req, res) => {
		try {
			const { categoryId, title, price, city, desc } = req.body
			if (req.files.length > 0) {
				const category = await Category.findOne({ _id: categoryId })
				const newItem = {
					categoryId: category._id,
					title,
					description: desc,
					price,
					city,
				}
				const item = await Item.create(newItem)
				category.itemId.push({ _id: item._id })
				await category.save()
				for (let i = 0; i < req.files.length; i++) {
					const imageSave = await Image.create({
						imageUrl: req.files[i].filename,
					})
					item.imageId.push({ _id: imageSave._id })
					await item.save()
				}
				req.flash("alertMessage", "Success Added Item")
				req.flash("alertStatus", "success")
				res.redirect("/admin/item")
			}
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	showImageItem: async (req, res) => {
		try {
			const { id } = req.params
			const item = await Item.findOne({ _id: id }).populate({
				path: "imageId",
				select: "id imageUrl",
			})
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			res.render("admin/item/view_item", {
				title: "Staycation | Show Image Item",
				alert,
				item,
				action: "showimage",
				user: req.session.user,
			})
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	showEditItem: async (req, res) => {
		try {
			const { id } = req.params
			const item = await Item.findOne({ _id: id })
				.populate({
					path: "imageId",
					select: "id imageUrl",
				})
				.populate({
					path: "categoryId",
					select: "id name",
				})
			const category = await Category.find()
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			res.render("admin/item/view_item", {
				title: "Staycation | Edit Item",
				alert,
				category,
				item,
				action: "edit",
			})
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	editItem: async (req, res) => {
		try {
			const { id } = req.params
			const { categoryId, title, price, city, desc } = req.body
			const item = await Item.findOne({ _id: id })
				.populate({ path: "imageId", select: "id imageUrl" })
				.populate({ path: "categoryId", select: "id name" })

			if (req.files.length > 0) {
				for (let i = item.imageId.length - 1; i >= 0; i--) {
					let imageUpdate = await Image.findOne({
						_id: item.imageId[i]._id,
					})
					console.log(imageUpdate)
					console.log(item.imageId[i]._id)
					await fs.unlink(
						path.join(`public/images/${imageUpdate.imageUrl}`)
					)
					await item.imageId.pull({ _id: imageUpdate._id })
					await imageUpdate.remove()
				}
				for (let j = 0; j < req.files.length; j++) {
					let imageSave = await Image.create({
						imageUrl: req.files[j].filename,
					})
					item.imageId.push({ _id: imageSave._id })
				}
			}
			//await item.imageId.pull("612281824b1f7b2f3c8a9337")
			item.title = title
			item.price = price
			item.city = city
			item.descriptions = desc
			item.categoryId = categoryId
			await item.save()
			req.flash("alertMessage", "Success Updated Item")
			req.flash("alertStatus", "success")
			res.redirect("/admin/item")
		} catch (error) {
			//console.log(error)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	deleteItem: async (req, res) => {
		try {
			const { id } = req.params
			const item = await Item.findOne({ _id: id }).populate({
				path: "imageId",
			})
			for (let i = 0; i < item.imageId.length; i++) {
				Image.findOne({ _id: item.imageId[i].id }).then(async (image) => {
					await fs.unlink(path.join(`public/images/${image.imageUrl}`))
					image.remove()
				})
			}
			await item.remove()
			req.flash("alertMessage", "Success Deleted Item")
			req.flash("alertStatus", "success")
			res.redirect("/admin/item")
		} catch (error) {
			console.log(error)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	viewDetailItem: async (req, res) => {
		const { itemId } = req.params
		const feature = await Feature.find({ itemId: itemId })
		const activity = await Activity.find({ itemId: itemId })
		const alertMessage = req.flash("alertMessage")
		const alertStatus = req.flash("alertStatus")
		const alert = { message: alertMessage, status: alertStatus }
		try {
			res.render("admin/item/detail_item/view_detail_item", {
				title: "Staycation | Detail Item",
				alert,
				itemId,
				feature,
				activity,
				user: req.session.user,
			})
		} catch (error) {
			console.log(error)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	addFeature: async (req, res) => {
		const { name, qty, itemId } = req.body
		try {
			if (!req.file) {
				req.flash("alertMessage", "Image not found")
				req.flash("alertStatus", "danger")
				res.redirect(`/admin/item/show-detail-item/${itemId}`)
			}
			const feature = await Feature.create({
				name,
				qty,
				itemId,
				imageUrl: req.file.filename,
			})

			const item = await Item.findOne({ _id: itemId })
			item.featureId.push(feature._id)
			await item.save()
			req.flash("alertMessage", "Success added Feature")
			req.flash("alertStatus", "success")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	editFeature: async (req, res) => {
		const { id, name, qty, itemId } = req.body
		try {
			const feature = await Feature.findOne({ _id: id })
			if (req.file != undefined) {
				await fs.unlink(path.join(`public/images/${feature.imageUrl}`))
				feature.imageUrl = req.file.filename
			}
			feature.name = name
			feature.qty = qty
			await feature.save()
			req.flash("alertMessage", "Sucess Updated Feature")
			req.flash("alertStatus", "success")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	deleteFeature: async (req, res) => {
		const { id, itemId } = req.params
		try {
			const feature = await Feature.findOne({ _id: id })
			const item = await Item.findOne({ _id: itemId }).populate("featureId")
			for (let i = 0; i < item.featureId.length; i++) {
				if (item.featureId[i]._id.toString() === feature.id.toString()) {
					item.featureId.pull({ _id: feature._id })
					await item.save()
				}
			}
			await fs.unlink(path.join(`public/images/${feature.imageUrl}`))
			await feature.remove()
			req.flash("alertMessage", "Sucess Deleted Feature")
			req.flash("alertStatus", "success")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	addAcivity: async (req, res) => {
		const { name, type, itemId } = req.body
		try {
			if (!req.file) {
				req.flash("alertMessage", "Image not found")
				req.flash("alertStatus", "danger")
				res.redirect(`/admin/item/show-detail-item/${itemId}`)
			}
			const activity = await Activity.create({
				name,
				type,
				itemId,
				imageUrl: req.file.filename,
			})

			const item = await Item.findOne({ _id: itemId })
			item.activityId.push(activity.id)
			await item.save()
			req.flash("alertMessage", "Success added Activity")
			req.flash("alertStatus", "success")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	editActivity: async (req, res) => {
		const { id, name, type, itemId } = req.body
		try {
			const activity = await Activity.findOne({ _id: id })
			if (req.file != undefined) {
				await fs.unlink(path.join(`public/images/${activity.imageUrl}`))
				activity.imageUrl = req.file.filename
			}
			activity.name = name
			activity.type = type
			await activity.save()
			req.flash("alertMessage", "Sucess Updated Activity")
			req.flash("alertStatus", "success")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	deleteActivity: async (req, res) => {
		const { id, itemId } = req.params
		try {
			const activity = await Activity.findOne({ _id: id })
			const item = await Item.findOne({ _id: itemId }).populate("activityId")
			for (let i = 0; i < item.featureId.length; i++) {
				if (item.activityId[i]._id.toString() === activity.id.toString()) {
					item.activityId.pull({ _id: activity._id })
					await item.save()
				}
			}
			await fs.unlink(path.join(`public/images/${activity.imageUrl}`))
			await activity.remove()
			req.flash("alertMessage", "Sucess Deleted Activity")
			req.flash("alertStatus", "success")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		} catch (error) {
			console.log(error.message)
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect(`/admin/item/show-detail-item/${itemId}`)
		}
	},

	viewBooking: (req, res) => {
		res.render("admin/booking/view_booking", {
			title: "Staycation | Booking",
			user: req.session.user,
		})
	},
}
