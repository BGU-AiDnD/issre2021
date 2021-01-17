var connection = require('./../DButils');
var sha256 = require('js-sha256');


module.exports.register=function(req,res) {
    var encryptedString = sha256(req.body.password);
    var users={
        "username":req.body.username,
        "password": encryptedString,
        "email":req.body.email
    }
    var errorDetected = '';
    if(users.username.length < 6 || users.username.length > 16){
        errorDetected = 'Username must contain between 6 to 16 letters';
    }
    if (/[^a-zA-Z]/.test(users.username)){
        errorDetected = 'Username must consist of only letters';
    }
    var emailReg = /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/;
    if(!emailReg.test(users.email)){
        errorDetected = 'You have entered an invalid email address';
    }
    var passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
    if(!passwordReg.test(req.body.password)){
        errorDetected = 'password must contain atleast one number,letter and contain between 8-16 characters';
    }
    if(errorDetected === ""){
        connection.registerUser(users).then((result)=>{
            req.flash('message', 'Your registration was successful!');
            res.redirect('/login');
        }).catch((error)=>{
            if (error.code === 'ER_DUP_ENTRY') {
                req.flash('message', 'Username already exist!');
                res.redirect('/register');
            } else if (error.code === 'PROTOCOL_CONNECTION_LOST') {
                req.flash('message', 'Server is unavailable');
                res.redirect('/register');
            }
        })
    }else{
        req.flash('message', errorDetected);
        res.redirect('/register');
    }
}