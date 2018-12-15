const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
        name:String,
        email:String,
        address:String,
        phone : String,
        registrationDate:Date
    });

mongoose.model('registration', registrationSchema);