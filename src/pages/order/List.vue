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
          placeholder="订单号/商品名称"
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
          <a-select-option value="">卡片渠道</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-select style="width: 120px" defaultValue='' @change="handleStoreChange">
          <a-select-option value="">订单状态</a-select-option>
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

    <div class="table-container">
      <a-table :columns="columns" :dataSource="data">
        <a slot="name" slot-scope="name" href="javascript:;">
          <img :src="name" :alt="name">
        </a>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [{
  title: '会员卡',
  dataIndex: 'name',
  key: 'name',
  scopedSlots: { customRender: 'name' },
}, {
  title: '订单号',
  dataIndex: 'order_number',
  key: 'order_number',
}, {
  title: '支付方式',
  dataIndex: 'payment_type',
  key: 'payment_type',
}, {
  title: '支付流水号',
  dataIndex: 'payment_number',
  key: 'payment_number',
}, {
  title: '单价/数量',
  dataIndex: 'shop',
  key: 'shop',
}, {
  title: '订单渠道',
  key: 'send',
  dataIndex: 'send',
}, {
  title: '客户手机号',
  key: 'store',
  dataIndex: 'store',
}, {
  title: '下单时间',
  key: 'buy',
  dataIndex: 'buy',
}, {
  title: '订单状态',
  key: 'status',
  dataIndex: 'status',
}, {
  title: '实付金额',
  key: 'total_price',
  dataIndex: 'total_price',
}];

const data = [];

export default {
  name: 'card-list',
  data() {
    return {
      page: 1,
      size: 10,

      form: this.$form.createForm(this),
      data,
      columns,
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
      const mock = [
        {
            "order_number": "1",
            "payment_number": "2",
            "payment_type": "3",
            "total_price": 100,
            "stock": 1, 
            "product": {
                "id": 12091,
                "name": "商品名称",
                "subtitle": "副标题",
                "img_url": "图片封面",
                "category": "商品分类",
                "category_id": 12921
            },
            "state":"",
            "user_phone": "18959642121"
        }
      ]
      return mock;
    },

    getList() {
      const params = {
        page: this.page,
        size: this.size,
      };

      this.$http.get('/orders', {
        params,
      }).then((res) => {
        this.data = this.formatData(res.data.items);
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
}
</style>