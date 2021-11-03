const express=require('express');
const app = express();
const path =require('path')
const hbs=require('hbs')
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const mongoose=require('mongoose')
const config=require('./config')
const {loginController,registerController,updateController, deleteUser}=require('./controller/user')
const User=require('./model/user')

app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());
hbs.registerHelper('helper_name', function (options) { return 'helper value'; });
hbs.registerPartial('partial_name', 'partial value');
app.use('/public',express.static(path.join(__dirname,'public')))
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
app.set("views",path.join(__dirname,'views'))
app.set('view engine',"hbs");
mongoose.connect(config.DATABASE,{ useNewUrlParser: true,useUnifiedTopology:true },function(err){
    if(err) console.log(err);
    console.log("database is connected");
});
const backup={};

const middleware=(req,res,next)=>{
    const token=req.cookies['token'];
    console.log(token)
    if(!token)return ;
    else
    {
        
        req.user_id=token;
        next();
    }
}
app.get("/",(req,res)=>{
    res.render("index",{loginform:true})
})
app.get('/register',(req,res)=>{
    res.render('index',{loginform:false})
})
app.get('/dashboard',middleware,async(req,res)=>{
    const data =await User.find();
    console.log(req.user_id);
    const impdata=await User.findById({_id:req.user_id});
    if(!impdata)
    {
        res.redirect('/')
        return ;
    }
    delete impdata.password
    res.render('dashboard',{data:data,impdata:impdata})
})
app.post('/user/login',loginController)
app.post("/user/register",registerController);
app.post("/user/update/:id",middleware,updateController);
app.get("/user/delete/:id",middleware,deleteUser)
app.listen(5000,()=>{console.log('server running')})