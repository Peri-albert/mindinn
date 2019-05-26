import Resource from '../lib/resource'
import Service from './service'
import Session from '../lib/session'

class MPService extends Service {
	constructor() {
		super();
		this.page = null;
		this.event2handler = {};
	}

	bind(page) {
		this.page = page;
		return this;
	}

	handle(event, ...args) {
		console.log(`handle ${event} in mp_service`);
		console.log(args);
		let handler = this.event2handler[event];
		if (handler) {
			handler(...args);
		}
	}

	playVideo(options) {
		console.log(options);
		if (options.url) {
			this.page.$broadcast('play-video', options.url);
		}

		if (options.complete) {
			this.event2handler['close-video-player'] = options.complete;
		}
	}

	showModalEditor(options) {
		console.log(options);
		let placeholder = options.placeholder || '';
		let page = options.page != undefined ? options.page : 'normal';
		this.page.$broadcast('show-modal-editor', placeholder, page);

		if (options.complete) {
			this.event2handler['submit-modal-editor'] = options.complete;
		}
	}

	hideModalEditor() {
		console.log('hide hide hide');
		this.page.$broadcast('hide-modal-editor');
	}

	showProfileEditor(options) {
		console.log(options);
		this.page.$broadcast('show-profile-editor', options.type, options.data);

		if (options.complete) {
			this.event2handler['submit-profile-editor'] = options.complete;
		}
	}

	hideProfileEditor() {
		this.page.$broadcast('hide-profile-editor');
	}
	
	sendGift(options) {
		let page = options.page != undefined ? options.page : 'normal';
		let showTitle = options.showTitle != undefined ? options.showTitle : true;
		this.page.$broadcast('send-gift', options.userId, page, showTitle);
		if (options.complete) {
			this.event2handler["close-gift"] = options.complete;
		}
	}

	dialogChoice(options) {
		this.page.$broadcast('dialog-choice', options.message, options.id);
	}
}

let service = new MPService();

export default service;