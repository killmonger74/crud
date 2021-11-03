const mongoose=require('mongoose');
const UserSchema=mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})
module.exports=mongoose.model('User',UserSchema)