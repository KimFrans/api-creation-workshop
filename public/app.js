let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const hiBtn = document.querySelector('.hi');
const login = document.querySelector('.login');
const loginBtn = document.querySelector('.loginBtn');
const username = document.querySelector('.username');

const usermessage = document.querySelector('.usermessage');
const garmentsApp = document.querySelector('.app')
const loginHide = document.querySelector('.hi')


if (localStorage.getItem('token')) {
	login.classList.add('hidden');
}


// add the token as a header to each call of axios
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

loginBtn.addEventListener('click', function() {
	if (username.value != '') {
		axios
			.post('/api/token/', {username : username.value})
			.then(function(result){
				const {token} = result.data;
				// update Axios's latest token
				localStorage.setItem('token', token);
				usermessage.innerHTML = 'your token has been created'
				setTimeout(function () {
					usermessage.innerHTML = ''
				}, 3000);
				
				axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
			});
	}
	else{
		usermessage.innerHTML = 'please enter a username'
		setTimeout(function () {
			usermessage.innerHTML = ''
		}, 3000);
	}
	
});

hiBtn.addEventListener('click', function() {

	const url = `/api/garments`;
	axios
		.get(url)
		.then(function(){
			filterData()
			login.classList.add('hidden');
			loginHide.classList.add('hidden')
			garmentsApp.classList.remove('hidden')
			
		})
		
});

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);


seasonOptions.addEventListener('click', function (evt) {
	seasonFilter = evt.target.value;
	filterData();
});

genderOptions.addEventListener('click', function (evt) {
	genderFilter = evt.target.value;
	filterData();
});

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
}

priceRangeElem.addEventListener('change', function (evt) {
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
});

filterData();
