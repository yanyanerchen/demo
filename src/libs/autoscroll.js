(function(a){
    a.fn.extend({
        Scroll:function(c,p){
            if(!c){
                var c={}
            }
			
        var m=a("#"+c.up);
			
        var f=a("#"+c.down);
        var k=c.timername;
		
        var h=this.eq(0).find("ul:first");
        var n=h.find("li:first").height(),q=c.line?parseInt(c.line,10):parseInt(this.height()/n,10),e=c.speed?parseInt(c.speed,10):500;
        var timer=c.timer;
		//如果高度不够不滚动
        var thisnum=h.find("li").length;
		var scrollnum= parseInt(this.height()/n);
		if (thisnum<=scrollnum){
			window.clearInterval(k);
		}

        if(q==0){
            q=1
            }
        var l=0-q*n;
			
        var d=function(){
			thisnum=h.find("li").length;
			if (thisnum<=scrollnum){
			window.clearInterval(k);
			return false;
			
			}
            m.unbind("click",d);
            h.animate({
                marginTop:l
            },e,function(){
                for(i=1;i<=q;i++){
                    h.find("li:first").appendTo(h)
                    }
                    h.css({
                    marginTop:0
                });
                m.bind("click",d)
                })
            };
            
        var o=function(){
            f.unbind("click",o);
            for(i=1;i<=q;i++){
                h.find("li:last").show().prependTo(h)
                }
            h.css({
                marginTop:l
           	});
            h.animate({
                marginTop:0
            },e,function(){
                f.bind("click",o)
            })
       };
           
        var g=function(){
            if(timer){
				window.clearInterval(k);
				if (thisnum>scrollnum){
					k=window.setInterval(d,timer)
				}
             }
            };
        
		var b=function(){ 
			if(timer){
				window.clearInterval(k)
				}
			};
		h.hover(b,g).mouseout();
		m.css("cursor","pointer").click(d).hover(b,g);
		f.css("cursor","pointer").click(o).hover(b,g)
		
    }
	
})
})(jQuery);