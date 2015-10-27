$(document).ready(function(){




			$.link_click=function(url)
			{

				var line=$(".loading")
				line.css({"display":"block","width":"0%"}).animate({"width":"50%"},400,function(){
				window.location=url

				})

			}



			if ($("#menu").length>0)
			{


				$.reset_redbtn2=function(zt){

					var movebg=$("#menu").find(".btn_redbg")
					var change_mb=$("#menu").find("li.change")
					if (!movebg.position() || !change_mb.position()) {
						return;
					}
					var ul=$("#menu").find("ul")
					if (zt==0)
					{

						var line=$(".loading")
						if (line.is(":visible"))
						{
							line.css({"display":"block","width":"50%"}).stop(true,false).animate({"width":"100%"},700,function(){line.fadeOut(300);})
						}
						movebg.css({"left":ul.position().left+change_mb.position().left+"px","width":change_mb.css("width")})
					}
					else
					{
						movebg.css({"left":ul.position().left+change_mb.position().left+"px","width":change_mb.css("width")+"px","height":"0"}).stop(true,false).animate({"height":"100%"},400)
					}

				}

				$.reset_redbtn2(0)
				$("#menu").find("li.change").addClass("hover");

				/*$("#menu ul li").click(function(){
					if($(".loading").is(":animated")){return false;}
					if ($(this).is(".hover")) {return false;}
					$(this).parent().find(".hover").removeClass("change")	.removeClass("hover")
					$(this).addClass("change").addClass("hover")
					var url=$(this).find("a").attr("href")
					$.reset_redbtn2(1)
					$.link_click(url)
					return false;
				})*/


			}




			if ($("#nav").length>0)
			{


				$.reset_redbtn=function(zt){
					var movebg=$("#nav").find(".btn_redbg")
					var change_mb=$("#nav").find("li.change")
					if (!movebg.position() || !change_mb.position()) {
						return;
					}
					var ul=$("#nav").find("ul")
					if (zt==0)
					{
						movebg.css({"left":ul.position().left+change_mb.position().left+"px","width":change_mb.width()+"px"})
					}
					else
					{
						movebg.stop(true,false).animate({"left":ul.position().left+change_mb.position().left+"px","width":change_mb.width()+"px"},200)
					}





				}

				$.reset_redbtn(0)
				$("#nav").find("li.change").addClass("hover");

				$("#nav ul li").hover(function(){
					$(this).parent().find(".change").removeClass("change")
					$(this).addClass("change")
					$.reset_redbtn(1)
				},function(){
					$(this).parent().find(".change").removeClass("change")
					$(this).parent().find(".hover").addClass("change")
					$.reset_redbtn(1)
				})/*.click(function(){
					if($(".loading").is(":animated")){return false;}
					if ($(this).is(".hover")) {return false;}
					$(this).parent().find(".hover").removeClass("change")	.removeClass("hover")
					$(this).addClass("change").addClass("hover")
					var url=$(this).find("a").attr("href")
					$.link_click(url)
					return false;
				})*/


			}

			$(".PictureList li").hover(function(){
				$(this).addClass("hover")

			},function(){

				$(this).removeClass("hover")
				})


				$(window).resize()
})




	$(window).resize(function(){
		if ($.reset_redbtn) {
			$.reset_redbtn(0)
			$.reset_redbtn2(0)
		}

	})


