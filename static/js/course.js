/**
 * firstweek是开始周，lastweek是结束周，w是当前周
 */
const COURSE_G_VAR={
	firstweek:1,
	lastweek:17,
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
 * 渲染课程表
 * @param {Object} curriculum 课程表内容
 * @param {Object} startDate 学期第一周星期一日期
 * @param {Object} week 渲染第几周
 */
function renderCurrWeekViewTable(curriculum, startDate, week) {
	const clzSeqArr = [1, 3, 5, 7, 9];
	for (let i = 1; i <= 7; i++) {
		for (let cs of clzSeqArr) {
			$("#c" + i + "-" + cs).html(curriculum[week + "-" + i + "-" + cs] ?? '');
		}
	}
	//渲染表头的日期和第几周
	for (let i = 1; i <= 7; i++) {
		let dt = formatDate(calDays(startDate, (week - 1) * 7 + i - 1));
		//处理今天着色
		if (dt === formatDate(new Date())) {
			$('#currTable').setColumnBg(i + 1, '#FFFAE8');
			$('#w' + i + '-rmk').text('（今天）');
		} else {
			$('#currTable').setColumnBg(i + 1, '#FFFFFF');
			$('#w' + i + '-rmk').text('');
		}
		$('#w' + i + '-date').text(dt);
	}
	$(".current-week").text(week);
	$("#prevBtn").text("< 第" + Math.max(1, week - 1) + "周 ");
	$("#nextBtn").text(" 第" + Math.min(COURSE_G_VAR.lastweek, week + 1) + "周 >");
	$(".btn-week").each(function() {
		if (parseInt($(this).text()) === week) {
			$(this).addClass("btn-week-active");
		} else {
			$(this).removeClass("btn-week-active")
		}
	});
	setCurrentWeek(week);
}

/**
 * 设置当前周
 * @param {Object} week
 */
function setCurrentWeek(week){
	//防止周超出范围
	COURSE_G_VAR.w=Math.min(COURSE_G_VAR.lastweek, Math.max(COURSE_G_VAR.firstweek, week));
	addHashParamLegacy("w", COURSE_G_VAR.w);
}

function getCurrentWeek(){
	return COURSE_G_VAR.w;
}

(function($) {
	// 扩展jQuery方法
	$.fn.hideLastColumns = function(count) {
		count = count || 2; // 默认隐藏2列
		return this.each(function() {
			$(this).find('tr').each(function() {
				$(this).find('td, th').slice(-count).hide();
			});
		});
	};
	$.fn.showLastColumns = function(count) {
		count = count || 2; // 默认隐藏2列
		return this.each(function() {
			$(this).find('tr').each(function() {
				$(this).find('td, th').slice(-count).show();
			});
		});
	};
	$.fn.toggleLastColumns = function(count) {
		count = count || 2; // 默认隐藏2列
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
	// 使用方法
	$(document).ready(function() {
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
		//获取当前周，默认第一周
		let w = getHashParams["w"] ?? COURSE_G_VAR.firstweek;
		setCurrentWeek(w);
		//学期开始日期
		let startDate;
		//课程表数据对象
		let curriculum;
		const highlightDate = urlParams.get('d');

		$("#prevBtn").click(function() {
			setCurrentWeek(getCurrentWeek()-1);
			renderCurrWeekViewTable(curriculum, startDate, getCurrentWeek());
		});
		$("#nextBtn").click(function() {
			setCurrentWeek(getCurrentWeek()+1);
			renderCurrWeekViewTable(curriculum, startDate, getCurrentWeek());
		});
		/**
		 * 今日课程按钮点击
		 */
		$("#todayBtn").click(function() {
			let today = new Date();
			setCurrentWeek(calWeekWithDate(startDate, today));
			renderCurrWeekViewTable(curriculum, startDate, getCurrentWeek());
			if (today.getDay() === 6 || today.getDay() === 0) {
				$('#currTable').showLastColumns(2);
				$('#weekendToggleBtn').text("隐藏周末和夜晚课程");
				$('#night-row').show();
			}
		});
		$(".btn-week").click(function() {
			renderCurrWeekViewTable(curriculum, startDate, parseInt($(this).text()));
		});
		$.ajax({
			url: '/static/' + filterStr(currname) + ".json",
			type: 'GET',
			dataType: 'json', // 关键设置：告诉 jQuery 期望返回 JSON 格式
			success: function(data) {
				$("#title").text(data.title);
				startDate = parseDate(data.startDate)
				curriculum = data.curriculum;
				setCurrentWeek(calWeekWithDate(startDate, new Date()));
				renderCurrWeekViewTable(curriculum, startDate, getCurrentWeek());
			},
			error: function(xhr, status, error) {
				console.error('请求失败:', error);
			}
		});

	});
})(jQuery);