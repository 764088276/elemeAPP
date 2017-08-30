<template>
  <div v-if="seller" :class="{indexTop:detailShow}">
    <div class="header" :class="{filterLayer:detailShow||shopCartFilter}">
      <img :src="seller.avatar" class="bg-img">
      <div class="filter-layer"></div>
      <div class="ct-wrapper">
        <div class="avatar">
          <img :src="seller.avatar" width="64">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span>{{seller.name}}</span>
          </div>
          <div class="delivery">
            {{seller.description}} / {{seller.deliveryTime}}分钟送达
          </div>
          <div class="account">
            <span class="acc-icon" :class="'acc-icon'+seller.supports[0].type"></span>
            <p>{{seller.supports[0].description}}</p>

          </div>
        </div>
        <div style="clear:both"></div>
        <div class="more-acc" @click="showDetail()">
          <span>{{seller.supports.length+'个'}}</span>
          <i class="iconfont">&#xe605;</i>
        </div>
      </div>
      <div class="des" @click="showDetail()">
        <span></span>
        <span>{{seller.bulletin}}</span>
        <i class="iconfont">&#xe605;</i>
      </div>

    </div>
    <transition name="slide">
      <div class="out-layer" v-show="detailShow">
        <div>
          <h2>{{seller.name}}</h2>
          <div class="stars">
            <star :score="seller.score" size="48" dis="10px"></star>
          </div>
          <ul class="acc-msg">
            <div class="top-line">
              <span></span>
              <h3>优惠信息</h3>
              <span></span>
            </div>
            <li v-for="x in seller.supports">
              <span class="msg-icon" :class="'msg-icon'+x.type"></span>
              <span>{{x.description}}</span>
            </li>
          </ul>
          <div class="seller-declare">
            <div class="top-line">
              <span></span>
              <h3>商家信息</h3>
              <span></span>
            </div>
            <p class="seller-description">{{seller.bulletin}}</p>
          </div>
          <div class="seller-declare">
            <div class="top-line">
              <span></span>
              <h3>商家信息</h3>
              <span></span>
            </div>
            <p class="seller-description">{{seller.bulletin}}</p>
          </div>
          <div class="close" @click="hideDetail()">
            <span class="iconfont">&#xe612;</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import star from "../common/star.vue";
  export default{
    data(){
      return {
        seller: null,
        accountType: ["decrease", "discount", "guarantee", "invoice", "special"],
        detailShow: false
      }
    },
    props: ['shopCartFilter'],
    components: {
      star
    },
    methods: {
      showDetail: function () {
        this.detailShow = true;
        console.log(this.detailShow);
        this.$emit("getFilter", this.detailShow)
      },
      hideDetail: function () {
        this.detailShow = false;
        this.$emit("getFilter", this.detailShow)
      }
    },
    created(){
      this.$http.get("/api/seller").then((res) => {
        this.seller = res.body.data;
      }, (err) => {
        console.log(err)
      })
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .baseStyle(@fontSize,@lineHeight,@color:white,@fontWeight:200) {
    font-size: @fontSize;
    line-height: @lineHeight;
    color: @color;
    font-weight: @fontWeight;
  }
  .indexTop {
    z-index: 1000000
  }
  .header {
    width: 100%;
    height: 136px;
    box-sizing: border-box;
    position: relative;
    /*background: rgb(7, 17, 27);*/
    color: white;
    overflow: hidden;
    .ct-wrapper {
      padding: 24px 12px 0 24px;
    }
    .more-acc {
      position: absolute;
      .baseStyle(10px, 12px);
      padding: 7px 8px;
      bottom: 43px;
      right: 12px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.2);
      i {
        display: inline-block;
        font-size: 10px;
        transform: scale(0.6);
      }
    }
    .bg-img {
      width: 100%;
      filter: blur(5px);
      position: absolute;
      top: 0;
      left: 0;
      z-index: -10;
    }
    .filter-layer {
      width: 100%;
      position: absolute;
      height: 100%;
      z-index: -1;
      background: rgba(7, 17, 27, 0.8);
    }
    .avatar {
      float: left;
    }
    .content {
      float: left;
      margin-left: 16px;
      .title {
        font-size: 16px;
        font-weight: bold;
        line-height: 18px;

        .brand {
          float: left;
          width: 30px;
          height: 18px;
          margin-right: 6px;
          background: url("images/brand@2x.png");
          background-size: 100% 100%;
        }
      }
      .delivery {
        font-size: 12px;
        line-height: 12px;
        font-weight: 200;
        margin-top: 8px;
      }
      .account {
        margin-top: 10px;
        position: relative;
        .acc-icon {
          width: 12px;
          height: 12px;
          float: left;
          background: red;
          margin-right: 4px;
          &.acc-icon0 {
            background: url(images/decrease_1@2x.png);
          }
          &.acc-icon1 {
            background: url(images/discount_1@2x.png);
          }
          &.acc-icon2 {
            background: url(images/guarantee_1@2x.png);
          }
          &.acc-icon3 {
            background: url(images/invoice_1@2x.png);
          }
          &.acc-icon4 {
            background: url(images/special_1@2x.png);
          }
          & {
            background-size: 100% 100% !important;
          }
        }
        p {
          float: left;
          .baseStyle(12px, 12px);
        }

      }
    }
  }

  .des {
    width: 100%;
    margin-top: 18px;
    height: 28px;
    overflow: hidden;
    background: rgba(7, 17, 27, 0.2);
    line-height: 28px;
    position: relative;
    span:first-child {
      width: 22px;
      height: 12px;
      float: left;
      margin-top: 9px;
      margin-left: 12px;
      background: url(images/bulletin@2x.png);
      background-size: 100% 100%;
    }
    span:nth-child(2) {
      float: left;
      width: 80%;
      margin-left: 4px;
      .baseStyle(10px, 28px);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    i {
      position: absolute;
      font-size: 12px;
      transform: scale(0.6);
      line-height: 28px;
      height: 100%;
      right: 12px;
    }
  }

  //topline部分
  .top-line {
    display: flex;
    margin-bottom: 10px;
    /*height: 1px;*/
    span {
      height: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      flex: 1;
      display: block;
    }
    h3 {
      flex: 1;
      text-align: center;
      transform: translateY(-50%);
      .baseStyle(14px, 14px, white, 700);
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.6s;
    left: 0;
    opacity: 1;
  }

  .slide-enter, .slide-leave-to {
    left: 100%;
    opacity: 0
  }

  .out-layer {
    width: 100%;
    height: 100%;
    top: 0;
    overflow: auto;
    background: rgba(7, 17, 27, 0.8);
    position: fixed;
    z-index: 100000;
    padding: 64px 36px 80px;
    color: white;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    h2 {
      width: 100%;
      text-align: center;
      .baseStyle(16px, 16px, white, 700)
    }

    .stars {
      margin-top: 16px;
      height: 24px;
      width: 100%;
      text-align: center;
    }
    .acc-msg {
      width: 100%;
      margin-top: 28px;
      .baseStyle(12px, 12px);

      li {
        margin-bottom: 12px;
        .msg-icon {
          width: 16px;
          height: 16px;
          float: left;
          margin-right: 6px;
          margin-left: 12px;
          background-size: 100% !important;
          &.msg-icon0 {
            background: url(images/decrease_2@2x.png);
          }
          &.msg-icon1 {
            background: url(images/discount_2@2x.png);
          }
          &.msg-icon2 {
            background: url(images/guarantee_2@2x.png);
          }
          &.msg-icon3 {
            background: url(images/invoice_2@2x.png);
          }
          &.msg-icon4 {
            background: url(images/special_2@2x.png);
          }
        }
      }
    }
    .seller-declare {
      margin-top: 28px;
      .seller-description {
        padding: 0 12px;
        box-sizing: border-box;
        display: block;
        .baseStyle(12px, 24px);
      }
    }
    .close {
      position: fixed;
      left: 0;
      bottom: 32px;
      width: 100%;
      text-align: center;
      font-size: 32px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
</style>
