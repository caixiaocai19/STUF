import api from '../../API/interfaceAPIs/caixiaocai/api.js';
import axios from "../axios.interceptors.js";
// 发布帖子
// export function createPost(data) {
// 	return axios.post(api.card.createCard,
// 		data
// 		, {//axios 默认是 Payload格式数据请求，但有时候后端接收参数要求必须是 Form Data 格式的，所以进行转换
// 			ContentType: 'application/x-www-form-urlencoded',
// 		})
// }
// 无条件获取帖子
export function getPost(data) {
	return axios.post(api.post.getNewPosts, data)
}
//获取一个用户的详细信息
export function getUserMes(uid) {
	return axios.get(api.user.getUserMeg + "?uid=" + uid)

}
//获取多个用户的详细信息
export function getManyUserMes(uidList) {
	return axios.post(api.user.getManyUserMes, uidList)

}
//根据id获取帖子的详细信息
export function getPostDetail(articleId) {
	return axios.get(api.post.getPostDetail + "?articleId=" + articleId)

}
//根据评论的ID获取帖子的一级评论
export function getCommentList(articleId, size, page) {
	return axios.get(api.comment.getCommentList + "?articleId=" + articleId + "&size=" + size + "&page=" + page)
}
//根据帖子ID获取帖子的二级评论
export function getReplyList(commentId, size, page) {
	return axios.get(api.comment.getReplyList + "?commentId=" + commentId + "&size=" + size + "&page=" + page)
}
// 帖子点赞
export function setLike(data) {
	return axios.post(api.post.likeIt, data)
}
// 帖子取消点赞
export function setUnLike(data) {
	return axios.post(api.post.dislikeIt, data)
}
// 评论点赞
export function setCommentLike(data) {
	return axios.post(api.comment.likeIt, data)
}
// 评论取消点赞
export function setCommentUnLike(data) {
	return axios.post(api.comment.dislikeIt, data)
}
//关注
export function  setNoticeIt(data) {
	return axios.post(api.user.noticeIt, data)
}
// 取消关注
export function setUnnoticeIt(data) {
	return axios.post(api.user.unoticeIt, data)
}
// 发布一级评论
export function createFirstComment(data) {
	return axios.post(api.comment.createComment,data)
}
//无被回复人的回复二级评论
export function createSecondComment(data){
	return axios.post(api.comment.replyComment,data)
}
//获取用户的关注列表
export function getMyNotices(uid,page,size){
	return axios.get(api.user.getMyNotices+"?uid="+uid+"&page="+page+"&size="+size);
}
//设置帖子的图片
export function setPhoto(articleId,data){
	return axios.post(api.post.setPhoto+"?articleId="+articleId,data,
		{//axios 默认是 Payload格式数据请求，但有时候后端接收参数要求必须是 Form Data 格式的，所以进行转换
 			ContentType: 'multipart/form-data',
 		});
}
//获取点赞过的帖子
export function getListLike(page,size){
	return axios.get(api.post.listLike+"?page="+page+"&size="+size);
}
//删除帖子
export function deletePost(data){
	return axios.post(api.post.deletePost,data);
} 