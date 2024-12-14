const mongoose = require('mongoose');

const connectDB=async()=>{
    try{
        mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            console.log("Connected to mongoDB successfully")
        })
    }catch (err) {
        console.error(err);
        process.exit(1);
    }
}


module.exports = connectDB;
