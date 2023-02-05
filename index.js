const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;


// Use Middleware ----------------------------
app.use(cors());
app.use(express.json());

// MongoDB ________________________________________________________________________
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@siriwazi11.dyqjb4g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const dataAboutPersonCollection = client.db("SiriwaziSiteDatabase").collection("personData");
        const dataAboutOrganizationCollection = client.db("SiriwaziSiteDatabase").collection("organizationData");
        const dataAboutProductServiceCollection = client.db("SiriwaziSiteDatabase").collection("product-service");
        const adminCollection = client.db("SiriwaziSiteDatabase").collection("admin");
        const heroContent = client.db("SiriwaziSiteDatabase").collection("heroContent");
        
        // Get Person Data From Client Site ______________________________________
        app.post('/personData', async(req, res) =>{
            const personData = req.body;
            const result = await dataAboutPersonCollection.insertOne(personData)
            if(personData.identityName === 'Email'){
              try{
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.Email,
                        pass: process.env.Pass
                    }
                });
                
                const mailOptions = {
                    from : personData.identityNo ,
                    to: process.env.Email,
                    subject: `Email Form Database Management`,
                    html: `
                        <h2>You Got a new message From Database Management</h2>
                        <h3>Some one Post about you please Check our Website</h3>
                    `
                }
                transporter.sendMail(mailOptions, (error,info) => {
                    if(error){
                        console.log("Error", error)
                    }else{
                        console.log("Email Sent" + info.response);
                        // console.log(mailOptions)
                    }
                })
            }
            finally{
        
            }
            }
            res.send({success: true, result});
        })
        // Get Organization Data From Client Site _________________________________
        app.post('/organizationData', async(req, res) =>{
            const organizationData = req.body;
            const result = await dataAboutOrganizationCollection.insertOne(organizationData)
            console.log('Add new organization Data', result);
            res.send({success: true, result});
        })
        // Get Product/Service Data From Client Site ______________________________
        app.post('/product-service', async(req, res) =>{
            const productServiceData = req.body;
            const result = await dataAboutProductServiceCollection.insertOne(productServiceData)
            console.log('Add new product/service Data', result);
            res.send({success: true, result});
        })

        // Get Data From Server ///////////////////////////////////////////////////////////////////////
        // Get Person Data from Server ______________________________________________
        app.get('/personData', async(req, res) => {
            const query ={};
            const cursor = dataAboutPersonCollection.find(query);
            const personData = await cursor.toArray();
            res.send(personData);
          });
        // Get Organization Data from Server ______________________________________________
        app.get('/organizationData', async(req, res) => {
            const query ={};
            const cursor = dataAboutOrganizationCollection.find(query);
            const organiztionData = await cursor.toArray();
            res.send(organiztionData);
          });
        // Get Organization Data from Server ______________________________________________
        app.get('/product-service', async(req, res) => {
            const query ={};
            const cursor = dataAboutProductServiceCollection.find(query);
            const productOrganizeData = await cursor.toArray();
            res.send(productOrganizeData);
          });



        //Get single Person Data from server______________________________________________________________________________
        app.get('/personData/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singleData = await dataAboutPersonCollection.findOne(query);
            res.send(singleData);
          })
        app.get('/organizationData/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singleData = await dataAboutOrganizationCollection.findOne(query);
            res.send(singleData);
          })
        //Get single organization Data from server________________________________________________
        app.get('/product-service/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const singleData = await dataAboutProductServiceCollection.findOne(query);
            res.send(singleData);
          })




          // Delete Data ///////////////////////////////////////////////////////////////////////////////////
          // Person data delete
          app.delete('/personData/:id',  async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await dataAboutPersonCollection.deleteOne(query);
            res.send(result);
          })
          // organization data data delete______________________________________
          app.delete('/organizationData/:id',  async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await dataAboutOrganizationCollection.deleteOne(query);
            res.send(result);
          })
          // Product Service data data delete______________________________________
          app.delete('/product-service/:id',  async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await dataAboutProductServiceCollection.deleteOne(query);
            res.send(result);
          })

          // Update hero Content  ______________________________________
          app.get('/heroContent', async (req, res) => {
            const query ={};
            const cursor = heroContent.find(query);
            const content = await cursor.toArray();
            res.send(content);
          })
          // Update hero Content  ______________________________________
          app.put('/heroContent', async (req, res) => {
            const id = req.body._id;
            const filter = { _id: ObjectId(id) };
            // update the value of the 'z' field to 42
            const updateDocument = {
               $set: {
                  title: req.body.title,
                  text: req.body.text,
               },
            };
            const result = await heroContent.updateMany(filter, updateDocument);
            res.send(result)
          })
        




        //   Admin ___________________________________
        app.get('/admin/:email', async(req, res) =>{
            const email = req.params.email;
            const user = await adminCollection.findOne({email: email});
            const isAdmin = user.pass === 'Oyombe@12345';
            res.send({admin: isAdmin})
        })

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running Sirwazi Server');
});

app.listen(port, () => {
    console.log('Running Sirwazi Server')
})
