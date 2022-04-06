// add code in here to create an API with ExpressJS
const express = require('express');
const app = express();

// enable the static folder...
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import the dataset to be used here
const garments = require('./garments.json');

const PORT = process.env.PORT || 4017;

// API routes to be added here
app.get('/api/garments', function(req, res){
	const gender = req.query.gender;
	const season = req.query.season;

	const filteredGarments = garments.filter(garment => {
		// if both gender & season was supplied
		if (gender != 'All' && season != 'All') {
			return garment.gender === gender 
				&& garment.season === season;
		} else if(gender != 'All') { // if gender was supplied
			return garment.gender === gender
		} else if(season != 'All') { // if season was supplied
			return garment.season === season
		}
		return true;
	});

	// note that this route just send JSON data to the browser
	// there is no template
	res.json({ 
		garments : filteredGarments
	});
	
	// res.json({garments});
	
});

app.get('/api/garments/price/:price', function(req, res){
	const maxPrice = Number(req.params.price);
	const filteredGarments = garments.filter( garment => {
		// filter only if the maxPrice is bigger than maxPrice
		if (maxPrice > 0) {
			return garment.price <= maxPrice;
		}
		return true;
	});

	res.json({ 
		garments : filteredGarments
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

	if (!description || !img || !gender || !season || !price) {
		res.json({
			status: 'error',
			message: 'Required data not supplied',
		});
	} else {

		// you can check for duplicates here using garments.find
		// const duplicates = garments.find((description, img,  gender,  season,  price) => {
		// 	for(var i=0;i<garments.length;i++){
		// 		if(garments[i].description == description && garments[i].img == img && garments[i].gender == gender && garments[i].season == season && garments[i].price == price){
		// 			res.json({
		// 				status: 'error',
		// 				message: 'This item already exists',
		// 			});
		// 		}
		// 	}
		// })

		// for(var i=0;i<garments.length;i++){
		// 	if(garments[i].description == description && garments[i].img == img && garments[i].gender == gender && garments[i].season == season && garments[i].price == price){
		// 	   console.log("The search found in JSON Object");
		// 	   res.json({
		// 			status: 'error',
		// 			message: 'This item already exists',
		// 		});
		// 	//    break;
		// 	}
		// }


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


app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});