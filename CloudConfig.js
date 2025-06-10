const cloudinary = require('cloudinary').v2;
const { allow } = require('joi');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_API_Key,
    api_secret: process.env.Cloud_API_Secret,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'waderlust_DEV',
    allowed_formats: ["png", "jpg", "jpeg"], 
  },
}); 


module.exports = {
  cloudinary,
  storage
}