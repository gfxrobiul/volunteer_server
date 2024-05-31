const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware 
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1blc0td.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);

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
    // await client.connect();
    const volenteerCollection = client.db('grandvolenteer').collection('volenteer');
    const beVolunteerCollection = client.db('grandvolenteer').collection('volenteerRequest');
    const reviewsCollection = client.db('grandvolenteer').collection('volenteerReview');
  
     //post data vlounteer 
     app.post('/addvolenteer', async(req, res) =>{
      const newVolenteer = req.body;
      console.log(newVolenteer);
      const result = await volenteerCollection.insertOne(newVolenteer);
      res.send(result);
  })

     //post data vlounteer be request 
     app.post('/reqvolenteer', async(req, res) =>{
      const newVolenteer = req.body;
      console.log(newVolenteer);
      const result = await beVolunteerCollection.insertOne(newVolenteer);
      res.send(result);
  })


    //get all volenteer
    app.get('/addvolenteer',async(req,res) =>{
        const result = await volenteerCollection.find().toArray()
        res.send(result)
    })

    //get all  request be a volunteer 
    app.get('/reqvolenteer',async(req,res) =>{
        const result = await beVolunteerCollection.find().toArray()
        res.send(result)
    })

     // delete post repuest cancel 
     app.delete('/bevolunteer/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await beVolunteerCollection.deleteOne(query);
      res.send(result);
    })
    
    //volunteerdetails
    app.get('/addvolenteer/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await volenteerCollection.findOne(query);
      res.send(result);
    })

    // data post using owner email
    app.get('/manageMyPost/:email', async(req,res)=>{
      const result = await volenteerCollection.find({organizerEmail:req.params.email}).toArray();
      res.send(result);
    })

    // delete post 
    app.delete('/manageMyPost/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await volenteerCollection.deleteOne(query);
      res.send(result);
    })

     //update  volunteer information data 
     app.put('/addvolenteer/:id',async(req,res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true}
      const updatedVolunteer = req.body;

      const volunteer ={
        $set:{
          title: updatedVolunteer.title,
          thumbnail: updatedVolunteer.thumbnail,
          category: updatedVolunteer.category,
          location: updatedVolunteer.location,
          volunteersNeeded: updatedVolunteer.volunteersNeeded,
          deadline: updatedVolunteer.deadline,
          
        }
      }
      const result = await volenteerCollection.updateOne(filter,volunteer,options);
      res.send(result);
    })

     // post customer reviews
     app.post('/reviews', async(req, res) =>{
      const newReview = req.body;
      console.log(newReview);
      const result = await reviewsCollection.insertOne(newReview);
      res.send(result);
  })

   //get customer reivews 
   app.get('/reviews',async(req,res) =>{
    const result = await reviewsCollection.find().toArray()
    res.send(result);
})



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Volunteer is Running')
  })

  app.listen(port, () => {
    console.log(`Volunteer is Running on this port: ${port}`)
  })