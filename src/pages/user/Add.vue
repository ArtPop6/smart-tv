<template>
  <div class="customer-add">
    <h4 class="h-title">基础资料</h4>
    <Form
      action='add'></Form>
  </div>
</template>

<script>
import Form from './Form';

export default {
  components: {
    Form,
  },

  data() {
    return {};
  },
};
</script>

<style lang="stylus">
.customer-add {
  padding: 10px 0 0 20px;
}

h4.h-title {
  height: 30px;
  border-bottom: 4px solid #ffde00;
  line-height: 30px;
  display: inline-block;
  font-size: 16px;
}
</style>
