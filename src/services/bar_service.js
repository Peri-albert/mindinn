import Resource from '../lib/resource';
import Service from './service'
import LocationService from './location_service'

class BarService extends Service {
	constructor() {
		super();
	}

	reset(resource) {
		console.warn("reset blog service");
		super.reset(resource);
	}

	async getBars() {
		let resource = 'bar.bars';
		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
			}
		})
		
		console.log(data)
		return data.bars;
	}

	async visitBar(barId) {
		let location = await LocationService.getCurrentLocation();
		try {
			let data = await Resource.put({
				service: 'gskep',
				resource: 'corp.bar_visit',
				data: {
					corp_id: barId,
					lat: location.lat,
					lng: location.lng,
					source: 'mercury',
					should_update_loc: false
				}
			})
			return true;
		} catch(e) {
			console.error(e);
			return false;
		}
	}

	changeNearbyBarsType(type) {
		this.resource2pageinfo['corp.nearby_paopao_bars'] = null;
	}

	async getNearbyBars(reset, distanceKm) {

	}

	async getNearbyStickedBars() {
		// let location = await LocationService.getCurrentLocation();
		// if (!location.lat) {
		// 	return [];
		// }

		// try {
		// 	let data = await Resource.get({
		// 		service: 'gskep',
		// 		resource: 'corp.nearby_sticked_paopao_bars',
		// 		data: {
		// 			lat: location.lat,
		// 			lng: location.lng
		// 		}
		// 	});

		// 	return data.bars;
		// } catch (e) {
		// 	console.error(e)
		// 	return []
		// } finally {

		// }
	}

	async getGroupBars(reset, groupId) {
		// let resource = 'corp.group_bars';
		// if (reset) {
		// 	wx.showLoading({
		// 		title: '获取附近酒吧',
		// 		mask: true
		// 	})
		// 	this.reset(resource);
		// }

		// let pageinfo = this.getStaticPageInfo(resource, 10);
		// if (!pageinfo.hasNext) {
		// 	return [];
		// }

		// let location = await LocationService.getCurrentLocation();
		// if (!location.lat) {
		// 	wx.hideLoading();
		// 	return [];
		// }

		// let params = {
		// 	lat: location.lat,
		// 	lng: location.lng,
		// 	group_id: parseInt(groupId),
		// 	page: pageinfo.page,
		// 	count_per_page: pageinfo.countPerPage
		// }
		// console.log(params)

		// try {
		// 	let data = await Resource.get({
		// 		service: 'gskep',
		// 		resource: 'corp.group_bars',
		// 		data: params
		// 	});

		// 	this.updatePageInfo(resource, data.pageinfo);
		// 	if (data.bars && data.bars.length > 0) {
		// 		let newBars = this.getCache('corp.group_bars').addAll(data.bars)
		// 		return newBars;
		// 	} else {
		// 		return []
		// 	}
		// } catch (e) {
		// 	console.error(e)
		// 	wx.showToast({
		// 		title: '获取附近酒吧失败',
		// 		icon: 'none',
		// 		duration: 1500
		// 	});
		// 	return []
		// } finally {
		// 	if (reset) {
		// 		wx.hideLoading();
		// 	}
		// }

		const data = [{"id":0,"group_id":14,"code":"10011126","name":"游戏","short_name":"北-魔术 BAR ","cover":"https://www.mindinn.top/images/hobby/game.jpg","address":"太平南路远洋国际168-20号商铺","area":"江苏省-南京市-秦淮区","visitor_count":110,"is_sticked":false,"is_deleted":false,"latitude":32.035919,"longitude":118.791446,"distance":"0.45"},{"id":1,"group_id":12,"code":"10011127","name":"萌宠","short_name":"PLUTO","cover":"https://www.mindinn.top/images/hobby/pet.jpg","address":"玄武门街道北京东路1号环亚凯瑟琳广场半山花园","area":"江苏省-南京市-玄武区","visitor_count":108,"is_sticked":false,"is_deleted":false,"latitude":32.0589,"longitude":118.78773,"distance":"2.30"},{"id":2,"group_id":0,"code":"10011105","name":"情感","short_name":"MIU CLUB","cover":"https://www.mindinn.top/images/hobby/emotion.jpg","address":"北京东路1号环亚凯瑟琳广场(海底捞火锅旁)","area":"江苏省-南京市-玄武区","visitor_count":105,"is_sticked":false,"is_deleted":false,"latitude":32.059417,"longitude":118.789102,"distance":"2.33"},{"id":3,"group_id":0,"code":"10011125","name":"音乐","short_name":"BRIDGE Whisky&Cocktail","cover":"https://www.mindinn.top/images/hobby/music.jpg","address":"西门子路19号3栋","area":"江苏省-南京市-江宁区","visitor_count":104,"is_sticked":false,"is_deleted":false,"latitude":31.93633,"longitude":118.822907,"distance":"11.73"},{"id":10808,"group_id":14,"code":"10011121","name":"美食","short_name":" Bar Wind风吧","cover":"https://www.mindinn.top/images/hobby/food.jpg","address":"中华路1号红街1-16(宜必思酒店后翠贝卡对面水游城向北300米)","area":"江苏省-南京市-秦淮区","visitor_count":103,"is_sticked":false,"is_deleted":false,"latitude":32.02722,"longitude":118.78644,"distance":"1.51"},{"id":10809,"group_id":14,"code":"10011122","name":"影视","short_name":"BarSignalLight Whisky","cover":"https://www.mindinn.top/images/hobby/movie.jpg","address":"户部街33号天之都大厦20楼2029室","area":"江苏省-南京市-秦淮区","visitor_count":102,"is_sticked":false,"is_deleted":false,"latitude":32.035145,"longitude":118.78851,"distance":"0.71"},{"id":10805,"group_id":11,"code":"10011118","name":"摄影","short_name":"SALT","cover":"https://www.mindinn.top/images/hobby/photography.jpg","address":"中山路286号羲和商业广场1楼","area":"江苏省-南京市-玄武区","visitor_count":101,"is_sticked":false,"is_deleted":false,"latitude":32.05468,"longitude":118.7852,"distance":"1.95"},{"id":10811,"group_id":0,"code":"10011124","name":"文化","short_name":"61HOUSE BAR&MUSIC","cover":"https://www.mindinn.top/images/hobby/culture.jpg","address":"汉口西路61号(宁海路口)","area":"江苏省-南京市-鼓楼区","visitor_count":100,"is_sticked":false,"is_deleted":false,"latitude":32.05452,"longitude":118.77201,"distance":"2.73"},{"id":10800,"group_id":11,"code":"10011113","name":"旅行","short_name":"潮人酒吧","cover":"https://www.mindinn.top/images/hobby/travel.jpg","address":"长江后街2号","area":"江苏省-南京市-玄武区","visitor_count":97,"is_sticked":false,"is_deleted":false,"latitude":32.046314,"longitude":118.79722,"distance":"0.85"},{"id":10807,"group_id":11,"code":"10011120","name":"二次元","short_name":"V lounge威朗驰威士忌","cover":"https://www.mindinn.top/images/hobby/anime.jpg","address":"洪武北路129号Soloone1913街区","area":"江苏省-南京市-玄武区","visitor_count":93,"is_sticked":false,"is_deleted":false,"latitude":32.04648,"longitude":118.78874,"distance":"0.99"},{"id":10796,"group_id":0,"code":"10011109","name":"时尚","short_name":"FUTURE CLUB","cover":"https://www.mindinn.top/images/hobby/fashion.jpg","address":"拉萨路1-3号","area":"江苏省-南京市-鼓楼区","visitor_count":92,"is_sticked":false,"is_deleted":false,"latitude":32.047747,"longitude":118.772288,"distance":"2.31"},{"id":10799,"group_id":11,"code":"10011112","name":"娱乐","short_name":"南京百度酒吧","cover":"https://www.mindinn.top/images/hobby/entertainment.jpg","address":"杨将军巷9号曼度文化广场2楼","area":"江苏省-南京市-玄武区","visitor_count":92,"is_sticked":false,"is_deleted":false,"latitude":32.045753,"longitude":118.793717,"distance":"0.76"}]

		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 3000)
		})
	}

	async getBarVisitorCounts(corpIds) {
		try {
			let data = await Resource.get({
				service: 'gskep',
				resource: 'corp.bar_visitor_counts',
				data: {
					corp_ids: JSON.stringify(corpIds)
				}
			});

			return data
		} catch (e) {
			console.error(e)
			return null
		}
	}

	async getUserVisitsForCorp(index) {
		// let resource = 'corp.bar_visits';
		// if (reset) {
		// 	this.reset(resource)
		// }

		// let pageinfo = this.getStaticPageInfo(resource, count);
		// if (!pageinfo.hasNext) {
		// 	return [];
		// }

		// try {
		// 	let data = await Resource.get({
		// 		service: 'gskep',
		// 		resource: resource,
		// 		data: {
		// 			page: pageinfo.page,
		// 			count_per_page: pageinfo.countPerPage,
		// 			corp_id: corpId,
		// 			type: type,
		// 			'__f-user_sex': sex
		// 		}
		// 	});

		// 	console.log("********************")
		// 	console.log(data);
		// 	console.log("********************")
		// 	this.updatePageInfo(resource, data.pageinfo);
		// 	return data.user_visits;
		// } catch (e) {
		// 	console.error(e)
		// 	return []
		// }

		const data = [{"id":1411821,"corp_id":10813,"corp_name":"","visit_time":"24天前","user":{"id":2680639,"name":"老湯","avatar":"http://resource.vxiaocheng.com/upload/honeycomb_image/2680639/2019_03_02_07_26_59.56097.jpg","sex":"male"}},{"id":1408280,"corp_id":10813,"corp_name":"","visit_time":"25天前","user":{"id":2926073,"name":"丁卯","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/385858307.jpg","sex":"male"}},{"id":1058158,"corp_id":10813,"corp_name":"","visit_time":"2个月前","user":{"id":1574351,"name":"等伱丶","avatar":"http://resource.vxiaocheng.com/upload/honeycomb_image/1574351/2019_01_25_12_33_16.22618.jpg","sex":"male"}},{"id":996641,"corp_id":10813,"corp_name":"","visit_time":"2个月前","user":{"id":95826,"name":"荼白","avatar":"http://resource.vxiaocheng.com/upload/honeycomb_image/95826/2018_12_03_06_09_06.71519.jpg","sex":"male"}},{"id":903043,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":765529,"name":"一只小蚂蚁","avatar":"http://resource.vxiaocheng.com/upload/honeycomb_image/765529/2018_11_16_09_00_13.68664.jpg","sex":"female"}},{"id":755055,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":28773,"name":"大佳佳","avatar":"http://resource.vxiaocheng.com/upload/upload/image/u_28773/2018_12_28_20_24_01_080341.jpg","sex":"female"}},{"id":753591,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1435876,"name":"黄凌河","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/384368110.jpg","sex":"male"}},{"id":722632,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303851,"name":"凉快","avatar":"http://resource.vxiaocheng.com/mercury/user/259/1.jpg","sex":"male"}},{"id":722611,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303783,"name":"不哭站路","avatar":"http://resource.vxiaocheng.com/mercury/user/373/1.jpg","sex":"male"}},{"id":722666,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303877,"name":"杞人忧天","avatar":"http://resource.vxiaocheng.com/mercury/user/130/1.jpg","sex":"female"}},{"id":722643,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1164564,"name":"cc","avatar":"http://resource.vxiaocheng.com/mercury/user/88/1.jpg","sex":"female"}},{"id":722585,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303938,"name":"zozo","avatar":"http://resource.vxiaocheng.com/mercury/user/188/1.jpeg","sex":"female"}},{"id":722607,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303873,"name":"律RITSU","avatar":"http://resource.vxiaocheng.com/mercury/user/370/1.jpg","sex":"male"}},{"id":722613,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1062160,"name":"桐桐","avatar":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1541468847024_167.jpg","sex":"female"}},{"id":722580,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303972,"name":"枫","avatar":"http://resource.vxiaocheng.com/mercury/user/391/1.jpg","sex":"male"}},{"id":722575,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1304033,"name":"eita","avatar":"http://resource.vxiaocheng.com/mercury/user/534/1.jpg","sex":"male"}},{"id":722609,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1304102,"name":"倩女","avatar":"http://resource.vxiaocheng.com/mercury/user/245/1.jpeg","sex":"female"}},{"id":722649,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1062242,"name":"疯狂","avatar":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1541471525071_163.jpg","sex":"female"}},{"id":722608,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303836,"name":"蛋白质","avatar":"http://resource.vxiaocheng.com/mercury/user/147/1 (22).jpg","sex":"female"}},{"id":722593,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303848,"name":"锦上添花","avatar":"http://resource.vxiaocheng.com/mercury/user/169/1.jpg","sex":"female"}},{"id":722640,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303853,"name":"啊啊霸老师","avatar":"http://resource.vxiaocheng.com/mercury/user/403/1.jpg","sex":"male"}},{"id":722583,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1303936,"name":"Jane","avatar":"http://resource.vxiaocheng.com/mercury/user/323/1.png","sex":"female"}},{"id":722625,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1304066,"name":"oilver","avatar":"http://resource.vxiaocheng.com/mercury/user/371/1.jpg","sex":"male"}},{"id":722635,"corp_id":10813,"corp_name":"","visit_time":"3个月前","user":{"id":1164656,"name":"梅子","avatar":"http://resource.vxiaocheng.com/mercury/user/12/1.jpg","sex":"female"}}]
		
		return new Promise((res, rej) => {
			setTimeout(() => {
				switch (true) {
					case index == 0:
						res(data.slice(0, 6))
						break;
					case index == 1:
						res(data.slice(5, 13))
						break;
					case index == 2:
						res(data.slice(18, 26))
						break;
					case index == 3:
						res(data.slice(12, 19))
						break;
					default:
						res(data.slice(7, 14))
						break;
				}
			}, Math.random() * 1700)
		})
	}

	async getBar(corpId) {
		console.log(corpId);
		let bar = this.getCachedObject(corpId);
		if (!bar) {
			console.log("get bar from remote service")
			let location = await LocationService.getCurrentLocation();
			let data = await Resource.get({
				service: 'gskep',
				resource: 'corp.bar',
				data: {
					id: corpId,
					lat: location.lat,
					lng: location.lng,
				}
			})
			bar = data.bar;
		} else {
			console.log("get bar from cache")
		}
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		console.log(bar)
		return bar;
	}

	async getCallUpProducts() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'bar.call_up_products',
			data: {}
		});
		return data;
	}

	async getBarCallups(corpId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'bar.call_ups',
			data: {
				"corp_id": corpId
			}
		});
		return data.callups;
	}

	async getEnabledGroups(city) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'bar.enabled_groups',
			data: {
				"city": city
			}
		});
		return data;
	}

	async getEnabledWxGroups(city) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'bar.enabled_wx_groups',
			data: {
				"city": city
			}
		});
		return data;
	}
}

let service = new BarService();

export default service;