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
                "name" : "lighting",
                "link"  : "lighting.html",
                "active": false
            },
            {
                "title" : "楼顶发光字",
                "name" : "building-lumin-chars",
                "link"  : "building-lumin-chars.html",
                "active": false
            },
            {
                "title" : "楼宇彩虹字",
                "name" : "building-rainbow-chars",
                "link"  : "building-rainbow-chars.html",
                "active": false
            },
            {
                "title" : "房地产围墙",
                "name" : "realestate-wall",
                "link"  : "realestate-wall.html",
                "active": false
            }
        ],

        "info" : [
        ]
    }
};
exports=module.exports=global;