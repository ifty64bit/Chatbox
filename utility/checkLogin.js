const jwt = require('jsonwebtoken');

function checkLogin(req, res, next) {
    let cookie = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if (cookie)
    {
        try {
            const token = cookie['token'];
            const decode = jwt.verify(token, process.env.JWT_SEC);
            req.user = decode.uname;
            next()
        }
        catch (err)
        {
            console.log(err);
            res.status(500).redirect('/login');
        }
       
    }
    else {
        res.redirect('/login');
    }
}

module.exports = {
    checkLogin
}