const express = require('express');
const app = express();
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
// const { MongoClient, ServerApiVersion } = require('mongodb');
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const multer  = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/images")
  },
  filename: (req,file,cb)=>{
    cb(null,req.body.name)
  }
})

const upload = multer({storage})

app.post('/api/upload', upload.single('file'), function (req, res, next) {
  try{
    return res.status(400).json("The file has been uploaded successfully!")
  }catch(err){
    console.log(err)
  }
})
const uri = "mongodb+srv://nokibnur:Nokibnur100@cluster0.wchjftl.mongodb.net/?retryWrites=true&w=majority";


// use it before all route definitions
app.use(cors());

mongoose.connect(uri,(req,res)=>{
  console.log("connected");
  // console.log(res);

});


// dotenv.config();


//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));


app.use('/images', express.static(path.join(__dirname, 'public/images')));


app.listen(8800,()=>{
    console.log("the app is running lol");
})

//Routing
app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);



