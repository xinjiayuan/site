var fs=require("fs"),
    gulp=require("gulp"),
    del = require("del"),
    cp = require("cp"),
    gulpCopy = require("gulp-copy"),
    global = require("./global"),
    ejs = require("gulp-ejs"),
    rename = require("gulp-rename"),
    util   = require("./util");

exports=module.exports=Project;

function Project(field, options) {
    //工程领域
    this.field = field;
    //数据文件的根路径
    this.root = 'data/cases/';
    //url根路径
    this.urlRoot = 'cases/';
    this.projects = {};
    this.imgExt = ".jpg";
    this.distFolder = options.dist;
    try {
        fs.mkdirSync(this.distFolder);
    } catch(err) {

    }

    this.read();
}

Project.prototype = {

    /**
     * 生成工程领域页面和各项目的页面
     * @return {[type]} [description]
     */
    generateProjects : function() {

        this.clean();
        var fieldFolder = this.distFolder+'/'+this.field.name;
        //将图片拷贝到dist目录中
        this.copyImages( fieldFolder);

        var projects = this.getProjects();
        var menus = util.activeMenu(global.menus, '鑫嘉源案例'),
            submenus = util.activeMenu(global.submenus.cases, this.field.title);

        //生成工程领域页面
        var contextdata = {
            'menus':    menus,
            'submenus': submenus,
            'projects' : projects
        };
        gulp.src("./templates/index.ejs")
        .pipe(ejs(contextdata))
        .pipe(rename(this.field.name+'.html'))
        .pipe(gulp.dest('./dist'));
        //生成项目页面
        for (var i = projects.length - 1; i >= 0; i--) {
            gulp.src("./templates/project.ejs")
                .pipe(ejs({
                    'menus'     : menus,
                    'submenus'  : submenus,
                    'project'   : projects[i]
                })).pipe(rename(projects[i].index+'.html')).pipe(gulp.dest(fieldFolder));
        }
    },
    //将项目图片从data目录中拷贝到dist目录中
    copyImages:function( fieldFolder) {
        var field = this.field.name;
        fs.mkdirSync(fieldFolder);
        var projects = this.getProjects();

        for (var i=0,len=projects.length;i<len;i++) {
            var p = projects[i];
            //拷贝图片和缩略图
            gulp.src(this.root+field+"/"+p.index+"/*"+this.imgExt).pipe(gulpCopy(fieldFolder,
                {prefix:3}));//prefix:3即拷贝到目的地的目录深度
            cp.sync(this.root+field+"/"+p.imgFile,fieldFolder+'/'+p.index+this.imgExt);
        }
    },

    clean:function() {

    },

    read:function() {
        this.readProjects();
    },
    //读取行业内的项目信息
    readProjects:function() {
        var field = this.field.name;
        var path = this.root+field+'/';
        var projectFiles = fs.readdirSync(path);
        var projects = [];
        for (var i=0,len=projectFiles.length;i<len;i++) {
            //projectFiles[i]是项目缩略图文件,文件名类似 1-现代森林城, 1是序号, -后面是项目名称
            var name = projectFiles[i];
            if (name.indexOf(this.imgExt) > 0) {
                var nameParts = name.split('-');
                if (nameParts.length <= 1) {
                    continue;
                }
                //项目序号
                var index = parseInt(nameParts[0]);
                //项目名称
                var title = nameParts[1].substring(0, nameParts[1].length-4);
                //项目信息
                var projectInfo = {
                    "imgFile" : name,
                    "index" : index,
                    "title" : title,
                    "img"   : this.urlRoot+field+'/'+index+this.imgExt,
                    "link"  : this.urlRoot+field+'/'+ index+'.html',
                    "imgalt": title,
                    //从desc.txt中读取项目的描述信息
                    "desc"  : fs.readFileSync(this.root+field+"/"+index+"/desc.txt")
                };
                //从[index]文件夹中读取图片文件, 并去掉txt文件
                var hits=[];
                var images = fs.readdirSync(this.root+field+"/"+index);
                var j;
                for (j = images.length - 1; j >= 0; j--) {
                    if (images[j].indexOf('.txt')>0) {
                        hits.push(j);
                    }
                }
                for (j = hits.length - 1; j >= 0; j--) {
                    images.splice(hits[j],1);
                }
                images.sort(function(a,b) {
                    return parseInt(a)-parseInt(b);
                });
                projectInfo['images'] = images;

                projects.push(projectInfo);
            }
        }
        projects.sort(function(a,b) {
            return -b.index+a.index;
        });
        this.projects = projects;
    },

    getProjects:function() {
        return this.projects;
    }
};
