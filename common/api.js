const net = require("./net.js")
const config = require("../config.js")

// 密码登陆
export function loginByPwd(user) {
	let url = `/plate/user/loginByPwd`
	return net.post(url,user)
}

// 注册
export function register(params) {
	let url = `/plate/user/register`
	return net.post(url,params)
}

// 微信登陆
export function loginWeiXin(params) {
	let url = `/plate/user/loginWeiXin`
	return net.post(url,params)
}

// token登陆
export function loginByToken() {
	let url = `/plate/user/loginByToken`
	return net.post(url)
}

// 退出登陆
export function logout(uid) {
	let url = `/plate/user/logout?uid=${uid}`
	return net.post(url)
}

// 注册时，校验用户名是否可以
export function canUseName(name) {
	let url = `/plate/user/canUseName?name=${name}`
	return net.post(url)
}

// 根据id查询用户
export function loadUser(id) {
	let url = `/plate/me/me?id=${id}`
	return net.post(url)
}

// 根据code获取openid
export function getOpedId(code) {
	let url = `/plate/user/getOpedId?code=${code}`
	return net.post(url)
}

// 修改密码
export function updatePwd(params) {
	let url = `/plate/me/updatePwd`
	return net.post(url,params)
}

// 修改头像
export function changeHeader(params) {
	let url = `/plate/me/changeHeader`
	return net.post(url,params)
}

// 完善个人资料
export function fullUserInfo(params) {
	let url = `/plate/me/fullUserInfo`
	return net.post(url,params)
}

// 发送验证码
export function getPhoneCode(phone,code_flag) {
	let url = `/plate/me/getPhoneCode?phone=${phone}&code_flag=${code_flag}`
	return net.post(url)
}

// 手机号验证码登陆
export function loginByPhone(phone,code) {
	let url = `/plate/user/loginByPhone?phone=${phone}&code=${code}`
	return net.post(url)
}



// 车牌列表
export function plateList(pageNumber, pageSize,searchParam) {
	let url = `/plate/main/list?pageNumber=${pageNumber}&pageSize=${pageSize}&searchParam=${searchParam}`
	return net.post(url)
}

// 添加车牌
export function addPlate(model) {
	let url = `/plate/main/add`
	return net.post(url,model)
}

// 修改车牌
export function editPlate(model) {
	let url = `/plate/main/edit`
	return net.post(url,model)
}

// 删除车牌
export function del(id) {
	let url = `/plate/main/del?id=${id}`
	return net.post(url)
}

// 车牌详情
export function initPlate(id) {
	let url = `/plate/main/initPlate?id=${id}`
	return net.get(url)
}
