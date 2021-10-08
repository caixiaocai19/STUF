var _api_root = "http://106.55.168.236:80/";
var api = {
	post:{
		postLogin: _api_root + "api/" +"user/info/login",
		changePwd: _api_root + "api/" +"user/info/changePassword",
		postInitpwd: _api_root + "api/" + "user/info/initPassword",
	},
	get:{
		getUser: _api_root + "api/user/detail/get",
	}
	
};
export default api;