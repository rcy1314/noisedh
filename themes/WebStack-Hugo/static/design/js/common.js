 (function(c,b,a,e){var d=c(b);c.fn.lazyload=function(f){var h=this;var i;var t;var g={threshold:0,failure_limit:0,event:"scroll",effect:"show",throttle:300,container:b,data_attribute:"src",skip_invisible:true,appear:null,load:null,placeholder:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"};function j(){var k=0;h.each(function(){var l=c(this);if(g.skip_invisible&&!l.is(":visible")){return}if(c.abovethetop(this,g)||c.leftofbegin(this,g)){}else{if(!c.belowthefold(this,g)&&!c.rightoffold(this,g)){l.trigger("appear");k=0}else{if(++k>g.failure_limit){return false}}}})}if(f){if(e!==f.failurelimit){f.failure_limit=f.failurelimit;delete f.failurelimit}if(e!==f.effectspeed){f.effect_speed=f.effectspeed;delete f.effectspeed}c.extend(g,f)}i=(g.container===e||g.container===b)?d:c(g.container);if(0===g.event.indexOf("scroll")){i.bind(g.event,function(){if(t){clearTimeout(t)}return t=setTimeout(j,g.throttle)})}this.each(function(){var k=this;var l=c(k);k.loaded=false;if(l.attr("src")===e||l.attr("src")===false){if(l.is("img")){l.attr("src",g.placeholder)}}l.one("appear",function(){if(!this.loaded){if(g.appear){var m=h.length;g.appear.call(k,m,g)}var o=l.attr("data-"+g.data_attribute);if(l.is("img")){l.attr("src",o)}else{l.css("background-image","url("+o+")")}k.loaded=true;var n=c.grep(h,function(q){return !q.loaded});h=c(n);if(g.load){var p=h.length;g.load.call(k,p,g)}}});if(0!==g.event.indexOf("scroll")){l.bind(g.event,function(){if(!k.loaded){l.trigger("appear")}})}});d.bind("resize",function(){j()});if((/(?:iphone|ipod|ipad).*os 5/gi).test(navigator.appVersion)){d.bind("pageshow",function(k){if(k.originalEvent&&k.originalEvent.persisted){h.each(function(){c(this).trigger("appear")})}})}c(a).ready(function(){j()});return this};c.belowthefold=function(g,h){var f;if(h.container===e||h.container===b){f=(b.innerHeight?b.innerHeight:d.height())+d.scrollTop()}else{f=c(h.container).offset().top+c(h.container).height()}return f<=c(g).offset().top-h.threshold};c.rightoffold=function(g,h){var f;if(h.container===e||h.container===b){f=d.width()+d.scrollLeft()}else{f=c(h.container).offset().left+c(h.container).width()}return f<=c(g).offset().left-h.threshold};c.abovethetop=function(g,h){var f;if(h.container===e||h.container===b){f=d.scrollTop()}else{f=c(h.container).offset().top}return f>=c(g).offset().top+h.threshold+c(g).height()};c.leftofbegin=function(g,h){var f;if(h.container===e||h.container===b){f=d.scrollLeft()}else{f=c(h.container).offset().left}return f>=c(g).offset().left+h.threshold+c(g).width()};c.inviewport=function(f,g){return !c.rightoffold(f,g)&&!c.leftofbegin(f,g)&&!c.belowthefold(f,g)&&!c.abovethetop(f,g)};c.extend(c.expr[":"],{"below-the-fold":function(f){return c.belowthefold(f,{threshold:0})},"above-the-top":function(f){return !c.belowthefold(f,{threshold:0})},"right-of-screen":function(f){return c.rightoffold(f,{threshold:0})},"left-of-screen":function(f){return !c.rightoffold(f,{threshold:0})},"in-viewport":function(f){return c.inviewport(f,{threshold:0})},"above-the-fold":function(f){return !c.belowthefold(f,{threshold:0})},"right-of-fold":function(f){return c.rightoffold(f,{threshold:0})},"left-of-fold":function(f){return !c.rightoffold(f,{threshold:0})}})})(jQuery,window,document);

  !function () {
  var _996nav = _996nav || {};
    _996nav.lzImg = function (imgs) {
        if (imgs === undefined) {
            imgs = jQuery("img.lazy");
        }
        imgs.lazyload({
            threshold: 100,
            failure_limit: 10,
            effect: "fadeIn",
            throttle: 50,
            effect_speed: 100,
            skip_invisible: true,
            load: function () {               
            }
        });
    };
  _996nav.init = function () {
        _996nav.lzImg();
    };  
    jQuery(function () {
          _996nav.init();
    });
        var $scroll_obj = $('#btn-scrollup');
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 100) {
                $scroll_obj.fadeIn();
            } else {
                $scroll_obj.fadeOut();
            }
        });

        // $scroll_obj.on('click', function() {
        //     $('html, body').animate({
        //         scrollTop: 0
        //     }, 600);
        //     return false;
        // });

    for(j=0;j<arr.length;j++){
    for(i=0;i<arr[j].length;i++){
              var newDiv = document.createElement('div');
              var num = Math.floor(Math.random()*1000); 
            newDiv.className = "col-xs-12 col-sm-6 col-md-3 col-lg-2 website";
            newDiv.innerHTML = 
            '<a href="'+arr[j][i].href+'" title="'+arr[j][i].name+'" target="_blank" >'+
            '<img class="lazy website_logo"  src="images/lazy.png" data-src="'+arr[j][i].logo+'" alt="">'+
            ' <div class="website_introduce">'+
            '<h3 class="website_name">'+arr[j][i].name+'<em>'+num+'</em>'+'</h3>'+
            '<p class="website_keywords">'+arr[j][i].detail+'</p>'+
            '</div>'+
            '</a>'   
            $(".main").eq(j).append(newDiv);                 
      };
}; 
 $(window).scroll(function(){
            var _top = $(this).scrollTop();
            
            if (_top > 0){
                $(".siderBar").fadeIn();    
            } else {
                $(".siderBar").fadeOut();   
            };  
            var obj = $(".container .site");     

            obj.each(function(){                                
                var i = $(this).index()-1;
                var _h = obj.eq(i).offset().top + $(this).height()/2;                     
                if (_top < _h){
                    $(".floor ul li").eq(i).find("span").addClass("active").parent().siblings().find("span").removeClass("active");
                    return false;
                }
            });         
        });     

        
        $(".floor ul li").click(function(){
            $(this).find("span").addClass("active").parent().siblings().find('span').removeClass();     
            var _index = $(this).index();
            var _height = $(".container .site").eq(_index).offset().top+15;          
            $("body,html").animate({scrollTop:_height},500);        
        }); 
$('.siderBar .top').click(function(){
     $('html, body').animate({
                scrollTop: 0
            }, 600);
})
        $(".siderBar .shejiao").hover(function(){
        $(this).children().show(100);
    },function(){
        $(this).children().hide(500);
        
    });

  }();


 
     

       var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?d50bffcfa093581a686b59b87f5d917f";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();




eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('!2(){2 g(){h(),i(),j(),k()}2 h(){d.9=s()}2 i(){z a=4.8(\'A[B="7"][5="\'+p()+\'"]\');a&&(a.9=!0,l(a))}2 j(){v(u())}2 k(){w(t())}2 l(a){P(z b=0;b<e.O;b++)e[b].I.1c("s-M");a.F.F.F.I.V("s-M")}2 m(a,b){E.H.S("L"+a,b)}2 n(a){6 E.H.Y("L"+a)}2 o(a){f=a.3,v(u()),w(a.3.5),m("7",a.3.5),c.K(),l(a.3)}2 p(){z b=n("7");6 b||a[0].5}2 q(a){m("J",a.3.9?1:-1),x(a.3.9)}2 r(a){6 a.11(),""==c.5?(c.K(),!1):(w(t()+c.5),x(s()),s()?E.U(b.G,+T X):13.Z=b.G,10 0)}2 s(){z a=n("J");6 a?1==a:!0}2 t(){6 4.8(\'A[B="7"]:9\').5}2 u(){6 4.8(\'A[B="7"]:9\').W("14-N")}2 v(a){c.1e("N",a)}2 w(a){b.G=a}2 x(a){a?b.3="1a":b.16("3")}z y,a=4.R(\'A[B="7"]\'),b=4.8("#18-C-19"),c=4.8("#C-12"),d=4.8("#17-C-15"),e=4.R(".C-1b"),f=a[0];P(g(),y=0;y<a.O;y++)a[y].D("Q",o);d.D("Q",q),b.D("1d",r)}();',62,77,'||function|target|document|value|return|type|querySelector|checked||||||||||||||||||||||||||var|input|name|search|addEventListener|window|parentNode|action|localStorage|classList|newWindow|focus|superSearch|current|placeholder|length|for|change|querySelectorAll|setItem|new|open|add|getAttribute|Date|getItem|href|void|preventDefault|text|location|data|blank|removeAttribute|set|super|fm|_blank|group|remove|submit|setAttribute'.split('|'),0,{}))