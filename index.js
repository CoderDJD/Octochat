const express = require('express');
const cors = require('cors');
const monk = require('monk');
const app = express();
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const db = monk(process.env.MONGO_URI || 'localhost/octochat');
const octos = db.get('octos');
const filter = new Filter();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'OctoChat😎✨'
    });
});

app.get('/octos', (req, res, next) => {
    octos
        .find({})
        .then(octos => {
            res.json(octos);
    }) .catch(next);
});

app.get('/v2/octos', (req, res) => {
    octos
        .find({})
        .then(octos => {
            res.json(octos);
    }) .catch(err=>res.status(400).send(err.toString()));
});

function isValidOcto(octo) {
    return octo.name && octo.name.toString().trim() !== '' &&
        octo.content && octo.content.toString().trim() !== '';
}

app.use(rateLimit({
    windowMS: 15 * 1000,
    max: 20
}));

app.post('/octos', (req, res) => {
    if(isValidOcto(req.body)) {
            const octo = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };
        console.log(req.query);
        octos
            .insert(octo)
            .then(createdOcto => {
                res.json(createdOcto);
            });
    }   else {
        res.status(422);
        res.json({
            message: "Hey! Name and Content are required."
        });
    }
});

app.listen(5000, () => {
    console.log("Listening on http://localhost:5000");
});