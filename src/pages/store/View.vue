<template>
  <div class="store-detail">
    <div class="form-container">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" label="门店图片">
          <a-upload
            :beforeUpload="beforeUpload"
            :fileList="fileList"
            :remove="handleRemove"
            listType="picture-card"
            v-decorator="[
              'fileList'
            ]"
          ></a-upload>
        </a-form-item>

        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="门店类型">
          <a-select
            disabled
            placeholder="请选择门店类型"
            v-decorator="[
                'catalog',
                {initialValue: formInitData.catalog},
                {rules: [{ required: true, message: 'Please select type!' }]}
              ]"
          >
            <a-select-option :key="item.id" :value="item.name" v-for="item in catalogs">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="门店名称">
          <a-input
            disabled
            placeholder="请输入门店名称"
            v-decorator="[
              'name',
              {initialValue: formInitData.name},
              {rules: [{ required: true, message: 'Please input address' }]}
            ]"
          />
        </a-form-item>

        <div class="ant-row ant-form-item">
          <div class="ant-col-5 ant-form-item-label">
            <label class="ant-form-item-required" for="address" title="区域选择">区域选择</label>
          </div>
          <div class="ant-col-15 ant-form-item-control-wrapper" style="margin-top: 3px;">
            <area-select :data="pcaa" :level="2" disabled type="text" v-model="areaSelected"></area-select>
          </div>
        </div>

        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="门店地址">
          <a-input
            disabled
            placeholder="请输入门店地址"
            v-decorator="[
              'address',
              {initialValue: formInitData.address},
              {rules: [{ required: true, message: 'Please input address' }]}
            ]"
          />
        </a-form-item>

        <div class="ant-row ant-form-item">
          <div class="ant-col-5 ant-form-item-label">
            <label class="ant-form-item-required" for="lon">地图定位</label>
          </div>
          <div class="ant-col-15 ant-form-item-control-wrapper" style="margin-top: 3px;">
            <span style="margin-right: 3px;" v-if="mapResult.lat != 0">{{mapResult.lat + ',' + mapResult.lng}}</span>
            <a-button @click="handleMapShow(true)">查看地图位置</a-button>
            <Map :show="mapVisible" @MapSendData="handlerMapSendData" @MapShow="handleMapShow"></Map>
          </div>
        </div>

        <a-row>
          <a-col :span="5" class="ant-form-item-label">
            <label class for="description" title="本店介绍">本店介绍</label>
          </a-col>
          <a-col :span="17">
            <editor :catchData="catchData" :content="editorContent"></editor>
          </a-col>
        </a-row>

        <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="配套设施">
          <a-checkbox-group :options="gymServicesOptions" disabled v-model="gymServicesCheckedList"></a-checkbox-group>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button @click="back" class="ml-16" icon="left" type="primary">返回主页面</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { find } from 'lodash'
import 'vue-area-linkage/dist/index.css' // v2 or higher
import { AreaCascader, AreaSelect } from 'vue-area-linkage'
import { pca, pcaa } from 'area-data'
import Editor from './components/Editor'
import Map from './components/Map'
import GymServicesOptions from './components/gymServices.js'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
}

const gymServicesOptions = GymServicesOptions

