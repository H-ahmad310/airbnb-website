const User=require("../models/user.js");

module.exports.randerSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupRoute=async(req,res)=>{
try{
   let {username,email,password}=req.body;
   const newuser=new User({email,username});
   const registerUser=await User.register(newuser,password);
   console.log(registerUser);
   req.logIn(registerUser,(err)=>{
    if(err){
        return next(err);
    }
     req.flash("success","welcome to wanderlust!");
   res.redirect("/listings");
   });

}catch(e){
    req.flash("error",e.message);
    res.redirect("/signup")
}
};

module.exports.randerloginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginRoute=async(req,res)=>{
    req.flash("success","welcome back to wandelust!");
    if(!res.locals.redirectUrl){
     res.redirect("/listings")
    }else{
     res.redirect(res.locals.redirectUrl)
    }
};

module.exports.logoutForm=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
        return next(err)
        }
        req.flash("success","you are logged out")
        res.redirect("/listings");
    });
}