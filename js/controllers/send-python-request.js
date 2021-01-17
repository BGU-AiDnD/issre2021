const emails = require('./email-controller.js');
var connection = require('./../DButils');
const { resolve } = require('bluebird');

module.exports.callPyRequest = function (userID, github, jira) {
        return new Promise ((resolve, reject) => {
        let { PythonShell } = require('python-shell');
        let options = {
            mode: 'text',
            pythonPath: 'C:/Python27/python.exe',
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: 'C:/bugMiningSite/python/repository_mining',
            args: [github, jira]
        };
        if (userID == undefined){
            reject('user not logged-in')
        } 
        connection.addRequest(userID, jira);
        PythonShell.run('apache_repos.py', options, function (err, results) {
            if (err) {
                reject(err)
            }
            // results is an array consisting of messages collected during execution
            // if results is null then process end find
            console.log('results: %j', results);
            if(results == null){
                // Example for users
                // users = [{
                //     name: 'amit',
                //     email: 'webstudentmailer@gmail.com',
                //     projectName: 'test123',
                // }];
                connection.getUserEmail(userID).then(result=> {
                    user = [{
                        name: userID,
                        email: result,
                        projectName: github,
                    }];
                    emails.sendTo(user);
                },
                error=> {
                    reject('error while sending emails');
                });
                resolve('done')
            }
        });
    })
}