import Resource from '../lib/resource';
import Service from './service'
import _ from '../lib/mptool'
import QQMapWX from '../lib/qqmap/qqmap-wx-jssdk.min'

class LocationService extends Service {
	constructor() {
		super();

		//长期数据
		this.rawData = null;
		this.specialCities = {
			'北京市': true,
			'天津市': true,
			'上海市': true,
			'重庆市': true
		}

		//短期业务数据
		this.mode = null;
		this.provinceCities = null;
		this.provinces = null;
		this.name2provinceIndex = {};
		this.name2cityIndex = {};

		this.lat = null;
		this.lng = null;
		this.region = null;
		this.qqmapKey = [
			"66NBZ-R7EKP-YLJDH-LKEHR-NCAA2-ZEFTN",
			"N2KBZ-MRAKO-HGLW2-SFB4J-CUPH6-XQBCE",
			"QYEBZ-3K7WX-WFR4X-ZFFYH-RY422-U3F3G",
			"BGUBZ-6YMCX-C5W43-Z3NZJ-LKWBO-4JFLU",
			"L5TBZ-YG7CX-52T46-73G63-AQVIE-ZCFAX"
		];
	}

	// setQQMapKey(key) {
	// 	this.qqmapKey = key;
	// }

	async getCities(activityId) {
		let resource = 'location.cities';

		wx.showLoading({
			title: '获取城市...',
			mask: true
		});
		let data = await Resource.get({
			service: 'coral',
			resource: resource,
			data: {
			}
		})
		wx.hideLoading();

		this.getCache(resource).addAll(data.cities);
		return data.cities;
	}

	async loadCitiesFromServer(mode) {
		if (this.rawData == null) {
			this.provinceCities = null;
			this.provinces = null;
			this.name2provinceIndex = {};
			this.name2cityIndex = {};

			let data = await Resource.get({
				service: 'skep',
				resource: 'location.province_cities',
				data: {}
			})

			this.rawData = data;
		}

		let provinceCities = _.clone(this.rawData);
		if (mode == 'country') {
			let country = {
				id: 0,
				name: "全国",
				cities: [{
					id: 0,
					name: "全国"
				}]
			}
			provinceCities = [country, ...provinceCities];
			for (let i = 0; i < provinceCities.length; ++i) {
				let province = provinceCities[i];

				if (this.specialCities[province.name]) {
					let cities = [{
						id: province.id,
						name: province.name
					}];
					province.cities = cities;
				}
			}
		}

		return provinceCities;
	}

	async reset() {
		this.provinceCities = null;
		this.provinces = null;
		this.name2provinceIndex = {};
		this.name2cityIndex = {};
	}

	async __getCitiesData(mode) {
		if (mode != this.mode) {
			this.reset();
		}

		if (this.provinceCities == null) {
			this.provinceCities = await this.loadCitiesFromServer(mode);

			//转换数据
			for (let i = 0; i < this.provinceCities.length; ++i) {
				let province = this.provinceCities[i];
				this.name2provinceIndex[province.name] = i;

				let cities = province.cities;
				if (this.specialCities[province.name]) {
					cities = [province];
				}
				for (let j = 0; j < cities.length; ++j) {
					let city = cities[j];
					this.name2cityIndex[city.name] = j;
				}
			}

			this.provinces = this.provinceCities.map(province => {
				return {
					"id": province.id,
					"name": province.name
				}
			})
		}

		let cities = this.provinceCities[0].cities;
		
		return {
			'provinceCities': [this.provinces, cities],
			'provinceCityIndex': [0, 0]
		}
	}

	async getCountryCities() {
		return await this.__getCitiesData("country");
	}

	async getProvinceCities(region='北京市,东城区') {
		return await this.__getCitiesData("province");
	}

	getProvinceCitiesForProvinceIndex(index) {
		let cities = this.provinceCities[index].cities.map(city => {
			return {
				"id": city.id,
				"name": city.name
			}
		})

		return [this.provinces, cities];
	}

	getProvinceCityByIndex(provinceIndex, cityIndex) {
		let province = this.provinceCities[provinceIndex];
		let city = province.cities[cityIndex];

		return {
			'province': {
				id: province.id,
				name: province.name,
			},
			'city': {
				id: city.id,
				name: city.name
			}
		}
	}

	getProvinceCityIndexForRegion(region) {
		let items = region.split(',');
		let provinceName = items[0];
		let cityName = items[1];

		let provinceIndex = this.name2provinceIndex[provinceName];
		let cityIndex = this.name2cityIndex[cityName];

		return [provinceIndex, cityIndex];
	}

	getCity(id) {
		return this.getCachedObject(id);
	}

