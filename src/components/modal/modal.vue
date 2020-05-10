<template>
  <div v-show="show">
    <div class="modal" style="z-index: 11;">
      <div class="modal-dialog" :class="size">
        <header class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="btn-close" @click="handleClose" v-if="!noClose">
            <span class="fa fa-times"></span>
          </button>
        </header>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { addBackdrop, removeBackdrop } from './backdrop';

  export default {
    props: {
      title: String,
      show: { type: Boolean, default: false },
      size: { type: String, default: 'normal' },
      noClose: { type: Boolean, default: false },
    },
    data: () => ({
    }),
    watch: {
      show(val) {
        if (val) addBackdrop();
        else removeBackdrop();
      },
    },
    methods: {
      handleClose() {
        this.$emit('close');
      },
    },
    beforeDestroy() {
      removeBackdrop();
    },
    mounted() {
      if (this.show) addBackdrop();
    },
  };
</script>

<style lang="stylus">
</style>
