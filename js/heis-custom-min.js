function imgShow(g,h,d,t){t=t.attr("src");$(d).attr("src",t),$("<img/>").attr("src",t).on("load",function(){var t=$(window).width(),i=$(window).height(),s=this.width,n=this.height,a=.8;i*a<n?t*a<(o=(e=i*a)/n*s)&&(o=t*a):e=t*a<s?(o=t*a)/s*n:(o=s,n),$(d).css("width",o);var o=(t-o)/2,e=(i-e)/2;$(h).css({top:e,left:o}),$(g).fadeIn("fast")}),$(g).click(function(){$(this).fadeOut("fast")})}function hideSidebar(){$("#bsidebar").toggle(),$("#hide-sb-btn").toggle(),$("#show-sb-btn").toggle(),$("#mainpanel").css("margin","0 auto")}function showSidebar(){$("#bsidebar").toggle(),$("#hide-sb-btn").toggle(),$("#show-sb-btn").toggle(),$("#mainpanel").css("margin","")}