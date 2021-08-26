/** @format */

const Category = require("../models/Category")
const Bank = require("../models/Bank")

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
			const alert = {message: alertMessage, status: alertStatus}
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
			const {name} = req.body
			//console.log(name)
			await Category.create({name})
			req.flash("alertMessage", "Added Category")
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
			const {id, name} = req.body
			const category = await Category.findOne({_id: id})
			// category as an object
			category.name = name
			await category.save()
			req.flash("alertMessage", "Updated Category")
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
			const {id} = req.params
			const category = await Category.findOne({_id: id})
			await category.remove()
			req.flash("alertMessage", "Deleted Category")
			req.flash("alertStatus", "success")
			res.redirect("/admin/category")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/category")
		}
	},

	viewBank: (req, res) => {
		try {
			const alertMessage = req.flash("alertMessage")
			const alertStatus = req.flash("alertStatus")
			const alert = {message: alertMessage, status: alertStatus}
			res.render("admin/bank/view_bank", {
				alert,
				title: "Staycation | Banks",
			})
		} catch (error) {
			res.redirect("/admin/bank")
		}
	},
	addBank: async (req, res) => {
		try {
			const {name, bankName, accountNumber} = req.body
			console.log(req)
			//await Bank.create({name, BankName, accountNumber})
			req.flash("alertMessage", "Added Bank")
			req.flash("alertStatus", "success")
		} catch (error) {
			req.flash("alertMessage", `${error.message}`)
			req.flash("alertStatus", "danger")
			res.redirect("/admin/bank")
		}
	},

	viewItem: (req, res) => {
		res.render("admin/item/view_item", {
			title: "Staycation | Item",
		})
	},
	viewBooking: (req, res) => {
		res.render("admin/booking/view_booking", {
			title: "Staycation | Booking",
		})
	},
}
