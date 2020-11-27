//登录信息的各种方法

const UID = "uid"
const TOKEN = "token"
const USER_INFO = "userInfo"

/**
 * storage中是否存在登录信息
 */
function hasLoginInfoInStorage() {
  try {
    var uid = wx.getStorageSync(UID);
    var token = wx.getStorageSync(TOKEN);
    if (uid && token) {
      return true
    } else {
      return false
    }

  } catch (e) {
    return false
  }
}

/**
 * app.globalData中是否存在登录信息
 */
function hasLoginInfoInGlobalData() {
  var app = getApp()
  if (app.globalData.uid && app.globalData.token) {
    return true
  }

  return false
}

/**
 * 保存登录信息
 * 将userinfo/uid/token写入storage/app.globalData
 */
function saveLoginInfo(userInfo, uid, token) {
  try {
    wx.setStorageSync(USER_INFO, userInfo)
    wx.setStorageSync(TOKEN, token)
    wx.setStorageSync(UID, uid)

    var app = getApp()
    app.globalData.userInfo = userInfo
    app.globalData.uid = uid
    app.globalData.token = token

    return true
  } catch (e) {
    return false
  }
}

function clearLoginInfo() {
  try {
    wx.removeStorageSync(USER_INFO)
    wx.removeStorageSync(TOKEN)
    wx.removeStorageSync(UID)

    var app = getApp()
    app.globalData.userInfo = null
    app.globalData.uid = ''
    app.globalData.token = ''

    return true
  } catch (e) {
    return false
  }
}

/**
 * 从globalData或者storage获取userInfo
 */
function getUserInfo() {
  try {
    var userInfo = getApp().globalData.userInfo
    if (!userInfo) {
      userInfo = wx.getStorageSync(USER_INFO)
    }

    return userInfo
  } catch (e) {
    return ''
  }
}

/**
 * 从globalData或者storage获取token
 */
function getToken() {
  try {
    var token = getApp().globalData.token
    if (!token) {
      token = wx.getStorageSync(TOKEN)
    }

    if (!token) {
      token = ''
    }
    return token
  } catch (e) {
    return ''
  }
}

/**
 * 从globalData或者storage获取uid
 */
function getUId() {
  try {
    var uid = getApp().globalData.uid
    if (!uid) {
      uid = wx.getStorageSync(UID)
    }

    if (!uid) {
      uid = ''
    }
    return uid
  } catch (e) {
    return ''
  }
}

module.exports = {
  UID: UID,
  TOKEN: TOKEN,
  USER_INFO: USER_INFO,
  hasLoginInfoInStorage: hasLoginInfoInStorage,
  hasLoginInfoInGlobalData: hasLoginInfoInGlobalData,
  saveLoginInfo: saveLoginInfo,
  clearLoginInfo: clearLoginInfo,
  getUserInfo: getUserInfo,
  getToken: getToken,
  getUId: getUId
}