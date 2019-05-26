import Resource from '../lib/resource';
import Service from './service'

class TagService extends Service {
	constructor() {
		super();
	}

	async getTags() {
		let resource = 'tag.tags';

		wx.showLoading({
			title: '获取数据...',
			mask: true
		});
		let types = ['dance', 'friend', 'female_looks', 'music', 'wine', 'male_looks'];
		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				types: JSON.stringify(types)
			}
		})
		wx.hideLoading();
		
		return data.tags;
	}

	async getUserTags(id) {
		let resource = 'user.tags';

		if (!id) {
			id = -1;
		}
		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				user_id: id,
			}
		})
		
		return data.tags;
	}

	async setUserTags(id, tags) {
		let resource = 'user.tags';

		let ids = []
		for (let i=0; i<tags.length; i++) {
			ids.push(tags[i].id)
		}
		console.log(ids)
		// wx.showLoading({
		// 	title: '设置用户标签...',
		// 	mask: true
		// });

		try {
			await Resource.post({
				service: 'honeycomb',
				resource: resource,
				data: {
					user_id: id,
					tag_ids: JSON.stringify(ids),
				}
			})
			// wx.hideLoading();
			return true;
		} catch(e) {
			return false;
		}
	}
}

let service = new TagService();

export default service;