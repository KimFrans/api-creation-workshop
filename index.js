// add code in here to create an API with ExpressJS
require('dotenv').config()
const express = require('express');
const res = require('express/lib/response')
const app = express();
const jwt = require('jsonwebtoken')
const axios = require('axios');
let LocalStorage = require('node-localstorage').LocalStorage;

// enable the static folder...
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import the dataset to be used here
const garments = require('./garments.json');


const PORT = process.env.PORT || 4017;

function checkToken(req, res, next){
	

	const token =  req.headers.authorization && req.headers.authorization.split(" ")[1];

	console.log(req.headers.authorization);

	if (!req.headers.authorization || !token){
		res.sendStatus(401);
		return;
	}

	// what do I need to do with the token ?

	// unwrap the decode the token...
	const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

	// find the username in the token ?
	const {username} = decoded;
	
	console.log(username);

	// check if the username in the token is 'KimFrans'
	if (username && username === 'KimFrans') {
		next();
	} else {
		res.sendStatus(403);
	}

}

// app.get('/api/name', checkToken, function(req, res){
// 	res.json({
// 		name: "Kim Frans"
// 	})
// });

app.post('/api/token', function(req, res){
	const {username} = req.body;
	console.log(req.body)
	
		const token = jwt.sign({
			username
		}, process.env.ACCESS_TOKEN_SECRET);

		res.json({
			token
		});
	

});

// API routes to be added here
app.get('/api/garments', checkToken, function (req, res) {
	
	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender
				&& garment.season === season;
		} else if (gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if (season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true;
	});

	// note that this route just send JSON data to the browser
	// there is no template
	

	res.json({
		garments: filteredGarments
	});

	// res.json({garments});

});

app.get('/api/garments/price/:price', function (req, res) {
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter(garment => {
		// filter only if the maxPrice is bigger than maxPrice
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

	res.json({
		garments: filteredGarments
	});
});

app.post('/api/garments', (req, res) => {

	// get the fields send in from req.body
	const {
		description,
		img,
		gender,
		season,
		price
	} = req.body;

	// add some validation to see if all the fields are there.
	// only 3 fields are made mandatory here
	// you can change that

	// if (!description || !img || !gender || !season || !price) {
	// 	res.json({
	// 		status: 'error',
	// 		message: 'Required data not supplied',
	// 	});
	// } 
	if (!description && !img && !gender && !season && !price) {
		res.json({
			status: 'error',
			message: 'Required data not supplied',
		});
	}
	else if (!description) {
		res.json({
			status: 'error',
			message: 'Please add an item description',
		});
	}
	else if (!img) {
		res.json({
			status: 'error',
			message: 'Please insert a garment image',
		});
	}
	else if (!gender) {
		res.json({
			status: 'error',
			message: 'Please enter a gender',
		});
	}
	else if (!season) {
		res.json({
			status: 'error',
			message: 'Please enter a season',
		});
	}
	else if (!price) {
		res.json({
			status: 'error',
			message: 'Please enter a price',
		});
	}

	else {

		// you can check for duplicates here using garments.find

		let Duplicate = garments.find(garment => garment.description == description && garment.img == img && garment.gender == gender && garment.season == season && garment.price == price);
		if (typeof (Duplicate) === "undefined") {
			garments.push({
				description,
				img,
				gender,
				season,
				price
			});
			res.json({
				status: 'success',
				message: 'New garment added.',
			});
			return;

		} else {
			if (JSON.stringify(Duplicate).length > 0) {
				res.json({
					status: 'error',
					message: 'This item already exists',
				});
				return;
			}
		}

		// add a new entry into the garments list
		// garments.push({
		// 	description,
		// 	img,
		// 	gender,
		// 	season,
		// 	price
		// });

		// res.json({
		// 	status: 'success',
		// 	message: 'New garment added.',
		// });
	}

});


app.listen(PORT, function () {
	console.log(`App started on port ${PORT}`)
});