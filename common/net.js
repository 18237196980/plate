const auth = require("./auth.js")
const config = require("../config.js")

/**
 * 封装微信的的request
 */
function request(code, data = {}, method = "GET") {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.URL + code,
			data: data,
			method: method,
			timeout: 50000,
			header: {
				'Content-Type': 'application/json',
				'token': auth.getToken(),
				'uid': auth.getUId(),
				//'device': '2', //1 PC 2 安卓 3 IOS 4 微信 5 微信小程序
				//'deviceId': ''
			},
			success: function(res) {
				if (res.statusCode == 200) {
					if (res.data) {
						if (res.data.code == -1) {
							uni.hideLoading();
							//token错误
							auth.clearLoginInfo()
							wx.reLaunch({
								url: '/pages/login/login',
							})
						} else if (res.data.code == 1) {
							resolve(res.data)
						} else {
							resolve(res.data)
						}
					} else {
						var apiResult = {
							code: 0,
							message: res.errMsg,
							data: res.err
						}
						reject(apiResult)
					}
				} else {
					var apiResult = {
						code: 0,
						message: res.errMsg,
						data: res.err
					}
					reject(apiResult)
				}
			},
			fail: function(err) {
				var apiResult = {
					code: 0,
					message: err.errMsg,
					data: err
				}
				reject(apiResult)
			}
		})
	});

}

function get(code, data = {}) {
	return request(code, data, 'GET')
}

function post(code, data = {}) {
	return request(code, data, 'POST')
}

module.exports = {
	get: get,
	post: post
}
