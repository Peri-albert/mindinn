import Resource from '../lib/resource';
import Uploader from '../lib/uploader'
import _ from '../lib/mptool'
import Service from './service';
import LocationService from './location_service'
import WebIMService from './webim_service'

class BlogService extends Service {
	constructor() {
		super();

		this.id2blog = {};

		this.nearbyBlogCountPerPage = 5;
		this.nearbyBlogPage = 1;
		this.nearbyBlogIds = [];
		this.mixRewardPage = 1
	}

	reset(resource) {
		console.warn("reset blog service");
		super.reset(resource);

		this.nearbyBlogPage = 1;
		this.nearbyBlogIds = [];
	}

	processBlogs(newBlogs) {
		for (let i=0; i<newBlogs.length; i++) {
			let newBlog = newBlogs[i];
			let showingContent = newBlog.content.split("\n");
			newBlog.showingContent = showingContent;

			if (newBlog.extra_data.length > 0) {
				newBlog.extra_data = JSON.parse(newBlog.extra_data);
			}
		}
	}

	getCachedBlogs() {
		return this.getCache("blog.blogs").getAll();
	}

	async getBlogs(type, count=5) {
		let resource = 'blog.blogs';
		let pageinfo = this.getPageInfo(resource, count);
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let params = {
			_p_from: pageinfo.nextFromId,
			_p_count: pageinfo.countPerPage,
			type: type
		}

		if (type == "square") {
			params['blog_ids'] = JSON.stringify(this.nearbyBlogIds);
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: params
		})
		
