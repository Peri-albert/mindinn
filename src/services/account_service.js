import Resource from '../lib/resource'
import Service from './service'
import Session from '../lib/session'
import LocationService from './location_service'
import UserService from './user_service'

class AccountService extends Service {
	constructor() {
		super();

		this.nearbyUserCountPerPage = 10
		this.nearbyUserPage = 1
		this.nearbyUserMode = 'finish_profile'
		this.continuousEmptyNearbyUserCounter = 0
	}

	isDevMode() {
		return Resource.isDevMode()
	}

	async generateDevUsers() {
		wx.showLoading({
			title: '生成测试用户',
			mask: false
		})

		try {
			let data = await Resource.put({
				service: 'skep',
				resource: 'dev.dev_users',
				data: {}
			})

			return true;
		} catch(e) {
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	async checkVersionBossVideo(version) {
		return await Resource.get({
			service: 'coral',
			resource: 'system.version_check',
			data: {
				'version': version
			}
		});
	}

	getSelfId() {
		return Session.getKey('uid');
	}

	isCorpUserLogined() {
		if (Session.getKey('cid')) {
			return true;
		} else {
			return false;
		}
	}

	async getNearbyUsers(reset, distanceKm, sex, tagIds) {
		// if (this.continuousEmptyNearbyUserCounter > 4) {
		// 	return null;
		// }
		
		// if (reset) {
		// 	wx.showLoading({
		// 		title: '获取用户'
		// 	})
		// 	this.nearbyUserPage = 1;
		// 	this.nearbyUserMode = 'finish_profile';
		// }
		// let location = await LocationService.getCurrentLocation();
		
		// if (!location.lat) {
		// 	wx.hideLoading();
		// 	return [];
		// }

		// try {
		// 	let data = await Resource.get({
		// 		service: 'honeycomb',
		// 		resource: 'user.nearby_users',
		// 		data: {
		// 			lat: location.lat,
		// 			lng: location.lng,
		// 			distance: distanceKm,
		// 			sex: sex,
		// 			tag_ids: JSON.stringify(tagIds),
		// 			page: this.nearbyUserPage,
		// 			mode: this.nearbyUserMode,
		// 			count_per_page: this.nearbyUserCountPerPage,
		// 			enable_filter_user: true
		// 		}
		// 	});

		// 	if (data.users && data.users.length > 0) {
		// 		this.nearbyUserPage += 1;
		// 		this.continuousEmptyNearbyUserCounter = 0;
		// 		return data.users;
		// 	} else {
		// 		this.nearbyUserPage = 1;
		// 		this.continuousEmptyNearbyUserCounter += 1;
		// 		return []
		// 	}
		// } catch (e) {
		// 	wx.showToast({
		// 		title: '获取用户信息失败',
		// 		icon: 'none',
		// 		duration: 1500
		// 	});
		// 	return []
		// } finally {
		// 	if (reset) {
		// 		wx.hideLoading();
		// 	}
		// }

		const data = [{"id":2810292,"name":"琪琪GiGi","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/game.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.7867,"latitude":32.0372,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":3188942,"name":"余柏商贸有限公司13386000198","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/pet.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.786655,"latitude":32.037535,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1477722,"name":"太平洋~张蓉","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/emotion.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.78658294677734,"latitude":32.037437438964844,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1848166,"name":"下一个雨季","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/music.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.786674,"latitude":32.03782,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1919577,"name":"欣悦","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/food.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.78671,"latitude":32.038,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1919718,"name":"T","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/movie.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.78656005859375,"latitude":32.03742599487305,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1919828,"name":"💋💋Zzy","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/photography.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.786606,"latitude":32.03798,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1920080,"name":"渔人歌","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/culture.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.7889,"latitude":32.04091,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":1975811,"name":"陈传玲🕊","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/travel.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.78657531738281,"latitude":32.0373649597168,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false},{"id":2550535,"name":"羽兮","avatar":"https://raw.githubusercontent.com/AlbertGandolf/AlbertGandolf/master/hobby/anime.jpg","cover":"","sex":"female","birthday":"0001-01-01","region":"","slogan":"","age":28,"code":"","phone":"","source":"","longitude":118.7867,"latitude":32.0371,"distance":"0","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":false,"like_status":"","roles":null,"enable_mpcoin":false}]

		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 1000)
		})
	}

	async getOpUsers() {
		try {
			let data = await Resource.get({
				service: 'gskep',
				resource: 'user.op_users',
				data: {}
			});
			return data.users;
		} catch (e) {
			wx.showToastwx.showToast({
				title: '获取用户失败',
				icon: 'none',
				duration: 1500
			});
		}
	}

	async getUsers(userIds) {
		//TODO: 将服务改为gskep
		console.log(userIds)
		let data = await Resource.get({
			service: 'skep',
			resource: 'account.users',
			data: {
				ids: JSON.stringify(userIds),
			}
		});
		return data.users;
	}

	async isValidUser() {
		try {
			let data = await Resource.get({
				service: 'gskep',
				resource: 'account.account_validity',
				data: {}
			});
			return data.is_user_valid;
		} catch (e) {
			console.warn('错误的jwt信息，需要重新登录');
			return false;
		}
	}

	async setOpenid(openid) {
		try {
			let data = await Resource.put({
				service: 'gaia',
				resource: 'weixin.user_authinfo',
				data: {
					apptype: "mercury",
					openid: openid
				}
			});
		} catch (e) {
			console.warn('error');
		}
	}

	async setFormid(formid) {
		try {
			let data = await Resource.put({
				service: 'gaia',
				resource: 'weixin.user_form',
				data: {
					apptype: "mercury",
					formid: formid
				}
			});
		} catch (e) {
			console.warn('error');
		}
	}

	// doSimpleLogin(appId, options) {
	// 	let self = this;
	// 	wx.login({
	// 		success: res => {
	// 			Resource.put({
	// 				service: 'skep',
	// 				resource: 'account.simple_microapp_user',
	// 				data: {
	// 					app_id: appId,
	// 					code: res.code,
	// 					type: 'mercury'
	// 				}
	// 			}).then(data => {
	// 				let shouldGetUserInfo = (data.user.sex != 'male' && (data.unionid.length == 0 || data.user.name.length == 0))
	// 				Session.update(data['sid']);
	// 				Session.setKey('pid', data['pid']);
	// 				Session.setKey('uid', data['id']);
    //                 self.setOpenid(data.user.mercury_openid);
	// 				if (options && options.success) {
	// 					options.success(shouldGetUserInfo);
	// 				}
	// 			}, resp => {
	// 				console.log('put skep:account.simple_microapp_user failed!');
	// 				if (options.fail) {
	// 					options.fail();
	// 				}
	// 			})
	// 		}
	// 	})
	// }

	doMockLogin(userId, options) {
		wx.showLoading({
			title: '模拟登录',
			mask: false
		})
		Resource.put({
			service: 'skep',
			resource: 'dev.logined_user',
			data: {
				user_id: userId
			}
		}).then(data => {
			wx.hideLoading();
			Session.update(data['sid']);
			Session.setKey('uid', data['id']);
			UserService.clearCachedUserInfo()
			if (options && options.success) {
				options.success();
			}
		}, resp => {
			console.error(resp)
			wx.hideLoading();
			wx.showToastwx.showToast({
				title: '模拟登录失败',
				icon: 'none',
				duration: 1500
			});
		})
		Session.update('123456978')
		Session.setKey('uid', 94)
	}

	checkAccount(options) {
		let jwt = Session.get();
		console.log('[launch] jwt: ' + jwt);
		if (jwt && jwt.length > 0) {
			this.isValidUser().then(isValid => {
				if (isValid) {
					console.log("[launch] valid user, enter microapp");
					if (options.success) {
						options.success();
					}
				} else {
					console.log("[launch] invalid user, re-login");
					Session.clear();
					if (options.fail) {
						options.fail();
					}
				}
			}, res => {});
		} else {
			console.log("[launch] invalid jwt, login");
			if (options.fail) {
				options.fail();
			}
		}
	}

	bindWxUser(appid, detail, options) {
		let self = this;
		wx.login({
			success: res => {
				console.log(res);
				if (res.code) {
					let code = res.code;
					wx.getUserInfo({
						withCredentials: true,
						success: res => {
							console.log('getUserInfo(res) => res ',res)
							let userInfo = res.userInfo;
							let gender = 'unknown';
							if (userInfo.gender == 1) {
								gender = 'male';
							} else {
								gender = 'female';
							}

							Resource.put({
								service: 'gskep',
								resource: 'login.logined_microapp_user',
								data: {
									app_id: appid,
									code: code,
									name: userInfo.nickName,
									avatar: userInfo.avatarUrl,
									gender: gender,
									iv: res.iv,
									encrypted_data: res.encryptedData,
									raw_data: res.rawData,
									signature: res.signature,
									type: "mercury",
									update_existed_user: true
								}
							}).then(data => {
								console.log(data);
								if (data['sid']) {
									Session.update(data['sid']);
									Session.setKey('uid', data['id']);
									if (data['mercury_openid']){
										self.setOpenid(data['mercury_openid']);
									}
								}

								Resource.put({
									service: 'gskep',
									resource: 'account.persistent_user_avatar',
									data: {
										url: userInfo.avatarUrl
									}
								}).then(data => {
									console.info("persist user avatar successfully");
									if (options && options.success) {
										options.success();
									}
								}, res => {
									console.info("persist user avatar failed");
								})
							}, res => {
								wx.showToast({
									title: '登录失败，请稍后再试',
									icon: 'none',
									duration: 1500
								});
							});
						},
						fail: res => {
							//Session.clear()
							wx.showToast({
								title: '登录失败，请检查网络后再尝试',
								icon: 'none',
								duration: 1500
							});
						}
					})
				}
			},
			fail: res => {
				wx.showModal({
					title: '提示',
					content: '小程序无法获取微信登录信息，请关闭小程序后再次打开，重新登录',
					showCancel: false,
					success: function(res) {
					}
				})
			}
		});
		Session.update('123456978')
		Session.setKey('uid', 94)
		
	}
	//获取共同足迹信息
	async getJointFootprints() {
		//TODO: 将服务改成gskep（确认不需要了，待删除）
		let respData = await Resource.get({
			service: 'skep',
			resource: 'account.visit_same_bar_users',
			data: {
			}
		});

		return respData
	}
	//获取历史足迹信息
	async getHistoryFootprints(id) {
		let params = {};
		if (id) {
			params['target_user_id'] = id
			params['target_id'] = id
		}
		let	respData = await Resource.get({
			service: 'gskep',
			resource: 'user.visited_bars',
			data: params
		})
		return respData
	}

	//删除历史足迹
	async delHistoryFootprints(id) {
		//TODO: 将服务改为gskep
		let respData = await Resource.delete({
			service: 'skep',
			resource: 'bar.visit',
			data: {
				id: id
			}
		});

		return respData
	}
	
	//发送弹幕
	async putDanmu(userId, content) {
		let respData = await Resource.put({
			service: 'honeycomb',
			resource: 'user.barrage',
			data: {
				user_id: userId,
				content: content
			}
		})

		return respData
	}
	//获取弹幕
	async getDanmu(userId) {
		let respData = Resource.get({
			service: 'honeycomb',
			resource: 'user.barrages',
			data: {
				user_id: userId
			}
		})

		return respData
	}

	async checkUserBlock() {
		let respData = Resource.get({
			service: 'gskep',
			resource: 'account.user_block',
			data: {}
		})

		return respData;
	}

	async getForceUpdateVersion() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'system.force_update_version',
			data: {}
		})

		return data;
	}

	updateVersion() {
		if (wx.canIUse('getUpdateManager')) {
			const updateManager = wx.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				if (res.hasUpdate) {
					updateManager.onUpdateReady(function () {
				  		wx.showModal({
							title: '更新提示',
							content: '新版本已经准备好，请重启使用最新版本',
							showCancel: false,
							success: function () {
								updateManager.applyUpdate()
							}
				  		})
					})
					updateManager.onUpdateFailed(function () {
						wx.showModal({
							title: '更新提示',
							content: '新版本已经上线，请您删除当前小程序，重新搜索打开，否则会影响部分功能的正常使用',
						})
					})
			  	}
			})
		} else {
			wx.showModal({
				title: '提示',
			  	content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
			})
		}
	}

	async doAccountTransfer() {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'system.account_transfer',
			data: {}
		})

		return data;
	}
}

let service = new AccountService();

export default service;