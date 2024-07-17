const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.xegw8vb.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const craftsCollection = client.db('Art&CraftDB').collection('crafts');
        app.get('/crafts', async (req, res) => {
            const cursor = craftsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/crafts', async (req, res) => {
            const newCraft = req.body;
            console.log(newCraft);
            const result = await craftsCollection.insertOne(newCraft);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Craft mania is running')
})
app.listen(port, () => {
    console.log(`Server id running on ${port}`);
})