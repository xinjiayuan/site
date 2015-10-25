var fs=require("fs"),
    gulp=require("gulp"),
    del = require("del"),
    cp = require("cp"),
    gulpCopy = require("gulp-copy"),
    global = require("./global"),
    ejs = require("ejs"),
    rename = require("gulp-rename"),
    util   = require("./util");

exports=module.exports=InfoReader;



function generateHtml( filename, data) {
    // var templ = ejs.compile('./templates/infopage.ejs',{filename:'./templates/infopage.ejs'});
    var  templ = fs.readFileSync('./templates/infopage.ejs','utf-8');
    // console.log(data);
    var html = ejs.render(templ, {
        info:data,
        path:'../../',
        menus:util.activeMenu(global.menus, '鑫嘉源资讯'),
        submenus:null
    },{filename:'./templates/infopage.ejs'});
    //console.log(html);
    fs.writeFileSync(filename, html);
}

function InfoReader() {
    //数据文件的根路径
    this.root = 'data/infos/';
    //url根路径
    this.urlRoot = 'infos/';
    this.infos = {};
    this.imgExt = ".jpg";
    this.distFolder = './dist/infos/';
    try {
        fs.mkdirSync(this.distFolder);
    } catch(err) {

    }
    this.infos = this.read();
}

InfoReader.prototype={
    clean:function() {

    },
    generate:function() {
        this.clean();
        //将图片拷贝到dist目录中
        this.copyImages( this.distFolder);
        var me = this;

            for (var i = me.infos.length - 1; i >= 0; i--) {
		try {
        		fs.mkdirSync(me.distFolder+me.infos[i].path+'/');
    		} catch(err) {

    		}
                generateHtml(me.distFolder+me.infos[i].path+'/'+me.infos[i].name+'.html',
                    me.infos[i]);

            }



        return this.infos;
    },

    //将项目图片从data目录中拷贝到dist目录中
    copyImages:function( distFolder) {
        // fs.mkdirSync(distFolder);
        //拷贝图片和缩略图
        gulp.src(this.root+"/**/*"+this.imgExt).pipe(gulpCopy(distFolder,
            {prefix:2}));//prefix:3即拷贝到目的地的目录深度
    },

    read:function() {
        var path = this.root;
        var infoDates = fs.readdirSync(path);
        var infos = [];
        for (var i=0,len=infoDates.length;i<len;i++) {
            //日期
            var name = infoDates[i];
            var parts = name.split('-');
            var infoDate = new Date().setFullYear(parseInt(parts[0]),parseInt(parts[1]),parseInt(parts[2]));
            var infoDateName = parts[0]+'年'+parts[1]+'月'+parts[2]+'日';
            var infoList = fs.readdirSync(path+name);
            //新闻目录
            for (var j = infoList.length - 1; j >= 0; j--) {
                var infoFolder = infoList[j];
                var infoFilePath = path+name+'/'+infoFolder;
                var infoFiles = fs.readdirSync(infoFilePath);
                var desc = "", content = "", title="";
                var images = [];
                //新闻文件, content.txt是新闻内容, desc.txt是新闻简介, 其他都是图片
                try {
                    desc = fs.readFileSync(infoFilePath+"/desc.txt");
                } catch (err) {
                    console.error(err);
                }
                try {
                    content = fs.readFileSync(infoFilePath+"/content.txt");
                } catch (err) {
                    console.error(err);
                }
                try {
                    title = fs.readFileSync(infoFilePath+"/title.txt");
                } catch (err) {
                    console.error(err);
                }
                //图片
                for (var n = infoFiles.length - 1; n >= 0; n--) {
                    if (infoFiles[n].indexOf('.txt') < 0) {
                        images.push(infoFiles[n]);
                    }
                }
                images.sort(function(a, b) {
                    return parseInt(a.split('.')[0])-parseInt(b.split('.')[0]);
                });
                infos.push({
                    "name":infoFolder,
                    "path" : name+"/",
                    "title":title,
                    "desc" : desc,
                    "content" : content,
                    "infodate" : infoDateName,
                    "index":infoDate,
                    "images":images,
                    "link": name+"/"+infoFolder+".html"
                });
            }
        }
        return infos;
    }
};