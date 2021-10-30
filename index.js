const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ew9gz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("online_travel");
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("orders");
        const galleryCollection = database.collection("gallery");
        const teamCollection = database.collection("team");

        // get all services data
        app.get("/services", async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // get single service data
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result);
        })
        // get all order services data
        app.get("/orders", async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // get order service  data
        app.get("/orders/:email", async (req, res) => {
            const query = { email: req.params.email }
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        })
        // get all gallery data
        app.get("/gallery", async (req, res) => {
            const cursor = galleryCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // get all team data
        app.get("/team", async (req, res) => {
            const cursor = teamCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // post api for add a service
        app.post("/services", async (req, res) => {
            const result = await serviceCollection.insertOne(req.body);
            res.send(result);
        })
        // post api for booking service
        app.post("/addOrder", async (req, res) => {
            const result = await orderCollection.insertOne(req.body);
            res.send(result);
        })
        // post api for booking service updated
        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: 'Approved'
                },
            };
            const result = await orderCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        // delete api for booking service
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Alfred Travel Server Running');
})

app.listen(port, () => {
    console.log('alfred travel server running port', port)
})