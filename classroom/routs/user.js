
const express = require("express")
 const router = express.Router();
 


//index-users
router.get("/",(req,res)=>{
    res.send("Get for users ");
});
//shoow -user
router.get("/:id",(req,res)=>{
    res.send("Get for show users");
});
//post-user
router.post("/:id",(req,res)=>{
    res.send("post for show users");
});

//delete 
router.delete("/:id",(req,res)=>{
     res.send("delete for user post id");
});
module.exports = router ;   