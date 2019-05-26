
import Raven from './raven/raven.min'
// Object.prototype.clone = function() {
// 	console.log('enter clone...')	
// }

let clone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}

let ravenLog = function () {
    return (target, name, descriptor) => {
		var oldValue = descriptor.value;
		let data = undefined;

        descriptor.value = async function () {
			let length = arguments.length,
				title = "",
				tips = "";

			if (length > 0) {
				let args = arguments[length - 1];
				if (args instanceof Object && args.showLoading) {
					title = args.content.title;
					tips = args.content.tips;
				}
			}

			if (title) {
				wx.showLoading({
					title: title + "...",
					mask: true
				});
			}
            try {
                data = await oldValue.apply(this, arguments);
                wx.hideLoading();
            } catch (e) {
				wx.hideLoading();
				if (tips) {
					wx.showToast({
						title: tips,
						icon: 'none',
						duration: 3000
					});
				}
                Raven.captureMessage(tips + name + JSON.stringify(e), {
                    level: 'error'
                });
            } finally {
                return data;
            }
        };

        return descriptor;
    }
}

let formatNowDate = function() {
		var d = new Date(),
			month = '' + (d.getMonth() + 1),
			day = '' + d.getDate(),
			year = d.getFullYear();
	
		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
	
		return [year, month, day].join('-');
}

let calculateTime = function(time) {
	let now = new Date();
	let t = time.split(/[/ :-]/);
	t[5] ? '' : t[5] = '00'
	let ctime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
	let timestap = now - ctime;
	let timeString = "";

	if (timestap < 0) {
		timeString = "刚刚";
	} else {
		let year = Math.floor(timestap/(365 * 24 * 60 * 60 * 1000)),
			month = Math.floor(timestap/2628000000),
			day = Math.floor(timestap/(24 * 60 * 60 * 1000)),
			hour = Math.floor(timestap/(60 * 60 * 1000)),
			minute = Math.floor(timestap/(60 * 1000));

		if (year>0) {
			timeString = year + "年前";
		} else if (month>0) {
			timeString = month + "个月前";
		} else if (day>0) {
			timeString = day + "天前";
		} else if (hour>0) {
			timeString = hour + "小时前";
		} else if (minute>0) {
			timeString = minute + "分钟前";
		} else {
			timeString = "刚刚";
		}
	}
	return timeString;
}

let getFormatTime = function(timeString="") {
	if (timeString == "") {
		var timeObject = new Date();
	} else {
		let timeStr = timeString.split(/[/ :-]/);
		var timeObject = new Date(timeStr[0], timeStr[1]-1, timeStr[2], timeStr[3], timeStr[4], timeStr[5]);
	}

	let year = timeObject.getFullYear();
	
	let month = timeObject.getMonth() + 1;
	if (month < 10) {
		month = "0" + month;
	}

	let day = timeObject.getDate();
	if (day < 10) {
		day = "0" + day;
	}
	
	let hour = timeObject.getHours();
	if (hour < 10) {
		hour = "0" + hour;
	}

	let min = timeObject.getMinutes();
	if (min < 10) {
		min = "0" + min;
	}

	let sec = timeObject.getSeconds();
	if (sec < 10) {
		sec = "0" + sec;
	}

	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}

let getAldTime = function() {
	let timeObject = new Date();

	let year = timeObject.getFullYear();
	let month = timeObject.getMonth() + 1;
	let day = timeObject.getDate();
	let hour = timeObject.getHours();
	let min = timeObject.getMinutes();

	return year + "年" + month + "月" + day + "日 " + hour + "点" + min + "分" ; 
}

let uuid1 = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
let unique = function(arr){
    var hash = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                ++i;
            }
        }
        hash.push(arr[i]);
    }
    return hash;
}

export default {
	clone: clone,
	calculateTime: calculateTime,
	getFormatTime: getFormatTime,
    getAldTime: getAldTime,
    uuid1: uuid1,
    unique: unique
};
export { ravenLog }