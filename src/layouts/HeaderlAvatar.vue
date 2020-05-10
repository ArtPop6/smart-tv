<template>
  <a-dropdown style="display: inline-block; height: 100%; vertical-align: initial" >
    <span style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="currUser.img_url"/>
      <span>{{currUser.nick_name}}</span>
    </span>
    <a-menu style="width: 150px" slot="overlay">
      <a-menu-item>
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon type="poweroff"/>
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  name: 'HeaderAvatar',
  computed: {
    currUser() {
      return this.$store.state.session.user;
    },
  },
  methods: {
    logout() {
      this.$http.post('/auth/logout').then(() => {
        this.$message.success('Logout Success', 3);
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style lang="stylus" scoped>
  .avatar{
    margin: 15px 4px 20px 0;
    color: #1890ff;
    background: rgba(206, 202, 202, 0.85);
    vertical-align: middle;
  }
</style>
