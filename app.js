const express =require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyparser = require('body-parser');
const methodverride= require('method-override');
const flash= require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();


//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//passport config
require('./config/passport')(passport);
//db config
const db = require('./config/database');
//connect to mongoose
mongoose.connect(db.mongoURI,{
  useNewUrlParser : true
}).then(() => console.log('MongoDB Connected....'))
.catch(err => console.log(err));


//Handlebar middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());

//static folder
app.use(express.static(path.join(__dirname,'public')));

//method override middleware
app.use(methodverride('_method'));

//express session
app.use(session({
  secret:'secret',
  resave :true,
  saveUninitialized: true,
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
//Global variables
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});
// // how middleware works
// app.use(function(req,res,next){
//  console.log(Date.now());
//  req.name='rana';
//  next();
// });


//Index Route
app.get('/',(req,res)=>{
const x= 'Welcome To VidJot';
res.render('Index',{
  title: x
});
});

//About Route
app.get('/about',(req,res)=>{
  res.render('about');
});

//use routes
app.use('/ideas',ideas);
app.use('/users',users);



const port = process.env.PORT || 5000;

app.listen(port,()=>{
  console.log(`Server strated on port ${port}`);
});