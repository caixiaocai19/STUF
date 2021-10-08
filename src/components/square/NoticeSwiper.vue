<!--常看关注-->
<template>
  <view class="notice_swiper" v-if="$store.state.Followee.FolloweeData.length !== 0">
    <view class="notice_titile">
      {{ isLogin ? "常看的关注" : "尚未登陆" }}
    </view>
    <view class="notice_list" v-if="isLogin">
      <view
        class="notice_item"
        v-for="(item, index) in $store.state.Followee.FolloweeData"
        @click.stop="gotToFolloweePro(item)"
      >
        <view class="notice_photo">
          <image :src="item.photoPath"></image>
        </view>
        <view class="notice_name"> {{ item.nickname }} </view>
        <view class="notice_sign"> {{ item.motto }} </view>
      </view>
    </view>
    <view class="unlogin" v-else>
      <image src="../../UI/unlogin.gif" mode="heightFix"></image>
    </view>
  </view>
</template>

<script>
import { getMyNotices, getUserMes } from "../../axios/square/square";
import {
  FOLLOWPERSON,
  CANCELFOLLOWPERSON,
  CANCELLOGIN,
} from "../../pages/constant";
export default {
  name: "NoticeSwiper",
  data() {
    return {
      maxPageNum: 1, //数据库中最大的页数
      page: 1, //当前的页数
      follows: [], //关注的人的数据
      uid: 1, //当前用户的id
      loadSize: 20, //一次加载的最大数量
      isLogin: false, //判断是否已经登陆了--一开始默认为没有
    };
  },
  methods: {
    //获取所关注的所有人
    getMyNotices() {
      getMyNotices(this.uid, this.page, this.loadSize).then((res) => {
        this.maxPageNum = res.data.data.maxPageNum;
        for (const item of res.data.data.detail) {
          this.follows.push(item.userInfo);
        }
        //vuex全局管理关注的人
        this.$store.commit("Followee/setFolloweeData", this.follows);
      });
    },
    //跳转到我关注的人的页面
    gotToFolloweePro(profile) {
      let data = {
        src: "关注",
        userInfo: profile,
      };
      uni.navigateTo({
        url:
          "../../level3/profile/followeeProfile?profile=" +
          JSON.stringify(data),
      });
    },
  },
  mounted() {
    //获取当前登陆的用户信息----（有则展示没有直接取消展示）
    let _this = this;
    new Promise((resolve, reject) => {
      uni.getStorage({
        key: "userInfo",
        success: (data) => {
          _this.uid = data.data.uid;
          _this.isLogin = true;
          resolve(1);
        },
        fail: (err) => {
          console.log("还没有登陆呢");
          reject(1);
        },
      });
    })
      .then((res) => {
        //获取关注的列表
        this.getMyNotices();
        //绑定自定义事件 监听是否有关注列表的改变
        this.$bus.$on(FOLLOWPERSON, (uid) => {
          //同步关注的动作
          getUserMes(uid).then(
            (res) => {
              this.follows.push(res.data.data);
            },
            (err) => {
              uni.showToast({
                title: "关注信息同步出错",
              });
            }
          );
        });
        this.$bus.$on(CANCELFOLLOWPERSON, (uid) => {
          //同步取消关注的动作
          this.follows = this.follows.filter((person) => {
            return person.uid != uid;
          });
          console.log("这里是取消关注", uid);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //注销登陆
    this.$bus.$on(CANCELLOGIN, () => {
      this.isLogin = false;
    });
  },
};
</script>
<style scoped>
/* 还未登陆的图片展示 */
.unlogin {
  width: 100%;
  height: 250rpx;
  overflow: hidden;
  background-color: #ffffff;
  text-align: center;
  line-height: 200rpx;
}
.unlogin image {
  /* width: 100%; */
  /* height: 100%; */
  /* height: 200rpx; */
  height: 250rpx;
}
.notice_swiper {
  height: 172px;
  background-color: #fdf7ef;
}
.notice_titile {
  padding-left: 16px;
  line-height: 28px;
  font-size: 12px;
  color: #464545;
}
.notice_list {
  display: flex;
  flex-wrap: nowrap;
  overflow-y: scroll;
  justify-content: flex-start;
}
.notice_item {
  box-sizing: border-box;
  display: flex;
  margin-bottom: 7px;
  margin-right: 16px;
  height: 129px;
  width: 107px;
  border-radius: 10px;
  background-color: #fff;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.notice_photo image {
  width: 60px;
  height: 60px;
  border-radius: 60px;
}
.notice_name {
  font-size: 15px;
  font-weight: 600;
}
.notice_sign {
  font-size: 10px;
  font-weight: 400;
}
</style>