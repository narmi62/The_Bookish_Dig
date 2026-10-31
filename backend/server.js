const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const cloudinary = require("./config/cloudinary");


const bookRoutes = require("./routes/bookroutes")
const cartRoutes = require("./routes/cartroutes");
const orderRoutes = require("./routes/orderRoutes");



const app = express();


app.use(cors());
app.use(express.json());



app.get("/",(req,res)=>
{
    res.send("The Bookish dig backend is running")
})

app.use("/api/books",bookRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>
{
    console.log("MongoDB connected successfully")

    const PORT = process.env.PORT || 5000;
    app.listen(PORT,()=>
    {
        console.log(`Served connected to the port ${PORT}`)
    })
})
.catch((error)=>
{
 console.log("MongoDB connection failed",error.message)
}
);


