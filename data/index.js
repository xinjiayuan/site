var global = require("./global"),
    ProjectReader = require('./project'),
    util   = require("./util");




var _menus = util.activeMenu(global.menus, '鑫嘉源案例');

var _submenus = util.activeMenu(global.submenus.cases, '亮化工程');

var projectReader = new ProjectReader();

var _projects = projectReader.getProjects('lighting');

var indexdata = {
    menus:_menus,
    submenus:_submenus,
    projects : _projects
};

exports = module.exports = indexdata;