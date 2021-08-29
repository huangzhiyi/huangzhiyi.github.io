/*生成复制按钮*/
//获取所有的代码区域的pre元素节点
const codecopys = document.getElementsByTagName('pre');
//遍历DOM（pre节点）节点
for (let i = 0; i < codecopys.length; i++) {
    //pre元素对象
    let codecopy = codecopys[i];

    //生成复制按钮
    let html_temp = '<div class="codecopy-btn" id="copybtn_'+i+'" data-title="复制" data-clipboard-action="copy" data-clipboard-target="#code_' + i + '"' +
        'οnclick="onC(this);" οnmοuseοut="mOut(this)">复制</div>';

	  codecopy.setAttribute('class','codecopy');
    codecopy.firstChild.setAttribute('id', 'code_' + i);

    //将复制按钮追加至页面
    let html = codecopy.innerHTML + html_temp;

    codecopy.innerHTML = html;
}
/*初始化复制功能*/
const clipboardJs = new ClipboardJS('.codecopy-btn');//注意：ClipboardJS替代了Clipboard

/*复制成功事件*/
clipboardJs.on('success', function (e) {
	e.trigger.innerHTML = '复制成功';
	setTimeout(function () {
        e.trigger.innerHTML = '复制';
    }, 1500);
    console.log(e);
});
/*复制失败事件*/
clipboardJs.on('error', function (e) {
    console.log(e);
});
