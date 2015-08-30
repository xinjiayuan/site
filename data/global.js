var global = {
    //主菜单
    "menus": [
        {
            "title" : "鑫嘉源案例",
            "link"  : "/cases.html",
            "active": false
        },
        {
            "title" : "关于鑫嘉源",
            "link"  : "/about.html",
            "active": false
        },
        {
            "title" : "鑫嘉源资讯",
            "link"  : "/info.html",
            "active": false
        },
        {
            "title" : "联系我们",
            "link"  : "/contact.html",
            "active": false
        }
    ],

    //二级菜单
    submenus : {
        //鑫嘉源案例的二级菜单
        "cases" : [
            {
                "title" : "亮化工程",
                "link"  : "/cases/lighting.html",
                "active": false
            },
            {
                "title" : "楼顶发光字",
                "link"  : "/cases/building-lumin-chars.html",
                "active": false
            },
            {
                "title" : "楼宇彩虹字",
                "link"  : "/cases/building-rainbow-chars.html",
                "active": false
            },
            {
                "title" : "房地产围墙",
                "link"  : "/cases/realestate-wall.html",
                "active": false
            }
        ],

        "info" : [
        ]
    }
};
exports=module.exports=global;