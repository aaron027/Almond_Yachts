var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/almondboats')

var Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    first_name:{
        type:String,
        required: true,
        minlength:2,
        maxlength:20
    },
    last_name:{
        type:String,
        required: true,
        minlength:2,
        maxlength:20
    },
    password:{
        type:String,
        required: true
    },
    create_time:{
        type:Date,
        default: Date.now
    },
    last_modified_time:{
        type:Date,
        default: Date.now
    },
    avatar:{
        type:String,
        url:'/public/image/client.jpg'
    },
    telephone:{
        type:String,
        default:''
    },
    address:{
        type:String,
        default:''
    },
    country:{
        type:String,
        default:''
    },
    state:{
        type:String,
        default: ''
    },
    suburb:{
        type:String,
        default:''
    },
    role:{
        type:String,
        enum:['admin','normal']
    },
    zipcode:{
        type:Number,
        default:''
    }
    
}) 

module.exports = mongoose.model('User', userSchema)