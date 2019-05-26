import Resource from '../lib/resource';
import Service from './service'

class AdService extends Service {
	constructor() {
		super();
		this.id2ad = {};
	}

	reset() {
		super.reset();
		this.id2ad = {};
	}

	async getAds(type) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'ad.opened_ads',
			data: {
				"__f-type": type
			}
		})

		let id2ad = {}
		for (let i=0; i<data.ads.length; i++) {
			id2ad[data.ads[i].id] = data.ads[i];
		}

		this.id2ad = id2ad;
		return data.ads;
	}

	async getAd(id) {
		let ad = this.id2ad[id];
		return ad;
	}
}

let service = new AdService();

export default service;