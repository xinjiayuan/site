var global = require("./global"),
    index = require("./index"),
    fs=require("fs"),
    gulp=require("gulp"),
    ejs = require("ejs"),
    util   = require("./util");


function generate(templ, data) {
    var str = fs.readFileSync('./templates/'+templ+'.ejs');
    var html = ejs.render(str.toString(), data,{filename:'./templates/templates/'});
    // console.log(html);
    fs.writeFileSync('./dist/'+templ+'.html', html);
}

function generateSite() {
    generate('index',index);
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