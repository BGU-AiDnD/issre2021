var mysql = require('mysql');
var sha256 = require('js-sha256');
require("dotenv").config();

var connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});
connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log(err);
        console.log("Error while connecting with database");
    }
});

function getUserEmail(user){
    return new Promise((resolve,reject) => {
        connection.query('SELECT email FROM users WHERE username = ?', [user], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                if (results.length > 0) {
                    resolve(results[0].email);
                }
                else {
                    reject("no user found");
                }
            }
        });
    });
}

async function authUser(username, password){
    return new Promise((resolve, reject)=>{
        connection.query('SELECT * FROM users WHERE username = ?', [username], async function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                if (results.length > 0) {
                    encryptedPassword = sha256(password);
                    if (encryptedPassword == results[0].password) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
                else {
                    resolve(false)
                }
            }
        });
    });
}

function registerUser(userDetails){
    return new Promise((resolve, reject)=>{
        connection.query('INSERT INTO users SET ?', userDetails, function (error, results, fields) {
            if (error) {
                reject(error)
            } else {
                resolve('success')
            }
        });
    })
}
function getUserID(username) {
        return new Promise((resolve, reject)=>{
        connection.query("SELECT ID FROM users WHERE username =  ?", [username], function (error,results,fields) {
            if (error) {
                reject(error);
            }
            if(results.length > 0){
                resolve(results[0].ID)
            }else{
                reject('No user found')
            }
        });
    })
}

function addRequest(user, projectName) {
    getUserID(user).then((result)=>{
        console.log("hereee"+result)
            let requestDetails = {
              project_requested: projectName,
              date: new Date(),
              user_requested_id: result,
            };
            connection.query(
              "INSERT INTO user_request SET ?",
              requestDetails,
              function (error, results, fields) {
                if (error) {
                  console.log(error);
                } else {
                }
              }
            );
    }).catch((error)=>{
        console.log(error)
    })
}


module.exports = {
  getUserEmail: getUserEmail,
  authUser: authUser,
  registerUser: registerUser,
  addRequest: addRequest,
}; 

