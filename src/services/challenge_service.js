import Resource from '../lib/resource';
import Service from './service'

class ChallengeService extends Service {
	constructor() {
		super();
	}

	reset(resource) {
		super.reset(resource);
	}

	async getQuestions(bankId, count=5) {
		let data = await Resource.put({
			service: 'app_answer',
			resource: 'app.activity',
			data: {
				'question_count': count,
				'question_bank_id': bankId
			}
		})
		
		return data;
	}

	async submitAnswer(id, answer, score) {
		let data = await Resource.post({
			service: 'app_answer',
			resource: 'app.activity',
			data: {
				'id': id,
				'question2option': JSON.stringify(answer),
				'score': score
			}
		})
		
		return data;
	}

	async getChallengeRanking(appId, reset=false, count=15) {
		let resource = 'app.top_users';
		if (reset) {
			this.reset(resource);
		}
		
		let pageInfo = this.getStaticPageInfo(resource, count)
		console.log(pageInfo)

		if (!pageInfo.hasNext) {
			return [];
		}
		wx.showLoading({
			title: '获取数据...',
			mask: true
		})

		let data = await Resource.get({
			service: 'app_answer',
			resource: resource,
			data: {
				page: pageInfo.page,
				count_per_page: pageInfo.countPerPage,
				app_id: appId
			}
		})
		console.log(data);
		wx.hideLoading();
		this.updatePageInfo(resource, data.pageinfo);
		return data.users;
	}

	async getStartGameLottery(gameString = 'bacchus') {
		const data = await Resource.get({
			service: 'app_answer',
			resource: 'lottery.unlimited_lottery',
			data: {
				'game': gameString
			}
		})

		return data
	}

	async getGameLottery() {
		const data = await Resource.get({
			service: 'app_answer',
			resource: 'lottery.user_lotterys',
			data: {}
		})

		return data
	}

	async postLotteryStateById(lotteryId) {
		const data = await Resource.post({
			service: 'app_answer',
			resource: 'lottery.received_lottery',
			data: {
				'id': lotteryId
			}
		})

		return data
	}

	async getAnnaulSummary() {
		const data = await Resource.get({
			service: 'jarvis',
			resource: 'overview.report.member_report',
			data: {}
		})

		return data
	}

	async getGameEntrance() {
		let data = await Resource.get({
			service: 'app_answer',
			resource: 'app.apps',
			data: {}
		})

		return data
	}
}

let service = new ChallengeService();

export default service;