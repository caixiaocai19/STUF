
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["src/pages/level1/login/login","src/pages/level2/login/forgetpwd","src/pages/level3/login/modify","src/pages/level1/square/square","src/pages/level1/profile/profile","src/pages/level3/profile/modifypsw","src/pages/level3/profile/username","src/pages/level3/profile/usersign","src/pages/level3/profile/userhead","src/pages/level2/profile/myfans","src/pages/level2/profile/edit","src/pages/level2/profile/followee","src/pages/level1/message/message","src/pages/level1/square/square","src/pages/level2/message/label","src/pages/level2/square/postDetail"],"window":{"navigationBarTextStyle":"white","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#007AFF","backgroundColor":"#FFFFFF","navigationStyle":"custom","titleNView":false},"tabBar":{"color":"black","selectedColor":"black","backgroundColor":"#b7c7ff","height":"50px","list":[{"pagePath":"src/pages/level1/square/square","text":"广场","iconPath":"static/tabbar/square.png","selectedIconPath":"static/tabbar/square_active.png","style":{"enablePullDownRefresh":true}},{"pagePath":"src/pages/level1/message/message","text":"发布","iconPath":"static/tabbar/message.png","selectedIconPath":"static/tabbar/message.png"},{"pagePath":"src/pages/level1/profile/profile","text":"我的","iconPath":"./static/tabbar/profile.png","selectedIconPath":"./static/tabbar/profile_active.png"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"金凤","compilerVersion":"3.1.13","entryPagePath":"src/pages/level1/login/login","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/src/pages/level1/login/login","meta":{"isQuit":true},"window":{}},{"path":"/src/pages/level2/login/forgetpwd","meta":{},"window":{}},{"path":"/src/pages/level3/login/modify","meta":{},"window":{}},{"path":"/src/pages/level1/square/square","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/src/pages/level1/profile/profile","meta":{"isQuit":true,"isTabBar":true},"window":{"enablePullDownRefresh":true}},{"path":"/src/pages/level3/profile/modifypsw","meta":{},"window":{}},{"path":"/src/pages/level3/profile/username","meta":{},"window":{}},{"path":"/src/pages/level3/profile/usersign","meta":{},"window":{}},{"path":"/src/pages/level3/profile/userhead","meta":{},"window":{}},{"path":"/src/pages/level2/profile/myfans","meta":{},"window":{}},{"path":"/src/pages/level2/profile/edit","meta":{},"window":{}},{"path":"/src/pages/level2/profile/followee","meta":{},"window":{}},{"path":"/src/pages/level1/message/message","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/src/pages/level2/message/label","meta":{},"window":{}},{"path":"/src/pages/level2/square/postDetail","meta":{},"window":{"enablePullDownRefresh":true}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
