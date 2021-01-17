let connection = require('./../DButils');
module.exports.authenticate = async function (req, res) {
    console.log("trying to connect...")
    let username = req.body.username;
    let password = req.body.password;
    connection.authUser(username, password).then((result)=>{
        if (result) {
            req.session.userID = username;
            res.redirect('');
        } else {
            req.flash('message', 'Wrong username or password');
            res.redirect('/login');
        }
    }).catch((error)=>{
        req.flash('message', 'Service not available please try again');
        res.redirect('/login');
    })
}
