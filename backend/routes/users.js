const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update a user 
router.put("/:id",async (req,res)=>{
    if(req.body.userId===req.params.id || req.user.isAdmin){
        if(req.body.password){
            try{
                saltRounds = 10;
                req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            }catch(err){
                res.status(500).json(err)
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            })
            res.status(200).json("Your account has been updated successfully");
    }catch(err){
        res.status(500).json(err)
    }

    }else{
        return res.status(403).json("You can only update your account")
    }
})


// delete a user 
router.delete("/:id",async (req,res)=>{
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Your account has been deleted successfully");
    }catch(err){
        res.status(500).json(err)
    }

    }else{
        return res.status(403).json("You can only delete your account")
    }
})


// get a user 
router.get("/",async (req,res)=>{
    const userId = req.query.userId;
    const username = req.query.username;

    try{
        const user = username ? await User.findOne({username: username}) : await User.findById(userId);
        const {password,updatedAt,...other} = user._doc
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err);
    }
})


// follow a user 
router.put("/:id/follow",async (req,res)=>{
    if (req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}})
                res.status(200).json("you follow this person now");
            }else{
                res.status(403).json("you already follow him");
            }

        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You cannot follow yourself");
    }
})


// unfollow a user 
router.put("/:id/unfollow",async (req,res)=>{
    if (req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}})
                res.status(200).json("you unfollowed this person now");
            }else{
                res.status(403).json("you unfollowed him");
            }

        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("You cannot follow/unfollow yourself");
    }
})

module.exports = router