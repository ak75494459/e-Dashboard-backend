const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Products", ProductSchema)