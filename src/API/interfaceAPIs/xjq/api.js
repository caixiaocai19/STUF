var _api_root = "http://106.55.168.236:80/";
var api = {
  user: {
    // alterUserMeg: _api_root + "user/detail/update",
    getUserMeg: _api_root + "api/user/detail/get",
	setUserPhoto: _api_root + "api/user/photo/update",	
    // getManyUserMes: _api_root + "api/user/detail/list",
    // getAlterCard: _api_root + "post/updatePost/update",
    // noticeIt: _api_root + "api/user/follow/follow",
    // unoticeIt: _api_root + "api/user/follow/cancel",
    // getMyNotices: _api_root + "api/user/follow/get",
    // getNoticeds: _api_root + "api/user/follow/getFollowed",
    addLabel: _api_root + "api/user/label/add",
    deleteLabel: _api_root + "api/user/label/delete",
    getLabelList: _api_root + "api/user/label/list",
	getList: _api_root + "api/label/list",
    // setUserPhoto: _api_root + "user/photo/update",
    // resetPassword: _api_root + "user/info/initPassword",
    // hotTag: _api_root + "post/topTag"
  },

  post: {
	  getUserUpdate: _api_root + "api/user/detail/update",
	  getPswUpdate: _api_root + "api/user/info/changePassword",
	  createPost: _api_root + "api/article/postInfo",
    // createPost: _api_root + "api/article/postInfo",
    // likeIt: _api_root + "api/article/like",
    // dislikeIt: _api_root + "api/article/dislike",
    // getPostDetail: _api_root + "api/article/getDetail",
    // getNewPosts: _api_root + "api/article/listNew",
    // getOldPosts: _api_root + "article/listOld",
    // getRecomPosts: _api_root + "article/recommend",
    setPhoto: _api_root + "api/article/setPhoto",
    // deletePost: _api_root + "article/delete"
  },

};
export default api;
