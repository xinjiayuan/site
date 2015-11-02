var global = require("./global"),
    fs=require("fs"),
    gulp=require("gulp"),
    ejs = require("ejs"),
    InfoReader = require('./info'),
    ProjectReader = require('./project'),
    util   = require("./util");


function generate(templ, data, filename) {
    var str = fs.readFileSync('./templates/'+templ+'.ejs');
    var html = ejs.render(str.toString(), data,{filename:'./templates/'+templ});
    if (!filename) {
        filename = templ;
    }
    fs.writeFileSync('./dist/'+filename+'.html', html);
}

function formPaging(page, size, count) {
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
}

function generateProjects(options) {
    var _menus = util.activeMenu(global.menus, '鑫嘉源案例');
    // var _submenus = util.activeMenu(global.submenus.cases, '亮化工程');
    if (!options) {
        options = {};
    }
    options['dist'] = './dist/cases/';
    //遍历所有的案例行业
    var hit = -1;
    for (var i = global.submenus.cases.length - 1; i >= 0; i--) {
        var field = global.submenus.cases[i];
        //读取行业下的项目信息

        var projectReader = new ProjectReader(field,options);
        //生成页面
        projectReader.generateProjects();
    }


}

function generateMainPage() {
    var _menus = util.activeMenu(global.menus, '鑫嘉源案例');
    var hit = -1;
    for (var i = global.submenus.cases.length - 1; i >= 0; i--) {
        var field = global.submenus.cases[i];
        if (field.name === 'lighting') {
            hit = i;
            break;
        }
    }
    //发光字工程, 作为主页上的项目信息
    var projectReader = new ProjectReader(global.submenus.cases[hit],{dist:'./dist/cases/'});

    var _projects = projectReader.getProjects();
    var _submenus = util.activeMenu(global.submenus.cases, '亮化工程');
    //分页生成第一页的项目展示页
    var pageProjects = _projects.slice(0, (projectReader.num_of_projects_in_page>_projects.length?_projects.length:projectReader.num_of_projects_in_page));
    var indexdata = {
        'pagename' : 'lighting',
        'menus':_menus,
        'submenus':_submenus,
        'projects' : pageProjects,
        'paging':projectReader.formPaging(0,projectReader.num_of_projects_in_page,_projects.length),
        'path':'./'
    };
    generate('index',indexdata,'main');
}

function generateInfos() {
    var menus = util.activeMenu(global.menus, '鑫嘉源资讯');
    var infoReader = new InfoReader();
    var infos = infoReader.generate();
    var pageSize = 6;
    infos.sort(function(a,b) {
        //日期相同时, 用页面名称即1,2,3,4来排序
        if (a.index === b.index) {
            return parseInt(a.name)-parseInt(b.name);
        }
        return -a.index+b.index;
    });
    var infoCount = infos.length;
    var pageCount = Math.ceil(infoCount/pageSize);
    for (var i = 0; i < pageCount ; i++) {
        var name_index = i;
        //计算slice的end
        var end = (i+1)*pageSize>infoCount?infoCount:(i+1)*pageSize;
        var pageInfos = infos.slice(i*pageSize,end);
        var contextdata = {
            'pagename' : 'info',
            'menus':    menus,
            'submenus': null,
            'infos' : pageInfos,
            'paging' : formPaging(name_index,pageSize,infoCount),
            'path':'./'
        };
        generate('info',contextdata,'info-'+i);
        if (i === 0) {
            generate('info',contextdata);
        }
    }
     /*generate('info',{
                        'pagename' : 'info',

                        'path':'./',
                        'paging':{
                            'current': 0,
                            'isFirst' : true,
                            'isLast' : true,
                            'last' : 0,
                            'total' : 1
                        }
                    });*/
}

function generateSite(options) {
    generateProjects(options);
    generateMainPage();

    generate('cover',{
                        'pagename' : 'cover',
                        'menus':util.activeMenu(global.menus, null),
                        'submenus':'hide',
                        'path':'./'
                    },'index');
    generateInfos();
    generate('about',{
                        'pagename' : 'about',
                        'menus':util.activeMenu(global.menus, '关于鑫嘉源'),
                        'submenus':util.activeMenu(global.submenus.about, '我们的业务'),
                        'path':'./'
                    });
    generate('aboutwish',{
                            'pagename' : 'aboutwish',
                            'menus':util.activeMenu(global.menus, '关于鑫嘉源'),
                            'submenus':util.activeMenu(global.submenus.about, '我们的愿景'),
                            'path':'./'
                        });
    generate('aboutcustomer',{
                        'pagename' : 'aboutcustomer',
                        'menus':util.activeMenu(global.menus, '关于鑫嘉源'),
                        'submenus':util.activeMenu(global.submenus.about, '我们的客户'),
                        'path':'./'
                    });
    generate('contact',{
                        'pagename' : 'contact',
                        'menus':util.activeMenu(global.menus, '联系我们'),
                        'submenus':null,
                        'path':'./'
                    });


}



exports = module.exports = generateSite;