export default {
  name: 'store-edit',

  components: {
    AreaCascader,
    AreaSelect,
    Editor,
    Map
  },

  data() {
    return {
      id: 0,

      currentStep: 0, //步骤
      form: this.$form.createForm(this),
      formItemLayout,

      // form Data
      formInitData: {
        name: '',
        catalog: '',
        address: '',
        description: ''
      },

      // imgs upload
      fileList: [],
      // gymServices
      gymServicesCheckedList: [],
      catalogs: [],
      // area
      pca,
      pcaa,
      areaSelected: ['福建省', '厦门市', '思明区'],

      // editor
      editorContent: '',
      // map
      mapVisible: false,
      mapResult: {
        lat: 0,
        lng: 0
      }
    }
  },

  computed: {
    gymServicesOptions() {
      return gymServicesOptions.map(item => {
        return item.name
      })
    }
  },

  created() {
    this.getCatalog().then(res => {
      this.catalogs = res.data
    })
  },

  methods: {
    getCatalog() {
      return this.$http.get('/dictionaries?code=STORE_CATALOG', {})
    },
    // img upload
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },

    beforeUpload(file) {
      const _file = file
      this.handleUpload(file).then(res => {
        if (res.status === 200) {
          _file.url = res.data.uri
          _file.file_store_id = res.data.file_store_id
          this.fileList.unshift(_file)
        }
      })
      return false
    },

    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.handleUpdate(values).then(() => {
            this.$message.success('更新门店成功')
            this.back()
          })
        }
      })
    },

    finished(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.status = 'UP'
          this.handleUpdate(values).then(() => {
            this.$message.success('更新门店成功')
            this.back()
          })
        }
      })
    },

    handleUpload(imgData) {
      const formData = new FormData()
      formData.append('img', imgData)
      return this.$http.post('/files', formData)
    },

    // 更新门店
    handleUpdate(values) {
      function _imgs(imgs) {
        let _images = []
        imgs.map(item => {
          _images.push({
            id: item.uid,
            file_store_id: item.file_store_id,
            uri: item.url
          })
        })
        return _images
      }

      function _services(services, originServers) {
        let _gets = []
        services.map(item => {
          originServers.filter(jitem => {
            if (jitem.name === item) {
              _gets.push(jitem)
            }
          })
        })
        return _gets
      }

      let postData = {
        id: this.id,
        name: values.name,
        description: values.description,
        catalog: values.catalog,
        province: this.areaSelected[0],
        city: this.areaSelected[1],
        area: this.areaSelected[2],
        address: values.address,
        lon: '118.1803400000',
        lat: '24.4860100000'
      }
      postData.imgs = _imgs(this.fileList)

      const storeImgTarget = postData.imgs.shift()
      postData.img = storeImgTarget.uri
      postData.services = _services(this.gymServicesCheckedList, gymServicesOptions)

      if (values.status) {
        postData.status = values.status
      }

      return this.$http.put('/stores', postData)
    },

    prev() {
      this.currentStep = 0
    },

    next() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.currentStep = 1
        }
      })
    },

    back() {
      this.$router.push({
        name: 'store'
      })
    },

    getDetail() {
      return this.$http.get(`/stores/${this.id}`)
    },

    initIMGFile(data) {
      let _tmp = []

      let _tmp2 = data.gym_imgs.map(item => {
        return {
          uid: item.id,
          name: item.uri,
          status: 'done',
          url: item.uri,
          file_store_id: item.file_store_id
        }
      })

      return _tmp.concat(_tmp2)
    },

    catchData(param) {
      this.formInitData.description = param
    },

    handleMapShow(param) {
      this.mapVisible = param
    },

    handlerMapSendData(param) {
      this.mapResult = param
    }
  },

  mounted() {
    this.id = this.$route.params.id
    this.getDetail().then(res => {
      const data = res.data
      this.formInitData = {
        name: data.name,
        catalog: data.catalog,
        address: data.address,
        description: data.description
      }
      this.editorContent = data.description

      this.gymServicesCheckedList = data.gym_services.map(item => {
        return item.name
      })

      this.areaSelected = [data.province, data.city, data.area]
      this.fileList = this.initIMGFile(data)

      //map
      this.mapResult = {
        lat: data.lat,
        lng: data.lon
      }
    })
  }
}
</script>

<style lang="stylus">
.store-detail
  padding 20px 50px

  .form-container
    padding-top 70px

  .ml-16
    margin-left 16px

  .area-select-wrap
    .area-select
      margin-left 0

    .area-select .area-selected-trigger
      padding-top 6px
</style>