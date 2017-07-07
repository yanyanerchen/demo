let express = require('express');
let app = express();
let defaultPort = 8004;

let pshop = require('./pshop');
let draw = require('./draw');
let service = require('./service');
let auth = require('./auth');

app.use(express.static(__dirname))

app.use('/auth/pshop', pshop);
app.use('/auth/draw', draw);
app.use('/ucsr-api/auth/service', service);
app.use('/service', service);
app.use('/ucsr-api/auth', auth);

let server = app.listen(defaultPort, () => {
	console.log('app listening at http://localhost:' + defaultPort)
})