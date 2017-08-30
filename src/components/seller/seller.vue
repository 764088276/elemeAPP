<template>
  <div id="seller" v-if="seller">
    <div class="score-msg">
      <div class="seller-name">
        <div class="left-bar">
          <h2>{{seller.name}}</h2>
          <div class="score">
            <star :score="seller.score" size="36" dis="2px"></star>
            <span>({{seller.ratingCount}})</span>
            <span>月售{{seller.sellCount}}单</span>
          </div>
        </div>
        <div class="right-bar">
          <i class="iconfont" v-show="collected" @click="collected=!collected">&#xe602;</i>
          <i class="iconfont" v-show="!collected" @click="collected=!collected">&#xe6a9;</i>
          <span v-show="!collected">收藏</span>
          <span v-show="collected">已收藏</span>
        </div>
      </div>
      <div class="delivery-msg">
        <div class="min-price">
          <span>起送价</span>
          <i>{{seller.minPrice}}<b>元</b></i>
        </div>
        <div class="delivery-cost">
          <span>商家配送</span>
          <i>{{seller.deliveryPrice}}<b>元</b></i>
        </div>
        <div class="delivery-time">
          <span>平均配送时间</span>
          <i>{{seller.deliveryTime}}<b>分钟</b></i>
        </div>
      </div>
    </div>
    <div class="main-des">
      <div class="activity">
        <h3>公告与活动</h3>
        <p>{{seller.bulletin}}</p>
      </div>
      <ul class="account-msg">
        <li v-for="support in seller.supports">
            <i :class="accType[support.type]"></i><span>{{support.description}}</span>
        </li>
      </ul>
    </div>
    <div class="seller-scene">
      <h3>商家实景</h3>
      <div class="img-part">
        <img :src="pic" alt="" v-for="pic in seller.pics">
      </div>
    </div>
    <div class="seller-msg">
      <h3>商家信息</h3>
      <ul class="seller-infos">
        <li v-for="info in seller.infos">
          {{info}}
        </li>
      </ul>
    </div>
    <div class="footer-block">
    </div>
  </div>
</template>

<script>
  import star from "../common/star.vue"
  export default{
    data(){
      return {
        collected: false,
        seller: null,
        accType: ["decrease", "discount", "guarantee", "invoice", "special"]
      }
    },
    components: {
      star
    },
    created(){
      this.$http.get('api/seller').then((res) => {
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
  ::-webkit-scrollbar{
    width:0;
  }
  #seller {
    background: #f3f5f7;
    width: 100%;
    position:fixed;
    height:70%;
    overflow:auto;
    .score-msg {
      background: #fff;
      width: 100%;
      padding: 0 18px;
      box-sizing: border-box;
      border-bottom: 2px solid #e6e7e8;
      .seller-name {
        width: 100%;
        border-bottom: 1px solid #e6e7e8;
        padding: 18px 0;
        box-sizing: border-box;
        overflow: hidden;
        .left-bar {
          float: left;
          h2 {
            .baseStyle(14px, 14px, rgb(7, 17, 27));
            margin-bottom: 8px;
          }
          .score {
            .baseStyle(10px, 18px, #4d555d);
            span {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        .right-bar {
          float: right;

          i {
            .baseStyle(24px, 24px, rgb(240, 20, 20));
            display: block;
            text-align: right;
          }
          span {
            .baseStyle(10px, 10px, rgb(77, 85, 93));
            display: block;
            margin-top: 4px;
            text-align: center;
          }
        }
      }
      .delivery-msg {
        width: 100%;
        padding: 18px 0;
        box-sizing: border-box;
        overflow: hidden;
        & > div {
          width: 33.33%;
          text-align: center;
          float: left;
          box-sizing: border-box;
          border-right: 1px solid #e6e7e8;
          &:last-child {
            border: 0 none;
          }
          span, i {
            width: 100%;
            display: block;
            text-align: center;
          }
          span {
            .baseStyle(10px, 10px, #93999f);
          }
          i {
            .baseStyle(20px, 20px, rgb(7, 17, 27));
            margin-top: 4px;
            b {
              font-size: 10px;
            }
          }
        }
      }
    }
    .main-des{
      width:100%;
      padding:0 18px;
      box-sizing:border-box;
      background: #fff;
      margin-top:16px;
      border-top:2px solid #e6e7e8;
      border-bottom:2px solid #e6e7e8;
      .activity{
        width:100%;
        padding:18px 0;
        box-sizing:border-box;
        h3{
          width:100%;
          .baseStyle(14px,14px,#07111b);
          margin-bottom:8px;
        }
        p{
          width:100%;
          padding:0 12px;
          box-sizing:border-box;
          .baseStyle(12px,24px,rgb(240,20,20));
          text-align: justify;
        }
      }
      .account-msg{
        width:100%;
        li{
          width:100%;
          border-top:1px solid #e6e7e8;
          padding:16px 0;
          .baseStyle(12px,16px,rgb(7,17,27));
          i{
            width:16px;
            height:16px;
            background-size:100% 100%!important;
            float:left;
            margin-right:6px;
            &.decrease{
              background: url(images/decrease_4@2x.png);
            }
            &.discount{
              background: url(images/discount_4@2x.png);

            }
            &.guarantee{
              background: url(images/guarantee_4@2x.png);

            }
            &.invoice{
              background: url(images/invoice_4@2x.png);

            }
            &.special{
              background: url(images/special_4@2x.png);

            }
          }
        }
      }
    }
    .seller-scene{
      width:100%;
      border-top:2px solid #e6e7e8;
      border-bottom:2px solid #e6e7e8;
      padding:18px;
      box-sizing:border-box;
      background: #fff;
      margin-top:16px;
      h3{
        .baseStyle(14px,14px,#07111b);
        margin-bottom:12px;
      }
      .img-part{
        width:100%;
        display:flex;
        height:90px;
        overflow: scroll;
         img{
           flex:1;
           margin-left:6px;
           width:120px;
           height:100%;
           float:left;
         }
       }
    }
    .seller-msg{
      width:100%;
      border-top:2px solid #e6e7e8;
      border-bottom:2px solid #e6e7e8;
      padding:18px;
      box-sizing:border-box;
      background: #fff;
      margin-top:16px;
      h3{
        width:100%;
        .baseStyle(14px,14px,#07111b);
        margin-bottom:12px;
      }
      .seller-infos{
        width:100%;

        li{
          padding:16px 12px;
          border-top:1px solid #e6e7e8;
          .baseStyle(12px,16px,rgb(7,17,27))
        }

      }
    }
    .footer-block{
      width:100%;
      height:47px;
    }
  }
</style>
