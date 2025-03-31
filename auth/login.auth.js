const userModel = require('../models/finder.model.js');

exports.login = (req, res) => {
    const { code, password } = req.body;
    const user = userModel.findUser(code);

    if(user){
        if (user.pass === parseInt(password)) {
            res.redirect("/app");
        } else {
            res.redirect("/?error=1&pass=1");
        }
    }else{
        res.redirect("/?error=1");
    }
};
