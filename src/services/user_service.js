import Resource from '../lib/resource';
import Service from './service'
import Uploader from '../lib/uploader'

class UserService extends Service {
	constructor() {
		super();
		this.userId = -1;
		this.flag = false;
		this.userInfo = null;
	}

	clearCachedUserInfo() {
		this.userInfo = null;
	}

	async getUserInfo(userId, options) {
		// let isGetSelfInfo = false;
		// if (userId == undefined) {
		// 	isGetSelfInfo = true;

		// }

		// if (isGetSelfInfo && this.userInfo != null) {
		// 	return this.userInfo;
		// }

		// let resource = 'account.user';

		// if (options && options.hideLoading) {

		// } else {
		// 	// wx.showLoading({
		// 	// 	title: '获取用户信息',
		// 	// 	mask: false
		// 	// });
		// }

		// let data = {}

		// let prodVersion = "2019031916"
		
		// if (userId) {
		// 	data = {
		// 		target_id: userId,
		// 		with_relationship: true,
		// 		with_block_info: true,
		// 		with_location: true,
		// 		prod_version: prodVersion,
		// 	}
		// } else {
		// 	data = {
		// 		prod_version: prodVersion,
		// 		with_role_info: true,
		// 		with_im_info: true,
		// 	}
		// }

		// try {
		// 	let resp = await Resource.get({
		// 		service: 'honeycomb',
		// 		resource: resource,
		// 		data: data
		// 	})

		// 	console.log('>>>>>>>> user <<<<<<<<')
		// 	console.log(resp)
		// 	if (isGetSelfInfo) {
		// 		this.userInfo = resp;
		// 	}
		// 	return resp;
		// } catch(e) {
		// 	return null;
		// } finally {
		// 	wx.hideLoading();
		// }

		const data = {"id":996452,"name":"红茶拿铁配司康","avatar":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1544508901095_167.png","cover":"","sex":"male","birthday":"1997-10-09","region":"","slogan":"","age":0,"code":"300996765","phone":"","source":"mercury","longitude":0,"latitude":0,"distance":"","last_active_time":"","display_liveness":"","is_followee":false,"is_blocked":false,"is_register_easemob":true,"like_status":"","roles":["mp_operator"],"enable_mpcoin":true}
		
		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 500)
		})
	}

	isMpOperator(userInfo) {
		if (!userInfo.roles || userInfo.roles.length == 0) {
			return false;
		}

		let roles = userInfo.roles;
		for (var i = 0; i < roles.length; ++i) {
			if (roles[i] == "mp_operator") {
				return true;
			}
		}

		return false;
	}

	async getUserLiveness(userId) {
		let resource = 'account.user_liveness';

		try {
			let resp = await Resource.get({
				service: 'skep',
				resource: resource,
				data: {
					target_id: userId
				}
			})

			return resp;
		} catch(e) {
			console.error(e);
			return null;
		}
	}

	async getVisitSameBarUsers(userIds) {
		try {
			let data = await Resource.get({
				service: 'skep',
				resource: 'account.visit_same_bar_user_ids',
				data: {
					target_user_ids: JSON.stringify(userIds)
				}
			})

			return data.user_ids;
		} catch(e) {
			return null;
		}
	}

	async getUserVisits(userIds) {
		try {
			let data = await Resource.get({
				service: 'gskep',
				resource: 'user.batch_visited_bars',
				data: {
					target_user_ids: JSON.stringify(userIds)
				}
			})

			return data.user2visits;
		} catch(e) {
			return null;
		}
	}

	async getBarVisit(corpId) {
		try {
			let data = await Resource.get({
				service: 'gskep',
				resource: 'corp.bar_visit',
				data: {
					corp_id: corpId 
				}
			})

			return data.user_visit;
		} catch(e) {
			console.error(e);
			return null;
		}
	}

	async getMoreUserInfo(userId) {
		let data = await Resource.get({
			service: 'skep',
			resource: 'account.user',
			data: {
				target_id: userId
			}
		})

		console.log(data);
		return data;
	}

	async getMutliUserInfo(userIds) {
		let data = await Resource.get({
			service: 'skep',
			resource: 'account.users',
			data: {
				ids: JSON.stringify(userIds),
			}
		})
		
		return data.users;
	}

	async checkUserSexChanged() {
		const data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.sex_changed'
		})
		
		return data;
	}

	async updateUserInfo(data, options) { 
		let resource = 'account.user';

		if (!options || !options.hideLoading) {
			wx.showLoading({
				title: '更新用户信息',
				mask: true
			});
		}

		try {
			let resp = await Resource.post({
				service: 'honeycomb',
				resource: resource,
				data: data
			})

			this.userInfo = null;
			return true
		} catch(e) {
			if (e.data && e.data.errMsg) {
				return e.data.errMsg
			} else {
				return false;
			}
		} finally {
			if (!options || !options.hideLoading) {
				wx.hideLoading();
			}
		}
	}

	async initProfile(data) {
		let resource = 'user.profile';

		wx.showLoading({
			title: '上传图片',
			mask: true
		});

		let avatarUrl = data.avatar;
		if ((data.avatar.indexOf('resource.vxiaocheng.com') == -1) && (data.avatar.indexOf('wx.qlogo.cn') == -1)) {
			let urls = await Uploader.uploadImages([data.avatar]);
			avatarUrl = urls[0];
		}

		if (avatarUrl.indexOf("wxfile:") != -1) {
			wx.showToast({
				title: '头像图片无效, 请重新上传头像',
				icon: 'none',
				duration: 1500
			})
			return
		}

		wx.showLoading({
			title: '更新用户信息',
			mask: true
		});
		try {
			// let tagIds = data.tags.map(tag => {
			// 	return tag.id;
			// })
			let resp = await Resource.post({
				service: 'honeycomb',
				resource: resource,
				data: {
					avatar: avatarUrl,
					sex: data.sex,
					tag_ids: '[]'
				}
			})

			if (this.userInfo) {
				this.userInfo.avatar = avatarUrl;
				this.userInfo.sex = data.sex;
			}

			return true
		} catch(e) {
			console.error(e)
			return false
		} finally {
			wx.hideLoading();
		}
	}

	async likeBlog(blogId) {
		let resource = 'blog.liked_blog';

		wx.showLoading({
			title: '操作中',
			mask: true
		});

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: resource,
				data: {
					id: blogId
				}
			})
			return true
		} catch(e) {
			return false
		} finally {
			wx.hideLoading();
		}
	}

	async unlikeBlog(blogId) {
		let resource = 'blog.liked_blog';

		wx.showLoading({
			title: '操作中',
			mask: true
		});

		try {
			let data = await Resource.delete({
				service: 'honeycomb',
				resource: resource,
				data: {
					id: blogId
				}
			})
			return true
		} catch(e) {
			return false
		} finally {
			wx.hideLoading();
		}
	}

	async getGalleryImages(userId) {
		let resource = 'user.gallery_images';

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				target_id: userId
			}
		})

		return data;
	}

	async codeValidation(corp_code, manager_code=null){
		let resource = 'account.code_validation';

		let params = {
			corp_code
		}
		if(manager_code){
			params['manager_code'] = manager_code;
		}
		console.log(params);
		let data = await Resource.put({
			service: 'skep',
			resource: resource,
			data: params
		})


		return data;

	}

	async userCorpStaff(corp_code, manager_code=null) {
		let resource = 'account.corp_staff';

		wx.showLoading({
			title: '获取数据...',
			mask: true
		});
		let params = {
			corp_code
		}
		if(manager_code){
			params['manager_code'] = manager_code;
		}
		console.log(params);
		let data = await Resource.put({
			service: 'skep',
			resource: resource,
			data: params
		})
		wx.hideLoading();

		return data;
	}

	async userManagedCorpStaff(corp_id) {
		let resource = 'account.managed_corp_staffs';

		wx.showLoading({
			title: '获取数据...',
			mask: true
		});
		let params = {
			corp_id
		}
		let data = await Resource.get({
			service: 'skep',
			resource: resource,
			data: params
		})
		wx.hideLoading();

		return data.staffs;
	}

	async followUser(userId, options) {
		let resource = 'user.followee';

		if (!options || !options.hideLoading) {
			wx.showLoading({
				title: '关注中',
				mask: true
			});
		}

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: resource,
				data: {
					followee_id: userId
				}
			})
			return true
		} catch(e) {
			return false
		} finally {
			if (!options || !options.hideLoading) {
				wx.hideLoading();
			}
		}
	}

	async unfollowUser(userId) {
		let resource = 'user.followee';

		wx.showLoading({
			title: '取消关注',
			mask: true
		});

		try {
			let data = await Resource.delete({
				service: 'honeycomb',
				resource: resource,
				data: {
					followee_id: userId
				}
			})
			return true
		} catch(e) {
			return false
		} finally {
			wx.hideLoading();
		}
	}

	async likeUser(userId, options) {
		let resource = 'user.like_user';

		if (options && options.hideLoading) {

		} else {
			wx.showLoading({
				title: '喜欢TA...',
				mask: true
			});
		}

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: resource,
				data: {
					user_id: userId
				}
			})
			return {
				isSuccess: true,
				isMutualLike: data.is_mutual_like
			}
		} catch(e) {
			return {
				isSuccess: false,
				isMutualLike: false
			}
		} finally {
			wx.hideLoading();
		}
	}

	async dislikeUser(userId) {
		let resource = 'user.dislike_user';

		// wx.showLoading({
		// 	title: '不喜欢TA...',
		// 	mask: true
		// });

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: resource,
				data: {
					user_id: userId
				}
			})
			return true
		} catch(e) {
			return false
		} finally {
			//wx.hideLoading();
		}
	}

	async getImageCounts(userIds) {
		try {
			let data = await Resource.get({
				service: 'honeycomb',
				resource: "user.gallery_image_count",
				data: {
					user_ids: JSON.stringify(userIds)
				}
			})
			return data
		} catch(e) {
			return null
		} finally {
		}
	}

	async getFollowees() {
		let resource = 'user.followees';

		wx.showLoading({
			title: '获取用户列表',
			mask: true
		});

		try {
			let data = await Resource.get({
				service: 'honeycomb',
				resource: resource,
				data: {
				}
			})
			return data.users
		} catch(e) {
			return []
		} finally {
			wx.hideLoading();
		}
	}

	async getFollowers() {
		let resource = 'user.followers';

		wx.showLoading({
			title: '获取用户列表',
			mask: true
		});

		try {
			let data = await Resource.get({
				service: 'honeycomb',
				resource: resource,
				data: {
				}
			})
			return data.users
		} catch(e) {
			return []
		} finally {
			wx.hideLoading();
		}
	}

	async getMutualLikers() {
		wx.showLoading({
			title: '获取用户列表',
			mask: true
		});
		
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.mutual_likers',
			data: {}
		});
		
		return data.users;
	}

	async uploadVideo(url) {
		wx.showLoading({
			title: '添加视频',
			mask: true
		});

		try {
			let respData = await Resource.put({
				service: 'honeycomb',
				resource: 'user.video',
				data: {
					url: url
				}
			})

			return true;
		} catch(e) {
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	async deleteVideo(videoId) {
		wx.showLoading({
			title: '删除视频',
			mask: true
		});

		try {
			let respData = await Resource.delete({
				service: 'honeycomb',
				resource: 'user.video',
				data: {
					id: videoId
				}
			})

			return true;
		} catch(e) {
			console.error(e);
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	async getVideos(userId) {
		let data = {}
		if (userId) {
			data['target_id'] = userId;
		}
		try {
			let respData = await Resource.get({
				service: 'honeycomb',
				resource: 'user.videos',
				data: data
			})

			return respData.videos;
		} catch(e) {
			console.error(e);
			return [];
		} finally {
			wx.hideLoading();
		}
	}

	async uploadImages(urls) {
		wx.showLoading({
			title: '添加相册图片...',
			mask: true
		});

		try {
			let respData = await Resource.put({
				service: 'honeycomb',
				resource: 'user.gallery_images',
				data: {
					images: urls
				}
			})

			return true;
		} catch(e) {
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	async uploadImage(index, url) {
		wx.showLoading({
			title: '上传图片...',
			mask: true
		});

		try {
			let respData = await Resource.put({
				service: 'honeycomb',
				resource: 'user.gallery_image',
				data: {
					index: index,
					image: url
				}
			})

			if (index == 1 && this.userInfo) {
				this.userInfo.avatar = url;
			}
			
			return respData.id;
		} catch(e) {
			if (e.data && e.data.errMsg) {
				return e.data.errMsg
			} else {
				return false;
			}
		} finally {
			wx.hideLoading();
		}
	}

	async deleteImage(imageId) {
		wx.showLoading({
			title: '删除相册图片',
			mask: true
		});

		try {
			let respData = await Resource.delete({
				service: 'honeycomb',
				resource: 'user.gallery_image',
				data: {
					id: imageId
				}
			})

			return true;
		} catch(e) {
			console.error(e);
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	deleteImages(imageIds) {
		for (let i=0; i<imageIds.length; i++) {
			Resource.delete({
				service: 'honeycomb',
				resource: 'user.gallery_image',
				data: {
					id: imageIds[i],
				}
			})
		}
	}

	async getImages(userId) {
		let data = {}
		if (userId) {
			data['target_id'] = userId;
		}
		try {
			let respData = await Resource.get({
				service: 'honeycomb',
				resource: 'user.gallery_images',
				data: data
			})

			return respData;
		} catch(e) {
			console.error(e);
			return [];
		} finally {
			wx.hideLoading();
		}
	}

	async getCounters(types, id) {
		if (!id) {
			id = -1;
		}

		try {
			let respData = await Resource.get({
				service: 'honeycomb',
				resource: 'system.counter',
				data: {
					types: JSON.stringify(types),
					user_id: id,
				}
			})

			return respData;
		} catch(e) {
			console.error(e);
			return {};
		} finally {
		}
	}

	async resetCounter(type) {
		if (!type) {
			return
		}

		try {
			let respData = await Resource.delete({
				service: 'honeycomb',
				resource: 'system.counter',
				data: {
					type: type
				}
			})

			return true;
		} catch(e) {
			console.error(e);
			return false;
		} finally {
		}
	}

	async getFollowerCount(userId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.follower_counter',
			data: {
				'user_id': userId
			}
		})

		return data;
	}

	async reportOtherUser(targetUserId, reason, detail, resources) {
		let urls = [];
		if (resources.length > 0) {
			urls = await Uploader.uploadImages(resources);
		}

		wx.showToast({
			title: '提交举报',
			icon: 'loading',
			mask: true
		});

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: 'system.user_report',
				data: {
					target_user_id: targetUserId,
					reason: reason,
					detail: detail,
					resources: JSON.stringify(urls)
				}
			})

			return true;
		} catch(e) {
			console.error(e);
			return false;
		} finally {
			wx.hideLoading();
		}		
	}

	async setVisitor(userId) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'user.visiting',
			data: {
				user_id: userId,
			}
		})

		return data;
	}

	async getVisitors(reset=false, count=20) {
		let resource = 'user.visitings';

		if (reset) {
			super.reset(resource);
		}

		let pageinfo = this.getPageInfo(resource, count);
		console.log(pageinfo);

		if (!pageinfo.hasNext) {
			return [];
		}

		wx.showLoading({
			title: '获取数据中...',
			mask: true,
		});
	
		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
			}
		})

		wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		// let visitors = this.getCache(resource).addAll(data.visitings);
		return data.visitings;
	}

	async checkHasNewNotify() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'system.unread_msg',
			data: {}
		})

		if (data.has_unread) {
			return true;
		} else {
			let respData = await Resource.get({
				service: 'honeycomb',
				resource: 'system.counter',
				data: {
					types: JSON.stringify(['new_follower', 'new_receive_gift']),
				}
			})

			if (respData.new_follower > 0 || respData.new_receive_gift > 0) {
				return true;
			} else {
				return false;
			}
		} 
	}

	checkCount() {
		this.getCounters(['new_follower', 'new_receive_gift', "new_receive_comment", "new_receive_upvote"]).then(counter => {
			if (counter) {
				if (counter.new_follower > 0 || counter.new_receive_gift > 0 || counter.new_receive_comment > 0 || counter.new_receive_upvote > 0) {
					console.log('show red dot 2');
					wx.showTabBarRedDot({
						index: 2
					})
					if (counter.new_follower > 0 || counter.new_receive_gift > 0) {
						console.log('show red dot 3');
						// wx.showTabBarRedDot({
							// index: 3
						// })
					} else {
						console.log('hide red dot 3');
						// wx.hideTabBarRedDot({
							// index: 3
						// })
					}
				} else {
					if (counter.new_follower + counter.new_receive_gift == 0) {
						// wx.hideTabBarRedDot({
						// 	index: 3
						// })
					}

					if (counter.new_follower+counter.new_receive_gift+counter.new_receive_comment+counter.new_receive_upvote == 0) {
						wx.hideTabBarRedDot({
							index: 2
						})
					}
				}
			}
		})	
	}

	async getUserNotifyInfo() {
		let data = await Resource.get({
			service: 'gaia',
			resource: 'weixin.user_with_notify',
			data: {
				apptype: 'mercury'
			}
		})

		return data;
	}

	async getRoleUsers(reset=false, count=8) {
		let resource = 'account.users_with_role';

		if (reset) {
			super.reset(resource);
		}

		let pageinfo = this.getPageInfo(resource, count);
		console.log(pageinfo);

		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'skep',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				role: 'star',
			}
		})

		this.updatePageInfo(resource, data.pageinfo);
		return data.users;
	}

	async setUserNotify(checked) {
		let data = await Resource.post({
			service: 'gaia',
			resource: 'weixin.user_with_notify',
			data: {
				with_notify: checked,
				apptype: 'mercury',
			}
		})

		return data;
	}

	async getUnreadSMInfo(userId) {
		if (!userId) {
			userId = -1
		}
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'system.unread_msg',
			data: {
				user_id: userId,
			}
		})

		return data;
	}

	async UpdateUnreadSM(userId) {
		if (!userId) {
			userId = -1
		}
		let data = await Resource.post({
			service: 'honeycomb',
			resource: 'system.unread_msg',
			data: {
				user_id: userId,
			}
		})
	}

	async isProfileInitialized() {
		try {
			let data = await Resource.get({
				service: 'honeycomb',
				resource: 'user.profile_initialization',
				data: {
				}
			})
			return data.is_profile_initialized;
		} catch(e) {
			console.error(e);
			return false;
		}
	}

	async getUserAgreement() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'system.about',
			data: {}
		})
		return data.agreement;
	}
	//判断当前是否运营账号
	async getIsOperater(id) {
		try {
			let respData = await Resource.get({
				service: 'skep',
				resource: 'account.op_user',
				data: {
					user_id: id,
				}
			})

			return respData;
		} catch(e) {
			console.error(e);
			return {};
		} finally {
		}
	}
	//记录此次待办任务
	async putMessagesToDo(userId, type, id) {
		try {
			let respData = await Resource.put({
				service: 'honeycomb',
				resource: 'system.op_counter',
				data: {
					user_id: userId,
					type: type,
					count: id
				}
			})

			return respData;
		} catch(e) {
			console.error(e);
			return {};
		} finally {
		}
	}
	//获取有待办任务用户列表
	async getHaveMessagesOperaters() {
		try {
			let respData = await Resource.get({
				service: 'honeycomb',
				resource: 'system.op_counters',
				data: {}
			})

			return respData;
		} catch(e) {
			console.error(e);
			return {};
		} finally {
		}
	}
	//获取当前用户待办任务
	async getOperaterMessages(userId) {
		try {
			let respData = await Resource.get({
				service: 'honeycomb',
				resource: 'user.op_counters',
				data: {
					user_id: userId
				}
			})

			return respData;
		} catch(e) {
			console.error(e);
			return {};
		} finally {
		}
	}
	//删除待办任务
	async delMessageToDo(type, id) {
		try {
			let respData = await Resource.delete({
				service: 'honeycomb',
				resource: 'system.op_counter',
				data: {
					type: type,
					count: id
				}
			})

			return respData;
		} catch(e) {
			console.error(e);
			return {};
		} finally {
		}
	}

	async getOPUsers() {
		let data = await Resource.get({
			service: 'gskep',
			resource: 'user.op_users',
			data: {}
		})
		return data;
	}

	async getUserPrivateChatPermission(userId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.private_chat_permission',
			data: {
				'user_id': userId
			}
		})
		return data;
	}

	async publishCallUp(corpId, price, content) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'user.call_up',
			data: {
				'corp_id': corpId,
				'price': price,
				'content': content
			}
		})
		return data;
	}

	async updateUserCallUpPaidStatus(bid, userCount) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'user.call_up',
			data: {
				'bid': bid,
				'user_count': userCount
			}
		})
	}

	async dailyLogin(userId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.daily_login',
			data: {
				'user_id': userId
			}
		})

		return data
	}

	async isSignin() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.sign_in',
			data: {}
		})

		return data
	}

	async signin() {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'user.sign_in',
			data: {}
		})

		return data;
	}

	async getRankingList(type='gift_count') {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.ranking_list',
			data: {
				type: type
			}
		})
		return data;
	}

	async getRedPacketStatus(luckeyMoneyId) {
		let data = await Resource.get({
			service: 'tyche',
			resource: 'lucky_money.activity_status',
			data: {
				'lucky_money_id': luckeyMoneyId
			}
		})
		return data;
	}

	async getRedPacketRecords(luckeyMoneyId) {
		let data = await Resource.get({
			service: 'tyche',
			resource: 'lucky_money.activity',
			data: {
				'lucky_money_id': luckeyMoneyId
			}
		})
		return data;
	}

	async grabLuckyMoney(luckeyMoneyId, extraData) {
		let data = await Resource.post({
			service: 'tyche',
			resource: 'lucky_money.activity',
			data: {
				'lucky_money_id': luckeyMoneyId,
				'extra_data': extraData
			}
		})
		return data;
	}

	async tellRobotReplay(robotId, userId) {
		const data = await Resource.put({
			service: 'honeycomb',
			resource: 'system.like_task',
			data: {
				'user_id': robotId,
				'target_id': userId
			}
		})
		return data;
	}
}

let service = new UserService();

export default service;