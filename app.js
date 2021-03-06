var express=require('express');
var path=require('path');
var cookieparser=require('cookie-parser');
var bodyparser=require('body-parser');
var exphbs=require('express-handlebars');
var expressvalidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var localstrategy=require('passport-local').Strategy;
var mongo=require('mongodb');
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/loginapp',{ useNewUrlParser: true })
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err));

var routes=require('./routes/index');
var users=require('./routes/users');

//Initialize the app
var app=express();

//View Engine
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');

//BodyParser Middleware
 app.use(bodyparser.json());
 app.use(bodyparser.urlencoded({extended:false}));
 app.use(cookieparser());

 //Set Public folder
 app.use(express.static(path.join(__dirname,'public')));

 //Express Session
 app.use(session({
     secret:'secret',
     saveUninitialized:true,
     resave:true
 }));
  
 //Passport Initialization
 app.use(passport.initialize());
 app.use(passport.session());
 //Express validator
 app.use(expressvalidator({
     errorFormatter:function(param,msg,value){
         var namespace = param.split('.')
         ,root=namespace.shift()
         ,formParam=root;
         while(namespace.length){
             formParam+='[' +namespace.shift()+']';
         }
         return{
             param:formParam,
             msg:msg,
             value:value
         };
     }
 }));

 //Connect Flash
 app.use(flash());
 //Global Vars
 app.use(function(req,res,next){
     res.locals.success_msg=req.flash('success_msg');
     res.locals.error_msg=req.flash('error_msg');
     res.locals.error=req.flash('error');
     res.locals.user=req.user||null;
     next();
 });

 app.use('/',routes);
 app.use('/users',users);

 //Set Port
 app.set('port',(process.env.PORT||3000));
 app.listen(app.get('port'),function(){
     console.log('Server started on port'+app.get('port'));
 });