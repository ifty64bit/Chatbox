const express = require('express');
const signupRouter = express.Router();
const bcrypt = require('bcrypt');
const user = require('../model/user');
const { check, validationResult } = require('express-validator');

const validationRules = [
    check('uname').isLength({ min: 3 }).trim().escape().withMessage("Username must be greater then 3 char"),
    check('pass1').isLength({ min: 6 }).withMessage("Password must be minimum 6 char long").trim().escape(),
    check('pass2').isLength({ min: 6 }).trim().escape().custom( async (value,{req}) => {
        if (value !== req.body.pass1) {
            throw new Error("Password Dose not Match");
        }
    }),
];
//function for validation
function checkData(req, res, next)
{
    const errors = validationResult(req);
    const mappedErr=errors.mapped()
    if (Object.keys(mappedErr).length===0)
    {
        next();
    }
    else
    {
        console.log(mappedErr);
        res.status(500).render('signup',{errors:mappedErr,title:"Signup"});
    }
}

//Adding user to databse
async function addUser(req, res, next) {
    const pass = req.body.pass2;
    const hashedpass = await bcrypt.hash(pass, 10);
    const newUser = new user({
        username : req.body.uname,
        password : hashedpass
    })

    try {
        const result = await newUser.save();
        next();
    }
    catch (err)
    {
        console.log(err);
        res.status(500).render('signup',{errors:err,title:"Signup"})
    }
}

async function checkIfExist(req, res, next)
{
    let uname = req.body.uname;
    let ifexist = await user.findOne({ username: uname });
    if (ifexist)
    {
        res.render('signup', { title: 'Signup', errors: "User Already Exist. Try Another Username" });
    }
    else {
        next();
    }
}

signupRouter.get('/', (req, res) => {
    res.render('signup',{errors:"",title:"Signup"});
})

signupRouter.post('/', checkIfExist, validationRules, checkData, addUser, (req, res) => {
    res.redirect('/login');
    
})

module.exports = {
    signupRouter,
}