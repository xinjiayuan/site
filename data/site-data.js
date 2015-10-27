var global = require("./global"),
    index = require("./index"),
    fs=require("fs"),
    gulp=require("gulp"),
    ejs = require("ejs"),
    InfoReader = require('./info'),
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

function generateSite() {

    generate('index',index,'main');
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