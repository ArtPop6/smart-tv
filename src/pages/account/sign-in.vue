<template>
  <div>
    <div class="container">
      <div class="content">
        <div class="top">
          <div class="header">
            <img
              alt="logo"
              class="logo"
              src="static/crm.png"
            />
            <span class="title">{{systemName}}</span>
          </div>
          <div class="desc">{{slogan}}</div>
        </div>

        <div class="login">
          <a-form
            @submit="onSubmit"
            :autoFormCreate="(form) => this.form = form"
          >
            <a-tabs
              size="large"
              :tabBarStyle="{textAlign: 'center'}"
              style="padding: 0 2px;"
            >
              <a-tab-pane
                tab="账户密码登录"
                key="1"
              >
                <a-alert
                  type="error"
                  :closable="true"
                  v-show="error"
                  :message="error"
                  showIcon
                  style="margin-bottom: 24px;"
                />
                <a-form-item
                  fieldDecoratorId="name"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入账户名', whitespace: true}]}"
                >
                  <a-input
                    size="large"
                    placeholder="请输入您的账号"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item
                  fieldDecoratorId="password"
                  :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码', whitespace: true}]}"
                >
                  <a-input
                    size="large"
                    placeholder="请输入您的密码"
                    type="password"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                    />
                  </a-input>
                </a-form-item>
              </a-tab-pane>
              <a-tab-pane
                tab="手机号登录"
                key="2"
                v-if="false"
              >
                <a-form-item>
                  <a-input
                    size="large"
                    placeholder="mobile number"
                  >
                    <a-icon
                      slot="prefix"
                      type="mobile"
                    />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-row
                    :gutter="8"
                    style="margin: 0 -4px"
                  >
                    <a-col :span="16">
                      <a-input
                        size="large"
                        placeholder="captcha"
                      >
                        <a-icon
                          slot="prefix"
                          type="mail"
                        />
                      </a-input>
                    </a-col>
                    <a-col
                      :span="8"
                      style="padding-left: 4px"
                    >
                      <a-button
                        style="width: 100%"
                        class="captcha-button"
                        size="large"
                      >获取验证码</a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
              </a-tab-pane>
            </a-tabs>
            <div v-if="false">
              <a-checkbox :checked="true">自动登录</a-checkbox>
              <a style="float: right">忘记密码</a>
            </div>
            <a-form-item>
              <a-button
                :loading="logging"
                style="width: 100%;margin-top: 24px"
                size="large"
                htmlType="submit"
                type="primary"
              >登录</a-button>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <global-footer
        :link-list="linkList"
        :copyright="copyright"
      />
    </div>
  </div>
</template>

<script>
import GlobalFooter from '../../layouts/GlobalFooter';

export default {
  name: 'Login',
  components: { GlobalFooter },
  data () {
    return {
      uid: '',
      pwd: '',
      logging: false,
      error: '',
      slogan: '悦动悦轻松',
    };
  },

  computed: {
    systemName () {
      return this.$store.state.settings.systemName;
    },
    linkList () {
      return this.$store.state.settings.footerLinks;
    },
    copyright () {
      return this.$store.state.settings.copyright;
    },
  },
  methods: {
    onSubmit (e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.logging = true;
          this.$http.post('/auth/login', {
            user_name: values.name,
            password: values.password,
          }).then((res) => {
            localStorage.setItem('access_token', res.data.access_token);
            this.logging = false;
            if (res.status === 200) {
              this.$router.push('/dashboard');
              this.$message.success('Login Success', 3);
            } else {
              this.error = 'login fail';
            }
          }, (err) => {
            this.logging = false;
          });
        }
      });
    },

    onLogout () {
      this.$http.post('/auth/logout').then(() => {
        this.$message.success('Logout Success', 3);
        this.$router.push('/sign-in');
      });
    },

  },
};
</script>

<style scoped lang='stylus'>
.login-panel {
  width: 600px;
  margin: 100px auto 0;
}

.primary--text {
  color: #1976D2 !important;
}

.btn {
  &.primary {
    background-color: #1867c0 !important;
  }

  &.btn--disabled {
    background-color: #aaa !important;
  }
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg') no-repeat center 110px;
  background-size: 100%;

  .content {
    padding: 32px 0;
    flex: 1;

    @media (min-width: 768px) {
      padding: 112px 0 24px;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;

        a {
          text-decoration: none;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }

        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, 0.85);
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }

      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .login {
      width: 368px;
      margin: 0 auto;

      @media screen and (max-width: 576px) {
        width: 95%;
      }

      @media screen and (max-width: 320px) {
        .captcha-button {
          font-size: 14px;
        }
      }

      .icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
