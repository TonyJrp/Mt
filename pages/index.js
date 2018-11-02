import axios from 'axios'
import { Swiper, Slide } from 'vue-swiper-component'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'index',
  components: {
    Swiper,
    Slide
  },
  data() {
    return {
      shop_id: 2,
      showCheckout: false, //显示结算信息
      showPayqr: false, //显示支付码
      count: 0, //购物车数量
      totalNum: 0, //购物车商品总价
      goodsCatList: [], //商品分类列表
      goodsList: [], //商品列表
      curMenu: 0, //当前菜单栏
      gIcon: '', //商品icon
      cartList: [], //购物车列表
      sortType: '', //排序方式dprice降序、saprice升序其余为默认排序
      cartIds: '',
      balls: [
        //小球 设为3个
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      /**订单确认信息*/
      pay_money: 0, //需支付金额
      orderGoodsList: [], //订单商品列表
      total: 0,
      orderId: 0,
      wxpay: '',
      alipay: '',
      imagesList: [],
      goodsDetail: {},
      detailCount: 0,
      showDetail: false,
      isenable: true,
      showMsg: false, //消息提示框
      suc: false, //成功Icon
      msg: '', //提示信息
      timer: null,
      checkoutBtnText: '去结算',
      payBtnText: '立即支付',
      screen_code: '', //设备code
      page: 0,
      totalPage: 1,
      cat_id: 0,
      sloading: false,
      busy: false //是否正在加载过程中
    }
  },
  mounted() {
    this.screen_code = this.$route.query.screen_code
    //this.getData()
    // this.$api('test', 'get').then(res => {
    //   console.log(res)
    // }),
    //   err => {
    //     console.log(err)
    //   }
  },
  created() {},
  watch: {},
  methods: {
    payOder() {
      if (this.payBtnText != '立即支付') {
        return false
      }
      this.payBtnText = '前往支付中...'
      let param = {
        id: this.orderId,
        screen_code: this.screen_code
      }
      console.log(this.$api)
      // this.$http
      //   .get('/order/orderpaymentbyqr', param)
      that
        .$api('/order/orderpaymentbyqr', 'get', param)
        .then(res => {
          if (res.rs) {
            this.wxpay = res.data.xcxpay
            this.showPayqr = true
            this.showCheckout = false
            this.isPayed()
          } else {
            this.showMsg = true
            this.suc = false
            this.msg = res.message
            this.autoHideMsg()
          }
          this.payBtnText = '立即支付'
        })
        .catch(err => {
          this.payBtnText = '立即支付'
        })
    },
    checkout() {
      if (this.checkoutBtnText != '去结算') {
        return false
      }
      this.checkoutBtnText = '结算中...'
      let param = {
        id: this.cartIds,
        type: 4,
        screen_code: this.screen_code
      }
      // this.$http
      //   .get('/order/post', param)
      this.$api('/order/post', 'get', param)
        .then(res => {
          if (res.rs) {
            this.pay_money = res.data.pay_money
            this.total = res.data.total
            this.orderGoodsList = res.data.orderGoodsList
            this.orderId = res.data.id
            this.wxpay = ''
            this.alipay = ''
            this.showCheckout = true
          } else {
            this.showMsg = true
            this.suc = false
            this.msg = res.message
            this.autoHideMsg()
          }
          this.checkoutBtnText = '去结算'
        })
        .catch(err => {
          this.checkoutBtnText = '去结算'
        })
    },
    hidPayOrder() {
      this.showPayqr = false
      clearTimeout(this.timer)
      this.trashOrder()
    },
    hadPayOrder() {
      this.showPayqr = false
      clearTimeout(this.timer)
      this.page = 0
      this.totalPage = 1
      this.goodsList = []
      this.getData()
    },
    hidCheckout() {
      this.showCheckout = false
      this.trashOrder()
    },
    hidDetail() {
      this.showDetail = false
    },
    hidMsg() {
      this.showMsg = false
      this.msg = ''
    },
    autoHideMsg() {
      let that = this
      setTimeout(function() {
        that.hidMsg()
      }, 5000)
    },
    additem(glist, type, catlist) {
      //添加/减少购物车
      let that = this,
        e = event
      let param = {
        id: glist.id,
        type: type,
        screen_code: that.screen_code
      }
      if (!that.isenable) {
        return false
      }
      that.isenable = false
      // that.$http
      //   .get('/cart/listadd', param)
      that
        .$api('/cart/listadd', 'get', param)
        .then(res => {
          if (res.rs) {
            that.count = res.total
            that.totalNum = res.sum
            that.cartList = res.cartList
            that.cartIds = res.cartIds
            if (type == 2) {
              that.gIcon = glist.image_path
              that.drop(e.target)
              glist.cart_number++
            } else {
              glist.cart_number--
            }
          } else {
            that.showMsg = true
            that.suc = false
            that.msg = res.message
            that.autoHideMsg()
          }
          that.isenable = true
        })
        .catch(err => {
          that.isenable = true
        })
    },
    addcart(item, type) {
      //购物车列表增减减少商品数
      let that = this,
        e = event
      let param = {
        id: item.goods_id,
        type: type,
        screen_code: that.screen_code
      }
      if (!that.isenable) {
        return false
      }
      that.isenable = false
      // that.$http
      //   .get('/cart/listadd', param)
      that
        .$api('/cart/listadd', 'get', param)
        .then(res => {
          if (res.rs) {
            that.count = res.total
            that.totalNum = res.sum
            that.cartList = res.cartList
            that.cartIds = res.cartIds
          } else {
            that.showMsg = true
            that.suc = false
            that.msg = res.message
            that.autoHideMsg()
          }
          that.isenable = true
        })
        .catch(err => {
          that.isenable = true
        })
    },
    addDetailCount(id, type) {
      let that = this,
        e = event
      let param = {
        id: id,
        type: type,
        screen_code: that.screen_code
      }
      if (!that.isenable) {
        return false
      }
      that.isenable = false
      // that.$http
      //   .get('/cart/listadd', param)
      that
        .$api('/cart/listadd', 'get', param)
        .then(res => {
          if (res.rs) {
            that.count = res.total
            that.totalNum = res.sum
            that.cartList = res.cartList
            that.cartIds = res.cartIds
            if (type == 2) {
              that.detailCount++
            } else {
              that.detailCount--
            }
          } else {
            that.showMsg = true
            that.suc = false
            that.msg = res.message
            that.autoHideMsg()
          }
          that.isenable = true
        })
        .catch(err => {
          that.isenable = true
        })
    },
    changeMenu(id) {
      this.cat_id = id
      this.page = 0
      this.totalPage = 1
      this.goodsList = []
      this.getData()
    },
    getData() {
      //获取商品列表
      let that = this
      if (that.sloading) {
        return false
      }
      if (that.page >= that.totalPage) {
        return false
      }
      that.sloading = true

      let params = {
        sort: that.sortType,
        screen_code: that.screen_code,
        page: that.page + 1,
        cat_id: that.cat_id
      }
      // that.$http
      //   .get('/dpgoods', params)
      that
        .$api('/dpgoods', 'get', params)
        .then(res => {
          that.goodsCatList = res.data.goodsCatList
          that.goodsList = that.goodsList.concat(res.data.goodsList)
          that.cartList = res.data.cartList

          that.count = res.data.totalCart
          that.totalNum = res.data.totalSum
          that.cartIds = res.data.cartIds
          that.curCat = res.data.curCat
          that.totalPage = res.data.totalPages
          that.page = res.data.curPage
          that.sloading = false
        })
        .catch(err => {
          that.sloading = false
        })
    },
    getGoodsDetail(id, num) {
      let that = this
      let params = {
        id: id,
        screen_code: that.screen_code
      }
      //that.$http.get('/goods', params)
      that.$api('/goods', 'get', params).then(res => {
        that.showDetail = true
        that.imagesList = res.data.album
        that.goodsDetail = res.data.record
        that.detailCount = num
      })
    },
    trashOrder() {
      //取消订单
      let that = this
      let params = {
        id: this.orderId,
        screen_code: this.screen_code
      }
      //that.$http.get('/iorder/trash', params)
      that.$api('/iorder/trash', 'get', params).then(res => {})
    },
    sortGoodslist(sortType, tab) {
      if (tab) {
        if (tab == 1) {
          if (this.sortType == 'dprice') {
            this.sortType = 'aprice'
          } else {
            this.sortType = sortType
          }
        } else {
          if (this.sortType == 'dorder') {
            this.sortType = 'aorder'
          } else {
            this.sortType = sortType
          }
        }
      } else {
        this.sortType = ''
      }
      this.page = 0
      this.totalPage = 1
      this.goodsList = []
      this.getData()
    },
    clearCart() {
      //清空购物车商品
      let params = {
        screen_code: this.screen_code
      }
      //this.$http.get('/cart/removeall', params)
      this.$api('/cart/removeall', 'get', params).then(res => {
        this.page = 0
        this.totalPage = 1
        this.goodsList = []
        this.getData()
      })
    },
    isPayed() {
      let that = this
      let params = {
        id: that.cartIds,
        orderid: that.orderId,
        screen_code: that.screen_code
      }
      // that.$http.get('/order/ispayed', params)
      that.$api('/order/ispayed', 'get', params).then(res => {
        if (res.data.status == 1) {
          that.timer = setTimeout(function() {
            that.isPayed()
          }, 5000)
        } else {
          that.showMsg = true
          that.suc = true
          that.msg = res.message
          setTimeout(function() {
            that.hadPayOrder()
          }, 3000)
          that.autoHideMsg()
        }
      })
    },
    drop(el) {
      //抛物
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop(el) {
      /* 购物车小球动画实现 */
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect() //元素相对于视口的位置
          let x = -(window.innerWidth - rect.left - window.innerWidth * 0.25)
          let y = -(window.innerHeight - rect.top + 75) //获取y
          el.style.display = ''
          el.style.transform = 'translateY(' + y + 'px)'
          el.style.webkitTransform = 'translateY(' + y + 'px)' //translateY
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.transform = 'translateX(' + x + 'px)'
          inner.style.webkitTransform = 'translateX(' + x + 'px)'
        }
      }
    },
    dropping(el, done) {
      /*重置小球数量  样式重置*/
      let rf = el.offsetHeight
      el.style.transform = 'translate3d(0,0,0)'
      el.style.webkitTransform = 'translate3d(0,0,0)'
      let inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.transform = 'translate3d(0,0,0)'
      inner.style.webkitTransform = 'translate3d(0,0,0)'
      el.addEventListener('transitionend', done)
    },
    afterDrop(el) {
      /*初始化小球*/
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    }
  },
  computed: {
    ...mapGetters(['swipeData'])
  }
}
