const pkg = require('./package')

module.exports = {
  mode: 'spa',
  /*
     ** Headers of the page
     <meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
		<!--<meta http-equiv="Cache-Control" content="no-siteapp" />-->
		<!-- 启用360浏览器的极速模式(webkit) -->
		<meta name="renderer" content="webkit">
		<!-- 避免IE使用兼容模式 -->
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="screen-orientation" content="portrait">
		<meta name="x5-orientation" content="portrait">
		<meta name="full-screen" content="yes">
		<meta name="x5-fullscreen" content="true">
		<meta name="x5-page-mode" content="app">
		<meta name="browsermode" content="application">
		<meta name="msapplication-tap-highlight" content="no">
		<!-- 关键词 -->
		<meta name="keywords" content="我厨生活馆">
		<!-- 网站内容描述 -->
		<meta name="description" content="我厨生活馆，净菜+新零售">
		<title>我厨生活馆</title>
     */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
      },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
     ** Customize the progress-bar color
     */
  loading: { color: '#fff' },

  /*
     ** Global CSS
     */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/css/common-def.scss',
    '@/assets/css/common.scss'
  ],

  /*
     ** Plugins to load before mounting the App
     */
  plugins: [
    '@/plugins/element-ui',
    { src: '@/plugins/api/http.js', ssr: true }
  ],

  /*
     ** Nuxt.js modules
     */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios'
  ],
  /*
     ** Axios module configuration
     */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },
  router: {
    middleware: 'middleware'
  },

  /*
     ** Build configuration
     */
  build: {
    loaders: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash].[ext]'
        }
      }
    ],
    /*
         ** You can extend webpack config here
         */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
