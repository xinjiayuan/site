var fs=require("fs"),
    gulp=require("gulp"),
    del = require("del"),
    cp = require("cp"),
    gulpCopy = require("gulp-copy"),
    global = require("./global"),
    ejs = require("ejs"),
    rename = require("gulp-rename"),
    util   = require("./util");

exports=module.exports=Project;

function generate(templ, filename, data) {
    var str = fs.readFileSync(templ);
    var html = ejs.render(str.toString(), data,{filename:'./templates/templates/'});
    // console.log(html);
    fs.writeFileSync(filename, html);
}

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
    num_of_projects_in_page : 9,
    /**
     * 生成工程领域页面和各项目的页面
     * @return {[type]} [description]
     */
    generateProjects : function() {
        this.clean();
        var fieldFolder = this.distFolder+'/'+this.field.name;
        //将图片拷贝到dist目录中
        this.copyImages( fieldFolder);
        // console.log(this.field.title);
        var projects = this.getProjects();
        var menus = util.activeMenu(global.menus, '鑫嘉源案例'),
            submenus = util.activeMenu(global.submenus.cases, this.field.title);
        //生成工程领域页面
        var projectsCount = projects.length;
        var pageCount = Math.ceil(projectsCount/this.num_of_projects_in_page);
        //领域页面分页
        for (var i = 0; i <pageCount ; i++) {
            var name_index = i;
            //计算slice的end
            var end = (i+1)*this.num_of_projects_in_page>projectsCount?projectsCount:(i+1)*this.num_of_projects_in_page;
            var pageProjects = projects.slice(i*this.num_of_projects_in_page,end);
            var contextdata = {
                'pagename' : this.field.name,
                'menus':    menus,
                'submenus': submenus,
                'projects' : pageProjects,
                'paging' : this.formPaging(name_index,this.num_of_projects_in_page,projectsCount),
                'path':'./'
            };
            //console.log(contextdata);
            generate("./templates/index.ejs",'./dist/'+this.field.name+'-'+name_index+'.html',contextdata);
            /*gulp.src("./templates/index.ejs")
            .pipe(ejs(contextdata))
            .pipe(rename(this.field.name+'-'+name_index+'.html'))
            .pipe(gulp.dest('./dist'));*/
            //生成文件名中不带0的栏目首页,内容与pagename-0.html相同,带0的页面为了分页方便
            if (i === 0) {
                generate("./templates/index.ejs",'./dist/'+this.field.name+'.html',contextdata);
                /*gulp.src("./templates/index.ejs")
                .pipe(ejs(contextdata))
                .pipe(rename(this.field.name+'.html'))
                .pipe(gulp.dest('./dist'));*/
            }

             //生成项目页面
            for (var j = pageProjects.length - 1; j>= 0; j--) {
                generate("./templates/project.ejs",fieldFolder+'/'+pageProjects[j].index+'.html',{
                        //项目页的父页面链接地址
                        'parentlink' : '../../'+this.field.name+'-'+name_index+'.html',
                        //广告领域名称
                        'fieldtitle':this.field.title,
                        //广告领域页面名字, 为了设定submenu的高亮
                        'pagename' : this.field.name,
                        'menus'     : menus,
                        'submenus'  : submenus,
                        'project'   : pageProjects[j],
                        //相对路径, 用来设定图片等资源路径
                        'path':'../../'
                    });
                /*gulp.src("./templates/project.ejs")
                    .pipe(ejs({
                        //项目页的父页面链接地址
                        'parentlink' : '../../'+this.field.name+'-'+name_index+'.html',
                        //广告领域名称
                        'fieldtitle':this.field.title,
                        //广告领域页面名字, 为了设定submenu的高亮
                        'pagename' : this.field.name,
                        'menus'     : menus,
                        'submenus'  : submenus,
                        'project'   : pageProjects[j],
                        //相对路径, 用来设定图片等资源路径
                        'path':'../../'
                    })).pipe(rename(pageProjects[j].index+'.html')).pipe(gulp.dest(fieldFolder));*/
            }
        }



    },

    /**
     * 构造分页对象
     * @param  {Number} page  页数
     * @param  {Number} size  每页记录数
     * @param  {Number} count 总数
     */
    formPaging:function(page, size, count) {
        var lastPage = Math.ceil(count/size)-1;
        return {
            "total"     :    lastPage+1,
            "current"   :   page,
            "isFirst"   :   (page === 0),
            "isLast"    :   (page === lastPage),
            "last"      :     lastPage,
            "pre"       :      page-1,
            "next"      :     page+1
        };
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
		var desc = "";
		try {
			desc = fs.readFileSync(this.root+field+"/"+index+"/desc.txt");
		} catch (err) {
			console.error(err);
		}
                //项目信息
                var projectInfo = {
                    "imgFile" : name,
                    "index" : index,
                    "title" : title,
                    "img"   : this.urlRoot+field+'/'+index+this.imgExt,
                    "link"  : this.urlRoot+field+'/'+ index+'.html',
                    "imgalt": title,
                    //从desc.txt中读取项目的描述信息
                    "desc"  : desc
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
