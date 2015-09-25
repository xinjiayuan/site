var global = require("./global"),
    ProjectReader = require('./project'),
    util   = require("./util");




var _menus = util.activeMenu(global.menus, '鑫嘉源案例');

var _submenus = util.activeMenu(global.submenus.cases, '亮化工程');

//遍历所有的案例行业
var hit = -1;
for (var i = _submenus.length - 1; i >= 0; i--) {
    var field = _submenus[i];
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
var projectReader = new ProjectReader(_submenus[hit],{dist:'./dist/cases/'});

var _projects = projectReader.getProjects();

//生成子页面
projectReader.generateProjects();

var indexdata = {
    'menus':_menus,
    'submenus':_submenus,
    'projects' : _projects
};

exports = module.exports = indexdata;