import Resource from '../lib/resource';
import Service from './service'
// import Uploader from '../lib/uploader'

class PaymentService extends Service {
	constructor() {
		super();
	}

	async getPaymentInfo(bid, openid) {
		let paymentInfo = await Resource.put({
			service: 'plutus',
			resource: 'pay.payment',
			data: {
                bid: bid,
                source: 'mini_app',
				description: '每屏秀秀-秀点',
				pay_way: 'weixin',
				extra_data: JSON.stringify({
					"openid": openid,
					"app_code": 'paopao',
					"source": 'mini_app'
				}),
            }
		})

		return paymentInfo;
	}		
}

let service = new PaymentService();

export default service;