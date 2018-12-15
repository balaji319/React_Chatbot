const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/dev')
const app = express();
app.use(bodyParser.json());
mongoose.connect(encodeURI(config.mongoURL), {useNewUrlParser : true })


require('./routes/dailogFlowRoutes')(app);




app.listen(5001);