const {model,schema, Schema}=require("mongoose");
const userSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    },
    phoneOtp:{
        type:String
    }
},{timestamps:true});

module.exports=model("USER",userSchema);
