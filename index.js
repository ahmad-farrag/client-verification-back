const express = require('express');
const app = express();
const cors = require('cors');
const port = 10000;
const hash = {};

app.use(cors());
app.use(express.json());

const PASS = process.env.HASH_KEY;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/v1/validate/', (req, res) => {
	const { password } = req.body;

	res.status(200).send({ status: password === PASS });
});

app.get('/v1/hash', (req, res) => {
	const { key, value, pass } = req.query;

	if (pass !== PASS) {
		return res.status(401).send('Unauthorized');
	}

	hash[key] = value;
	res
		.status(201)
		.send(`Saved a new hash with key: ${key}  and value: ${value}`);
});

app.get('/v1/hash/all', (req, res) => {
	res.status(200).send({ hash });
});

app.get('/v1/hash/:key', (req, res) => {
	const { key } = req.params;
	const value = hash[key];
	if (!value) {
		res.status(404).send(`No hash found with key: ${key}`);
	}

	res.status(200).send(value);
});

app.get('/healthz', (req, res) => {
	res.status(200).send('Ok');
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