	getkey() {
		let index = parseInt(Math.random() * 5);
		return this.qqmapKey[index];
	}

	async getCurrentLocation() {
		if (this.lat) {
			return {
				lat: this.lat,
				lng: this.lng
			}
		} else {
			let geoData = await this.wxGetLocation();
			return {
				lat: this.lat,
				lng: this.lng
			}
		}
	}

	async reportLocation() {
		if (this.lat == null) {
			await this.wxGetLocation();
		}
		
		try {
			let data = await Resource.post({
				service: 'gskep',
				resource: 'account.user_location',
				data: {
					lat: this.lat,
					lng: this.lng,
					region: this.region
				}
			})
			return true;
		} catch(e) {
			console.error('update user location failed')
			return false;
		}
	}

	async getLocationAddress() {
		if (!this.lat) {
			await this.wxGetLocation();
		}
		let data = await this.getProvinceCity();
		console.log(data)
		return data;
	}

	async getProvinceCity() {
		let _this = this;
		let key = this.getkey();
		let qqmapsdk = new QQMapWX({
			key: key
		});

		return new Promise((resolve, reject) => {
			qqmapsdk.reverseGeocoder({
				location: {
					latitude: this.lat,
					longitude: this.lng
				},
				success: addressRes => {
					let addressComponent = addressRes.result.address_component;
					_this.region = addressComponent['province']+','+addressComponent['city']
					console.log(addressRes)
					resolve(addressRes.result);
				},
				fail: res => {
					resolve("");
				},
			})
		})
	}

	async wxGetLocation() {
		let _this = this;
		return new Promise((resolve, reject) => {
			wx.getLocation({
				type: 'wgs84',
				success: res => {
					console.warn("***** get location success")
					_this.lat = res.latitude;
					_this.lng = res.longitude;
					resolve("")
				},
				fail: res => {
					console.warn("***** get location fail")
					resolve("")
				}
			});
		});
	}

	// async getAddressCoordinate(key, address) {
	// 	let qqmapsdk = new QQMapWX({
	// 		key
	// 	});
	// 	console.log(address)
	// 	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
	// 	return new Promise((resolve, reject) => {
	// 		qqmapsdk.geocoder({
	// 			'address': address,
	// 			success: function(res) {
	// 				resolve(res.result.location);
	// 			},
	// 			fail: function(res) {
	// 				reject(res);
	// 			}
	// 		})
	// 	})
	// }

	async getLocationInfoByCoordinate(coordinate) {
		let key = this.getkey();
		let qqmapsdk = new QQMapWX({
			key: key
		});
		return new Promise((resolve, reject) => {
			qqmapsdk.reverseGeocoder({
				location: coordinate,
				success: function(res) {
					let info = res.result.address_component;
					let address = info.province + ',' + info.city;
					let key = `${coordinate.latitude}_${coordinate.longitude}`;
					let resp = {};
					resp[key] = address;
					resolve(resp);
				},
				fail: function(res) {
					reject(res);
				}
			})
		})
	}

	async calculateDistance(tos) {
		let key = this.getkey();
		let qqmapsdk = new QQMapWX({
			key: key
		});

		let from = await this.getCurrentLocation();
		if (!this.lat) {
			return {}
		}

		from = {
			latitude: from.lat,
			longitude: from.lng
		}

		return new Promise((resolve, reject) => {
			qqmapsdk.calculateDistance({
				from: from,
				to: tos,
				success: function(data) {
					let key2distance = {}
					data.result.elements.forEach(result => {
						let key = `${result.to.lat}_${result.to.lng}`;
						key2distance[key] = result.distance;
					})
					resolve(key2distance)
				},
				fail: function(res) {
					console.error(res);
				},
				complete: function() {
					console.log("complete")
				}
			})
		})
	}

	async getLocationText(coordinate) {
		let key = this.getkey();
		let qqmapsdk = new QQMapWX({
			key: key
		});
		return new Promise((resolve, reject) => {
			qqmapsdk.reverseGeocoder({
				location: coordinate,
				success: function(res) {
					resolve(res.result.formatted_addresses.recommend);
				},
				fail: function(res) {
					reject(res);
				}
			})
		})
	}

	async getAddressByCoordinate(coordinates) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'system.coordinate_addresses',
			data: {
				'coordinates': JSON.stringify(coordinates)
			}
		})
		return data.data;
	}

	async updateCoordinateAddress(datas) {
		await Resource.put({
			service: 'honeycomb',
			resource: 'system.coordinate_addresses',
			data: {
				'datas': JSON.stringify(datas)
			}
		})
	}
}

let service = new LocationService();

export default service;