const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require('path');

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const { checkLogin } = require('./utility/checkLogin');
const users = require('./model/user');
//const messages = require('./model/message');

const { loginRouter } = require('./routes/login');
const { signupRouter } = require('./routes/signup');
const inboxRouter = require('./routes/inbox');

const searchUser = require('./api/searchUser');

//App Setting
dotenv.config();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser(process.env.SIGNED_JWT_SEC));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/search', searchUser);
app.use('/message', inboxRouter);

//Database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

//Main Route
app.get('/', checkLogin, (req, res) => {
    let user = [];
    try {
        users.find({}).then((user)=>{
            console.log(user);
            user.forEach(u => {
                user.push(u.username);
            })
            res.render('index', { users: user, title:'Index' });
        })  
    } catch (error) {
        console.log(error);
        res.render('index', { error: error, title: index });
    }
    
    
})

app.use('/login', loginRouter);
app.use('/signup', signupRouter);


//Start Server
app.listen(80, () => {
    console.log('Server Started');
})