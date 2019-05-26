import Service from './service'

class DateService extends Service {
	constructor() {
		super();
		this.asterisms = [{
			name: '水瓶',
			image: 'shuiping',
			from: {month:1, date:21},
			to: {month:2, date:19}
		}, {
			name: '双鱼',
			image: 'shuangyu',
			from: {month:2, date:20},
			to: {month:3, date:20}
		}, {
			name: '白羊',
			image: 'baiyang',
			from: {month:3, date:21},
			to: {month:4, date:20}
		}, {
			name: '金牛',
			image: 'jinniu',
			from: {month:4, date:21},
			to: {month:5, date:21}
		}, {
			name: '双子',
			image: 'shuangzi',
			from: {month:5, date:22},
			to: {month:6, date:21}
		}, {
			name: '巨蟹',
			image: 'juxie',
			from: {month:6, date:22},
			to: {month:7, date:22}
		}, {
			name: '狮子',
			image: 'shizi',
			from: {month:7, date:23},
			to: {month:8, date:23}
		}, {
			name: '处女',
			image: 'chunv',
			from: {month:8, date:24},
			to: {month:9, date:23}
		}, {
			name: '天秤',
			image: 'tianpin',
			from: {month:9, date:24},
			to: {month:10, date:23}
		}, {
			name: '天蝎',
			image: 'tianxie',
			from: {month:10, date:24},
			to: {month:11, date:22}
		}, {
			name: '射手',
			image: 'sheshou',
			from: {month:11, date:23},
			to: {month:12, date:21}
		}, {
			name: '摩羯',
			image: 'mojie',
			from: {month:12, date:22},
			to: {month:1, date:20}
		}]
	}

	getAsterism(dateStr) {
		if (!dateStr) {
			return {
				name: "",
				image: null
			}
		}
		
		let dateObj = new Date(dateStr)
		let month = dateObj.getMonth() + 1;
		let date = dateObj.getDate();
		for (var i = 0; i < this.asterisms.length; ++i) {
			let asterism = this.asterisms[i];
			if (month == asterism.from.month && date >= asterism.from.date) {
				return asterism;
			}
			if (month == asterism.to.month && date <= asterism.to.date) {
				return asterism;
			}
		}
	}
}

let service = new DateService();

export default service;