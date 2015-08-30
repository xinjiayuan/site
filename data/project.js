var fs=require("fs");

exports=module.exports=Project;

function Project(options) {
    // this.title = options.title;
    this.root = 'data/cases/';
    this.urlRoot = '/cases/';
    this.projects = {};
    // this.distFolder = options.dist;
    this.read();
}

Project.prototype = {
    read:function() {
        var projectFields = fs.readdirSync(this.root);
        for (var i=0, len=projectFields.length;i<len;i++) {
            this.readField(projectFields[i]);
        }
    },

    readField:function(field) {
        var path = this.root+field+'/';
        var projectFiles = fs.readdirSync(path);
        var projects = [];
        for (var i=0,len=projectFiles.length;i<len;i++) {
            var name = projectFiles[i];
            if (name.indexOf('.jpg') > 0) {
                var nameParts = name.split('-');
                var index = parseInt(nameParts[0]);
                projects.push({
                    "index" : index,
                    "title" : nameParts[1].substring(0, nameParts[1]-4),
                    "img"   : name,
                    "link"  : this.urlRoot+field+'/'+ index+'.html',
                    "imgalt": name
                });
            }
        }
        projects.sort(function(a,b) {
            return b.index-a.index;
        });
        this.projects[field] = projects;
    },

    getFields:function() {
        var result = [];
        for (var p in this.projects) {
            if (this.projects.hasOwnProperty(p)) {
                result.push(p);
            }
        }
        return result;
    },

    getProjects:function(field) {
        return this.projects[field];
    }
};
