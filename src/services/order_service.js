import Resource from '../lib/resource';
import Service from './service'

class OrderService extends Service {
	constructor() {
		super();

		this.page = 1;
		this.countPerPage = 20;
		this.finishLoad = false;
	}

	reset() {
		super.reset();
		this.page = 1;
		this.countPerPage = 20;
		this.finishLoad = false;
	}

	// async payedOrder(bid) {
	// 	let data = await Resource.put({
	// 		service: 'peanut',
	// 		resource: 'order.payed_order',
	// 		data: {
	// 			"bid": bid,
	// 		}
	// 	})
	// 	console.log(data)
	// 	return data;
	// }

	// async getIncomeOrders(userId, count) {
	// 	let resource = 'order.orders';
	// 	let pageinfo = this.getPageInfo(resource, count);
	// 	console.log(pageinfo);

	// 	if (!pageinfo.hasNext) {
	// 		return [];
	// 	}

	// 	wx.showLoading({
	// 		title: '获取数据中...',
	// 		mask: true,
	// 	});
	// 	let data = await Resource.get({
	// 		service: 'peanut',
	// 		resource: resource,
	// 		data: {
	// 			page: pageinfo.nextPage != undefined ? pageinfo.nextPage : 1,
    //             count_per_page: pageinfo.countPerPage,
    //             _from_es: true,
    //             filters: JSON.stringify({"__f-extra_data>reciever_id-equal": userId, "__f-status-equal": 'finished'}),
	// 		}
	// 	})
	// 	wx.hideLoading();
	// 	console.log(data)
	// 	pageinfo.nextPage = data.page_info['next'];
	// 	pageinfo.hasNext = data.page_info['has_next'];
	// 	let orders = this.getCache(resource).addAll(data.orders);
	// 	return orders;
	// }

	// async getRechargeOrders(userId, count=12) {
	// 	let resource = 'order.recharge_order';
	// 	let pageinfo = this.getPageInfo(resource, count);
	// 	console.log(pageinfo);

	// 	if (!pageinfo.hasNext) {
	// 		return [];
	// 	}

	// 	wx.showLoading({
	// 		title: '获取数据中...',
	// 		mask: true,
	// 	});
	
	// 	let data = await Resource.get({
	// 		service: 'peanut',
	// 		resource: 'order.orders',
	// 		data: {
	// 			page: pageinfo.nextPage != undefined ? pageinfo.nextPage : 1,
    //             count_per_page: pageinfo.countPerPage,
    //             filters: JSON.stringify({
	// 				"__f-status-equal": 5,
	// 				"__f-user_id-equal": userId,
	// 				"__f-custom_type-in": ["mpcoin_product", "imoney:deposit"],
	// 			}),
	// 		}
	// 	})
	// 	wx.hideLoading();
	// 	pageinfo.nextPage = data.page_info['next'];
	// 	pageinfo.hasNext = data.page_info['has_next'];
	// 	let orders = this.getCache(resource).addAll(data.orders);
	// 	return orders;
	// }

	// async getIncomeInfo() {
	// 	let resource = "imoney.transfers"

	// 	wx.showLoading({
	// 		title: '获取数据中...',
	// 		mask: true,
	// 	});

	// 	if (this.finish_load) {
	// 		wx.hideLoading();
	// 		return [];
	// 	}
	// 	let data = await Resource.get({
	// 		service: 'plutus',
	// 		resource: resource,
	// 		data: {
	// 			page: this.page,
    //             count_per_page: 100,
	// 			_from_es: true,
	// 			imoney_code: 'pp_cash',
	// 			type: 'income'
	// 		}
	// 	})
	// 	wx.hideLoading();
	// 	if (data.page_info["has_next"]) {
	// 		this.page += 1;
	// 	} else {
	// 		this.finish_load = true;
	// 	}
	// 	console.log(data.transfers);
	// 	return data.transfers;
	// }

	async getOrderByBids(bids) {
		let resource = 'order.orders';
		let pageinfo = this.getPageInfo(resource, 20);

		if (!pageinfo.hasNext) {
			return [];
		}

		// wx.showLoading({
		// 	title: '获取数据中...',
		// 	mask: true,
		// });
		let data = await Resource.get({
			service: 'peanut',
			resource: resource,
			data: {
				page: pageinfo.nextPage != undefined ? pageinfo.nextPage : 1,
                count_per_page: pageinfo.countPerPage,
                _from_es: true,
                filters: JSON.stringify({"__f-bid-in": bids}),
			}
		})
		// wx.hideLoading();
		return data.orders;
	}

	async getUserTransfers(code, type) {
		if (this.finishLoad) {
			return [];
		}

		let data = await Resource.get({
			service: 'plutus',
			resource: 'imoney.transfers',
			data: {
				page: this.page,
                count_per_page: this.countPerPage,
				imoney_code: code,
				type: type
			}
		})

		if (data.page_info.has_next) {
			this.page = data.page_info.cur_page + 1;
		} else {
			this.finishLoad = true;
		}
		
		return data.transfers;
	}
}

let service = new OrderService();

export default service;