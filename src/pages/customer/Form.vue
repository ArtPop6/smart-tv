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
                    style="float: left;"
            >
                <img
                        v-if="imageUrl"
                        :src="imageUrl"
                        alt="avatar"
                        class="img-size"
                />
                <a-button>
                    <a-icon type='plus'/>
                    上传头像
                </a-button>
            </a-upload>

            <a-button @click="showModal" style="float: left; margin-top: 4px; margin-left: 10px;">
                <a-icon type="camera"/>
                摄像头拍照
            </a-button>

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

        <!-- 暂时屏蔽验证码 -->
        <!-- <a-form-item
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
        </a-form-item> -->

        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <div class="btn-group">
                <a-button
                        type="primary"
                        html-type="submit"
                >
                    保存
                </a-button>

                <a-button
                        @click="cancel"
                >
                    取消
                </a-button>
            </div>
        </a-form-item>

        <a-modal
                title="摄像头拍照"
                width="800"
                style="top: 60px;"
                :visible="visible"
                @ok="handleOk"
                @cancel="handleCancel"
        >
            <Capture/>
        </a-modal>
    </a-form>
</template>

<script>
  import Capture from "src/components/capture";

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  export default {
    components: {
      Capture
    },

    data() {
      return {
        form: this.$form.createForm(this),
        // formData
        phone: null,
        code: null,

        // img upload
        imageUrl: "",
        fileList: [],

        // modal
        visible: false
      };
    },

    props: {
      action: {
        type: String,
        default: "add"
      }
    },

    methods: {
      handleReset() {
        this.form.resetFields();
      },
      handleAvastarChange(info) {
        getBase64(info.file, imageUrl => {
          this.imageUrl = imageUrl;
        });
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
      next() {
        const self = this;
        self.$success({
          title: "新增用户成功",
          onOk() {
            self.handleReset();
          }
        });
      },
      handleUpload() {
        const {fileList, phone, code} = this;
        const formData = new FormData();

        formData.append("phone", phone);
        formData.append("img", fileList[0]);
        formData.append("code", code);

        // 人像识别
        return this.$http.post("/entrances/member", formData);
        // 图像上传
        // return this.$http.post('/files', formData);
      },
      // 以上是图片上传
      handleSuccess() {
        if (this.action === "add") {
          this.handleUpload().then(() => {
            this.$message.success("新增用户成功");
            this.next();
          });
        }
      },
      handleSubmit(e) {
        e.preventDefault();
        const self = this;
        this.form.validateFields((err, values) => {
          if (!err) {
            // 屏蔽原接口 需要验证手机号与验证码
            // self.handleCheckCode().then(() => {
            //   self.$message.success("短信验证成功");
            //   self.handleSuccess(values);
            // });
            // 提交数据新增
            self.handleSuccess(values);
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
          this.$message.error("手机格式不正确");
          return false;
        }
        const postData = {
          phone: this.phone
        };
        this.$http
        .get(`/detections?phone=${postData.phone}`, postData)
        .then(() => {
          this.$message.success("短信已发送");
        });
        return true;
      },
      handleCheckCode() {
        const postData = {
          phone: this.phone,
          code: this.code
        };
        return this.$http.post("/detections", postData);
      },
      // 模态框更新
      showModal() {
        this.visible = true;
      },

      handleOk() {
        setTimeout(() => {
          this.visible = false;
        }, 2000);
      },

      handleCancel() {
        this.visible = false;
      },

      cancel() {
        window.history.go(-1);
      },
    },
  };
</script>

<style lang="stylus">
    .btn-group {
        button {
            margin-right: 10px;
        }
    }

    .img-size {
        margin-bottom: 10px;
        width: 200px;
        height: auto;
        display: block;
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

