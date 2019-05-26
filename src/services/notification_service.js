import Resource from '../lib/resource';
import Service from './service'

class NotificationService extends Service {
	constructor() {
		super();
	}

	reset() {
		super.reset();
	}

	async getNotifications(count=8, type) {
		let resource = 'user.notifications';
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
				type: type,
			}
		})

		// wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		let notifications = this.getCache(resource).addAll(data.notifications);
		return notifications;
	}

	async getLatestNofitication(type) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.notifications',
			data: {
				type: type,
			}
		})

		return data.notifications[0];
	}

	async getCommentAtMe(count=8) {
		let resource = 'user.AtMeNotification';
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
			resource: 'user.notifications',
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				type: 'relate',
			}
		})

		// wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		let notifications = this.getCache(resource).addAll(data.notifications);
		return notifications;
	}

	async getCommentUpvote(count=8) {
		let resource = 'user.upvoteNotification';
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
			resource: 'user.notifications',
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				type: 'upvote',
			}
		})

		// wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		let notifications = this.getCache(resource).addAll(data.notifications);
		return notifications;
	}

	async sendCallUpMessage(userIds, corpId, barName, userName) {
		await Resource.put({
			service: 'honeycomb',
			resource: 'system.call_up_message',
			data: {
				'user_ids': JSON.stringify(userIds),
				'corp_id': corpId,
				'bar_name': barName,
				'user_name': userName
			}
		})
	}
}

let service = new NotificationService();

export default service;