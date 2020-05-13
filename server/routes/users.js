const express = require('express');
const mailer=require('../mailer');
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//function to genrate random token of specified length
function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}


router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});



router.post('/sendMail',async (req,res,next)=>{
  let otp=makeid(5);
  try{
  const html = `your otp is ${otp}`;


  await mailer.sendEmail('mlokesh.mamta@gmail.com', req.body.email, 'Please verify your email!', html);
  }
  catch(error) {
    next(error);
  }

  res.status(200).send(JSON.stringify({success: true , otp : otp ,data :req.body}));

});

router.post("/updatePass", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if(user)
    {
      user.password = req.body.newPassword;

      user.save((err, doc) => {
          if (err) return res.json({ success: false, err });
          return res.status(200).json({
              success: true
          });
      });
    }

  });
});

router.post("/register", (req, res) => {
    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/checkEmail", (req, res) => {

  User.findOne({ email: req.body.email }, (err, user) => {
      if (!user)
          return res.json({
              found: false,
              message: "email not found"
          });
      else
      {
         if(!user.fixed)
         {

           User.findByIdAndRemove( user._id )
           .then( () => {
             
           } )
           .catch( error => {
            console.log( `Error deleting subscriber by ID: ${error.message}` );
           } );

           return res.json({
               found: false,
               message: "email not found"
           });
         }

        return res.json({
            found: true,
            message: "email found"
        });
      }
  });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email  }, (err, user) => {

        if ((!user) || (req.body.fixed && (!user.fixed)))
        {
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {


            if ((req.body.fixed) && (!isMatch))
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;
