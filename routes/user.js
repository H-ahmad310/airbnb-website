const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/Wrapasync.js")
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userControllers=require("../controllers/user.js");

router.
route("/signup")
.get(userControllers.randerSignupForm)
.post(wrapasync(userControllers.signupRoute))

router.
route("/login")
.get(userControllers.randerloginForm)
.post(saveRedirectUrl,
    passport.authenticate
    ("local",{failureRedirect:"/login",failureFlash:true
    }),userControllers.loginRoute);

router.get("/logout",userControllers.logoutForm);

module.exports=router;

