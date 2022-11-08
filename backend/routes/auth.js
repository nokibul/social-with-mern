const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER 
router.post("/register",async (req,res)=>{
    try{
        // generate new hashedpass 
        saltRounds = 10;
        const hashedPass = await bcrypt.hash(req.body.password, saltRounds);
        // create new user 
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPass,
        });
        // save user 
        const user = await newUser.save()
        res.status(200).json(user) 
    }catch(err){
        res.status(500).json(err)
    }
})

// LOGIN 

router.post("/login", async (req,res)=> {
    try{
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).json("email not found");
    
        const validPass = await bcrypt.compare(req.body.password,user.password)
        !validPass && res.status(400).json("wrong pass")

        res.status(200).json(user)
    }
    catch(err){
        res.status(500).json(err)
    }

    
})


module.exports = router;