		this.updatePageInfo(resource, data.pageinfo);
		let newBlogs = this.getCache(resource).addAll(data.blogs, (oldBlog, newBlog) => {
			oldBlog.like_count = newBlog.like_count;
			oldBlog.comment_count = newBlog.comment_count;
			oldBlog.created_at = newBlog.created_at
		});
		this.processBlogs(newBlogs);
		console.log(newBlogs);
		return newBlogs;
	}

	async getTopicBlogs(reset=false, topicId, type) {
		let resource = 'blog.topic_blogs';
		if (reset) {
			this.reset(resource)
		}

		let pageinfo = this.getPageInfo(resource, 8);
		
		if (!pageinfo.hasNext) {
			return [];
		}
		wx.showLoading();
		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				id: topicId,
				type: type
			}
		})
		
		this.updatePageInfo(resource, data.pageinfo);
		let newBlogs = this.getCache(resource).addAll(data.blogs, (oldBlog, newBlog) => {
			oldBlog.comments = newBlog.comments
		});
		this.processBlogs(newBlogs);

		newBlogs.forEach(e => {
			e.created_ago = e.created_at ? _.calculateTime(e.created_at) : ''
			e.comments.forEach(e2 => {
				e2.contentData = WebIMService.Emoji.parseEmoji(e2.content)
			})
			if (e.type == 'audio') {
				e.audioDuration = Math.floor(+e.content)
			}
			return e
		})

		return newBlogs;
	}


	async getUserBlogs(userId, count=5, reset=false) {
		let resource = 'blog.user_blogs';
		if (reset) {
			this.reset(resource);
		}
		
		let pageinfo = this.getPageInfo(resource, count);
		console.log(pageinfo);
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				user_id: userId
			}
		})

		this.updatePageInfo(resource, data.pageinfo);
		let newBlogs = this.getCache(resource).addAll(data.blogs);
		this.processBlogs(newBlogs);

		newBlogs.forEach(e => {
			e.created_ago = e.created_at ? _.calculateTime(e.created_at) : ''
			if (e.type == 'audio') {
				e.audioDuration = Math.floor(+e.content)
			}

			return e
		})

		return newBlogs;
	}

	async getLikers(blogId, count=5, reset=false) {
		let resource = 'blog.blog_likers';
		if (reset) {
			this.reset(resource);
		}
		let pageinfo = this.getPageInfo(resource, count);
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				blog_id: blogId
			}
		})
		
		this.updatePageInfo(resource, data.pageinfo);
		return data.users;
	}

	async getBlog(blogId) {
		console.log(blogId);
		let blog = this.getCachedObject(blogId);
		if (!blog) {
			console.log("get blog from remote service")
			blog = await Resource.get({
				service: 'honeycomb',
				resource: 'blog.blog',
				data: {
					id: blogId
				}
			})
			this.processBlogs([blog])
		} else {
			console.log("get blog from cache")
		}
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		console.log(blog)

		if (blog.type == 'audio') {
			blog.audioDuration = Math.floor(+blog.content)
		}
		return blog;
	}

	getBlogSync(blogId) {
		console.log(blogId);
		let blog = this.getCachedObject(blogId);

		return blog;
	}

	async deleteBlog(blogId) {
		wx.showLoading({
			title: '删除动态',
			mask: true
		})

		try {
			Resource.delete({
				service: 'honeycomb',
				resource: 'blog.blog',
				data: {
					id: blogId,
				}
			})

			return true;
		} catch(e) {
			wx.showToast({
				title: '删除动态失败，请稍后再试',
				icon: 'none',
				duration: 1500
			})
			return false;
		} finally {
			wx.hideLoading();
		}
	}

	async postBlog(data, type) {
		// let urls = null
		// let blogData = {}

		// if (type == 'trends') {
		// 	if (data.resources.length == 0) {
		// 		let title = "请上传资源"
		// 		if (data.type == "video") {
		// 			title = "请上传视频"
		// 		} else if (data.type == "image") {
		// 			title = "请上传图片"
		// 		}
		// 		wx.showToast({
		// 			title: title,
		// 			icon: 'none',
		// 			duration: 1500,
		// 			mask: true
		// 		});	
		// 		return null
		// 	}

		// 	if (data.type == 'image') {
		// 		urls = await Uploader.uploadImages(data.resources);
		// 	} else if (data.type == 'video') {
		// 		urls = await Uploader.uploadVideos(data.resources);
		// 	} else if (data.type == 'audio') {
		// 		urls = data.resources
		// 	} else {
		// 		return;
		// 	}
		// 	console.log('urls', urls);

		// 	blogData = {
		// 		type: data.type,
		// 		content: data.content,
		// 		resources: JSON.stringify(urls),
		// 		topic_id: data.topicId,
		// 		address: data.address,
		// 		latitude: String(data.latitude),
		// 		longitude: String(data.longitude)
		// 	}

		// 	wx.showLoading({
		// 		title: '发布动态',
		// 		mask: true
		// 	});
		// }else if (type == 'reward') {
		// 	urls = data.resource.length ? await Uploader.uploadImages(data.resource) : []
		// 	blogData = {
		// 		content: data.content,
		// 		duration: data.duration,
		// 		count: data.count,
		// 		resource: JSON.stringify(urls),
		// 		topic_id: data.topicId,
		// 		address: data.address,
		// 		latitude: String(data.latitude),
		// 		longitude: String(data.longitude)
		// 	}
		// }

		// const resource = type == 'trends' ? 'blog.blog' : 'blog.reward_blog'
		
		try {
			// let data = await Resource.put({
			// 	service: 'honeycomb',
			// 	resource: resource,
			// 	data: blogData
			// })
			// return data;
			// 
			data.id = Math.floor(Math.random() * 100)
			let rs = []
			data.resources.forEach(e => {
				rs.push({
					id: Math.floor(Math.random() * 100),
					type: data.type,
					url: e
				})
			})
			data.resources = rs

			if (!wx.getStorageSync('trends')) {
				let arr = []
				arr.push(data)
				wx.setStorageSync('trends', JSON.stringify(arr))
			}else {
				let arr = JSON.parse(wx.getStorageSync('trends'))
				arr.push(data)
				wx.setStorageSync('trends', JSON.stringify(arr))
			}
			return new Promise((res, rej) => {
				setTimeout(() => {
					res(data)
				}, Math.random() * 1700)
			})
		} catch(e) {
			let title = '发布失败';
			wx.showToast({
				title: title,
				icon: 'none',
				duration: 2000,
				mask: true
			})
			return {}
		} finally {
			wx.hideLoading();
		}
	}

	async postBroadcastBlog(type, content, isAllowComment, count) {
		if (content.length == 0) {
			wx.showToast({
				title: '请输入霸屏文字内容',
				icon: 'none',
				duration: 1500,
				mask: true
			});	
			return null
		}

		wx.showLoading({
			title: '发布霸屏',
			mask: true
		});

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: 'blog.broadcast_blog',
				data: {
					type: type,
					content: content,
					is_allow_comment: isAllowComment,
					count: count,
				}
			})

			return data;
		} catch(e) {
			let title = e.data ? e.data.errMsg : '发布失败';
			wx.showToast({
				title: title,
				icon: 'none',
				duration: 2000,
				mask: true
			})
			return null;
		} finally {
			wx.hideLoading();
		}
	}

	async getBroadcastBlogs(count=8, reset=false) {
		let resource = 'blog.broadcast_blogs';

		if (reset) {
			this.reset(resource);
		}
		let pageinfo = this.getPageInfo(resource, count);

		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
			}
		})
		this.updatePageInfo(resource, data.pageinfo);
		return data.blogs;
	}

	async getUserBroadcastBlogs(count=8, reset=false) {
		let resource = 'user.broadcast_blogs';
		if (reset) {
			this.reset(resource);
		}
		let pageinfo = this.getPageInfo(resource, count);
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
			}
		})
		this.updatePageInfo(resource, data.pageinfo);
		return data.blogs;
	}

	async getShowingBroadcastBlogs() {
		let resource = 'blog.showing_broadcast_blogs';

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {}
		})
		return data.blogs;
	}

	async checkBlogValidity(id) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'blog.valid_blog',
			data: {
				id: id,
			}
		})
		
		return data;
	}
	async getNearByBlogs(reset=false) {
		wx.showLoading({
			title: '获取动态...',
			mask: true
		})

		if (reset) {
			this.nearbyBlogPage = 1;
			this.nearbyBlogIds = [];
		}

		let location = await LocationService.getCurrentLocation();
		if (!location.lat) {
			wx.hideLoading();
			return [];
		}

		try {
			let data = await Resource.get({
				service: 'honeycomb',
				resource: 'blog.nearby_blogs',
				data: {
					lat: location.lat,
					lng: location.lng,
					page: this.nearbyBlogPage,
					count_per_page: this.nearbyBlogCountPerPage
				}
			});
			
			if (data.blogs) {
				for (let i=0; i<data.blogs.length; i++) {
					this.nearbyBlogIds.push(data.blogs[i].Id);
				}
				this.nearbyBlogPage += 1;
				return data.blogs;
			} else {
				return [];
			}
		} catch (e) {
			// wx.showToast({
			// 	title: '获取动态失败',
			// 	icon: 'none',
			// 	duration: 1500
			// });
			return []
		} finally {
			wx.hideLoading();
		}
	}

	//获取最热3话题
	async getThreeHotTopic() {
		// const resource = 'blog.hot_topics'

		// try {
		// 	let data = await Resource.get({
		// 		service: 'honeycomb',
		// 		resource: resource,
		// 		data: {}
		// 	})

		// 	return data.topics
		// }catch(e) {
		// 	return []
		// }

		const data = [{"id":46,"title":"春日声优","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1553260871046_53.jpg","reward_count":3,"is_hot":true,"display_index":3,"is_enable":true,"created_at":"2019-03-22 13:21:13"},{"id":14,"title":"土味情话PK","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/154546234801_223.jpg","reward_count":23,"is_hot":true,"display_index":2,"is_enable":true,"created_at":"2018-12-22 07:05:54"},{"id":44,"title":"做自己的女王","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1552017408048_455.jpg","reward_count":13,"is_hot":true,"display_index":2,"is_enable":true,"created_at":"2019-03-08 03:56:50"}]

		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 3000)
		})
	}

	//获取所有话题组
	async getTopics(reset = false, count = 15) {
		// const resource = 'blog.enabled_topics'

		// if (reset) {
		// 	this.reset(resource)
		// }

		// const pageInfo = this.getStaticPageInfo(resource, count)

		// if (!pageInfo.hasNext) {
		// 	return []
		// }

		// const params = {
		// 	page: pageInfo.page,
		// 	count_per_page: pageInfo.countPerPage
		// }

		// const data = await Resource.get({
		// 	service: 'honeycomb',
		// 	resource: resource,
		// 	data: params
		// })

		// this.updatePageInfo(resource, data.pageinfo)

		// return data.topics

		const data = [{"id":46,"title":"春日声优","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1553260871046_53.jpg","reward_count":3,"is_hot":true,"display_index":3,"is_enable":true,"created_at":"2019-03-22 13:21:13"},{"id":14,"title":"土味情话PK","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/154546234801_223.jpg","reward_count":23,"is_hot":true,"display_index":2,"is_enable":true,"created_at":"2018-12-22 07:05:54"},{"id":44,"title":"做自己的女王","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1552017408048_455.jpg","reward_count":13,"is_hot":true,"display_index":2,"is_enable":true,"created_at":"2019-03-08 03:56:50"},{"id":31,"title":"#万物皆可盘","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1547782872097_344.jpeg","reward_count":37,"is_hot":true,"display_index":1,"is_enable":true,"created_at":"2019-01-18 03:41:14"},{"id":25,"title":"#满分之路","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545994336019_974.jpg","reward_count":21,"is_hot":false,"display_index":1,"is_enable":true,"created_at":"2018-12-28 10:52:17"},{"id":26,"title":"#抖音中毒患者","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545995640063_104.jpg","reward_count":18,"is_hot":true,"display_index":1,"is_enable":true,"created_at":"2018-12-28 11:14:02"},{"id":35,"title":"#晒一晒年终泡吧报告","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1548432817041_42.PNG","reward_count":7,"is_hot":true,"display_index":1,"is_enable":true,"created_at":"2019-01-25 16:13:39"},{"id":33,"title":"#夜场知识小课堂开课啦","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1548224228061_47.jpg","reward_count":6,"is_hot":false,"display_index":1,"is_enable":true,"created_at":"2019-01-23 06:17:12"},{"id":16,"title":"夜店初体验","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545462621073_966.jpg","reward_count":29,"is_hot":false,"display_index":0,"is_enable":true,"created_at":"2018-12-22 07:10:23"},{"id":12,"title":"小哥哥自拍打卡","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545462081075_821.jpg","reward_count":23,"is_hot":false,"display_index":0,"is_enable":true,"created_at":"2018-12-22 07:01:23"},{"id":17,"title":"渣男报道","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545462718025_693.jpg","reward_count":20,"is_hot":false,"display_index":0,"is_enable":true,"created_at":"2018-12-22 07:11:59"},{"id":11,"title":"小姐姐自拍打卡","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545461749084_48.jpg","reward_count":19,"is_hot":false,"display_index":0,"is_enable":true,"created_at":"2018-12-22 06:55:51"},{"id":43,"title":"#情人节，秀恩爱","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1549951472084_420.png","reward_count":18,"is_hot":false,"display_index":0,"is_enable":true,"created_at":"2019-02-12 06:04:34"},{"id":13,"title":"全网第一酒神挑战局","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545462222074_807.jpg","reward_count":16,"is_hot":true,"display_index":0,"is_enable":true,"created_at":"2018-12-22 07:03:44"},{"id":24,"title":"#前任吐槽大会","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545989167071_323.jpg","reward_count":13,"is_hot":false,"display_index":0,"is_enable":true,"created_at":"2018-12-28 09:26:09"}]

		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 1700)
		})
	}

	//获取首页推荐动态
	async getRecommendTrends(reset = false, count = 15) {
		// const resource = 'blog.recommend_blogs'

		// if (reset) {
		// 	this.reset(resource)
		// }

		// const pageInfo = this.getPageInfo(resource, count)

		// if (!pageInfo.hasNext) {
		// 	return []
		// }

		// const params = {
		// 	_p_from: pageInfo.nextFromId,
		// 	_p_count: pageInfo.countPerPage
		// }

		// const data = await Resource.get({
		// 	service: 'honeycomb',
		// 	resource: resource,
		// 	data: params
		// })

		// this.updatePageInfo(resource, data.pageinfo)

		// return data.blogs.map(e => {
		// 	e.address = JSON.parse(e.extra_data).address ? JSON.parse(e.extra_data).address : ''
		// 	e.is_new = Date.now() - Date.parse(e.created_at.replace(/-/g, '/')) <= 7200000
		// 	e.created_ago = e.created_at ? _.calculateTime(e.created_at) : ''
		// 	if (e.type == 'audio') {
		// 		e.audioDuration = Math.floor(+e.content)
		// 	}

		// 	return e
		// })

		const data = [{"id":3541,"type":"video","source":"user","like_count":0,"comment_count":0,"content":"懒惰久了，稍微努力一下便以为在拼命？","topic":null,"is_allow_comment":true,"is_deleted":false,"resources":[{"id":4127,"type":"video","url":"http://resource.vxiaocheng.com/upload/honeycomb_video/1137699/2019_04_13_11_00_42.94504.mp4"}],"comments":[],"author":{"id":1137699,"name":"居然还会有人","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/384069933.jpg","region":"","cover":"","sex":"male","slogan":"","callup_doyen":false,"reward_doyen":false,"code":"301138012"},"user_data":{"like":{"is_liked":false,"created_at":""}},"created_at":"2019-04-13 19:00:46","extra_data":"{\"address\":\"长虹路三九五九巷小区南(南湖东路)\",\"latitude\":\"32.02648\",\"longitude\":\"118.765093\"}","has_verify":true,"duration":0,"visit_count":0,"is_finished":false,"amount":0,"is_adopt":false,"adopt_mpcoin":0,"is_liked_by_current_user":false,"address":"长虹路三九五九巷小区南(南湖东路)","is_new":true,"created_ago":"4分钟前","is_in_homepage":true},{"id":3539,"type":"image","source":"usurp_screen","like_count":0,"comment_count":0,"content":"开心","topic":null,"is_allow_comment":true,"is_deleted":false,"resources":[{"id":4125,"type":"image","url":"http://resource.vxiaocheng.com/upload/sake/image/6273/6273_5101527_1555087752082_770.png"}],"comments":[],"author":{"id":868688,"name":"不忘初心&方得始终","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/383800922.jpg","region":"","cover":"","sex":"unkonwn","slogan":"","callup_doyen":false,"reward_doyen":false,"code":"300869001"},"user_data":{"like":{"is_liked":false,"created_at":""}},"created_at":"2019-04-13 18:45:35","extra_data":"{\"address\":\"欢迎光临D\\u0026D俱乐部\",\"corp_id\":\"6273\",\"source\":\"h5:usurp_screen\",\"theme\":\"\",\"time\":\"10\",\"usurp_screen_activity_id\":\"3969406\"}","has_verify":true,"duration":0,"visit_count":0,"is_finished":false,"amount":0,"is_adopt":false,"adopt_mpcoin":0,"is_liked_by_current_user":false,"address":"欢迎光临D&D俱乐部","is_new":true,"created_ago":"19分钟前","is_in_homepage":true},{"id":3538,"type":"image","source":"user","like_count":0,"comment_count":0,"content":"搞笑，斗图我会输？不存在的！","topic":{"id":24,"title":"#前任吐槽大会","url":"http://resource.vxiaocheng.com/upload/bacchus/image/3/1545989167071_323.jpg","reward_count":13,"is_hot":false,"display_index":0,"is_enable":false,"created_at":"2018-12-28 09:26:09"},"is_allow_comment":true,"is_deleted":false,"resources":[{"id":4116,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.20471.jpg"},{"id":4117,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.20003.jpg"},{"id":4118,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.16013.jpg"},{"id":4119,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.17674.jpg"},{"id":4120,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.12695.jpg"},{"id":4121,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.23180.jpg"},{"id":4122,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.22734.jpg"},{"id":4123,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.14350.jpg"},{"id":4124,"type":"image","url":"http://resource.vxiaocheng.com/upload/honeycomb_image/537421/2019_04_13_10_41_20.17938.jpg"}],"comments":[],"author":{"id":537421,"name":"Cisor","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/383469655.jpg","region":"","cover":"","sex":"male","slogan":"看看咯哪里去","callup_doyen":false,"reward_doyen":false,"code":"300537734"},"user_data":{"like":{"is_liked":false,"created_at":""}},"created_at":"2019-04-13 18:41:21","extra_data":"{\"address\":\"建邺区南湖东路小区\",\"latitude\":\"32.026338\",\"longitude\":\"118.76477\"}","has_verify":true,"duration":0,"visit_count":0,"is_finished":false,"amount":0,"is_adopt":false,"adopt_mpcoin":0,"is_liked_by_current_user":false,"address":"建邺区南湖东路小区","is_new":true,"created_ago":"23分钟前","is_in_homepage":true},{"id":3536,"type":"audio","source":"user","like_count":2,"comment_count":1,"content":"7.513","topic":null,"is_allow_comment":true,"is_deleted":false,"resources":[{"id":4113,"type":"audio","url":"http://resource.vxiaocheng.com/upload/honeycomb_video/1137699/2019_04_13_10_34_05.50694.mp3"}],"comments":[{"id":1874,"blog_id":3536,"blog":null,"content":"额……去酒吧挑个人","like_count":0,"has_liked":false,"is_deleted":false,"author":{"id":28890,"name":"森叔👑","avatar":"http://resource.vxiaocheng.com/upload/honeycomb_image/28890/2019_03_30_08_21_52.89977.jpg","region":"","cover":"","sex":"","slogan":"","callup_doyen":false,"reward_doyen":false,"code":""},"at_user":null,"created_at":"2019/04/13 18:43:02","contentData":[{"data":"额……去酒吧挑个人","type":"txt"}]}],"author":{"id":1137699,"name":"居然还会有人","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/384069933.jpg","region":"","cover":"","sex":"male","slogan":"","callup_doyen":false,"reward_doyen":false,"code":"301138012"},"user_data":{"like":{"is_liked":false,"created_at":""}},"created_at":"2019-04-13 18:34:06","extra_data":"{\"address\":\"南湖公园\",\"latitude\":\"32.027164\",\"longitude\":\"118.763052\"}","has_verify":true,"duration":0,"visit_count":0,"is_finished":false,"amount":0,"is_adopt":false,"adopt_mpcoin":0,"is_liked_by_current_user":false,"address":"南湖公园","is_new":true,"created_ago":"31分钟前","audioDuration":7,"is_in_homepage":true}]

		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 3000)
		})
	}

	//获取热门动态列表
	async getHotTrends(reset = false, count = 15) {
		// const resource = 'blog.hot_blogs'

		// if (reset) {
		// 	this.reset(resource)
		// }

		// let pageInfo = this.getStaticPageInfo(resource, count);

		// if (!pageInfo.hasNext) {
		// 	return []
		// }

		// const params = {
		// 	page: pageInfo.page,
		// 	count_per_page: pageInfo.countPerPage
		// }

		// const data = await Resource.get({
		// 	service: 'honeycomb',
		// 	resource: resource,
		// 	data: params
		// })

		// this.updatePageInfo(resource, data.pageinfo)

		// return data.blogs.map(e => {
		// 	e.address = JSON.parse(e.extra_data).address ? JSON.parse(e.extra_data).address : ''
		// 	e.is_new = Date.now() - Date.parse(e.created_at.replace(/-/g, '/')) <= 7200000
		// 	e.created_ago = e.created_at ? _.calculateTime(e.created_at) : ''
		// 	if (e.type == 'audio') {
		// 		e.audioDuration = Math.floor(+e.content)
		// 	}

		// 	return e
		// })

		const data = [{"id":3541,"type":"video","source":"user","like_count":0,"comment_count":0,"content":"懒惰久了，稍微努力一下便以为在拼命？","topic":null,"is_allow_comment":true,"is_deleted":false,"resources":[{"id":4127,"type":"video","url":"http://resource.vxiaocheng.com/upload/honeycomb_video/1137699/2019_04_13_11_00_42.94504.mp4"}],"comments":[],"author":{"id":1137699,"name":"居然还会有人","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/384069933.jpg","region":"","cover":"","sex":"male","slogan":"","callup_doyen":false,"reward_doyen":false,"code":"301138012"},"user_data":{"like":{"is_liked":false,"created_at":""}},"created_at":"2019-04-13 19:00:46","extra_data":"{\"address\":\"长虹路三九五九巷小区南(南湖东路)\",\"latitude\":\"32.02648\",\"longitude\":\"118.765093\"}","has_verify":true,"duration":0,"visit_count":0,"is_finished":false,"amount":0,"is_adopt":false,"adopt_mpcoin":0,"is_liked_by_current_user":false,"address":"长虹路三九五九巷小区南(南湖东路)","is_new":true,"created_ago":"4分钟前","is_in_homepage":true},{"id":3536,"type":"audio","source":"user","like_count":2,"comment_count":1,"content":"7.513","topic":null,"is_allow_comment":true,"is_deleted":false,"resources":[{"id":4113,"type":"audio","url":"http://resource.vxiaocheng.com/upload/honeycomb_video/1137699/2019_04_13_10_34_05.50694.mp3"}],"comments":[{"id":1874,"blog_id":3536,"blog":null,"content":"额……去酒吧挑个人","like_count":0,"has_liked":false,"is_deleted":false,"author":{"id":28890,"name":"森叔👑","avatar":"http://resource.vxiaocheng.com/upload/honeycomb_image/28890/2019_03_30_08_21_52.89977.jpg","region":"","cover":"","sex":"","slogan":"","callup_doyen":false,"reward_doyen":false,"code":""},"at_user":null,"created_at":"2019/04/13 18:43:02","contentData":[{"data":"额……去酒吧挑个人","type":"txt"}]}],"author":{"id":1137699,"name":"居然还会有人","avatar":"http://resource.vxiaocheng.com/upload/persistent_avatar/384069933.jpg","region":"","cover":"","sex":"male","slogan":"","callup_doyen":false,"reward_doyen":false,"code":"301138012"},"user_data":{"like":{"is_liked":false,"created_at":""}},"created_at":"2019-04-13 18:34:06","extra_data":"{\"address\":\"南湖公园\",\"latitude\":\"32.027164\",\"longitude\":\"118.763052\"}","has_verify":true,"duration":0,"visit_count":0,"is_finished":false,"amount":0,"is_adopt":false,"adopt_mpcoin":0,"is_liked_by_current_user":false,"address":"南湖公园","is_new":true,"created_ago":"31分钟前","audioDuration":7,"is_in_homepage":true}]

		return new Promise((res, rej) => {
			setTimeout(() => {
				res(data)
			}, Math.random() * 3000)
		})
	}

	//围观(围观数+1)
	async addOnlookers(blogId) {
		const resource = 'blog.visiting'

		const data = await Resource.put({
			service: 'honeycomb',
			resource: resource,
			data: {
				blog_id: blogId
			}
		})

		return true
	}

	//发布投稿
	async postContribution(content, resourcesType, resources, blogId) {
		const resource = 'blog.contribute_blog'
		let newresources = [];
		if (resources.length) {
			newresources = resourcesType == 'image' ? await Uploader.uploadImages(resources) : await Uploader.uploadVideos(resources)
		}
		const data = await Resource.put({
			service: 'honeycomb',
			resource: resource,
			data: {
				content: content,
				resources: JSON.stringify(newresources),
				blog_id: blogId
			}
		})
		
		return data
	}

	//获取悬赏下所有投稿
	async getContributionsFromReward(blogId) {
		const resource = 'blog.contribute_blogs'

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				blog_id: blogId
			}
		})

		data.blogs.forEach(blog => {
			blog.adopt_mpcoin = blog.adopt_mpcoin ? Math.floor(blog.adopt_mpcoin * 2 / 3) / 100 : ''
		})

		return data
	}

	//采纳
	async adoptContribution(rewardId, contributeId) {
		const resource = `blog.adopt_blog`

		const data = await Resource.put({
			service: 'honeycomb',
			resource: resource,
			data: {
				reward_blog_id: rewardId,
				contribute_blog_id: contributeId
			}
		})

		return data
	}

	//获取我的悬赏
	async getMyRewards(isFinished) {
		const resource = `blog.user_reward_blogs`

		const data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				is_finished: isFinished
			}
		})

		return data.blogs.map(e => {
			e.is_from_myreward = true
			e.amount = e.amount ? Math.floor(e.amount * 2 / 3) / 100 : ''
			return e
		})
	}

	//获取我的召唤令
	async getMySummons() {
		const resource = `user.call_ups`

		const data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {}
		})

		return data.callups
	}

	//获取悬赏列表
	async getRewardBlogs(reset=false, finished = false, count=7) {
		let resource = 'blog.reward_blogs';
		if (reset) {
			this.reset(resource)
		}

		let pageinfo = this.getPageInfo(resource, count);
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				is_finished: finished
			}
		})
		
		this.updatePageInfo(resource, data.pageinfo);

		data.blogs.forEach(blog => {
			blog.amount = blog.amount ? Math.floor(blog.amount * 2 / 3) / 100 : ''
		})

		return data;
	}
}

let service = new BlogService();

export default service;