//vuex
import Vue from "vue";
import Vuex from "vuex";
import FolloweeModel from "./FolloweeModel";
import UserModel from "./UserModel.js"
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    Followee: FolloweeModel,
    User:UserModel
  },
});
export default store;
