const crypto=require('crypto');
const User=require('../model/user')
const registerController= async (req,res)=>{
  
    if(req.body.username===undefined || req.body.user===undefined || req.body.password===undefined || req.body.confirm===undefined)
    {
        res.render('index',{loginform:false,ress:{...req.body},error:"Please fill out all details"});
        return;
    }

    if(req.body.password!==req.body.confirm){

        res.render('index',{loginform:false,ress:{...req.body},error:"Password Didn't match"});
        return;
    }
    
     User.findOne({user:req.body.user},function(err,user){
        if(user) {
            res.render('index',{loginform:false,ress:{...req.body},error:'Email already registered'});
            return 
        }
    })
    User.findOne({username:req.body.username},function(err,username){
        if(username)
        {
            res.render('index',{loginform:false,ress:{...req.body},error:'username already exits Please choose a different one'});
            return 
        }
    })
      const hashedpassword=crypto.createHash('sha256').update(req.body.password).digest('hex');
      req.body.password=hashedpassword;  
      const newuser=new User(req.body);
         newuser.save((err,doc)=>{
             if(err) {
                res.render('index',{loginform:false,ress:{...req.body},error:'Internal Server Error'});
                 return 
                }
                 res.render("index",{loginform:true,mssg:"User Created Successfully Please login"})   
            });
        }


const loginController=async (req,res)=>{
    const {username,password}=req.body;
    const hashedpassword=crypto.createHash('sha256').update(req.body.password).digest('hex');
    req.body.password=hashedpassword;
    console.log(hashedpassword)
    console.log(username,password)
    try
    {
        const is_user=await User.findOne({$and:[{username:username},{password:hashedpassword}]})
        console.log(is_user,"asj")
        if(!is_user)
        {
            res.render('index',{loginform:true,ress:{...req.body},error:"Credentails didn't Match"});
            return;
        }
        else{
            let cookievalue;
            const token=crypto.randomBytes(16).toString('hex');
            cookievalue=`${is_user._id.toString()}`;
            res.cookie('token',cookievalue)
            res.redirect('/dashboard');
    }
    }
    catch(err)
    {
        res.render('index',{loginform:true,ress:{...req.body},error:"Please try again later"});
        return; 
    }


}
const updateController=async (req,res)=>{
    const {id}=req.params;
    
    const {user,username}=req.body;
    const isvalid_user=await User.findOne({username:username});
    const data=await User.find();
    console.log(id,isvalid_user)
    
    if(isvalid_user)
    {
        if(isvalid_user._id===id) //i will change user
       {
            try
            {
                const updated=await User.findByIdAndUpdate({_id:id},{user:user,username:username});
                res.render('dashboard',{mssg:"Change made Successfully" ,data:data,impdata:updated})

            }
            catch(err)
            {
                const iser=await User.find({_id:id});
                res.render('dashboard',{err:'Something went wrong' ,data:data,impdata:req.body});
            }
       }
       else
       {
           const iser=await User.find({_id:id});
            res.render('dashboard',{err:'something went wrong',impdata:iser,data:data})
       }
    }
    else
    {
        const updated=await User.findByIdAndUpdate({_id:id},{user:user,username:username});
        res.redirect('/dashboard');
    }
}
const deleteUser=async (req,res)=>{
    const {id}=req.params;
    const token=req.user_id;
    if(id===token)
    {
        const newdelete=await User.findOneAndDelete({_id:id});
        res.redirect('/');
    }
    else
    {
        res.redirect('/dashboard');
    }
}
module.exports={registerController,loginController,updateController,deleteUser}