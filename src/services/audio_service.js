import Resource from '../lib/resource'
import Uploader from '../lib/uploader'
import Service from './service'

class AudioService extends Service {
	constructor() {
		super();
		this.recorderManager = wx.getRecorderManager();
		this.tempFilePath = '';
		this.timer = 0;

		this.recorderManager.onStart((e) => {
			console.log('recorder start', e)
		})
		this.recorderManager.onPause(() => {
			console.log('recorder pause')
		})
		this.recorderManager.onResume(() => {
			console.log('recorder resume')
		})
		this.recorderManager.onStop((res) => {
			console.log('recorder stop', res);
			this.tempFilePath = res.tempFilePath;
		})
	}

	start(options = null) {
		if (!options) {
			options = {
				duration: 600000
			}
		}
		this.timer = Date.parse(new Date());
		this.recorderManager.start(options);
	}

	async stop() {
		let self = this;
		return new Promise((resolve, reject) => {
			self.recorderManager.onStop((res) => {
				console.log('recorder stop', res);
				self.tempFilePath = res.tempFilePath;
				resolve((Date.parse(new Date()) - this.timer) / 1000);
			});
			self.recorderManager.stop()
		});
	}

	async upload(file = null) {
		if (!file) {
			file = this.tempFilePath;
		}
		console.log(file);
		return file
	}
}

let service = new AudioService();

export default service;
