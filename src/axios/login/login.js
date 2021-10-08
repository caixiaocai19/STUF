import api from '../../API/interfaceAPIs/hxr/api.js';
import axios from "../axios.interceptors.js";

//验证登录，获取token
export function getLogin(data){
	return axios.post(api.post.postLogin, data)
}

//验证校园网账号密码
export function initPassword(data){
	return axios.post(api.post.postInitpwd,data)
}

//修改密码
export function postChangePwd(data){
	return axios.post(api.post.changePwd,data)
}

export function getUser(){
	return axios.get(api.get.getUser)
}