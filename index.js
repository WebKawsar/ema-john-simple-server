const express = require('express')
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2izr.mongodb.net/emaJohnSimple?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 8080


app.get('/', (req, res) => {
    res.send('Hello Ema Watson')
})





client.connect(err => {
    const collection = client.db("emaJohnSimple").collection("products");
    const ordersCollection = client.db("emaJohnSimple").collection("orders");


    app.post("/addproduct", (req, res) => {
        const products = req.body;
        collection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get("/products", (req, res) => {
        collection.find({})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    app.get("/product/:key", (req, res) => {
        collection.find({key: req.params.key})
        .toArray((error, documents) => {
            res.send(documents[0]);
        })
    })

    app.post("/productsByKeys", (req, res) => {
        const productKeys = req.body;
        collection.find({key: {$in: productKeys}})
        .toArray((error, documents) => {
            res.send(documents);
        })
    })

    // orders 
    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })



});



app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})