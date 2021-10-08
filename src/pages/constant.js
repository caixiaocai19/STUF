//通过事件总线发布本地帖子 减少卡顿(message.vue--->square.vue)
export const POSTINFO="postInfo";
//设置帖子的标签(label.vue-->message.vue)
export const SETLABELS="setLabels";
//修改了用户标签(comment.vue-->profile.vue)
export const HADCHANGELABELS="hadChangeLabels";
//点击原帖子发布一级评论(postDetail.vue-->PostBar.vue)
export const CREATEFIRSTCOMMENT="createFirstComment";
//同步点赞（postDetail.vue-->square.vue）
export const SYCNLIKE = "sycnlike";
//取消关注（FolloweeItem.vue-->NoticSwiper.vue）
//        (MyfansItem.vue-->NoticSwiper.vue)
//取消关注（FolloweeItem.vue-->square.vue）
//        (MyfansItem.vue-->square.vue)
export const CANCELFOLLOWPERSON = "cancelFollowPerson"
//关注（FolloweeItem.vue-->NoticeSwiper.vue）
//关注（FolloweeItem.vue-->square.vue）
export const FOLLOWPERSON = "followPerson"
//回复二级评论（PostComment.vue-->PostBar.vue）
export const REPLYPERSON = "replyPerson"
//回复一级评论产生二级评论（PostComment.vue-->PostBar.vue）
export const REPLYFIRSTCOMMENT = "replyFirstComment"
//刷新二级评论（PostBar.vue-->PostComment.vue）
export const REFLASHSECONDCOMMENT="reflashSecondComment";
//修改个人信息（userhead.vue-->edit.vue）->profileHeader.vue
//修改个人信息（username.vue-->edit.vue）->profileHeader.vue
//修改个人信息（usersign.vue-->edit.vue）->profileHeader.vue
export const CHANGEUSERMES = "changeUserMes"
//注销当前用户(edit.vue-->profile.vue&&NoticeSwiper.vue)
export const CANCELLOGIN ="cancelLogin"