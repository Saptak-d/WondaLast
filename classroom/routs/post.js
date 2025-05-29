//index-post

const express = require("express")
 const router = express.Router();
 



router.use("/",(req,res)=>{
    res.send("Get for post ");
});
//shoow -post
router.get("/:id",(req,res)=>{
    res.send("Get for show post");
});
//post-[post]
router.post("/:id",(req,res)=>{
    res.send("post for show Post");
});

//delete - post
router.delete("/:id",(req,res)=>{
     res.send("delete for user Post id");
});
module.exports = router ;   