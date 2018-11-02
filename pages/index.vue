<template>
  <div id="index">
    <div class="top">
      <div class="logo">
        <img src="../assets/images/index/logo.png">
      </div>
      <div class="cart-title">
        <div class="title">购物车</div>
        <button class="clear-btn"
                @click="clearCart()">清空购物车</button>
      </div>
    </div>
    <div class="content">
      <div class="menu">
        <ul>
          <li v-for="menulist in goodsCatList"
              :class="(curCat == menulist.id)?'on':''"
              :key="menulist.id"
              @click="changeMenu(menulist.id)">
            {{ menulist.name }}
          </li>
        </ul>
      </div>
      <div class="mian">
        <div class="tab">
          <div :class="!sortType?'current-tab':''"
               class="sort-all"
               @click="sortGoodslist('')">综合排序</div>
          <div :class="(sortType=='dprice'||sortType=='aprice')?'current-tab':''"
               class="sort-num"
               @click="sortGoodslist('dprice',1)">
            按价格
            <span>
              <img v-if="sortType=='dprice'"
                   src="../assets/images/index/down@3x.png">
              <img v-else
                   src="../assets/images/index/up@3x.png">
            </span>
          </div>
          <div :class="(sortType=='dorder'||sortType=='aorder')?'current-tab':''"
               class="sort-num"
               @click="sortGoodslist('dorder',2)">
            按销量
            <span>
              <img v-if="sortType=='dorder'"
                   src="../assets/images/index/down@3x.png">
              <img v-else
                   src="../assets/images/index/up@3x.png">
            </span>
          </div>
        </div>
        <div class="goods-list">
          <ul v-infinite-scroll="getData"
              infinite-scroll-disabled="sloading"
              infinite-scroll-distance="10"
              infinite-scroll="500">
            <li v-for="glist in goodsList"
                :key="glist.id">
              <div class="item">
                <div class="img-box">
                  <img v-lazy="glist.image_path"
                       :key="glist.image_path"
                       @click="getGoodsDetail(glist.id,glist.cart_number)">
                </div>
                <div>
                  <div class="goods-name"
                       @click="getGoodsDetail(glist.id,glist.cart_number)">{{ glist.name }}</div>
                  <!--<div class="sale-info">月销<span> {{glist.total_orders}} </span> 好评率<span class="favorable-rate"> {{glist.score}} </span></div>-->
                  <div class="sale-info" />
                  <div class="price">¥{{ glist.min_price }} <span v-if="glist.mk_price > glist.min_price">¥{{ glist.mk_price }}</span></div>
                  <div class="btn-add-cart-box">
                    <a href="javascript:void(0);"
                       class="btn-add btn-item-add-cart add-cart-btn"
                       @click="additem(glist,2)">
                      <i class="icon-jiahao">
                        <img src="../assets/images/index/add.png">
                      </i>
                    </a>
                    <!--<span id="number-559" class="num" v-if="glist.cart_number">{{glist.cart_number}}</span>
                                    <a href="javascript:void(0);" class="btn-sub btn-item-add-cart" v-if="glist.cart_number" @click="additem(glist,1)" >
                                        <i class="icon-jianhao">
                                        	<img src="../assets/images/index/minus.png">
                                        </i>
                                    </a>-->
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="cart-list">
        <div class="cart-content">
          <div v-if="cartList.length==0"
               class="cart-empty">
            <img src="../assets/images/index/cart-empty.png">
            <p>您的购物车空空如也~</p>
            <p>赶紧往里添加吧~</p>
          </div>
          <div v-for="(clist,index) in cartList"
               :key="index"
               class="cart-list-item">
            <div v-if="index==1"
                 class="item-top">
              零售商品
            </div>
            <div v-if="index==2"
                 class="item-top">
              已选菜品
            </div>
            <div v-if="index!=2 && index!=1"
                 class="item-top">
              其他
            </div>
            <ul class="goods-items">
              <li v-for="item in clist"
                  :key="item.name">
                <div class="goods-info">
                  <p>{{ item.name }}<span>({{ item.number }}份)</span></p>
                  ¥ {{ item.min_price }}
                </div>
                <div class="btn-add-cart-box btn-ctr">
                  <a href="javascript:void(0);"
                     class="btn-add btn-item-add-cart"
                     @click="addcart(item,2)">
                    <i class="icon-jiahao">
                      <img src="../assets/images/index/add.png">
                    </i>
                  </a>
                  <span class="num">{{ item.number }}</span>
                  <a href="javascript:void(0);"
                     class="btn-sub btn-item-add-cart"
                     @click="addcart(item,1)">
                    <i class="icon-jianhao">
                      <img src="../assets/images/index/minus.png">
                    </i>
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div class="checkout-view">
            <div class="checkout">
              <div class="total-price">
                <img src="../assets/images/index/cart.png">
                <p v-if="count">{{ count }}</p>
                合计：<span>¥ {{ totalNum }}</span>
              </div>
              <div class="checkout-btn"
                   @click="checkout()">{{ checkoutBtnText }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCheckout"
         class="confirm-order">
      <div class="order-content">
        <div class="close-btn"
             @click="hidCheckout()">
          <img src="../assets/images/index/close.png">
        </div>
        <div class="order-num">
          <div class="order-top">确认订单</div>
        </div>
        <div class="order-goods-list">
          <div v-for="(olist, index) in orderGoodsList"
               :key="index"
               class="order-item">
            <div v-if="index==1"
                 class="order-item-top">
              零售商品
            </div>
            <div v-if="index==2"
                 class="order-item-top">
              已选菜品
            </div>
            <div v-if="index!=2 && index!=1"
                 class="order-item-top">
              其他
            </div>
            <ul>
              <li v-for="item in olist"
                  :key="item.name">
                <img v-lazy="item.image_path"
                     :key="item.image_path">
                <div class="order-goods-info">
                  <p>{{ item.name }}<span>({{ item.number }}份)</span></p>
                  <span>¥ {{ item.price }}</span>
                </div>
                <div class="count">x{{ item.number }}</div>
              </li>
            </ul>
          </div>
        </div>
        <div class="pay-ctrl">
          <div class="pay-price">
            支付金额：<span>¥ {{ pay_money }}</span> <span class="count-num">({{ total }}份)</span>
          </div>
          <div class="pay-btn"
               @click.stop="payOder()">{{ payBtnText }}</div>
        </div>
      </div>
    </div>
    <div v-if="showPayqr"
         class="pay-order">
      <div class="pay-content">
        <div class="close-btn"
             @click="hidPayOrder()">
          <img src="../assets/images/index/close.png">
        </div>
        <div class="pay-top">
          <div class="pay-title">您的订单应付金额：<span>¥{{ pay_money }}</span>，扫码支付享更多优惠</div>
        </div>
        <div class="pay-type">
          <div class="wx-pay">
            <img class="wxpay-qr"
                 src="../assets/images/index/pay_demo.png">
            <div class="line" />
          </div>
          <div class="alipay">
            <div class="alipay-qr">
              <p class="wx-msg">微信扫码支付</p>
              <img :src="wxpay"
                   class="alipay-qr">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDetail"
         class="goods-detail-view"
         @click.self="hidDetail()">
      <div class="goods-detail-content">
        <div class="close-btn"
             @click="hidDetail()">
          <img src="../assets/images/index/close.png">
        </div>
        <div class="goods-detail-top">
          <Swiper interval="2500"
                  duration="500"
                  @:autoPlay="true"
                  @:showIndicator="true">
            <Slide v-for="img in imagesList"
                   :key="img.id">
              <img v-lazy="img.path"
                   :key="img.path">
            </Slide>
          </Swiper>
        </div>
        <div class="detail-info">
          <div class="detail-gname">{{ goodsDetail.name }}</div>
          <div class="sale-info">
            <!--月销<span> {{goodsDetail.total_orders}} </span> 好评率<span class="favorable-rate"> {{goodsDetail.score}} </span>-->
          </div>
          <div class="detail-goods-desc"
               v-html="goodsDetail.content">
            {{ goodsDetail.content }}
          </div>
        </div>
        <div class="detail-price">
          <div class="price">¥{{ goodsDetail.min_price }} <span v-if="goodsDetail.mk_price > goodsDetail.min_price"> ¥{{ goodsDetail.mk_price }}</span></div>
          <div class="btn-add-cart-box">
            <a href="javascript:void(0);"
               class="btn-add btn-item-add-cart"
               @click="addDetailCount(goodsDetail.id,2)">
              <i class="icon-jiahao">
                <img src="../assets/images/index/add.png">
              </i>
            </a>
            <span v-if="detailCount"
                  class="num">{{ detailCount }}</span>
            <a v-if="detailCount"
               href="javascript:void(0);"
               class="btn-sub btn-item-add-cart"
               @click="addDetailCount(goodsDetail.id,1)">
              <i class="icon-jianhao">
                <img src="../assets/images/index/minus.png">
              </i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="ball-container">
      <!--小球-->
      <div v-for="(ball, index) in balls"
           :key="index">
        <transition name="drop"
                    @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop">
          <div v-show="ball.show"
               class="ball">
            <div class="inner inner-hook">
              <img :src="gIcon">
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div v-if="showMsg"
         class="msg-box-view">
      <div class="msg-box-content">
        <div class="close-btn"
             @click="hidMsg()">
          <img src="../assets/images/index/close.png">
        </div>
        <div class="msg-box-top">
          温馨提示
        </div>
        <div class="msg-box">
          <img v-if="suc"
               src="../assets/images/index/suc_icon.png">
          <img v-else
               src="../assets/images/index/err_icon.png">
          <p>{{ msg }}</p>
        </div>
      </div>
    </div>
    <div v-if="sloading"
         class="loading">
      <div class="spinner loading-view">
        <div class="spinner-container container1">
          <div class="circle1" />
          <div class="circle2" />
          <div class="circle3" />
          <div class="circle4" />
        </div>
        <div class="spinner-container container2">
          <div class="circle1" />
          <div class="circle2" />
          <div class="circle3" />
          <div class="circle4" />
        </div>
        <div class="spinner-container container3">
          <div class="circle1" />
          <div class="circle2" />
          <div class="circle3" />
          <div class="circle4" />
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./index.js" />
<style lang="scss" scoped>
@import '../assets/css/common-def.scss';
@import './index.css';
</style>
