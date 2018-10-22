const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());

//Route 1: get request that renders all your users
app.get('/', function(request, response) {
	fs.readFile('./users.json', function(err, data) {
		if (err) {
			console.log(err);
		}
		const parsedData = JSON.parse(data);
		response.render('index', {parsedData}
			);
		});
	});

//Route 2: renders a page and display form
app.get('/search', function(request, response) {  // Will render the search.ejs page
	response.render('search');
});

//Route 3: takes post request from form displaying matches on new page
app.post('/search', function(request, response) {
	fs.readFile('./users.json', (err,data) => {
		if (err) {throw err}

		const parsedData = JSON.parse(data);
		const result = [];

			for (let i = 0; i < parsedData.length; i++) {
				if (parsedData[i].firstname.indexOf(request.body.input) > -1 
					|| parsedData[i].lastname.indexOf(request.body.input) > -1 === request.body.input) {
					result.push(parsedData[i]);
					console.log(result);
				}
			}
		response.render('matches', {result});
	})
});

app.get('/matches', function(request, response) {
	response.render('matches');
});

//Route 4: renders a page with 3 inputs on it
app.get('/addUser', function(request, response) {
	response.render('addUser');
});

//Route 5: takes in a post request from the addUser file
app.post('/addUser', function (request, response) {
	fs.readFile('./users.json', (err, data) => {
		if (err) {throw err}

		let parsedData = JSON.parse(data);
		
		let newUser = { //add user
			firstname: request.body.inputfirst,
			lastname: request.body.inputlast,
			email: request.body.inputemail,
		}
		//push new user to the array in .json file
		parsedData.push(newUser);

		let json = JSON.stringify(parsedData);

		fs.writeFile('./users.json', json, (err) => {
			if (err) {throw err}
		})
	})
	response.redirect('/');
});


//Server:
app.listen (port, () => console.log(`Listening on port: ${port}`));