const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ph4ajav.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//Database Connection
async function dbConnect() {
  try {
    client.connect();
  } catch (err) {
    console.log(err.name);
  }
}
dbConnect();

//Api endpoint creation

const Product = client.db("NodeMongoCrud").collection("products");

// Get All Products 
app.get("/products", async (req, res) => {
  const cursor = Product.find({});
  const result = await cursor.toArray();
  if (result) {
    res.send({
      success: true,
      data: result,
    });
  } else {
    res.send({
      success: false,
      error: "No Data Found",
    });
  }
});

// Get Single Product 
app.get("/product/:id", async (req, res) => {
    const productId = req.params.id;
    const query = {_id: ObjectId(productId)};
    const result = await Product.findOne(query);
    console.log(result);
    if (result) {
      res.send({
        success: true,
        data: result,
      });
    } else {
      res.send({
        success: false,
        error: "No Data Found",
      });
    }
  });


//Add a product
app.post("/products", async (req, res) => {
  try {
    const result = await Product.insertOne(req.body);
    if (result.insertedId) {
      res.send({
        success: true,
        message: `Inserted product ${req.body.productName} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't Insert the Product",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Update Product 
app.patch("/product/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: req.body,
      };
      const result = await Product.updateOne(filter, updatedDoc);
      if (result.matchedCount) {
        res.send({
          success: true,
          message: "Successfully Updated the product Data",
        });
      } else {
        res.send({
          success: false,
          error: "Couldn't update the product",
        });
      }
    } catch (error) {
      res.send(error.message);
    }
  });

// delete product 
app.delete("/product/:id", async (req, res) => {
  const productId = req.params.id;
  const query = { _id: ObjectId(productId) };
  const result = await Product.deleteOne(query);
  if (result.deletedCount) {
    res.send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } else {
    res.send({
      success: false,
      error: "Something Went Wrong. Please try again",
    });
  }
});


app.get("/", (req, res) => {
  res.send(`Welcome to CRUD App`);
});

app.listen(port, () => {
  console.log(`CRUD App server runing on port ${port}`);
});
