const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
});

//this is going to add on to our schema a user name.It's going to make sure those user names are unique.

//They're not duplicated.
UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',UserSchema);