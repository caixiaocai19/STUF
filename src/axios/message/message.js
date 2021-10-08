import api from '../../API/interfaceAPIs/xjq/api.js';
import axios from "../axios.interceptors.js";
//获取用户昵称、签名
//获取一个用户的详细信息
export function getUserMes(uid) {//uid——edit页面
	return axios.get(api.user.getUserMeg + "?uid=" + uid)

}
//上传用户昵称、签名
export function postUserUpdate(data){
	return axios.post(api.post.getUserUpdate, data)
}
//修改密码
export function postPswUpdate(data){
	return axios.post(api.post.getPswUpdate, data)
}
//修改头像
export function postUserPhoto(data){
	return axios.post(api.user.setUserPhoto, data,
	{
		ContentType:'multipart/form-data',
	});
}

//发布帖子文字内容
export function postArticle(data){
	return axios.post(api.post.createPost,data)
}
//发布帖子图片内容
export function setPhoto(articleId,data){
	return axios.post(api.post.setPhoto+"?articleId="+articleId , data,
	{
		ContentType:'multipart/form-data',
	});
}

//获取用户标签列表
export function getUserLabels(uid,page,size){//uid——label页面
	return axios.get(api.user.getLabelList+"?uid="+uid+"&page="+page+"&size="+size)
}
//获取所有标签
export function getLabels(typeId,size,page){
	return axios.get(api.user.getList+"?typeId="+typeId+"&size="+size+"&page="+page )
}
//添加标签
export function getAddLabel(data){
	return axios.post(api.user.addLabel,data)
}
//删除标签
export function getDeleteLabel(data){
	return axios.post(api.user.deleteLabel,data)
}