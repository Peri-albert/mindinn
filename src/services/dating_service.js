import Resource from '../lib/resource';
import Uploader from '../lib/uploader'
import Service from './service'

class DatingService extends Service {
	constructor() {
		super();
	}

	reset(resource) {
		super.reset(resource);
	}

	async getDatings() {
		let resource = 'dating.datings';
		let pageinfo = this.getPageInfo(resource, 5);
		console.log(pageinfo)
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
            }
		})

		this.updatePageInfo(resource, data.pageinfo);
		return data.datings;
	}

	async getDating(id) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.dating',
			data: {
                id: id,
            }
		})

		return data.dating;
	}

	async deleteDating(id) {
		await Resource.delete({
			service: 'honeycomb',
			resource: 'dating.dating',
			data: {
                id: id,
            }
		})
	}

	async createDating(datingTypeId, topic, time, address, priorGender, description, images, latitude, longitude) {
		let params = {
			'dating_type_id': datingTypeId,
			'topic': topic,
			'time': time,
			'address': address,
			'prior_gender': priorGender,
			'description': description,
			'images': JSON.stringify(images),
			'latitude': latitude,
			'longitude': longitude
		}

		wx.showLoading({
			title: '发布约会',
			mask: true
		})

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: 'dating.dating',
				data: params,
			})
			return data;
		} catch(e) {
			let title = e.data ? e.data.errMsg : '发布失败';
			wx.showToast({
				title: title,
				icon: 'none',
				duration: 2000,
				mask: true
			})
			return null;
		} finally {
			wx.hideLoading();
		}
	}

	async updateChatroomId(id, chatroomId) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'dating.dating',
			data: {
				'id': id,
				'chatroom_id': chatroomId,
			},
		})
	}

	async closeDating(id) {
		await Resource.put({
			service: 'honeycomb',
			resource: 'dating.closed_dating',
			data: {
				'id': id,
			},
		})
	}

	async checkDatingAbility() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.dating_ability',
			data: {},
		})

		return data;
	}

	async handleUserJoin(id, isAgree) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'dating.dating_join_verify',
			data: {
				'id': id,
				'is_agree': isAgree,
			},
		})
	}

	async kickedUserFromDating(id) {
		await Resource.delete({
			service: 'honeycomb',
			resource: 'dating.dating_join_verify',
			data: {
				'id': id,
			},
		})
	}

	async getDatingJoiners(datingId, hasAgreed) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.dating_joiners',
			data: {
				'dating_id': datingId,
				'has_agreed': hasAgreed,
			},
		})

		return data;
	}

	async getDatingTypes() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.dating_types',
			data: {},
		})

		return data;
	}

	async visitDating(datingId) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'dating.dating_visit',
			data: {
				'dating_id': datingId,
			},
		})

		return data;
	}

	async getDatingVisits(datingId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.dating_visits',
			data: {
				'dating_id': datingId,
			},
		})

		return data;
	}

	async followDating(datingId) {
		let data = await Resource.put({
			service: 'honeycomb',
			resource: 'user.followed_dating',
			data: {
				'dating_id': datingId,
            }
		});

		return data;
	}

	async unfollowDating(datingId) {
		await Resource.delete({
			service: 'honeycomb',
			resource: 'user.followed_dating',
			data: {
				'dating_id': datingId,
            }
		});
	}

	async getFollowedDatings(userId=-1) {
		let resource = 'dating.followed_datings';

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {}
		})

		return data.datings;
	}

	async joinDating(datingId) {
		wx.showLoading({
			title: '报名',
			mask: true
		})

		try {
			let data = await Resource.put({
				service: 'honeycomb',
				resource: 'dating.joined_dating',
				data: {
					'dating_id': datingId,
				},
			})

			return data;
		} catch(e) {
			return null;
		} finally {
			wx.hideLoading();
		}
	}

	async commentDating(datingId, content, images) {
		try {
			let urls = [];
			if (images.length > 0) {
				wx.showLoading({
					title: '上传图片',
					mask: true
				})
				console.log(images);
				urls = await Uploader.uploadImages(images);
				console.log(urls);
			}

			wx.showLoading({
				title: '发布评论',
				mask: true
			})
			let data = await Resource.put({
				service: 'honeycomb',
				resource: 'user.dating_rating',
				data: {
					'dating_id': datingId,
					'content': content,
					'images': JSON.stringify(urls)
				},
			})

			return data;
		} catch(e) {
			return null;
		} finally {
			wx.hideLoading();
		}
	}

	async cancelJoinDating(datingId) {
		await Resource.delete({
			service: 'honeycomb',
			resource: 'dating.joined_dating',
			data: {
				'dating_id': datingId,
			},
		})
	}

	async getMyJoinedDatings(userId=-1) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.my_joined_datings',
			data: {
				'user_id': userId
			},
		})

		return data.datings;
	}

	async checkEnterPermission(datingId) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.dating_permission',
			data: {
				'dating_id': datingId,
			},
		})

		return data;
	}

	async getMyPublishedDatings(userId=-1) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.my_published_datings',
			data: {
				'user_id': userId,
			}
		})
		return data.datings;
	}

	async FinishDating(datingId) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'dating.finished_dating',
			data: {
				'id': datingId,
            }
		})
	}

	async getApplyCount(id) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.apply_count',
			data: {
				'id': id,
            }
		});
		
		return data;
	}

	async getUserDatings(id) {
		let resource = 'dating.datings';
		let pageinfo = this.getPageInfo(resource, 5);
		console.log(pageinfo)
		
		if (!pageinfo.hasNext) {
			return [];
		}

		let data = await Resource.get({
			service: 'honeycomb',
			resource: resource,
			data: {
				_p_from: pageinfo.nextFromId,
				_p_count: pageinfo.countPerPage,
				filters: JSON.stringify({
					"__f-user_id-equal": id
				})
      }
		})

		this.updatePageInfo(resource, data.pageinfo);
		return data.datings;
	}

	async updateUserJoinInfo(id) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'dating.dating_notify',
			data: {
				'id': id,
            }
		});
	}

	async isUserFirstPublishDating() {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'user.dating_remind',
			data: {}
		});

		return data;
	}

	async payedDating(bid) {
		await Resource.post({
			service: 'honeycomb',
			resource: 'dating.payed_dating',
			data: {
				'bid': bid,
			}
		});
	}

	async getMongoDatings(lat, lng, distance) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.mongo_datings',
			data: {
				"lat": lat,
				"lng": lng,
				"distance": distance
			}
		})

		return data.datings;
	}

	async getNearbyDatings(ids) {
		let data = await Resource.get({
			service: 'honeycomb',
			resource: 'dating.nearby_datings',
			data: {
				"ids": JSON.stringify(ids),
			}
		})

		return data.datings;
	}
}

let service = new DatingService();
export default service;