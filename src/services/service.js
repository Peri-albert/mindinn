import Resource from '../lib/resource';
import LoadMoreService from '../services/loadmore_service'

class PageInfo {
	constructor(countPerPage) {
		this.type = 'dynamic';
		this.hasNext = true;
		this.nextFromId = 0;
		this.countPerPage = countPerPage;
	}
}

class StaticPageInfo {
	constructor(countPerPage) {
		this.type = 'static';
		this.hasNext = true;
		this.page = 1;
		this.countPerPage = countPerPage;
	}
}

let counter = 1;

class ObjectsCache {
	constructor(name, globalId2Object) {
		this.name = name;
		this.objects = [];
		this.id2object = {};
		this.globalId2Object = globalId2Object;
	}

	/**
	 * 将对象加入缓存
	 * @param {*} object 
	 */
	add(object, objectCallback) {
		if (!this.globalId2Object[object.id]) {
			this.globalId2Object[object.id] = object;
		} else {
			let newObject = object;
			let oldObject = this.globalId2Object[object.id];
			if (objectCallback) {
				objectCallback(oldObject, newObject);
			}
			object = oldObject
		}

		let existed = this.id2object[object.id];
		if (!existed) {
			this.objects.push(object);
			this.id2object[object.id] = object;
			return object;
		} else {
			return null;
		}
	}

	/**
	 * 将对象集合加入缓存，返回新对象集合
	 * @param {*} objects 
	 */
	addAll(objects, objectCallback) {
		let newObjects = [];
		objects.forEach((object) => {
			let newObject = this.add(object, objectCallback);
			if (newObject) {
				newObjects.push(newObject);
			} else {

			}
		})

		return newObjects;
	}

	/**
	 * 获取id对应的object
	 * @param {*} id 
	 */
	get(id) {
		return this.id2object[id];
	}

	getAll() {
		return this.objects;
	}
}

class Service {
	constructor() {
		this.resource2pageinfo = {};
		this.resource2cache = {};
		this.id2object = {};
	}

	updatePageInfo(resource, pageinfoData) {
		let pageinfo = this.getPageInfo(resource);
		if (pageinfo.type == 'dynamic') {
			pageinfo.hasNext = pageinfoData['has_next'];
			pageinfo.nextFromId = pageinfoData['next_from_id'];
		} else {
			pageinfo.hasNext = pageinfoData['has_next'];
			pageinfo.page += 1;
		}

		LoadMoreService.updatePageInfo(pageinfo);
	}

	getPageInfo(resource, countPerPage=20) {
		let pageinfo = this.resource2pageinfo[resource];
		if (!pageinfo) {
			pageinfo = new PageInfo(countPerPage);
			this.resource2pageinfo[resource] = pageinfo;
		}

		return pageinfo;
	}

	getStaticPageInfo(resource, countPerPage=20) {
		let pageinfo = this.resource2pageinfo[resource];
		if (!pageinfo) {
			pageinfo = new StaticPageInfo(countPerPage);
			this.resource2pageinfo[resource] = pageinfo;
		}

		return pageinfo;
	}

	getCache(resource) {
		let cache = this.resource2cache[resource];
		if (!cache) {
			cache = new ObjectsCache(resource, this.id2object);
			this.resource2cache[resource] = cache;
		}

		return cache;
	}

	getCachedObject(id) {
		return this.id2object[id];
	}

	reset(resource) {
		if (resource) {
			delete this.resource2pageinfo[resource];
			delete this.resource2cache[resource];
		} else {
			this.resource2pageinfo = {};
			this.resource2cache = {};
		}
	}
}

export default Service;