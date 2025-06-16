require('dotenv').config({ path: '../.env' });  // <-- path added

const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../Models/listing.js");

async function main() {
  try {
    await mongoose.connect(process.env.AtlasDB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to DB");

    await initDB();
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
  }
}

const initDB = async () => {
  await listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({ ...obj, owner: "684fe0f9b9b123a0926cd0ce" }));
  await listing.insertMany(initdata.data);
  console.log("Data was initialized");
};

main();
