const express = require("express");
const router = express.Router();
const userModel = require("../models/finder.model.js");

router.post("/get",(req,res)=>{
    const {user} = req.body;
    const materias = userModel.findMaterias(user);
    res.json(materias);
})

module.exports = router;