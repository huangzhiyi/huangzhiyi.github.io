/**
 * firstweek是开始周，lastweek是结束周，w是当前周
 */
const COURSE_G_VAR={
	firstweek:1,
	lastweek:19,
	w:1
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
 * 获取日期是星期几，周一 = 1，周日 = 7
 */
function getWeekNum(date = new Date()) {
  const d = date.getDay();
  return d === 0 ? 7 : d;
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
 * 格式化日期为 M-d 格式
 * @param {string | Date} date - 日期（Date对象 或 合法日期字符串）
 * @returns {string} 格式化后的日期字符串，例如 2026-04-02
 */
function formatDateMd(date) {
	// 转成标准 Date 对象
	const d = new Date(date);

	// 校验日期是否有效
	if (isNaN(d.getTime())) {
		throw new Error('无效的日期格式');
	}

	// 获取年、月、日
	const year = d.getFullYear();
	// 月份从 0 开始，所以 +1，再补 0
	const month = String(d.getMonth() + 1);
	// 日期补 0
	const day = String(d.getDate());

	if(month==="1"){
		return `${year}-${month}-${day}`;
	}else{
		return `${month}-${day}`;
	}
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

/**
 * 解析 URL # 后的参数，返回对象
 */
function getHashParams() {
	// 获取 # 后面的内容
	const hash = window.location.hash.slice(1);
	if (!hash) return {};

	// 拆分参数并转为对象
	return hash.split('&').reduce((params, item) => {
		const [key, value] = item.split('=');
		if (key) params[key] = decodeURIComponent(value || '');
		return params;
	}, {});
}
/**
 * 附加 Hash 参数到URL # 后
 * @param {Object} key
 * @param {Object} value
 */
function addHashParamLegacy(key, value) {
	let hash = window.location.hash.slice(1);
	let reg = new RegExp('(^|&)' + key + '=[^&]*', 'i');

	if (hash.match(reg)) {
		hash = hash.replace(reg, '$1' + key + '=' + encodeURIComponent(value));
	} else {
		hash += (hash ? '&' : '') + key + '=' + encodeURIComponent(value);
	}

	window.location.hash = hash;
	window.location.href = window.location.href;
}

/**
 * 解析课程定位参数
 * 格式：周-星期-节次，例如 1-2-3 表示第1周星期二第3节
 * @param {String} val hash 参数 course 的值
 * @returns {Object|null} {week, day, seq}，格式不合法返回 null
 */
function parseCourseParam(val) {
	if (typeof val !== 'string' || !val) return null;

	const arr = val.split('-');
	if (arr.length < 3) return null;

	const week = parseInt(arr[0], 10);
	const day = parseInt(arr[1], 10);
	const seq = parseInt(arr[2], 10);

	if (isNaN(week) || isNaN(day) || isNaN(seq)) return null;
	if (week < 1 || day < 1 || day > 7 || seq < 1) return null;

	return { week: week, day: day, seq: seq };
}

/**
 * 定位课程所在的单元格
 * 单元格 id 规则：c{星期}-{节次}，节次取值为 1,3,5,7,9（每次课占2小节）
 * 传入偶数节次（如第4节）时归入它所属的那一行（第3节）
 * @param {Object} day 星期，周一=1
 * @param {Object} seq 节次
 * @returns {Object|null} jQuery 对象
 */
function findCourseCell(day, seq) {
	const seqs = [seq];
	//偶数节次归属前一个奇数节次，奇数节次兜底取后一个
	seqs.push(seq % 2 === 0 ? seq - 1 : seq + 1);

	for (let s of seqs) {
		const $cell = $('#c' + day + '-' + s);
		if ($cell.length) return $cell;
	}
	return null;
}

/**
 * 闪烁高亮指定课程单元格（闪2下）
 * @param {Object} day 星期，周一=1
 * @param {Object} seq 节次
 * @returns {Boolean} 是否命中单元格
 */
function flashCourseCell(day, seq) {
	const $cell = findCourseCell(day, seq);
	if ($cell == null) return false;

	//周末列/夜间行默认隐藏，命中时先展开，否则看不到闪烁
	if (day >= 6 || seq >= 9) {
		showNightWeekendClz();
	}

	//重置动画，保证可重复触发
	$cell.removeClass('course-flash');
	void $cell[0].offsetWidth; //强制重排
	$cell.addClass('course-flash');
	//动画结束后移除类名，避免残留影响后续样式
	$cell[0].addEventListener('animationend', function handler() {
		$cell.removeClass('course-flash');
		$cell[0].removeEventListener('animationend', handler);
	});
	return true;
}

/**
 * 处理地址栏 course 参数：跳到指定周并闪烁指定课程
 * 只在首次渲染到目标周时闪烁一次
 * @param {Object} week 当前渲染的周
 */
function handleCourseParam(week) {
	const target = COURSE_G_VAR['course'];
	if (target == null) return;
	if (parseInt(week, 10) !== target.week) return;
    flashCourseCell(target.day, target.seq);
	// if (flashCourseCell(target.day, target.seq)) {
	// 	COURSE_G_VAR['courseFlashed'] = true;
	// }
}

/**
 * 计算当前日期所在的周，如果日期在开始日期之前，默认返回1。
 * @param {Object} startDate 开始日期（开始周的周一）
 * @param {Object} date 当前日期
 * @returns 当前日期所在的周
 */
function calWeekWithDate(startDate, date) {
	let week = 1;
	if (date > startDate) {
		week = parseInt(getDayDiff(startDate, date) / 7 + 1);
	}
	return week;
}

/**
 * 设置hash的值
 * @param {Object} name
 * @param {Object} value
 */
function setHashParam(name, value) {
    const params = new URLSearchParams(location.hash.substring(1));
    params.set(name, value);
    location.hash = params.toString();
}

/**
 * 转换日期到课程表的Key
 * @param {Object} startDate 开始日期（开始周的周一）
 * @param {Object} date 当前日期
 * @param {Object} clzSeqs 第几节课（数组）
 * @returns 返回所有课程表的Key
 */
function covDateToCurrKeys(startDate, date,clzSeqs) {
	let keys = [];
	if(clzSeqs!=null){
		if (date > startDate) {
			week = parseInt(getDayDiff(startDate, date) / 7 + 1);
			dayOfWeek=getWeekNum(date);
			for(var i=0;i<clzSeqs.length;i++){
				keys[i]=week+'-'+dayOfWeek+'-'+clzSeqs[i];
			}
		}
	}
	return keys;
}

/**
 * 根据调课信息修改课程表
 * @param {Object} curriculum 课程表
 * @param {Object} adjCourses 调课信息
 */
function adjustCurriculum(curriculum,adjCourses){
	Object.entries(adjCourses).forEach(([key, value]) => {
	    let srcDt=parseDate(key);
		let srcCurrKeys=covDateToCurrKeys(COURSE_G_VAR['startDate'],srcDt,value['srcSeq']);
		let destDt=parseDate(value['destDt'])
		let destCurrKeys=covDateToCurrKeys(COURSE_G_VAR['startDate'],destDt,value['destSeq']);
		for(var i=0;i<srcCurrKeys.length;i++){
			if(curriculum[srcCurrKeys[i]]!=null){
				curriculum[destCurrKeys[i]]=curriculum[srcCurrKeys[i]]+"<a href='#course="+srcCurrKeys[i]+"'>[调课自&gt;]</a>";
				curriculum[srcCurrKeys[i]]+="<a href='#course="+destCurrKeys[i]+"'>[调课到&gt;]</a>";
			}
		}
	});

}

/**
 * 渲染课程表
 * @param {Object} curriculum 课程表内容
 * @param {Object} startDate 学期第一周星期一日期
 * @param {Object} week 渲染第几周
 */
function renderCurrWeekViewTable(curriculum, startDate, week) {
	const clzSeqArr = [1, 3, 5, 7, 9];
	let has9clz=false;//是否有晚上课程
	let hasWeekendClz=false;//是否有周末课程
	for (let i = 1; i <= 7; i++) {
		for (let cs of clzSeqArr) {/* 循环迭代课程顺序 */
			if(!has9clz && cs===9 && curriculum[week + "-" + i + "-9"]!=null){
				has9clz=true;
			}
			if(!hasWeekendClz && (i===6||i===7) && curriculum[week + "-" + i + "-"+cs]!=null){
				hasWeekendClz=true;
			}
			$("#c" + i + "-" + cs).html(curriculum[week + "-" + i + "-" + cs] ?? '');
		}
	}
	//渲染表头的日期和第几周
	for (let i = 1; i <= 7; i++) {
		let date=calDays(startDate, (week - 1) * 7 + i - 1);
		let dtYmd = formatDate(date);
		let dtMd = formatDateMd(date);
		
		//处理节假日着色
		if(COURSE_G_VAR['holidays']!=null){
			let hday=COURSE_G_VAR['holidays'][dtYmd];
			if(hday!=null){
				$('.w' + i + '-rmk').text(hday['val']).addClass('color-'+hday['type']);
				if(hday['icon']!=null){
					//添加节假日图标
					$('.w' + i + '-rmk').addClass('iconfont icon-'+hday['icon']);
				}
				//节假日：该列所有单元格的课程文字置为淡灰色
				$('#currTable').toggleColumnClass(i + 1, 'holiday-col', true);
			}else {
				$('#currTable').setColumnBg(i + 1, '#FFFFFF');
				$('.w' + i + '-rmk').text('').attr('class', 'w' + i + '-rmk remark');
				//非节假日：恢复该列文字颜色
				$('#currTable').toggleColumnClass(i + 1, 'holiday-col', false);
			}
		}
		//处理今天着色
		if (dtYmd === formatDate(new Date())) {
			$('#currTable').setColumnBg(i + 1, '#FFFAE8');
			$('.w' + i + '-rmk').append(' 今天').addClass("color-orange");
		}else{
			$('#currTable').removeColumnBg(i + 1);//恢复该列背景颜色
			$('.w' + i + '-rmk').removeClass("color-orange");
		}
		$('.w' + i + '-date').text(dtMd);
	}
	$(".current-week").text("第"+week+"周");
	$("#prevBtn").text("< 第" + Math.max(1, week - 1) + "周 ");
	$("#nextBtn").text(" 第" + Math.min(COURSE_G_VAR.lastweek, week + 1) + "周 >");
	//渲染下排的周按钮
	$(".btn-week").each(function() {
		if (parseInt($(this).text()) === week) {
			$(this).addClass("btn-week-active");
		} else {
			$(this).removeClass("btn-week-active")
		}
	});
	COURSE_G_VAR.w=week;
	if(has9clz||hasWeekendClz){
		showNightWeekendClz();
	}
	//地址栏 course 参数：定位到指定周后闪烁指定课程
	handleCourseParam(week);

}

/**
 * 隐藏周末和夜晚课程
 */
function hideNightWeekendClz(){
	$('#currTable').hideLastColumns(2);
	$('#night-row').hide();
	$('#weekendToggleBtn').text("显示全部课程");
	$("#week-btn-bar").hide();
}

/**
 * 显示周末和夜晚课程
 */
function showNightWeekendClz(){
	$('#currTable').showLastColumns(2);
	$('#night-row').show();
	$('#weekendToggleBtn').text("隐藏周末和夜晚课程");
	$("#week-btn-bar").show();
}

/**
 * 设置当前周
 * @param {Object} week
 */
function setCurrentWeek(week){
	//防止周超出范围
	COURSE_G_VAR.w=Math.min(COURSE_G_VAR.lastweek, Math.max(COURSE_G_VAR.firstweek, week));
	//addHashParamLegacy("w", COURSE_G_VAR.w);
	location.hash="w="+COURSE_G_VAR.w
}

/**
 * 获取当前周
 */
function getCurrentWeek(){
	return COURSE_G_VAR.w;
}


(function($) {
	/**
	 * 隐藏最后的列
	 * @param {Object} count 最后几列，默认2
	 */
	$.fn.hideLastColumns = function(count) {
		count = count || 2; // 默认隐藏2列
		return this.each(function() {
			$(this).find('tr').each(function() {
				$(this).find('td, th').slice(-count).hide();
			});
		});
	};
	/**
	 * 显示最后的列
	 * @param {Object} count 显示的最后几列，默认2
	 */
	$.fn.showLastColumns = function(count) {
		count = count || 2; // 默认隐藏2列
		return this.each(function() {
			$(this).find('tr').each(function() {
				$(this).find('td, th').slice(-count).show();
			});
		});
	};
	/**
	 * 显示/隐藏最后的列
	 * @param {Object} count 最后几列，默认2
	 */
	$.fn.toggleLastColumns = function(count) {
		count = count || 2; 
		return this.each(function() {
			$(this).find('tr').each(function() {
				$(this).find('td, th').slice(-count).toggle();
			});
		});
	};
	/**
	 * 切换文本
	 * @param {Object} val1
	 * @param {Object} val2
	 */
	$.fn.toggleText = function(val1, val2) {
		return this.each(function() {
			var $this = $(this);
			if ($this.text().trim() === val1) {
				$this.text(val2);
			} else {
				$this.text(val1);
			}
		});
	};
	/**
	 * 表格指定列设置背景颜色
	 * @param {Object} colIndex
	 * @param {Object} bgColor
	 */
	$.fn.setColumnBg = function(colIndex, bgColor) {
		return this.each(function() {
			var $table = $(this);
			// 设置表头 th
			$table.find('tr > th:nth-child(' + colIndex + ')').css('background-color', bgColor);
			// 设置单元格 td
			$table.find('tr > td:nth-child(' + colIndex + ')').css('background-color', bgColor);
		});
	};
	/**
	 * 表格指定列设置背景颜色
	 * @param {Object} colIndex
	 * @param {Object} bgColor
	 */
	$.fn.removeColumnBg = function(colIndex) {
		return this.each(function() {
			var $table = $(this);
			// 设置表头 th
			$table.find('tr > th:nth-child(' + colIndex + ')').css('background-color', '');
			// 设置单元格 td
			$table.find('tr > td:nth-child(' + colIndex + ')').css('background-color', '');
		});
	};
	/**
	 * 表格指定列（仅 td）添加/移除样式类
	 * @param {Object} colIndex 列序号，从1开始
	 * @param {Object} className 样式类名
	 * @param {Object} add true 添加，false 移除
	 */
	$.fn.toggleColumnClass = function(colIndex, className, add) {
		return this.each(function() {
			$(this).find('tr > td:nth-child(' + colIndex + ')').toggleClass(className, !!add);
		});
	};
	
	$(window).on("hashchange", function () {
	    console.log("Hash发生变化");
	    console.log("当前Hash：", location.hash);
		let hashWeek = parseInt(getHashParams()["w"], 10);
		COURSE_G_VAR['course'] = parseCourseParam(getHashParams()["course"]);
		//获取当前周：course 参数优先，其次 w 参数，都没有则先取第一周
		let w = COURSE_G_VAR['course']!= null ? COURSE_G_VAR['course'].week : (isNaN(hashWeek) ? COURSE_G_VAR.firstweek : hashWeek);
		COURSE_G_VAR.w=w;
		renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], getCurrentWeek());
	});
	
	// 使用方法
	$(document).ready(function() {
		//渲染 week-btn-bar
		for(let i=1;i<=COURSE_G_VAR.lastweek;i++){
			$("#week-btn-bar").append('<button class="btn btn-week">'+i+'</button>');
		}
		// 2. 隐藏特定表格的最后3列
		$('#currTable').hideLastColumns(2);
		$('#night-row').hide();
		$('#weekendToggleBtn').click(function() {
			$('#currTable').toggleLastColumns(2);
			$('#night-row').toggle();
			var $this = $(this);
			$this.toggleText("隐藏周末和夜晚课程", "显示全部课程");
			$("#week-btn-bar").toggle();
		});

		// 创建 URLSearchParams 对象
		const urlParams = new URLSearchParams(window.location.search);

		//获取课程表内容
		const currname = urlParams.get('currname');
		//解析地址栏课程定位参数 course=周-星期-节次（如 1-2-3）
		COURSE_G_VAR['course'] = parseCourseParam(getHashParams()["course"]);
		//地址栏周次参数 w
		let hashWeek = parseInt(getHashParams()["w"], 10);
		//获取当前周：course 参数优先，其次 w 参数，都没有则先取第一周
		let w = COURSE_G_VAR['course'] != null ? COURSE_G_VAR['course'].week : (isNaN(hashWeek) ? COURSE_G_VAR.firstweek : hashWeek);
		setCurrentWeek(w);

		$("#prevBtn").click(function() {
			setCurrentWeek(getCurrentWeek()-1);
			renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], getCurrentWeek());
		});
		$("#nextBtn").click(function() {
			setCurrentWeek(getCurrentWeek()+1);
			renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], getCurrentWeek());
		});
		/**
		 * 今日课程按钮点击
		 */
		$("#todayBtn").click(function() {
			let today = new Date();
			setCurrentWeek(calWeekWithDate(COURSE_G_VAR['startDate'], today));
			renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], getCurrentWeek());
			if (today.getDay() === 6 || today.getDay() === 0) {
				$('#currTable').showLastColumns(2);
				$('#weekendToggleBtn').text("隐藏周末和夜晚课程");
				$('#night-row').show();
			}
		});
		$(".btn-week").click(function() {
			renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], parseInt($(this).text()));
		});
		//获取节假日信息
		$.ajax({
			url: '/static/data/holidays.json?'+parseInt(Math.random()*10000),
			type: 'GET',
			dataType: 'json', // 关键设置：告诉 jQuery 期望返回 JSON 格式
			success: function(data) {
				COURSE_G_VAR['holidays']=data;
				//若课表已渲染完成，补一次渲染，防止节假日（淡灰文字）因异步顺序未生效
				if(COURSE_G_VAR['curriculum']!=null){
					renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], getCurrentWeek());
				}
			},
			error: function(xhr, status, error) {
				console.error('请求失败:', error);
			}
		});
		
		//获取课表并进行渲染
		$.ajax({
			url: '/static/data/' + filterStr(currname) + ".json?"+parseInt(Math.random()*10000),
			type: 'GET',
			dataType: 'json', // 关键设置：告诉 jQuery 期望返回 JSON 格式
			success: function(data) {
				$("#title").text(data.title);
				COURSE_G_VAR['startDate'] = parseDate(data.startDate)
				COURSE_G_VAR['curriculum'] = data.curriculum;
				//course 参数优先跳到指定周，其次是 w 参数，都没有才定位到今天所在周
				if(COURSE_G_VAR['course'] != null){
					setCurrentWeek(COURSE_G_VAR['course'].week);
				}else if(!isNaN(hashWeek)){
					setCurrentWeek(hashWeek);
				}else{
					setCurrentWeek(calWeekWithDate(COURSE_G_VAR['startDate'], new Date()));
				}
				
			},
			error: function(xhr, status, error) {
				console.error('请求失败:', error);
			}
		});
        //获取调课信息
		$.ajax({
			url: '/static/data/adj-courses.json?'+parseInt(Math.random()*10000),
			type: 'GET',
			dataType: 'json', // 关键设置：告诉 jQuery 期望返回 JSON 格式
			success: function(data) {
				COURSE_G_VAR['adjCourses']=data;
				adjustCurriculum(COURSE_G_VAR['curriculum'],COURSE_G_VAR['adjCourses']);
				renderCurrWeekViewTable(COURSE_G_VAR['curriculum'], COURSE_G_VAR['startDate'], getCurrentWeek());
			},
			error: function(xhr, status, error) {
				console.error('请求失败:', error);
			}
		});

		/**
		 * 单元格悬停渐进着色特效：
		 * 把鼠标在单元格内的相对位置写入 --cell-x / --cell-y，
		 * CSS 的涟漪层会以此为圆心向外扩散着色（见 css/course.css）。
		 * 背景色的着色/还原由 CSS transition 完成，鼠标离开即恢复原色。
		 */
		$('#currTable').on('mousemove', 'td', function(e) {
			var rect = this.getBoundingClientRect();
			if (!rect.width || !rect.height) {
				return;
			}
			var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
			var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
			this.style.setProperty('--cell-x', x + '%');
			this.style.setProperty('--cell-y', y + '%');
		});
		
	});
})(jQuery);

