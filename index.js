const express = require("express");
const path = require("path");
const app = express();
const puerto = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const validarRutes = require("./routes/app.router.js");
app.use('/login',validarRutes);

app.get("/app",(req,res)=>{
    res.sendFile(path.join(__dirname, './public/app/index.html'));
})

app.listen(puerto,()=>{
    console.log('vivo');
})