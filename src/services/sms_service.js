import Resource from '../lib/resource'
import Service from './service'

class SMSService extends Service {
	constructor() {
		super();
	}

	async getVerifyCode(phone) {
		let resource = 'resource.verify_code';

		let data = await Resource.put({
			service: 'skep',
			resource: resource,
			data: {
				'phone': phone,
				'mock': 'false'
			}
		})
		
		return data.code;
    }
    
    async checkVerifyCode(code) {
        let resource = 'resource.verify_code';

		wx.showLoading({
			title: '检查验证码',
			mask: true
		})

		try {
			let data = await Resource.get({
				service: 'skep',
				resource: resource,
				data: {
					'code': code
				}
			})

			return data.is_valid;
		} catch(e) {
			console.error(e);
			return false;
		} finally {
			wx.hideLoading();
		}
		
	}
}

let service = new SMSService();

export default service;