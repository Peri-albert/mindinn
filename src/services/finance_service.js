import Resource from '../lib/resource';
import Service from './service';

class FinanceService extends Service {
	constructor() {
		super();
		console.log('create income service');
		this.incomes = [];
		this.extractDetails = [];
		this.id2extractDetail = {};
		this.records = {};
	}

	reset() {
		super.reset();
		this.incomes = [];
		this.extractDetails = [];
		this.id2extractDetail = {};
		this.records = {};
	}

	
	async getMPCoinProducts() {
		wx.showLoading({
		title: '加载秀豆信息',
		mask: true
		})

		try {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'system.mpcoin_products',
			data: {}
		})
		return data.products;
		} catch(e) {
		console.error(e);
		return null;
		} finally {
		wx.hideLoading();
		}
	}

	async withdraw(money) {
		wx.showLoading({
			title: '处理请求...',
			mask: true
		});

		let data = await Resource.put({
			service: 'plutus',
			resource: 'imoney.withdraw',
			data: {
				'imoney_code': 'pp_cash',
				'amount': money,
				'user_type': 'member',
				'channel': 'weixin',
			}
		})
		console.log(data);
		wx.hideLoading();

		return data;
	}

	async getWithdrawDetail() {
		let resource = 'imoney.withdraw_records';
		let pageinfo = this.getPageInfo(resource, 20);
		console.log(pageinfo)

		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'plutus',
			resource: resource,
			data: {
				page: pageinfo.nextPage != undefined ? pageinfo.nextPage : 1,
				count_per_page: pageinfo.countPerPage,
				imoney_code: 'pp_cash',
			}
		})
		pageinfo.nextPage = data.page_info['next'];
		pageinfo.hasNext = data.page_info['has_next'];
		// let records = data.records.filter((record) => {
		// 	return record.status == "success" || record.status == "requesting" || record.status == "rejected" || record.status == "failed" || record.status == "pass";
		// })
		data.records.forEach(record => {
			this.records[record.id] = record;
		});
		console.log(data.records)
		return data.records;
	}

	getRecordById(id) {
		return this.records[id];
	}
}

let service = new FinanceService();

export default service;