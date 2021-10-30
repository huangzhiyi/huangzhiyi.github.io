function imgShow(outerdiv, innerdiv, bigimg, _this){
    var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
    $(bigimg).attr("src", src);//设置#bigimg元素的src属性
      /*获取当前点击图片的真实大小，并显示弹出层及大图*/
    $("<img/>").attr("src", src).on('load',function(){
      var windowW = $(window).width();//获取当前窗口宽度
      var windowH = $(window).height();//获取当前窗口高度
      var realWidth = this.width;//获取图片真实宽度
      var realHeight = this.height;//获取图片真实高度
      var imgWidth, imgHeight;
      var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
      if(realHeight>windowH*scale) {//判断图片高度
        imgHeight = windowH*scale;//如大于窗口高度，图片高度进行缩放
        imgWidth = imgHeight/realHeight*realWidth;//等比例缩放宽度
        if(imgWidth>windowW*scale) {//如宽度扔大于窗口宽度
          imgWidth = windowW*scale;//再对宽度进行缩放
        }
      } else if(realWidth>windowW*scale) {//如图片高度合适，判断图片宽度
        imgWidth = windowW*scale;//如大于窗口宽度，图片宽度进行缩放
              imgHeight = imgWidth/realWidth*realHeight;//等比例缩放高度
      } else {//如果图片真实高度和宽度都符合要求，高宽不变
        imgWidth = realWidth;
        imgHeight = realHeight;
      }
          $(bigimg).css("width",imgWidth);//以最终的宽度对图片缩放
      var w = (windowW-imgWidth)/2;//计算图片与窗口左边距
      var h = (windowH-imgHeight)/2;//计算图片与窗口上边距
      $(innerdiv).css({"top":h, "left":w});//设置#innerdiv的top和left属性
      $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.pimg
    });
    $(outerdiv).click(function(){//再次点击淡出消失弹出层
      $(this).fadeOut("fast");
    });
}

function hideSidebar(){
	$('#bsidebar').toggle();
	$('#hide-sb-btn').toggle();
	$('#show-sb-btn').toggle();
	$('#mainpanel').css('margin','0 auto');
}

function showSidebar(){
	$('#bsidebar').toggle();
	$('#hide-sb-btn').toggle();
	$('#show-sb-btn').toggle();
	$('#mainpanel').css('margin','');
  window.location.href="#side-title";
}

function setClipboardText(event){
    event.preventDefault();
    var node = document.createElement('div');
    node.innerHTML=window.getSelection(0).toString();
    var htmlData = '<div>温馨提示：复制使人懒惰，请尽量自己输入代码</br>'
        + node.innerHTML
        + '</div>';
    var textData = '温馨提示：复制使人懒惰，请尽量自己输入代码\r\n'
        + window.getSelection(0).toString();
    if(event.clipboardData){
        event.clipboardData.setData("text/html", htmlData);
        event.clipboardData.setData('text/plain', textData);
    }else if(window.clipboardData){
        return window.clipboardData.setData("text", textData);
    }
}

/**
*cookie 取值
*/
function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++)
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

/**
*设值到cookie
*/
function setCookie(cname,cvalue,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires+"; path=/";
}

/**
*加载CSS
*/
function includeLinkStyle(url) {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
}

function setTheme(theme){
  setCookie("theme",theme,7);
  var eleLinks = document.querySelectorAll('link[title]');
  eleLinks.forEach(function (link) {
            link.disabled = true;
            if (link.getAttribute('title') == theme) {
                link.disabled = false;
            }
        });
}

function switchTheme(){
  var darkLink = document.getElementById("dark_theme_css");
  var lightLink = document.getElementById("light_theme_css");
  if(getCookie("theme")!="light"){
    lightLink.disabled=false;
    darkLink.disabled=true;
    setCookie("theme","light",7);
  }else{
    lightLink.disabled=true;
    darkLink.disabled=false;
    setCookie("theme","dark",7);
  }
}
