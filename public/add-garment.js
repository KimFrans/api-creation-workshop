const message = document.querySelector('.message');
const addGarmetBtn = document.querySelector('.addGarmentBtn');
const hideAddGarmetBtn = document.querySelector('.hideAddGarmetBtn');
const addGarmetSection = document.querySelector('.add.garment');
const addGarmetButtonSection = document.querySelector('.add.button');
const snack = document.getElementById("snack");

const nameTextBox = document.querySelector(".inputName")
const hideinputField = document.querySelector(".username")
const showGarments = document.querySelector(".app")


function showMessage(value){
	snack.innerHTML = value;
	snack.className = "show";
	setTimeout(function(){ snack.className = snack.className.replace("show", ""); }, 3000);

	// message.innerHTML = value;
	// message.classList.toggle('hidden');
	
	// setTimeout(() =>  {
	// 	message.innerHTML = '';
	// 	message.classList.toggle('hidden');
	// }, 3000);
}

function toggleAddGarmetScreen() {
	addGarmetSection.classList.toggle('hidden');
	// addGarmetButtonSection.classList.toggle('hidden');
}

hideAddGarmetBtn.addEventListener('click', function(evt) {
	toggleAddGarmetScreen()
});


const fieldManager = FieldManager({
	'description': '',
	'img': '',
	'season': '',
	'gender': '',
	'price': 0.00
});

addGarmetBtn.addEventListener('click', function(evt) {

	// fields on the screen
	const fields = fieldManager.getValues();

	axios
		.post('/api/garments', fields)
		.then(result =>{
			if (result.data.status == 'error') {
				showMessage(result.data.message);
				if(snack.classList.toggle("success")){
					snack.classList.remove("success")
				}
				snack.classList.add("error")
			} else {
				toggleAddGarmetScreen();
				// show success message from API
				showMessage(result.data.message);
				if(snack.classList.toggle("error")){
					snack.classList.remove("error")
				}
				snack.classList.add("success")
				fieldManager.clear();
				// show all the data
				filterData();
			}
		})
		.catch(err => {
			showMessage(err.stack)
		});
});

addGarmetButtonSection.addEventListener('click', function(evt) {
	evt.preventDefault();
	toggleAddGarmetScreen()
});