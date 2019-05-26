import Resource from './resource';
import Session from './session';

let loginService = {
	// login: function(appId, successCallback) {
	// 	try {
	// 		console.log('in login');
	// 		wx.showLoading({
	// 			title: '登陆中',
	// 			mask: true
	// 		});
	// 		this.doLogin(appId, successCallback);
	// 	} catch(err) {
	// 		console.log(err);
	// 		wx.showToast({
	// 			title: '登陆失败',
	// 			icon: 'none',
	// 			duration: 1500
	// 		});
	// 		return false;
	// 	}
	// 	wx.hideLoading();
	// },

	login: function(appId, successCallback) {
		//wx.authorize()
		wx.login({
			success: res => {
				console.log(res);
				if (res.code) {
					let code = res.code;
					wx.getUserInfo({
						withCredentials: true,
						success: res => {
							console.log(res)
							let userInfo = res.userInfo;
							let gender = 'unknown';
							if (userInfo.gender == 1) {
								gender = 'male';
							} else {
								gender = 'female';
							}

							Resource.put({
								service: 'skep',
								resource: 'account.microapp_user',
								data: {
									app_id: appId,
									name: userInfo.nickName,
									avatar: userInfo.avatarUrl,
									gender: gender,
									country: userInfo.country,
									province: userInfo.province,
									city: userInfo.city,
									code: code,
									iv: res.iv,
									encrypted_data: res.encryptedData,
									raw_data: res.rawData,
									signature: res.signature,
								}
							}).then(data => {
								console.debug(data);
								Session.update(data['sid']);
								Session.setKey("pid", data['pid']);

								//创建艺人
								Resource.put({
									service: 'coral',
									resource: 'artist.artist',
									data: {
										name: userInfo.nickName,
										avatar: userInfo.avatarUrl,
										age: 0,
										sex: gender,
										country: userInfo.country,
										province: userInfo.province,
										city: userInfo.city
									}
								}).then(data => {
									console.debug("create artist successfully");
									if (successCallback) {
										successCallback(true, data['sid']);
									}
								}, res => {

								})

								// var options = {
								// 	apiUrl: WebIM.config.apiURL,
								// 	user: data['easemob_username'],
								// 	pwd: data['easemob_password'],
								// 	grant_type: "password",
								// 	appKey: WebIM.config.appkey
								// }
								// WebIM.conn.open(options);

								// wx.getLocation({
								// 	success: function(res) {
								// 	var latitude = res.latitude
								// 	var longitude = res.longitude
								// 	Resource.post({
								// 		resource: 'sns.user_location',
								// 		data: {
								// 		latitude: latitude,
								// 		longitude: longitude
								// 		}
								// 	})
								// 	}
								// })
							}, res => {
								if (res.isBusinessError) {
									let data = res.data;

									if (data.errMsg == 'microapp_user:no_unionid') {
										wx.showModal({
											title: '提示',
											content: '小程序无法获得您的用户信息，请先关注"每屏秀秀"公众号',
											showCancel: false,
											success: function(res) {
											if (res.confirm) {
												console.log('用户点击确定')
											} else if (res.cancel) {
												console.log('用户点击取消')
											}
											}
										})
									}
								}
							});
						},
						fail: res => {
							console.log(res);
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
	},

	getUserInfo: function() {
		wx.getUserInfo({
			withCredentials: true,
			success: res => {
				console.log(res)
				let userInfo = res.userInfo;
				let gender = 'unknown';
				if (userInfo.gender == 1) {
					gender = 'male';
				} else {
					gender = 'female';
				}

				// Resource.put({
				// 	service: 'skep',
				// 	resource: 'account.microapp_user',
				// 	data: {
				// 		app_id: appId,
				// 		name: userInfo.nickName,
				// 		avatar: userInfo.avatarUrl,
				// 		gender: gender,
				// 		country: userInfo.country,
				// 		province: userInfo.province,
				// 		city: userInfo.city,
				// 		code: code,
				// 		iv: res.iv,
				// 		encrypted_data: res.encryptedData,
				// 		raw_data: res.rawData,
				// 		signature: res.signature,
				// 	}
				// }).then(data => {
				// 	console.debug(data);
				// 	Session.update(data['sid']);
				// 	Session.setKey("pid", data['pid']);

				// 	//创建艺人
				// 	Resource.put({
				// 		service: 'coral',
				// 		resource: 'artist.artist',
				// 		data: {
				// 			name: userInfo.nickName,
				// 			avatar: userInfo.avatarUrl,
				// 			age: 0,
				// 			sex: gender,
				// 			country: userInfo.country,
				// 			province: userInfo.province,
				// 			city: userInfo.city
				// 		}
				// 	}).then(data => {
				// 		console.debug("create artist successfully");
				// 		if (successCallback) {
				// 			successCallback(true, data['sid']);
				// 		}
				// 	}, res => {

				// 	})

				// 	// var options = {
				// 	// 	apiUrl: WebIM.config.apiURL,
				// 	// 	user: data['easemob_username'],
				// 	// 	pwd: data['easemob_password'],
				// 	// 	grant_type: "password",
				// 	// 	appKey: WebIM.config.appkey
				// 	// }
				// 	// WebIM.conn.open(options);

				// 	// wx.getLocation({
				// 	// 	success: function(res) {
				// 	// 	var latitude = res.latitude
				// 	// 	var longitude = res.longitude
				// 	// 	Resource.post({
				// 	// 		resource: 'sns.user_location',
				// 	// 		data: {
				// 	// 		latitude: latitude,
				// 	// 		longitude: longitude
				// 	// 		}
				// 	// 	})
				// 	// 	}
				// 	// })
				// }, res => {
				// 	console.warn(res);
				// 	if (res.isBusinessError) {
				// 	}
				// });
			},
			fail: res => {
				console.log(res);
			}
		})
	}
}

export default loginService;