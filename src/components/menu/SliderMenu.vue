<template>
  <div>
    <a-menu
      :selectedKeys="selectedKeys"
      :mode="mode"
      :theme="theme"
    >
      <template v-for="item in items">
        <a-menu-item
          :key="item.key"
          v-if="!item.children && item.invisible"
        >
          <router-link :to="item.path">
            <a-icon :type="item.icon" />
            <span>{{item.name}}</span>
          </router-link>
        </a-menu-item>

        <a-sub-menu
          :key="item.key"
          v-if="item.children && item.invisible"
        >
          <span slot="title">
            <a-icon :type="item.icon" /><span>{{item.name}}</span>
          </span>
          <template v-for="cell in item.children">
            <a-menu-item
              :key="cell.key"
              v-if="!cell.children && cell.invisible"
            >
              <router-link :to="cell.path">
                {{cell.name}}
              </router-link>
            </a-menu-item>
          </template>
        </a-sub-menu>
      </template>

    </a-menu>

  </div>
</template>
<script>
import { mapState } from 'vuex'
import IMenu from "./menu";

export default {
  name: "SliderMenu",
  data() {
    return {
      selectedKeys: [],
      originMenu: IMenu,
    }
  },
  watch: {
    $route: {
      handler: function(to, from) {
        const _path = to.path
        this.setKeyByPath(_path)
      },
      deep: true
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    mode() {
      return "inline";
    },
    ...mapState([
      'authority'
    ]),
    items () {
      return this.getMenu()
    }
  },
  methods: {
    findTargeByPath (path) {
      let _temp = null
      function _loop(path, arrays) {
        for (let _item of arrays) {
          if (_item.path && _item.path === path) {
            _temp = _item
            break
          }

          if (_item.children) {
            _loop(path, _item.children)
          }
        }
      }
      _loop(path, IMenu)
      return _temp
    },
    findTargeById (key, items) {
      let _temp = null
      function _loop(key, arrays) {
        for (let _item of arrays) {
          if (_item.key && _item.key === key) {
            _temp = _item
            break
          }

          if (_item.children) {
            _loop(key, _item.children)
          }
        }
      }
      _loop(key, items)
      return _temp
    },
    setKeyByPath(_path) {
      const target = this.findTargeByPath(_path)
      if (target) {
        this.selectedKeys = [target.key]
      }
    },
    getMenu() {
      const self = this
      function _loop(items) {
        if(!(items instanceof Array)) {
          return []
        }

        items.map(item => {
          let target = self.findTargeById(String(item.id), self.originMenu)
          if (target) {
            target.invisible = true
          }
          if(!!item.children) {
            _loop(item.children)
          }
        })
      }
      _loop(self.authority.menu)
      return self.originMenu
    },

    initSetKey () {
      let _path = this.$route.path
      let _pathArrs = _path.split('/')
      if (_pathArrs.length > 3) {
        _pathArrs = _.slice(_pathArrs, 0, 3)
      }
      this.setKeyByPath(_pathArrs.join('/'))
    }
  },
  mounted() {
    this.getMenu()
    // highlight left bar
    this.initSetKey()
  },
};
</script>

<style lang="stylus" scoped>
.ant-menu-dark {
  background: #000;
}
</style>
