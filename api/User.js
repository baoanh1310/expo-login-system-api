const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User');

const bcrypt = require('bcrypt');

// Signup
router.post('/signup', (req, res) => {
	let { name, email, password } = req.body;
	name = name.trim();
	email = email.trim();
	password = password.trim();

	if (name == "" || email == "" || password == "") {
		res.json({
			status: "FAILED",
			message: "Empty input fields!"
		});
	} else if (!/^[a-zA-Z ]*$/.test(name)) {
		res.json({
			status: "FAILED",
			message: "Invalid name entered!"
		});
	} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
		res.json({
			status: "FAILED",
			message: "Invalid email entered!"
		});
	} else if (password.length < 8) {
		res.json({
			status: "FAILED",
			message: "Password is too short!"
		});
	} else {
		// User already exist
		User.find({email}).then(result => {
			if (result.length) {
				res.json({
					status: "FAILED",
					message: "User already exist!"
				});	
			} else {
				// try to create new user
				
				// password handling
				const saltRounds = 10;
				bcrypt.hash(password, saltRounds).then(hashedPassword => {
					const newUser = new User({
						name,
						email,
						password: hashedPassword
					});

					newUser.save().then(result => {
						res.json({
							status: "SUCCESS",
							message: "Signup successful",
							data: result
						});
					})
					.catch(err => {
						console.log(err);
						res.json({
							status: "FAILED",
							message: "An error occurred while saving user account!"
						})
					})
				})
				.catch(err => {
					res.json({
						status: "FAILED",
						message: "An error occurred while hashing password!"
					});
				});
			}
		}).catch(err => {
			console.log(err);
			res.json({
				status: "FAILED",
				message: "An error occurred while checking for existing user!"
			});
		});	
	}
});

// Login
router.post('/login', (req, res) => {

});

module.exports = router;