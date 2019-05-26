import Resource from '../lib/resource';
import Service from './service'

class StorageService extends Service {
	constructor() {
		super();
		this.key2value = {};
	}

	set(key, value, once=false) {
		console.log(this.key2value);
		this.key2value[key] = value;
		console.log(this.key2value);
	}

	get(key) {
		return this.key2value[key];
	}

	getAndClear(key) {
		console.log(this.key2value);
		let value = this.key2value[key];
		delete this.key2value[key];
		return value;
	}
}

let service = new StorageService();

export default service;