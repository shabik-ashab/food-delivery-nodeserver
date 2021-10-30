const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.431bv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('burgerdb');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const orderTotalCollection = database.collection('orderTotal')
        // const servicesCollection = database.collection('services');/
        

        //GET Products API
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            
            res.send(products);
            });

        // post api for adding services 
        app.post('/product', async(req,res) => {
            const product = req.body;
            console.log('hit the post api',product);

            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json(result)
        })  
        
        // post api for cart 
        app.post('/orders', async(req,res) => {
            const orders = req.body;
            console.log('hit the post api order',orders);

            const result = await orderCollection.insertOne(orders);
            console.log(result);
            res.json(result)
        })
         
        // get api for cart 
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const products = await cursor.toArray();
            
            res.send(products);
            });

        //  delete order 
        app.delete('/order/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result)
        })   

        // delete all order 
        app.delete('/orders', async(req,res) =>{
           
            const result = await orderCollection.deleteMany({});
            console.log('deleting user with id', result);
            res.json(result)
        })  

       
        }
    finally{
        // await client.close 
    }
}

run().catch(console.dir)

app.get('/', (req,res) => {
    res.send('server is runing');
})

app.listen(port, () => {
    console.log('server running at',port)
})