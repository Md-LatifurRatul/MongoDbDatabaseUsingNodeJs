
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { connectToDb, getDb } = require('./database');

const app = express();
app.use(express.json())

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log("app listening on port 3000");
        });
        db = getDb()
    }
    else {
        console.error("erorr: connecting to database", err);
    }

});


app.get('/practice', (req, res) => {

    const page = req.query.p || 0;

    const booksPerpage = 2;



    let practice = []

    db.collection('practice')
        .find()
        .sort({ name: 1 })
        .skip(page * booksPerpage)
        .limit(booksPerpage)
        .forEach(element => {
            practice.push(element)
        })
        .then(() => {
            res.status(200).json(practice)
        }).catch(() => {
            res.status(500).json({ err: 'could not fetch the documents' })
        })

});

app.get('/practice/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {

        db.collection('practice').findOne({ _id: new ObjectId(req.params.id) })
            .then((doc) => {
                res.status(200).json(doc);
            }).catch((err) => {
                res.status(500).json({ error: 'could not fetch the document id' })
            });


    }
    else {
        res.status(500).json({ error: ' Not a valid doc id' });
    }


});

app.post('/practice', (req, res) => {

    const prac = req.body;
    db.collection('practice').insertOne(prac)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json({ error: 'could not create new document' });
        });

});

app.delete('/practice/:id', (req, res) => {


    if (ObjectId.isValid(req.params.id)) {
        db.collection('practice').deleteOne({ _id: new ObjectId(req.params.id) })
            .then((result) => {
                res.status(200).json(result);
            }).catch((err) => {
                res.status(500).json({ error: 'Could not delete the data' });
            });
    }
    else {
        res.status(500).json({ error: ' Not a valid doc id' });
    }


});

app.patch('/practice/:id', (req, res) => {
    const updates = req.body;
    if (ObjectId.isValid(req.params.id)) {
        db.collection('practice')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
            .then((result) => {
                res.status(200).json(result);
            }).catch((err) => {
                res.status(500).json({ error: 'could not update the document' });
            })
    }
    else {
        res.status(500).json({ error: 'Not a valid doc id' });
    }


});


// const express = require('express');
// const port = 8080;
// const { MongoClient } = require('mongodb');
// const app = express();

// let dbConnection;
// let db;


// const connectToDb = (cb) => {
//     MongoClient.connect('mongodb://localhost:27017/first_practice')
//         .then((client) => {
//             dbConnection = client.db();
//             cb();
//         })
//         .catch((err) => {
//             console.error(err);
//             cb();
//         });
// };





// connectToDb((err) => {
//     if (!err) {
//         app.listen(port, () => {
//             console.log("app is running")
//         });
//         db = dbConnection;

//     }
//     else {
//         console.error("Error connecting to database", err);
//     }
// });

// app.get('/practice', (req, res) => {
//     let prac = [];
//     db.collection('practice').find().toArray()
//         .then((result) => {
//             result.forEach(element => {
//                 prac.push(element);
//             });
//             res.status(200).json(prac);
//         })
//         .catch((err) => {
//             console.error("Error fetching the data", err);
//             res.status(500).json({ error: 'could not fetch the data' });
//         });

// });
