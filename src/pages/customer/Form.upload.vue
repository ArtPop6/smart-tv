<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
  >
    <a-form-item
      label="客户头像"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-upload
        v-decorator="[
          'avastar',
          {rules: [{ required: true, message: '请上传客户头像' }]}
        ]"
        :fileList="fileList"
        :remove="handleRemove"
        :beforeUpload="beforeUpload"
        @change="handleAvastarChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <a-button v-if="!imageUrl">
          <a-icon :type="loading ? 'loading' : 'plus'" /> 上传头像
        </a-button>
      </a-upload>

      <a @click="handleUpload">button</a>
    </a-form-item>

    <a-form-item
      label="手机号码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'phone',
          {
            rules: [
              { required: true, message: '请输入手机号码' },
            ]
          }
        ]"
        placeholder="请输入手机号码"
        maxLength="11"
        @change="handlePhoneNumber"
      />
    </a-form-item>

    <a-form-item
      label="验证码"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-row :gutter="8">
        <a-col :span="12">
          <a-input
            v-decorator="[
              'code',
              {rules: [{ required: true, message: '请输入验证码' }]}
            ]"
            placeholder="请输入验证码"
            @change="handleCode"
          />
        </a-col>
        <a-col :span="12">
          <a-button @click="handleGetCode">发送验证码</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item
      :wrapper-col="{ span: 12, offset: 5 }"
    >
      <div class="btn-group">
        <a-button
          type="primary"
          html-type="submit"
        >
          保存
        </a-button>

        <a-button>
          取消
        </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      // formData
      phone: null,
      code: null,

      // img upload
      imageUrl: '',
      loading: false,
      fileList: [],
    };
  },

  props: {
    action: {
      type: String,
      default: 'add',
    },
  },

  methods: {
    handleAvastarChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    },
    handleUpload() {
      const { fileList, phone, code } = this;
      const formData = new FormData();

      formData.append('phone', phone);
      formData.append('img', fileList[0]);
      formData.append('code', code);

      // return this.$http.post('/entrances/member', formData);
      return this.$http.post('/files', formData);
    },
    // 以上是图片上传
    handleSuccess() {
      if (this.action === 'add') {
        this.handleUpload().then(() => {
          this.$message.success('新增用户成功');
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      const self = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          self.handleCheckCode().then(() => {
            self.$message.success('短信验证成功');
            self.handleSuccess(values);
          });
        }
      });
    },

    handlePhoneNumber(e) {
      this.phone = e.currentTarget.value;
    },

    handleCode(e) {
      this.code = e.currentTarget.value;
    },

    handleGetCode() {
      if (!/^\d{11}$/.test(this.phone)) {
        this.$message.error('手机格式不正确');
        return false;
      }
      const postData = {
        phone: this.phone,
      };
      this.$http.get(`/detections?phone=${postData.phone}`, postData).then(() => {
        this.$message.success('短信已发送');
      });
      return true;
    },
    handleCheckCode() {
      const postData = {
        phone: this.phone,
        code: this.code,
      };
      return this.$http.post('/detections', postData);
    },
  },
};
</script>

<style lang="stylus">
.btn-group {
  button {
    margin-right 10px
  }
}

.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>

