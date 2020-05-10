<template lang="html">
  <transition name="toast">
    <div class="toast" v-show="show" style="z-index: 100;">
      <p class="message">{{message}}</p>
    </div>
  </transition>
</template>

<script>
export default {
  data: () => ({
    show: false,
    message: null,
    duration: 3000,
  }),
  methods: {
    destroy() {
      const that = this;
      that.$el.removeEventListener('transitionend', that.destroy);
      that.$destroy();
      if (that.$el && that.$el.parentNode) {
        that.$el.parentNode.removeChild(that.$el);
      }
    },
    close() {
      const that = this;
      that.$el.addEventListener('transitionend', that.destroy);
      that.show = false;
    },
  },
  mounted() {
    const that = this;
    that.$nextTick(() => {
      setTimeout(that.close, that.duration);
    });
    that.show = true;
  },
};
</script>

<style lang="stylus">
.toast {
  display: inline-block;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0 auto;
  min-width: 110px;
  text-align: center;
  pointer-events: none;
  transform: translateX(-50%) translateY(-50%);
  transition: all 0.6s;

  .message {
    padding: 6px 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 20px;
    font-size: 15px;
  }

  &-enter, &-leave-active {
    opacity: 0;
  }

  &-enter {
    top: 55%;
  }

  &-leave-active {
    top: 45%;
  }
}
</style>
