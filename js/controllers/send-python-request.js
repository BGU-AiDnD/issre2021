const emails = require('./email-controller.js');
var connection = require('./../DButils');
const { resolve } = require('bluebird');

module.exports.callPyRequest = function (userID, gitHub_user_name, github_repo, jira_product, jira_url) {
        return new Promise ((resolve, reject) => {
        let { PythonShell } = require('python-shell');
        let options = {
            mode: 'text',
            pythonPath: 'C:/Users/User/AppData/Local/Programs/Python/Python37/python.exe',
            pythonOptions: [], // get print results in real-time
            scriptPath: 'C:/repository_mining',
            args: ['-u', gitHub_user_name, '-g', github_repo, '-j', jira_product, '-jl', jira_url, '-q', '-s', '0', '-n', '5']
        };
        if (userID == undefined){
            reject('user not logged-in')
        } 
        connection.addRequest(userID, jira_product);
        PythonShell.run('main.py', options, function (err, results) {
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
                        projectName: jira_product,
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