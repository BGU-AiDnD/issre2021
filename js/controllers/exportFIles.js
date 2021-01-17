var JSZip = require("jszip");
const fs = require('fs');
const project_dir = "python/repository_mining/repository_data/apache_versions";
const features_dir = "python/repository_mining/repository_data/metrics";
var FileSaver = require('file-saver');


module.exports.zipProjects = function (req, res) {
    var zip = new JSZip();
    var project_folder = zip.folder("Projects");
    if (req.body.projects == undefined) {
        res.status(404).send("No project were selected!");
    } else {
        req.body.projects.forEach(element => {
            let path = project_dir + "/" + element.toUpperCase() + ".csv";
            let data = fs.readFileSync(path);
            project_folder.file(element + ".csv", data);
        });
        // zip
        // .generateNodeStream({type:'nodebuffer',streamFiles:true})
        // .pipe(fs.createWriteStream('userProjects.zip'))
        // .on('finish', function (){
        //     console.log("out.zip written.");
        // });
        zip.generateAsync({ type: "binarystring" }).then(function (content) {
            res.send(content);
        });
    }
}


module.exports.zipFeatures = function (req, res) {
    let zip = new JSZip();
    let project_folder = zip.folder(req.body.project_name);
    console.log(req.body.project_name)
    if (req.body.versions == undefined) {
        res.status(404).send("No project were selected!");
    }else if(req.body.project_name == undefined || req.body.feature_groups == undefined){
        res.status(404).send('Missing project or feature group')
    } else {
        req.body.versions.forEach(element => {
            let version_folder = project_folder.folder(element);
            req.body.feature_groups.forEach(feature_group => {
                let path = features_dir + "/" +req.body.project_name+"/"+element+'/'+feature_group+".csv";
                console.log(path)
                let data = fs.readFileSync(path);
                version_folder.file(feature_group + ".csv", data);
            })
        });
        // zip
        // .generateNodeStream({type:'nodebuffer',streamFiles:true})
        // .pipe(fs.createWriteStream('userProjects.zip'))
        // .on('finish', function (){
        //     console.log("out.zip written.");
        // });
        zip.generateAsync({ type: "binarystring" }).then(function (content) {
            res.send(content);
        });
    }
}