const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

//add css folder
app.use(express.static('public'));

//mongoose connect 
mongoose.connect(keys.mongoURI).then(() => {
    console.log('mongo connected!');
});

//middleware for bodyParser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//middleware for MethodOverride
app.use(methodOverride('_method'));


//handlebars helpers
const {truncate, stripTags, formatDate, selected, editIcon} = require('./helpers/hbs');

//Middleware for handlebars:
app.engine('handlebars', handlebars({ 
    helpers:{
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        selected: selected,
        editIcon: editIcon
    },
    defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Middleware for creating a session: (Needed for passport):
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Middleware to use passport:
app.use(passport.initialize());
app.use(passport.session());

//passport config
require('./config/passport')(passport);

//set globalvars
app.use(function(req, res, next){
    res.locals.user = req.user || null;
    next();
});


//load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//use routes
app.use("/", index);
app.use("/auth", auth);
app.use("/stories", stories);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server started on 5000');
});