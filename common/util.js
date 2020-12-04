function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

function showToast(title, icon = "none", duration = 2000) {
	uni.showToast({
		title: title,
		icon: icon,
		duration: duration
	})
}

//校验手机号格式
function isPhone(obj) {
	if (!isEmpty(obj)) {
		return RegExp(/^1[34578]\d{9}$/).test(obj);
	}
	return false;
}

//校验邮箱格式
function isEmail(email) {
	return RegExp(/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(
		email);
}

function isEmpty(obj) {
	if (!obj) {
		return true;
	}

	if (typeof(obj) == "undefined") {
		return true;
	}

	if (obj === 0) {
		return true;
	}

	if (obj === '') {
		return true;
	}

	//检验数组
	if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
		return true;
	}
	//检验对象
	if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
		return true;
	}

	return false;
}

function isEmptyString(obj) {
	if (!obj) {
		return true;
	}

	if (typeof(obj) == "undefined") {
		return true;
	}

	if (obj === 0) {
		return true;
	}

	if (obj === '') {
		return true;
	}

	if (obj.replace(/(^\s*)|(\s*$)/g, "").length == 0) {
		return true;
	}
	return false;
}

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	showToast: showToast,
	dateUtils: dateUtils,
	isEmpty: isEmpty,
	isEmptyString: isEmptyString,
	isPhone: isPhone,
	isEmail: isEmail
}
