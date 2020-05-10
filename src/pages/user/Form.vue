<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="客户姓名">
      <a-input
        placeholder="请输入客户姓名"
        v-decorator="[
          'name',
          {rules: [{ required: true, message: '请输入客户姓名' }]}
        ]"
      />
    </a-form-item>

    <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="客户性别">
      <a-select
        placeholder="请选择"
        v-decorator="[
          'sex',
          {rules: [{ required: true, message: '请选择' }]}
        ]"
      >
        <a-select-option value="male">男士</a-select-option>
        <a-select-option value="female">女士</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="手机号码">
      <a-input
        @change="handlePhoneNumber"
        maxlength="11"
        placeholder="请输入手机号码"
        v-decorator="[
          'phone',
          {
            rules: [
              { required: true, message: '请输入手机号码' },
            ]
          }
        ]"
      />
    </a-form-item>

    <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="验证码">
      <a-row :gutter="8">
        <a-col :span="12">
          <a-input
            @change="handleCode"
            placeholder="请输入验证码"
            v-decorator="[
              'code',
              {rules: [{ required: true, message: '请输入验证码' }]}
            ]"
          />
        </a-col>
        <a-col :span="12" v-if="authority.authority[30] ? authority.authority[30].enable : false">
          <a-button @click="handleGetCode">发送验证码</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <div class="btn-group">
        <a-button
          html-type="submit"
          type="primary"
          v-if="authority.authority[31] ? authority.authority[31].enable : false"
        >保存</a-button>

        <a-button @click="cancel">取消</a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapState } from 'vuex'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      // img upload
      loading: false,
      imageUrl: '',
      // formData
      phone: null,
      code: null
    }
  },

  computed: {
    ...mapState(['authority'])
  },

  props: {
    action: {
      type: String,
      default: 'add'
    }
  },

  methods: {
    handleSuccess(postData) {
      if (this.action === 'add') {
        this.$http.post('/addUser', postData).then(res => {
          this.$message.success('新增用户成功')
        })
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      const self = this
      this.form.validateFields((err, values) => {
        if (!err) {
          self.handleCheckCode().then(
            () => {
              self.$message.success('短信验证成功')
              self.handleSuccess(values)
            },
            () => {
              self.$message.error('短信验证失败')
            }
          )
        }
      })
    },
    handleChange(info) {
      getBase64(info.file.originFileObj, imageUrl => {
        this.imageUrl = imageUrl
        this.loading = false
      })
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },

    handlePhoneNumber(e) {
      this.phone = e.currentTarget.value
    },

    handleCode(e) {
      this.code = e.currentTarget.value
    },

    handleGetCode() {
      if (!/^\d{11}$/.test(this.phone)) {
        this.$message.error('手机格式不正确')
        return false
      }
      const postData = {
        phone: this.phone
      }
      this.$http.get(`/detections?phone=${postData.phone}`, postData).then(() => {
        this.$message.success('短信已发送')
      })
      return true
    },
    handleCheckCode() {
      const postData = {
        phone: this.phone,
        code: this.code
      }
      return this.$http.post('/detections', postData)
    },

    cancel() {
      window.history.go(-1)
    }
  }
}
</script>

<style lang="stylus">
.btn-group
  button
    margin-right 10px

.avatar-uploader > .ant-upload
  width 128px
  height 128px

.ant-upload-select-picture-card i
  font-size 32px
  color #999

.ant-upload-select-picture-card .ant-upload-text
  margin-top 8px
  color #666
</style>

