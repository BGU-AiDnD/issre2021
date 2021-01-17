const nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'webstudentmailer@gmail.com',
            pass: 'student2020',
        }
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');

    function sendEmail(obj){
        return transporter.sendMail(obj);
    }
    
    function loadTemplate(templateName, recivers){
        let template = new EmailTemplate(path.join(__dirname,'templates',templateName));
        return Promise.all(recivers.map((reciver)=>{
            return new Promise((resolve, reject) =>{
                template.render(reciver, (err, result)=>{
                    if(err) reject(err);
                    else resolve({
                        email:result,
                        reciver,
                    });
                });
            });
        }));
    }

    function sendTo(users){
        loadTemplate('project-done', users).then((results) => {
            return Promise.all(results.map((result) => {
                sendEmail({
                    to: result.reciver.email,
                    from: 'Me?',
                    subject: result.email.subject,
                    text: result.email.text,
                });
            }));
        }).then(() => {
            console.log("finished");
        }).catch((err) => {
            console.log(err);
        });
    }
module.exports = {sendTo:sendTo}; 