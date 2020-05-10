<template>
  <a-modal
    :confirmLoading="confirmLoading"
    :maskClosable="closable"
    @cancel="onCancel"
    @ok="handleOk"
    cancelText="取消"
    okText="提交"
    title="请企业微信管理员，登陆企业微信后台并复制出以下内容"
    v-model="visible"
    width="700px"
    wrapClassName="wechat-import"
  >
    <a-form :form="form">
      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" label="企业微信ID">
        <a-input placeholder="请输入企业微信ID" v-decorator="['wx_corp_id', configCrop]" />
      </a-form-item>
      <div class="url-tip">
        <a
          href="https://work.weixin.qq.com/wework_admin/frame#profile"
        >点此获取 https://work.weixin.qq.com/wework_admin/frame#profile</a>
      </div>

      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" label="企业通讯录ID">
        <a-input placeholder="请输入企业通讯录ID" v-decorator="['agent_id', configAgent]" />
      </a-form-item>
      <div class="url-tip">
        <a href="https://work.weixin.qq.com/wework_admin/frame#profile">
          点此获取
          https://work.weixin.qq.com/wework_admin/frame#apps/contactsApi
        </a>
      </div>

      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }" label="企业微信secret">
        <a-input placeholder="请输入企业微信secret" v-decorator="['secret', configSecret]" />
      </a-form-item>
      <div class="tip">
        <span>绑定后，将自动导入企业微信通讯录</span>
      </div>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'wechatWork',
  props: {
    importVisible: Boolean
  },
  data() {
    return {
      success: false,
      visible: false,
      closable: false,
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      configCrop: {
        initialValue: '',
        rules: [{ required: true, message: '请输入企业微信ID!' }]
      },
      configAgent: {
        initialValue: '',
        rules: [{ required: true, message: '请输入企业通讯录ID!' }]
      },
      configSecret: {
        initialValue: '',
        rules: [{ required: true, message: '请输入企业微信secret' }]
      },
      confirmLoading: false,
      disableButton: false,
      treeData: []
    }
  },

  watch: {
    importVisible(newValue) {
      this.visible = newValue
    }
  },
  methods: {
    onCancel() {
      this.visible = false
      this.$emit('wechatVisible', this.visible, this.success)
      this.form.setFieldsValue({
        wx_corp_id: '',
        agent_id: '',
        secret: ''
      })
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          this.$http
            .post('./staffs/wework', values)
            .then(res => {
              this.$message.success('企业微信导入成功')
              this.confirmLoading = false
              this.form.setFieldsValue({
                wx_corp_id: '',
                agent_id: '',
                secret: ''
              })
              this.visible = false
              this.success = true
              this.disableButton = true
              this.getDepartmentTree()
              this.$emit('wechatVisible', this.visible, this.success)
              this.$emit('disableButton', this.disableButton)
            })
            .catch(err => {
              this.confirmLoading = false
              this.visible = true
              this.$message.error(err.response.data.err_msg)
            })
        }
      })
    },
    getDepartmentTree() {
      const url = './departments'
      this.$http
        .get(url)
        .then(res => {
          this.treeData = res.data
          this.$emit('weTreeData', this.treeData)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="stylus">
.wechat-import
  .ant-modal-content
    .ant-modal-body
      padding 45px 0 16px 45px

      .ant-form-item
        margin-bottom 5px

        .ant-form-item-label
          text-align center

      .url-tip
        margin-left 23px
        margin-bottom 30px

      .tip
        margin-top 30px
        text-align center
        font-size 16px
        color orange
</style>
