// var express = require('express')
// var router = express.Router()
const fs = require('fs');
const project_dir = 'C:/repository_mining/repository_data/apache_versions';
const featureGroup_dir = 'C:/repository_mining/repository_data/dataname.json';
const authenticateController = require('./controllers/authenticate-controller');
const registerController = require('./controllers/register-controller');
const pythonRequestController = require('./controllers/send-python-request');
const exportFiles = require('./controllers/exportFIles');

module.exports = (router) => {
async function getProjects(callback) {
    fs.readdir(project_dir, function (err, files) {
        if (err) {
            return callback(err);
        } else {
            fileNames = [];
            files.forEach(element => {
                fileNames.push(element);
            });
            return callback(null, fileNames);
        };
    });
};

const featurePromise = new Promise((resolve, reject)=>{
    fs.readFile(featureGroup_dir, async (err, data) => {
        if (err) reject(err);
        let dictionary = {}
        JSON.parse(data).forEach(element => {
            if(dictionary[element.feature_group] == undefined){
                dictionary[element.feature_group] = []
            }
            dictionary[element.feature_group].push(element.feature_name)
        });
        resolve(dictionary)
    });
})

const redirectLogin = (req, res, next) => {
    if (!req.session.userID) {
        req.flash('message', 'Must be logged in before viewing projects');
        res.redirect('login');
    }
    else
        next();
}
// redirect user to home if already logged-in
const redirectHome = (req, res, next) => {
    if (req.session.userID)
        res.redirect('/');
    else
        next();
}

router.get('/', (req, res) => {
    const { userID } = req.session;
    if (!req.session.userID){
        res.redirect('login');
        console.log('goto login');
    }else{
        res.render('home', {
            userID,
            title: "homepage",
            message: req.flash('message')
        });
    }
});
// app.get('/project', redirectLogin, function (req, res, next) {
router.get('/project', redirectLogin, function (req, res, next) {
    res.redirect('project/projects')
});

router.get('/project/features', function (req, res, next){
    const { userID } = req.session;
    featurePromise.then((data) => {
        const features = data
        res.render("FeatureSelection", {
          title: "project",
          layout: "default",
          message: req.flash("message"),
          features,
          userID,
        });
    }).catch((err) => {
        console.log('error') // should redirect to error page
    })
})
router.get("/project/projects", function (req, res, next) {
    let projects = undefined;
    getProjects(async function (err, result) {
        projects = result;
          featurePromise.then((data) => {
              const features = data;
              const { userID } = req.session;
              res.render("project", {
                title: "project",
                layout: "default",
                message: req.flash("message"),
                features,
                userID,
                projects
              });
            }).catch((err) => {
              console.log(err); // should redirect to error page
            });
    });  
});

router.get('/login', redirectHome, function (req, res, next) {
    res.render('login', {
        title: "loginpage",
        message: req.flash('message')
    });
});

router.get('/register', redirectHome, (req, res) => {
    res.render('register', {
        title: "registerpage",
        message: req.flash('message')
    });
});


router.get('/welcome', redirectHome, (req, res) => {
    res.render('animated', {
    });
});

router.get('/about', redirectHome, function (req, res, next) {
    res.render('about', {
        title: "aboutpage",
        message: req.flash('message')
    });
});


router.get('/beirut', redirectHome, function (req, res, next) {
    res.render('beirut', {
        title: "beirutpage",
        message: req.flash('message')
    });
});


router.post('/request/project', redirectLogin, (req, res)=>{
    console.log(req.body)
    pythonRequestController.callPyRequest(req.session.userID, req.body.gitHub_user_name, req.body.github_repo, req.body.jira_product, req.body.jira_url).then((result)=>{
        console.log('done')
    }).catch((error)=>{
        console.log(error)
    })
    res.render('home', {
        userID: req.session.userID,
        title: "homepage",
        message: req.flash('message')
    });})



router.use((req, res, next) => {
    const redirector = res.redirect
    res.redirect = function (url) {
      // url = 'njsw08' + url
      console.log(`redirect ${url}`);
      redirector.call(this, url)
    }
    next()
  })
router.post('/controllers/register-controller', registerController.register);
router.post('/controllers/authenticate-controller', authenticateController.authenticate);
router.post('/controllers/zipProjects', exportFiles.zipProjects);
router.post('/controllers/zipFeatures', exportFiles.zipFeatures);
// app.post('/api/register', registerController.register);
// app.post('/api/authenticate', authenticateController.authenticate);
return router; 
};

