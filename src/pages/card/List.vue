<template>
  <div class="card-list">
    <a-form
      layout="inline"
      class="tool"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          v-decorator="[
          'name',
          {rules: [{ required: true, message: '请输入卡片名称' }]}
        ]"
          placeholder="卡片名称"
        >
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-select style="width: 120px" defaultValue='' @change="handleCardChange">
          <a-select-option value="">卡片种类</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-select style="width: 120px" defaultValue='' @change="handleStoreChange">
          <a-select-option value="">所属门店</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
        >
         搜索
        </a-button>
      </a-form-item>
    </a-form>

    <div class="btn-group">
      <a-button
      >
        新建卡片
      </a-button>
    </div>

    <div class="table-container">
      <a-table :columns="columns" :dataSource="data">
        <a slot="imgSlot" class="card_img" slot-scope="img_url" href="javascript:;">
          <img :src="img_url" :alt="img_url">
        </a>

        <a slot="nameSlot" slot-scope="name" href="javascript:;">
          {{name}}
        </a>

        <span slot="action" slot-scope="text, record">
          <a href="javascript:;">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;">下架</a>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [{
  title: '会员卡',
  dataIndex: 'img_url',
  key: 'img_url',
  scopedSlots: { customRender: 'imgSlot' },
}, {
  title: '名称',
  dataIndex: 'name',
  key: 'name',
  scopedSlots: { customRender: 'nameSlot' },
}, {
  title: '卡种',
  dataIndex: 'type',
  key: 'type',
}, {
  title: '门店',
  dataIndex: 'stores',
  key: 'stores',
  filters: [{
    text: '枋湖顶尚店',
    value: '枋湖顶尚店',
  }, {
    text: '万科泊寓店',
    value: '万科泊寓店',
  }, {
    text: '龙湖冠寓店',
    value: '龙湖冠寓店',
  }],
  onFilter: (value, record) => record.stores.indexOf(value) === 0,
}, {
  title: '可转赠',
  key: 'gift',
  dataIndex: 'gift',
}, {
  title: '库存',
  key: 'stock',
  dataIndex: 'stock',
}, {
  title: '本月销量',
  key: 'buy',
  dataIndex: 'buy',
}, {
  title: '状态',
  key: 'status',
  dataIndex: 'status',
}, {
  title: '创建时间',
  key: 'time',
  dataIndex: 'time',
}, {
  title: '操作',
  key: 'action',
  scopedSlots: { customRender: 'action' },
}];

const data = [];

export default {
  name: 'card-list',
  data() {
    return {
      form: this.$form.createForm(this),
      data,
      columns,

      storeId: 1,
    };
  },
  methods: {
    handleCardChange(value) {
      console.log(`selected ${value}`);
    },

    handleStoreChange(value) {
      console.log(`selected ${value}`);
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },

    formatData(items) {
      items.map((item) => {
        item.gift = item.gift ? '可转赠' : '不可转赠';
      })
      return items;
    },

    getList() {
      this.$http.get(`/stores/${this.storeId}/cards`, {}).then((res) => {
        this.data = this.formatData(res.data);
      });
    },
  },

  mounted() {
    this.getList();
  },
};
</script>

<style lang="stylus">
.card-list {
  padding: 15px;

  .tool {}

  .btn-group {
    padding-top: 10px;
  }

  .table-container {
    padding-top: 10px;
  }

  .card_img {
    width: 100px;
    height: 70px;
    display block
    img {
      width: 100%
      height 100%
    }
  }
}
</style>