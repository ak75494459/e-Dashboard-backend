const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        hide:true,
        set:function(value){
            return "*".repeat(value.length);
        }
    },
    confirmPassword: {
        type: String,
       required:true,
       hide:true
    },
});


module.exports = mongoose.model("User", userSchema);
