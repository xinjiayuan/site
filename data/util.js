exports=module.exports={
    activeMenu:function(_menus, title) {
        for (var i = 0, len = _menus.length;i<len;i++) {
            var menu = _menus[i];
            if (menu.title === title) {
                menu.active = true;
                break;
            }
        }
        return _menus;
    }
};