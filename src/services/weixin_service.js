import Resource from '../lib/resource';
import Service from './service'

class WeixinService extends Service {
	constructor() {
		super();
		this.store = null;
	}

	async recordShare(appId, encryptedData, iv) {
		let data = await Resource.put({
			service: 'coral',
			resource: 'weixin.share',
			data: {
				app_id: appId,
				encrypted_data: encryptedData,
				iv: iv
			}
		})

		if (data.is_earn_mpcoin) {
			//奖励了秀点
			wx.showToast({
				title: '今日首次分享，获得10个秀点的奖励',
				icon: 'none',
				duration: 1500
			});
		}

		return data;
	}

	async getPhoneNumber(appId, encryptedData, iv) {
		let data = await Resource.put({
			service: 'coral',
			resource: 'weixin.phone',
			data: {
				app_id: appId,
				encrypted_data: encryptedData,
				iv: iv
			}
		})

		return data;
	}
}

let service = new WeixinService();

export default service;