const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/LoginSingup')
.then (() => console.log('mongodb connection successful'))
.catch((err) => console.log("failled to print ",err));

const LoginSchema = new mongoose.Schema({ 
    username: { type: String, required: true },
    email : { type: String, required: true },
    password: { type: String, required: true }

})

const LoginSingupCollection = new mongoose.model('LoginCollection', LoginSchema)
module.exports = LoginSingupCollection