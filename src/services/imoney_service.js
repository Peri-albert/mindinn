import Resource from '../lib/resource';
import Service from './service'
import Session from '../lib/session'

class IMoneyService extends Service {
	constructor() {
		super();
	}

	async getImoneyRate(code) {
		let respData = await Resource.get({
			service: 'plutus',
			resource: 'imoney.imoney',
			data: {
				code: code,
			}
		})

		return respData;
	}

	async getBalance(imoneyCode) {
		let respData = await Resource.get({
			service: 'plutus',
			resource: 'imoney.balance',
			data: {
				imoney_code: imoneyCode
			}
		})

		return respData;
	}

	async deposit(mpcoinProductId, payMode) {
		wx.showLoading({
			title: '充值中...',
			mask: true
		});

		let params = {
			pay_mode: payMode,
			mpcoin_product_id: mpcoinProductId,
		}

		try {
			let respData = await Resource.put({
				service: 'honeycomb',
				resource: 'system.mpcoin_order',
				data: params,
			})

			return respData;
		} catch(e) {
			console.error(e);
			return false;
		} finally {
			wx.hideLoading();
		}

		return respData;
	}

	async transferByPlatform(imoneyCode, amount) {
		wx.showLoading({
			title: '平台转账中...',
			mask: true
		});

		let respData = await Resource.put({
			service: 'honeycomb',
			resource: 'dev.deposit',
			data: {
				count: amount,
				imoney: imoneyCode
			}
		})

		wx.hideLoading();

		return respData;
	}

	async rechargeByWithdrawMPCoin(count) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'system.recharge',
			data: {
				count: count
			}
		})

		return data;
	}
}

let service = new IMoneyService();

export default service;