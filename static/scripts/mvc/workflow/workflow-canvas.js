"use strict";define([],function(){function t(t,i,e){this.app=t,this.cv=i,this.cc=this.cv.find("#canvas-container"),this.overview=e,this.oc=e.find("#overview-canvas"),this.ov=e.find("#overview-viewport"),this.init_drag()}function i(t){this.panel=t}return $.extend(t.prototype,{init_drag:function(){var t=this,e=function(i,e){i=Math.min(i,t.cv.width()/2),i=Math.max(i,-t.cc.width()+t.cv.width()/2),e=Math.min(e,t.cv.height()/2),e=Math.max(e,-t.cc.height()+t.cv.height()/2),t.cc.css({left:i,top:e}),t.cv.css({"background-position-x":i,"background-position-y":e}),t.update_viewport_overlay()};this.cc.each(function(){this.scroll_panel=new i(this)});var o,h;this.cv.bind("dragstart",function(){var i=$(this).offset(),e=t.cc.position();h=e.top-i.top,o=e.left-i.left}).bind("drag",function(t,i){e(i.offsetX+o,i.offsetY+h)}).bind("dragend",function(){t.app.workflow.fit_canvas_to_nodes(),t.draw_overview()}),this.overview.click(function(i){if(t.overview.hasClass("blockaclick"))t.overview.removeClass("blockaclick");else{var o=t.cc.width(),h=t.cc.height(),s=t.oc.width(),c=t.oc.height(),n=i.pageX-t.oc.offset().left-t.ov.width()/2,a=i.pageY-t.oc.offset().top-t.ov.height()/2;e(-n/s*o,-a/c*h),t.app.workflow.fit_canvas_to_nodes(),t.draw_overview()}}),this.ov.bind("drag",function(i,o){var h=t.cc.width(),s=t.cc.height(),c=t.oc.width(),n=t.oc.height(),a=o.offsetX-t.overview.offset().left,f=o.offsetY-t.overview.offset().top;e(-a/c*h,-f/n*s)}).bind("dragend",function(){t.overview.addClass("blockaclick"),t.app.workflow.fit_canvas_to_nodes(),t.draw_overview()}),$("#overview-border").bind("drag",function(i,e){var o=$(this).offsetParent(),h=o.offset(),s=Math.max(o.width()-(e.offsetX-h.left),o.height()-(e.offsetY-h.top));$(this).css({width:s,height:s}),t.draw_overview()}),$("#overview-border div").bind("drag",function(){})},update_viewport_overlay:function(){var t=this.cc,i=this.cv,e=this.oc,o=this.ov,h=t.width(),s=t.height(),c=e.width(),n=e.height(),a=t.position();o.css({left:-a.left/h*c,top:-a.top/s*n,width:i.width()/h*c-2,height:i.height()/s*n-2})},draw_overview:function(){var t,i,e,o,h=$("#overview-canvas"),s=h.parent().parent().width(),c=h.get(0).getContext("2d"),n=$("#canvas-container").width(),a=$("#canvas-container").height(),f=this.cv.width(),r=this.cv.height();n<f&&a<r?(o=(s-(e=n/f*s))/2,i=(s-(t=a/r*s))/2):n<a?(i=0,t=s,o=(s-(e=Math.ceil(t*n/a)))/2):(e=s,o=0,i=(s-(t=Math.ceil(e*a/n)))/2),h.parent().css({left:o,top:i,width:e,height:t}),h.attr("width",e),h.attr("height",t),$.each(this.app.workflow.nodes,function(i,o){c.fillStyle="#D2C099",c.strokeStyle="#D8B365",c.lineWidth=1;var h=$(o.element),s=h.position(),f=s.left/n*e,r=s.top/a*t,v=h.width()/n*e,d=h.height()/a*t;o.errors?(c.fillStyle="#FFCCCC",c.strokeStyle="#AA6666"):void 0!==o.workflow_outputs&&o.workflow_outputs.length>0&&(c.fillStyle="#E8A92D",c.strokeStyle="#E8A92D"),c.fillRect(f,r,v,d),c.strokeRect(f,r,v,d)}),this.update_viewport_overlay()}}),$.extend(i.prototype,{test:function(t,i){clearTimeout(this.timeout);var e=t.pageX,o=t.pageY,h=(b=$(this.panel)).position(),s=b.width(),c=b.height(),n=b.parent(),a=n.width(),f=n.height(),r=n.offset(),v=r.left,d=r.top,l=v+n.width(),w=d+n.height(),p=-(s-a/2),g=-(c-f/2),u=a/2,_=f/2,k=!1;if(e-5<v){if(h.left<u){m=Math.min(23,u-h.left);b.css("left",h.left+m),k=!0}}else if(e+5>l){if(h.left>p){m=Math.min(23,h.left-p);b.css("left",h.left-m),k=!0}}else if(o-5<d){if(h.top<_){m=Math.min(23,_-h.top);b.css("top",h.top+m),k=!0}}else if(o+5>w&&h.top>g){var m=Math.min(23,h.top-p);b.css("top",h.top-m+"px"),k=!0}if(k){i();var b=this;this.timeout=setTimeout(function(){b.test(t,i)},50)}},stop:function(t,i){clearTimeout(this.timeout)}}),t});
//# sourceMappingURL=../../../maps/mvc/workflow/workflow-canvas.js.map