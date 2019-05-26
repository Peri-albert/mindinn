let SESSION_KEY = '_msid';

let CACHED_SID = null;

let Session = {
	update (value) {
		CACHED_SID = value;
		wx.setStorageSync(SESSION_KEY, value);
	},

	clear () {
		CACHED_SID = null;
		wx.removeStorageSync(SESSION_KEY);
		wx.clearStorageSync();
	},

	get () {
		if (CACHED_SID != null) {
			return CACHED_SID;
		} else {
			try {
				var value = wx.getStorageSync(SESSION_KEY);
				if (value) {
					CACHED_SID = value;
					return CACHED_SID;
				}
			} catch (e) {
				console.error(`no ${SESSION_KEY} in storage`);
			}
		}
	},

	setKey(key, value) {
		wx.setStorageSync(key, value);
	},

	getKey(key) {
		return wx.getStorageSync(key);
	}
}

export default Session;