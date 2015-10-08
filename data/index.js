var global = require("./global"),
    ProjectReader = require('./project'),
    util   = require("./util");




var _menus = util.activeMenu(global.menus, '鑫嘉源案例');

// var _submenus = util.activeMenu(global.submenus.cases, '亮化工程');

//遍历所有的案例行业
var hit = -1;
for (var i = global.submenus.cases.length - 1; i >= 0; i--) {
    var field = global.submenus.cases[i];
    if (field.name === 'lighting') {
        hit = i;
        continue;
    }
    //读取行业下的项目信息
    var projectReader = new ProjectReader(field,{dist:'./dist/cases/'});
    //生成页面
    projectReader.generateProjects();
}

//发光字工程, 作为主页上的项目信息
var projectReader = new ProjectReader(global.submenus.cases[hit],{dist:'./dist/cases/'});

var _projects = projectReader.getProjects();
var _submenus = util.activeMenu(global.submenus.cases, '亮化工程');
//生成子页面
projectReader.generateProjects();
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
exports = module.exports = indexdata;