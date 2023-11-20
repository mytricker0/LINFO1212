const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/LINFO1212')
.then (() => console.log('mongodb connection successful'))
.catch((err) => console.log("failled to print ",err));

const LoginSchema = new mongoose.Schema({ 
    username: { type: String, required: true },
    email : { type: String, required: true },
    password: { type: String, required: true }

})

const IncidentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    incidentType: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }
  });



const LoginSingupCollection = new mongoose.model('LoginCollection', LoginSchema)
const IncidentCollection = new mongoose.model('Incident', IncidentSchema);

module.exports = { LoginSingupCollection, IncidentCollection };