var _api_root = "http://106.55.168.236:80/";
var api = {
  user: {
    alterUserMeg: _api_root + "user/detail/update",
    getUserMeg: _api_root + "api/user/detail/get",
    getManyUserMes: _api_root + "api/user/detail/list",
    getAlterCard: _api_root + "post/updatePost/update",
    noticeIt: _api_root + "api/user/follow/follow",
    unoticeIt: _api_root + "api/user/follow/cancel",
    getMyNotices: _api_root + "api/user/follow/get",
    getNoticeds: _api_root + "api/user/follow/getFollowed",
    addLabel: _api_root + "user/label/add",
    deleteLabel: _api_root + "user/label/delete",
    getLabelList: _api_root + "user/label/list",
    setUserPhoto: _api_root + "user/photo/update",
    resetPassword: _api_root + "user/info/initPassword",
    hotTag: _api_root + "post/topTag"
  },
  label: {
    getLabelList: _api_root + "label/list"
  },
  post: {
    createPost: _api_root + "api/article/postInfo",
    likeIt: _api_root + "api/article/like",
    dislikeIt: _api_root + "api/article/dislike",
    getPostDetail: _api_root + "api/article/getDetail",
    getNewPosts: _api_root + "api/article/listNew",
    getOldPosts: _api_root + "article/listOld",
    getRecomPosts: _api_root + "article/recommend",
    setPhoto: _api_root + "api/article/setPhoto",
    deletePost: _api_root + "api/article/delete",
    listLike:_api_root + "api/article/listLike",
  },
  comment: {
    getCommentList: _api_root + "api/comment/list",
    createComment: _api_root + "api/comment/post",
    getReplyList: _api_root + "api/reply/list",
    replyComment: _api_root + "api/reply/post",
    likeIt: _api_root + "api/comment/like",
    dislikeIt: _api_root + "api/comment/dislike"
  },
};
export default api;
