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
/**
 * 解析 yyyy-MM-dd或者yyyyMMdd格式字符为日期
 * @param {Object} dateStr
 */
function parseDate(dateStr) {
  if (!dateStr) return null;

  // 去除所有空白，防止意外空格
  var s = $.trim(dateStr);

  var year, month, day;

  // 匹配 yyyy-MM-dd
  var reg1 = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  // 匹配 yyyyMMdd
  var reg2 = /^(\d{4})(\d{2})(\d{2})$/;

  var match;

  if ((match = s.match(reg1))) {
    year = parseInt(match[1], 10);
    month = parseInt(match[2], 10) - 1; // 月份从0开始
    day = parseInt(match[3], 10);
  } else if ((match = s.match(reg2))) {
    year = parseInt(match[1], 10);
    month = parseInt(match[2], 10) - 1;
    day = parseInt(match[3], 10);
  } else {
    return null;
  }

  // 构造日期并校验有效性
  var date = new Date(year, month, day);
  if (date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day) {
    return date;
  }

  return null;
}

/**
 * 日期加减天数计算
 * @param {string | Date} date - 原始日期（支持日期字符串/Date对象）
 * @param {number} days - 要增减的天数（正数增加，负数减少）
 * @returns {Date} 计算后的新日期对象
 */
function calDays(date, days) {
  // 先把传入的日期转为标准Date对象（兼容各种输入）
  const targetDate = new Date(date);
  
  // 判断日期是否有效，无效则抛出错误提示
  if (isNaN(targetDate.getTime())) {
    throw new Error('传入的日期格式无效，请使用合法日期（如 2025-05-20、2025/05/20 或 Date 对象）');
  }

  // 核心：获取原日期的时间戳 + 天数对应的毫秒数，生成新日期
  const resultDate = new Date(targetDate.getTime() + days * 24 * 60 * 60 * 1000);

  return resultDate;
}

/**
 * 格式化日期为 yyyy-MM-dd 格式
 * @param {string | Date} date - 日期（Date对象 或 合法日期字符串）
 * @returns {string} 格式化后的日期字符串，例如 2026-04-02
 */
function formatDate(date) {
  // 转成标准 Date 对象
  const d = new Date(date);
  
  // 校验日期是否有效
  if (isNaN(d.getTime())) {
    throw new Error('无效的日期格式');
  }

  // 获取年、月、日
  const year = d.getFullYear();
  // 月份从 0 开始，所以 +1，再补 0
  const month = String(d.getMonth() + 1).padStart(2, '0');
  // 日期补 0
  const day = String(d.getDate()).padStart(2, '0');

  // 拼接返回
  return `${year}-${month}-${day}`;
}

/**
 * 过滤字符串，只保留 数字、大小写字母、减号 -
 * @param {string} str 原始字符串
 * @returns {string} 过滤后的字符串
 */
function filterStr(str) {
  if (typeof str !== 'string') return '';
  // 正则匹配：数字、字母、减号，其他全部替换为空
  return str.replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * 计算两个日期之间相差的天数
 * @param {String|Date} date1 日期1
 * @param {String|Date} date2 日期2
 * @returns {Number} 相差天数（绝对值）
 */
function getDayDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // 重置时间为 00:00:00，避免时分秒影响
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // 时间戳差值转天数
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.floor(diffTime / 86400000);

  return diffDays;
}