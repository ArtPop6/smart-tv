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
          'avatar',
          {rules: [{ required: true, message: '请上传客户头像' }]}
        ]"
        name="avatar"
        listType="picture-card"
        class="avatar-uploader"
        :showUploadList="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        :beforeUpload="beforeUpload"
        @change="handleChange"
      >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
        <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
    </a-form-item>
    
    <a-form-item
      label="客户姓名"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-input
        v-decorator="[
          'name',
          {rules: [{ required: true, message: '请输入客户姓名' }]}
        ]"
        placeholder="请输入客户姓名"
      />
    </a-form-item>

    <a-form-item
      label="客户性别"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-select
        v-decorator="[
          'sex',
          {rules: [{ required: true, message: '请选择' }]}
        ]"
        placeholder="请选择"
      >
        <a-select-option value="male">
          男士
        </a-select-option>
        <a-select-option value="female">
          女士
        </a-select-option>
      </a-select>
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
      label="关联卡片"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-select
        v-decorator="[
          'card',
          {rules: [{ required: true, message: '请选择关联卡片' }]}
        ]"
        placeholder="请选择关联卡片"
      >
        <a-select-option value="male">
          male
        </a-select-option>
        <a-select-option value="female">
          female
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      label="有效期"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 12 }"
    >
      <a-select
        v-decorator="[
          'indate',
          {rules: [{ required: true, message: '请选择有效期' }]}
        ]"
        placeholder="请选择有效期"
      >
        <a-select-option value="male">
          male
        </a-select-option>
        <a-select-option value="female">
          female
        </a-select-option>
      </a-select>
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
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      // img upload
      loading: false,
      imageUrl: '',
      phone: null,
      code: null,
    };
  },

  props: {
    action: {
      type: String,
      default: 'add',
    },
  },

  methods: {
    handleSuccess(postData) {
      if (this.action === 'add') {
        this.$http.post('/addUser', postData).then((res) => {
          this.$message.success('新增用户成功');
          console.log(res);
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      const self = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          // self.handleCheckCode().then(() => {
          //   self.$message.success('短信验证成功');
          //   self.handleSuccess(values);
          // });
        }
      });
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return false;
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrl = imageUrl;
          this.loading = false;
        });
      }
      return false;
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
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

