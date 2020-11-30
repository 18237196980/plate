
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/login/start","pages/main/index/index","pages/me/me/me","pages/plate/add/add","pages/plate/detail/detail","pages/login/login","pages/reg/reg","pages/me/pwd/pwd","pages/me/detail/detail","pages/all/all","pages/car/car"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"车管家","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8"},"tabBar":{"color":"#666","selectedColor":"#09BB07","borderStyle":"black","backgroundColor":"#fafafa","list":[{"pagePath":"pages/main/index/index","iconPath":"static/icon_home_normal.png","selectedIconPath":"static/icon_home_press.png","text":"首页"},{"pagePath":"pages/all/all","iconPath":"static/icon_me_normal.png","selectedIconPath":"static/icon_me_press.png","text":"测"},{"pagePath":"pages/car/car","iconPath":"static/icon_car_normal.png","selectedIconPath":"static/icon_car_press.png","text":"车辆"},{"pagePath":"pages/me/me/me","iconPath":"static/icon_me_normal.png","selectedIconPath":"static/icon_me_press.png","text":"我的"}]},"networkTimeout":{"request":3000,"connectSocket":3000,"uploadFile":60000,"downloadFile":60000},"nvueCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":false,"autoclose":true},"appname":"车管家","compilerVersion":"2.9.8","entryPagePath":"pages/login/start"};
var __uniRoutes = [{"path":"/pages/login/start","meta":{"isQuit":true},"window":{}},{"path":"/pages/main/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"车牌列表","enablePullDownRefresh":true,"navigationBarBackgroundColor":"#435377"}},{"path":"/pages/me/me/me","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"我的","navigationBarBackgroundColor":"#435377"}},{"path":"/pages/plate/add/add","meta":{},"window":{"navigationBarTitleText":"添加车牌","navigationBarBackgroundColor":"#435377"}},{"path":"/pages/plate/detail/detail","meta":{},"window":{"navigationBarTitleText":"修改车牌","navigationBarBackgroundColor":"#435377"}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarBackgroundColor":"#435377","titleNView":{"autoBackButton":false}}},{"path":"/pages/reg/reg","meta":{},"window":{"navigationBarTitleText":"注册","navigationBarBackgroundColor":"#435377","titleNView":{"autoBackButton":false}}},{"path":"/pages/me/pwd/pwd","meta":{},"window":{"navigationBarTitleText":"修改密码","navigationBarBackgroundColor":"#435377"}},{"path":"/pages/me/detail/detail","meta":{},"window":{"navigationBarTitleText":"个人资料","navigationBarBackgroundColor":"#435377"}},{"path":"/pages/all/all","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"测","navigationBarBackgroundColor":"#435377"}},{"path":"/pages/car/car","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"车辆","navigationBarBackgroundColor":"#435377","enablePullDownRefresh":true}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
