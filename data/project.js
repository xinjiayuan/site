var fs=require("fs"),
    gulp=require("gulp"),
    del = require("del"),
    cp = require("cp"),
    gulpCopy = require("gulp-copy");

exports=module.exports=Project;

function Project(options) {
    // this.title = options.title;
    this.root = 'data/cases/';
    this.urlRoot = 'cases/';
    this.projects = {};
    this.imgExt = ".jpg";
    this.distFolder = options.dist;
    fs.mkdirSync(this.distFolder);
    this.read();
}

Project.prototype = {

    generateProjects : function() {
        this.clean();
        var fields = this.getFields();
        //create folders
        for (var i = 0, len = fields.length;i<len;i++) {
            var fieldFolder = this.distFolder+'/'+fields[i];
            this.generateField(fields[i], fieldFolder);
        }
    },

    generateField:function(field, fieldFolder) {
        fs.mkdirSync(fieldFolder);
        var projects = this.getProjects(field);

        for (var i=0,len=projects.length;i<len;i++) {
            var p = projects[i];
            //拷贝图片和缩略图
            gulp.src(this.root+field+"/"+p.index+"/*"+this.imgExt).pipe(gulpCopy(fieldFolder,
                {prefix:3}));
            // gulp.src(this.root+field+"/"+p.imgFile).pipe(gulpCopy(fieldFolder+'/',
            //     {prefix:3}));
            cp.sync(this.root+field+"/"+p.imgFile,fieldFolder+'/'+p.index+this.imgExt);
        }
    },

    clean:function() {

    },

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
            if (name.indexOf(this.imgExt) > 0) {
                var nameParts = name.split('-');
                if (nameParts.length <= 1) {
                    continue;
                }
                var index = parseInt(nameParts[0]);

                var title = nameParts[1].substring(0, nameParts[1].length-4);
                projects.push({
                    "imgFile" : name,
                    "index" : index,
                    "title" : title,
                    "img"   : this.urlRoot+field+'/'+index+this.imgExt,
                    "link"  : this.urlRoot+field+'/'+ index+'.html',
                    "imgalt": title
                });
            }
        }
        projects.sort(function(a,b) {
            return -b.index+a.index;
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
