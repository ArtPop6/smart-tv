const prod = process.env.NODE_ENV === 'production'
const version = pkg => require(`${pkg}/package.json`).version
const jsfile = name => (prod ? `${name}.min.js` : `${name}.js`)
const cssfile = name => (prod ? `${name}.min.css` : `${name}.css`)

// https://cdn.bootcss.com/
// https://lib.baomitu.com/
// https://cdnjs.cloudflare.com/ajax/libs/

const bootcdn = (pkg, url) => `https://lib.baomitu.com/${pkg}/${version(pkg)}/${url}`
const setCDN = (pkg, url) => {
  if (prod) return bootcdn(pkg, url)
  return bootcdn(pkg, url)
}

const cdn = {
  css: [
    'https://at.alicdn.com/t/font_1023822_z4vkykhkd3e.css',
    'https://lib.baomitu.com/wangEditor/3.1.1/wangEditor.min.css'
  ],
  js: [
    setCDN('vue', jsfile('vue.runtime')),
    setCDN('vue-router', jsfile('vue-router')),
    setCDN('vuex', jsfile('vuex')),
    'https://lib.baomitu.com/wangEditor/3.1.1/wangEditor.min.js'
  ]
}

module.exports = cdn
