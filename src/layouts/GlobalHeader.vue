<template>
  <a-layout-header :class="[theme, 'global-header']">
    <div :class="['global-header-wide', layout]">
      <a-icon v-if="layout === 'side'" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="toggleCollapse"/>
      <div :class="['global-header-right', theme]" >
          <header-search v-if="false" class="header-item" />
          <a-tooltip v-if="false" class="header-item" title="帮助文档" placement="bottom" >
            <a>
              <a-icon type="question-circle-o" />
            </a>
          </a-tooltip>
          <header-notice v-if="false" class="header-item"/>
          <header-avatar class="header-item"/>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
import HeaderSearch from './HeaderSearch';
import HeaderNotice from './HeaderNotice';
import HeaderAvatar from './HeaderlAvatar';

export default {
  name: 'GlobalHeader',
  components: {
    HeaderAvatar, HeaderNotice, HeaderSearch,
  },
  props: ['collapsed'],
  computed: {
    layout() {
      return this.$store.state.settings.layout;
    },
    theme() {
      return this.layout === 'side' ? 'light' : this.$store.state.settings.theme;
    },
  },
  methods: {
    toggleCollapse() {
      this.$emit('toggleCollapse');
    },
  },
};
</script>

<style lang="stylus" scoped>
  .trigger {
    font-size: 20px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
    &:hover{
      color: #1890ff;
    }
  }
  .header-item{
    padding: 0 12px;
    display: inline-block;
    height: 100%;
    cursor: pointer;
    vertical-align: middle;
    i{
      font-size: 16px;
      color: rgba(0,0,0,.65);
    }
  }
  .global-header{
    padding: 0 12px 0 0;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    position: relative;
    &.light{
      background: #fff;
    }
    &.dark{
      background: #001529;
    }
    .global-header-wide{
      &.head{
        max-width: 1400px;
        margin: auto;
      }
      &.side{
      }
      .logo {
        height: 64px;
        line-height: 58px;
        vertical-align: top;
        display: inline-block;
        padding: 0 12px 0 24px;
        cursor: pointer;
        font-size: 20px;
        &.pc{
          padding: 0 12px 0 0;
        }
        img {
          display: inline-block;
          vertical-align: middle;
        }
        h1{
          display: inline-block;
          font-size: 16px;
        }
        &.dark h1{
          color: #fff;
        }
      }
      .global-header-menu{
        display: inline-block;
      }
      .global-header-right{
        float: right;
        &.dark{
          color: #fff;
          i{
            color: #fff;
          }
        }
      }
    }
  }
</style>
