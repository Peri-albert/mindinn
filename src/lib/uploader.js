import 'wepy-async-function'
import Session from './session'
import Resource from './resource'

let API_SERVER = Resource.API_SERVER;

let Uploader = {
	uploadImages (files) {
		console.log('upload images')
		return this._uploadAll("image", files);
	},

	uploadVideos(files) {
		console.log('upload videos')
		return this._uploadAll("video", files);
	},

	_uploadAll (type, files) {
		let loadingText = type === 'image' ? '上传图片' : '上传视频';
		let urlPath = (type === 'image' ? 'gaia/resource/image' : 'gaia/resource/video');
		console.log(files)
		console.log('>>>>><<<<<')
		let a = wx.showLoading({
			title: loadingText,
			mask: true
		});

		let file2result = {}

		files.forEach(file => {
			file2result[file] = {
				isFinished: false,
				url: null
			};
		})

		return new Promise((resolve, reject) => {
			files.forEach(file => {
				
				let url = `${API_SERVER}/${urlPath}/?_v=1&_method=put`

				console.debug('upload file: ' + file + ' to ' + url);
				let header = {
					'Accept': 'application/json',
					'Authorization': (Session.get() || '0')
				}
				let uploadTask = wx.uploadFile({
					url: url,
					filePath: file,
					name: type,
					header: header,
					formData: {
					},
					success: function (res) {
						console.log(res);
						if (res.statusCode === 500) {
							wx.hideLoading();
							wx.showToast({
								title: '上传失败，请检查网络后重试',
								icon: 'none',
								duration: 1500
							});
							if (reject) {
								reject(res);
							}
						} else {
							var data = JSON.parse(res.data)
							file2result[file] = {
								isFinished: true,
								url: data.data.path
							}
						}
					},
					fail: function (res) {
						console.error(">>>>>>>>>> upload fail <<<<<<<<<<");
						console.error(res);
						wx.hideLoading();
						wx.showToast({
							title: '上传失败，请检查网络后重试',
							icon: 'none',
							duration: 1500
						});
						if (reject) {
							reject(res);
						}
					},
					complete: function (res) {
						file2result[file].isFinished = true;
						console.log(`upload ${file} finished`);

						let isAllFinished = true;
						files.forEach(file => {
							if (!file2result[file].isFinished) {
							isAllFinished = false;
							}
						})

						if (isAllFinished) {
							let resultUrls = files.map(file => {
							return file2result[file].url
							})
							wx.hideLoading();
							resolve(resultUrls);
						}
					}
				})

				uploadTask.onProgressUpdate((res) => {
					console.log(`${res.progress}% (${res.totalBytesSent}/${res.totalBytesExpectedToSend})`);
					wx.showLoading({
						title: res.progress + '%',
						mask: true
					})
				})
			});
		})
	}
}

export default Uploader;