const express = require("express");
const app  = express();

const users = require("./routs/user.js");
const post = require("./routs/post.js")
const cookiParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));


const sesionOptions = ({
    secret: "habujhaakiaaahik",
     resave: false,
     saveUninitialized : true

});

app.use(session(sesionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.get("/requst",(req,res)=>{
 let {name = "anonymous"} = req.query;
 req.session.name = name;
 if(name === "anonymous"){
    req.flash("error", "user is not registerd");
 }
 else{
     req.flash("success", "user register successfully")
 } 
 res.redirect("/hello");
})
 
app.get("/hello",(req,res)=>{

    res.render("page.ejs",{name : req.session.name})
})

 
//routs for post 

app.listen(3000,()=>{
    console.log("server is listning to 3000");

})