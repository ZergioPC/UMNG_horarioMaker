const express = require("express");
const app = express();
const puerto = 8080;

app.use(express.json());
app.use(express.static('public'));
app.use(express.static('app'));

const horarioRoute = require('./routes/app.router.js');

app.use('/app',horarioRoute);

app.listen(puerto,()=>{
    console.log('vivo');
})