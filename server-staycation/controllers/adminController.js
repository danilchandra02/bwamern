/** @format */

const Category = require("../models/Category")
const Bank = require("../models/Bank")
const Item = require("../models/Item")
const Image = require("../models/Image")
const fs = require("fs-extra")
const path = require("path")

module.exports = {
	viewDashboard: (req, res) => {
		res.render("admin/dashboard/view_dashboard", {
			title: "Staycation | Dashboard",
		})
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
			const item = await Item.findOne({ _id: id }).populate({
				path: "imageId",
				select: "id imageUrl",
			})
			const category = await Category.find()
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = { message: alertMessage, status: alertStatus }
			res.render("admin/item/view_item", {
				title: "Staycation | Show Image Item",
				alert,
				item,
				action: "showimage",
			})
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/item")
		}
	},

	viewBooking: (req, res) => {
		res.render("admin/booking/view_booking", {
			title: "Staycation | Booking",
		})
	},
}