/* 抽屉开关 + 多级菜单展开 */
			(function () {
				var nav = document.getElementById('topnav');
				if (!nav) { return; }
				var toggle = document.getElementById('topnavToggle');
				var closeBtn = document.getElementById('topnavClose');
				var backdrop = document.getElementById('topnavBackdrop');
				var mq = window.matchMedia('(max-width: 768px)');
				function isMobile() { return mq.matches; }
				function setOpen(open) {
					nav.classList.toggle('is-open', open);
					if (toggle) { toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
					document.body.style.overflow = (open && isMobile()) ? 'hidden' : '';
				}
				if (toggle) { toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); }); }
				if (closeBtn) { closeBtn.addEventListener('click', function () { setOpen(false); }); }
				if (backdrop) { backdrop.addEventListener('click', function () { setOpen(false); }); }
				document.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.keyCode === 27) { setOpen(false); } });

				function triggerOf(li) {
					var c = li.firstElementChild;
					return (c && (c.classList.contains('topnav-link') || c.classList.contains('submenu-link'))) ? c : null;
				}
				/* 收起所有子菜单：清掉 .open、aria 状态，并移除焦点，
				   否则切换回桌面端时 :focus-within 仍会保留展开状态 */
				function collapseAll() {
					var items = nav.querySelectorAll('li.has-sub');
					for (var i = 0; i < items.length; i++) {
						items[i].classList.remove('open');
						var t = triggerOf(items[i]);
						if (t) { t.setAttribute('aria-expanded', 'false'); }
					}
					if (document.activeElement && nav.contains(document.activeElement)) { document.activeElement.blur(); }
				}
				/* 视口变宽（移动端 -> 桌面端）时：关闭抽屉并复位所有子菜单 */
				function toDesktop() { setOpen(false); collapseAll(); }
				window.addEventListener('resize', function () { if (!isMobile()) { toDesktop(); } });
				if (mq.addEventListener) {
					mq.addEventListener('change', function (e) { if (!e.matches) { toDesktop(); } });
				} else if (mq.addListener) {
					mq.addListener(function (e) { if (!e.matches) { toDesktop(); } });
				}
				/* 桌面端：鼠标移出导航、或点击页面空白处，收起展开的子菜单 */
				nav.addEventListener('mouseleave', function () { if (!isMobile()) { collapseAll(); } });
				document.addEventListener('click', function (e) {
					if (!isMobile() && !nav.contains(e.target)) { collapseAll(); }
				});

				/* 有下级菜单的项：点击展开/收起（同级只展开一个） */
				var triggers = nav.querySelectorAll('.topnav-link, .submenu-link');
				for (var i = 0; i < triggers.length; i++) {
					(function (el) {
						var li = el.parentNode;
						if (!li || !li.classList.contains('has-sub')) { return; }
						el.addEventListener('click', function (e) {
							e.preventDefault();
							/* 同级只保留一个展开 */
							var sibs = li.parentNode.children;
							for (var j = 0; j < sibs.length; j++) {
								if (sibs[j] === li) { continue; }
								sibs[j].classList.remove('open');
								var t = triggerOf(sibs[j]);
								if (t) { t.setAttribute('aria-expanded', 'false'); }
							}
							if (isMobile()) {
								/* 移动端：手风琴，靠 .open 控制 */
								var open = !li.classList.contains('open');
								li.classList.toggle('open', open);
								el.setAttribute('aria-expanded', open ? 'true' : 'false');
							} else {
								/* 桌面端：展开由 :hover / :focus-within 控制，这里用焦点实现点击切换 */
								if (li.contains(document.activeElement)) {
									li.classList.remove('open');
									el.setAttribute('aria-expanded', 'false');
									el.blur();
								} else {
									li.classList.add('open');
									el.setAttribute('aria-expanded', 'true');
									el.focus();
								}
							}
						});
					})(triggers[i]);
				}
				/* 初始化：清除可能残留的展开状态 */
				collapseAll();
				/* 点击末级菜单项后，移动端自动收起抽屉 */
				var leaves = nav.querySelectorAll('a.topnav-link, a.submenu-link, button.submenu-link:not([aria-haspopup])');
				for (var k = 0; k < leaves.length; k++) {
					leaves[k].addEventListener('click', function () { if (isMobile()) { setOpen(false); } });
				}
				/* 高亮当前课表 */
				var curr = '';
				try { curr = new URLSearchParams(window.location.search).get('currname') || ''; } catch (err) { curr = ''; }
				if (curr) {
					var links = nav.querySelectorAll('a[href*="currname="]');
					for (var m = 0; m < links.length; m++) {
						if (links[m].getAttribute('href').indexOf('currname=' + curr) > -1) {
							links[m].classList.add('is-active');
							if (isMobile()) {
								var p = links[m].parentNode;
								while (p && p !== nav) { if (p.tagName === 'LI') { p.classList.add('open'); } p = p.parentNode; }
							}
						}
					}
				}
			})();

			/* 纵向滚动联动：页面标题被吸顶导航遮住后，把标题内容接到头部菜单的品牌位，
			   标题重新露出时还原为原来的“课程表” */
			(function () {
				var nav = document.getElementById('topnav');
				var brand = nav && nav.querySelector('.topnav-brand');
				var panel = document.getElementById('title-panel');
				var nameEl = document.getElementById('title');
				if (!nav || !brand || !panel) { return; }
				var original = brand.textContent;
				function readTitle() {
					var name = nameEl ? nameEl.textContent : '';
					var weekEl = panel.querySelector('.current-week');
					var week = weekEl ? weekEl.textContent : '';
					return (name.replace(/\s+/g, ' ').trim() + ' ' + week.replace(/\s+/g, ' ').trim()).trim();
				}
				var covered = false;
				/* 记录标题是否被遮住 */
				function sync() {
					/* 标题元素的底边跑到导航条底边之上，即视为被完全遮住 */
					var hidden = panel.getBoundingClientRect().bottom <= nav.getBoundingClientRect().bottom + 1;
					var text = hidden ? (readTitle() || original) : original;
					if (hidden === covered && brand.textContent === text) { return; }
					covered = hidden;
					brand.textContent = text;
					brand.title = text;
					brand.classList.toggle('is-title-shown', hidden);
				}
				var ticking = false;
				function onScroll() {
					if (ticking) { return; }
					ticking = true;
					(window.requestAnimationFrame || window.setTimeout)(function () { ticking = false; sync(); }, 16);
				}
				window.addEventListener('scroll', onScroll, { passive: true });
				window.addEventListener('resize', onScroll);
				/* 课表标题是 ajax 回填的，内容变化时同步一次 */
				if (window.MutationObserver) {
					new MutationObserver(sync).observe(panel, { childList: true, subtree: true, characterData: true });
				}
				sync();
			})();

			/* 表头日期行吸顶：滚动导致表格第一行日期被吸顶导航遮住后，
			   克隆一份日期行固定在显示屏顶部（位于导航下方，不挡菜单），
			   日期行重新露出时隐藏克隆条，恢复原来的样式 */
			(function () {
				var nav = document.getElementById('topnav');
				var container = document.querySelector('.schedule-container');
				var table = document.getElementById('currTable');
				var headRow = table ? table.rows[0] : null;
				if (!nav || !table || !headRow) { return; }

				/* 克隆表头日期行，放进固定定位的吸顶条 */
				var bar = document.createElement('div');
				bar.id = 'date-sticky-bar';
				var inner = document.createElement('div');
				inner.className = 'date-sticky-inner';
				var cloneTable = document.createElement('table');
				var cloneRow = headRow.cloneNode(true);
				/* 克隆行不带原行/cell 的 id，避免页面出现重复 id */
				cloneRow.removeAttribute('id');
				var clonedWithId = cloneRow.querySelectorAll('[id]');
				for (var r = 0; r < clonedWithId.length; r++) { clonedWithId[r].removeAttribute('id'); }
				cloneTable.appendChild(cloneRow);
				inner.appendChild(cloneTable);
				bar.appendChild(inner);
				nav.parentNode.insertBefore(bar, nav.nextSibling);

				var shown = false;
				/* 吸顶条紧贴导航条下缘：导航条是 sticky 的，高度随内容/断点变化，
				   每次同步时按实际高度重算 top，保证日期行始终显示在头部菜单下方 */
				function alignTop() {
					bar.style.top = Math.round(nav.getBoundingClientRect().height) + 'px';
				}
				/* 把原表头的内容和列宽同步到克隆行（课表数据是 ajax 回填的） */
				function syncContent() {
					var cells = headRow.cells, cloneCells = cloneRow.cells, total = 0;
					for (var i = 0; i < cells.length && i < cloneCells.length; i++) {
						/* 类名同步：切换“显示全部课程”时周末列会被隐藏/显示 */
						if (cloneCells[i].className !== cells[i].className) { cloneCells[i].className = cells[i].className; }
						if (cloneCells[i].innerHTML !== cells[i].innerHTML) {
							cloneCells[i].innerHTML = cells[i].innerHTML;
						}
						/* 用 getBoundingClientRect 取小数宽度，避免逐列取整累积误差 */
						var w = cells[i].getBoundingClientRect().width;
						if (w > 0.5) {
							cloneCells[i].style.width = w + 'px';
							total += w;
						}
						/* 被隐藏的列（如周末列）在克隆行里也要隐藏 */
						var disp = getComputedStyle(cells[i]).display;
						cloneCells[i].style.display = (disp === 'none') ? 'none' : '';
					}
					/* 宽度取各列实测宽度之和：窄屏下课程表横向滚动时，
					   表格实际宽度大于可视宽度，若按可视宽度设会把列挤窄、与原表错位 */
					if (total) { cloneTable.style.width = total + 'px'; }
				}
				/* 水平位置校正：表格可能在测量之后又被重新排布（周末列隐藏、数据回填、
				   字体加载等），用第一个可见列的实测左边界把克隆行推回原位 */
				function alignLeft() {
					var cells = headRow.cells, cloneCells = cloneRow.cells;
					for (var i = 0; i < cells.length && i < cloneCells.length; i++) {
						if (!cells[i].offsetWidth) { continue; }
						var delta = cells[i].getBoundingClientRect().left - cloneCells[i].getBoundingClientRect().left;
						if (Math.abs(delta) >= 0.5) {
							var cur = parseFloat(cloneTable.style.marginLeft) || 0;
							cloneTable.style.marginLeft = (cur + delta) + 'px';
						}
						break;
					}
				}
				/* 第一行日期的底边跑到导航条底边之上，即视为被完全遮住 */
				function sync() {
					var covered = headRow.getBoundingClientRect().bottom <= nav.getBoundingClientRect().bottom + 1;
					if (covered === shown) { return; }
					shown = covered;
					if (shown) {
						alignTop(); syncContent(); alignLeft();
						/* 下一帧再校一次，兜住测量之后才完成的重排 */
						(window.requestAnimationFrame || window.setTimeout)(function () {
							if (shown) { syncContent(); alignLeft(); }
						}, 32);
					}
					bar.classList.toggle('is-visible', shown);
				}
				var ticking = false;
				function onScroll() {
					if (ticking) { return; }
					ticking = true;
					(window.requestAnimationFrame || window.setTimeout)(function () { ticking = false; sync(); }, 16);
				}
				window.addEventListener('scroll', onScroll, { passive: true });
				window.addEventListener('resize', function () { if (shown) { alignTop(); syncContent(); alignLeft(); } sync(); });
				/* 移动端窄屏容器出现横向滚动时，吸顶条跟着横向滚动 */
				if (container) {
					container.addEventListener('scroll', function () {
						if (shown) { inner.scrollLeft = container.scrollLeft; }
					}, { passive: true });
				}
				/* 日期/备注是 ajax 回填的，内容、列宽、列的显示状态变化时
				   （切周、切换“显示全部课程”等）若吸顶条正在显示则同步一次。
				   观察整个表格：周末列隐藏是通过 tbody 单元格上的属性/class 改的，
				   会连带影响表头各列的宽度 */
				if (window.MutationObserver) {
					new MutationObserver(function () { if (shown) { syncContent(); alignLeft(); } })
						.observe(table, { childList: true, subtree: true, characterData: true, attributes: true });
				}
				sync();
			})();