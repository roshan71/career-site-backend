var mongoose=require('mongoose');
const Schema = require('mongoose').Schema;
var UserSchema =new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    answerResponse:[{
        type:String
    }],
    reportSend:{
        type:String
    }
});
const User = mongoose.model('UserRecord',UserSchema);


module.exports = User;