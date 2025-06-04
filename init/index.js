const mongoose = require("mongoose");
const initdata = require("./data.js"); // Correct path for data.js
const listing = require("../Models/listing.js"); // Correct path for listing.js (go up one level and into db)


main().then(()=>{
    console.log("connected to DB")
}).catch(err=>{
  console.log("err");
});

 
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wondaelust');    
}


 const initDB = async () => {
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner: "683c064e9286914499f58f47" }));
    await listing.insertMany(initdata.data);
    console.log("data was intilize ")

 };

 initDB();