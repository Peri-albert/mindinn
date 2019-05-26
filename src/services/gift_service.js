import Resource from '../lib/resource';
// import Uploader from '../lib/uploader'
import Service from './service'

class GiftService extends Service {
	constructor() {
		super();
	}

	reset(resource) {
		super.reset(resource);
	}

	async getGifts() {
		let resource = 'gift.gifts';

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {}
		})
		
		return data;
	}

	async givingGift(userId, giftId) {
		let resource= "user.gift_giving";

		let data = await Resource.put({
			service: 'honeycomb',
			resource: resource,
			data: {
				'user_id': userId,
				'gift_id': giftId,
			}
		})

		return data;
	}

	async getReceivedGifts(userId, count=12) {
		let resource = "user.received_gifts";
		let pageinfo = this.getPageInfo(resource, count);

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
			data:{
				"user_id": userId,
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
			},
		})

		wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		
		return data.gifts;
	}

	async getSentGifts(userId, count=12) {
		let resource = "user.sent_gifts";
		let pageinfo = this.getPageInfo(resource, count);

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
			data:{
				"user_id": userId,
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
			},
		})

		wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		
		return data.gifts;
	}

	async getReceivedGiftCount(userId) {
		let resource = "user.received_gift_count";

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data:{
				"user_id": userId,
			},
		})

		return data;
	}

	async getUserGiftsCount(userIds) {
		let resource = "gift.user_gifts_count";

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data:{
				"user_ids": JSON.stringify(userIds),
			},
		})

		return data;
	}

	async hasAccostUser(userId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.accost',
			data:{
				"user_id": userId,
			},
		});
		return data;
	}

	async accostUser(userId) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'user.accost',
			data:{
				"user_id": userId
			},
		});
		return data;
	}

	async getUserFreeGiftCount() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'gift.free_gift_count',
			data: {},
		})
		return data;
	}

	async updateUserFreeGiftCount(count) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'gift.free_gift_count',
			data: {
				'count': count,
			},
		})
	}

	async getUserShareGiftCount() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.share_gift_count',
			data: {},
		})
		return data;
	}

	async updateUserShareGiftCount() {
		await Resource.post({
			service: 'honeycomb',
			resource: 'user.share_gift_count',
			data: {},
		})
	}
}

let service = new GiftService();

export default service;