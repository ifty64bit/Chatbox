const express = require('express');
const loginRouter = express.Router();
const { check, validationResult } = require('express-validator');
const users = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Validation
const validationRules = [
    check('uname').not().isEmpty().withMessage("username is required"),
    check('pass').not().isEmpty().withMessage("password is required")
]

function checkData(req, res, next) {
    const errors = validationResult(req);
    const mappedErr = errors.mapped()
    if (Object.keys(mappedErr).length == 0)
    {
        next();
    }
    else {
        console.log(mappedErr);
        res.render('login', { errors: mappedErr, title:'Login'});
    }
}

async function doLogin(req, res, next)
{
    try {
        const user = await users.findOne({ username: req.body.uname });
        if (user && user._id) {
            const isValid = await bcrypt.compare(req.body.pass, user.password);
            if (isValid)
            {
                const userObj = {
                    uname:user.username
                }
                const token = jwt.sign(userObj, process.env.JWT_SEC, { expiresIn: Date.now() + 100 });
                console.log(token);
                res.cookie('token', token, { maxAge: Date.now() + 100, httpOnly: true, signed: true }).redirect('/');
                
            }
            else {
                res.render('login', { errors: { loginErr: "username or password error" }, title:'Login' })
            }
        }
    } catch (error) {
        console.log(error);
        res.render('login', { errors: error, title:"Login" });
    }
}


loginRouter.get('/', (req, res) => {
    res.render('login',{errors:"", title:"Login"});
})

loginRouter.post('/', validationRules, checkData, doLogin, (req, res) => {
    console.log(req.body);
})

module.exports = {
    loginRouter,
}