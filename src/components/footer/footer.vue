<template>
  <div id="footer">
    <div class="left" @click="showShopCart()">
      <div class="shop-cart">
        <span class="iconfont">&#xe600;</span>
        <i class="food-num" v-show="shopCartFoodNum>0">{{shopCartFoodNum}}</i>
      </div>
      <div class="price">￥{{curCost}}</div>
      <div class="delivery-price">另需配送费￥{{seller.deliveryPrice}}</div>
    </div>
    <div class="right" :class="{checkout:costLeft<=0}">
      <i v-show="costLeft>=seller.minPrice">￥{{seller.minPrice}}起送</i>
      <i v-show="costLeft>0&&costLeft<seller.minPrice">还差￥{{costLeft}}起送</i>
      <i v-show="costLeft<=0">去结算</i>
    </div>
    <div class="shop-detail" v-show="showDetail">
      <h2 class="title">
        <span>购物车</span>
        <i @click="clearAllFood()">清空</i>
      </h2>
      <ul class="main-ct">
        <li v-for="(food,index) in shopCartFood">
          <span class="food-name">{{food.name}}</span>
          <span class="num-ctrl">
            <i class="decrease iconfont" @click="decreaseFood(index)">&#xe61e;</i>
            <b class="num">{{food.num}}</b>
            <i class="increase iconfont" @click="increaseFood(index)">&#xe61f;</i>
          </span>
          <span class="price">￥<i>{{food.price}}</i></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import Bus from "../common/eventBus.js";
  export default{
    data(){
      return {
        seller: "",
        curCost: 0,
        showDetail: false,
        shopCartFood: [],
        costLeft: "",
        shopCartFoodNum: 0
      }
    },
    watch: {
      shopCartFood: {
        handler: function (val) {
          this.shopCartFoodNum=0;
          for (let i = 0; i < val.length; i++) {
            this.costLeft = this.costLeft - val[i].price;
            this.shopCartFoodNum += val[i].num;
            if(val[i].num==0){
                this.shopCartFood.splice(i,1);
                i--;
            }
          }
          Bus.$emit("sendShopCartData",val)
        },
        deep: true
      }
    },
    created(){
      this.$http.get("/api/seller").then((res) => {
        this.seller = res.body.data;
        this.costLeft = this.seller.minPrice;
      }, (err) => {
        console.log(err)
      });
      Bus.$on("getData", res => {
        for (let i = 0; i < this.shopCartFood.length; i++) {
          if (res.name == this.shopCartFood[i].name) {
            this.shopCartFood[i].num += res.num;
            if (this.shopCartFood[i].num < 0) {
              this.shopCartFood[i].num = 0;
            }
            this.shopCartFood[i].price = res.price * this.shopCartFood[i].num;
            this.curCost +=res.price*res.num;
            return
          }
        }
          this.shopCartFood.push(res);
          this.curCost += res.price;
      })
    },
    methods: {
      showShopCart(){
        this.showDetail = !this.showDetail;
        this.$emit("getShopCart", this.showDetail);
      },
      clearAllFood(){
        this.shopCartFood = [];
        this.curCost = 0;
      },
      increaseFood(index){
        let foodPrice = this.shopCartFood[index].price / this.shopCartFood[index].num;
        this.shopCartFood[index].num++;
        this.shopCartFood[index].price = foodPrice * this.shopCartFood[index].num;
        this.curCost += foodPrice;
      },
      decreaseFood(index){
        let foodPrice = this.shopCartFood[index].price / this.shopCartFood[index].num;
        this.shopCartFood[index].num--;
        this.curCost -= foodPrice;
        this.shopCartFood[index].price = foodPrice * this.shopCartFood[index].num;
      }
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

  #footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    z-index: 1001;
    height: 47px;
    .baseStyle(12px, 58px, rgba(255, 255, 255, 0.4));
    .left {
      width: 75%;
      float: left;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      position: relative;
      .shop-cart {
        width: 50px;
        height: 50px;
        background: #141d27;
        border-radius: 50%;
        padding: 6px;
        z-index: 100;
        box-sizing: border-box;
        position: absolute;
        top: -11px;
        left: 12px;
        span {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.4);
          display: block;
          border-radius: 50%;
          text-align: center;
          .baseStyle(20px, 38px, rgba(255, 255, 255, 0.4))
        }
        i {
          position: absolute;
          padding: 3px 7px;
          background: #f01414;
          border-radius: 9px;
          right: 0;
          top: 0;
          .baseStyle(10px, 16px, white, 700);
        }
      }
      > .price {
        padding: 0 12px;
        .baseStyle(16px, 24px, rgba(255, 255, 255, 0.4), 700);
        position: absolute;
        left: 62px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        top: 11px;
      }
      .delivery-price {
        position: absolute;
        left: 112px;
        .baseStyle(12px, 24px, rgba(255, 255, 255, 0.4));
        padding: 0 12px;
        top: 11px;
        letter-spacing: 1px;
      }
    }
    .right {
      width: 25%;;
      height: 100%;
      float: left;
      padding: 0 10px;
      box-sizing: border-box;
      background: #2b333b;
      .baseStyle(14px, 14px, #979a9c, 700);
      display: flex;
      text-align: center;
      align-items: center;
      justify-content: center;
      &.checkout {
        background: #56d176;
        color: #f9fff3;
        letter-spacing: 1px;
        font-size: 14px;
      }
    }
    .shop-detail {
      width: 100%;
      z-index: 20;
      position: absolute;
      bottom: 100%;
      left: 0;
      background: #fff;
      .title {
        width: 100%;
        height: 40px;
        line-height: 40px;
        background: #f3f5f7;
        border-bottom: 2px solid rgba(7, 17, 27, 0.1);
        span {
          float: left;
          margin-left: 17px;
          .baseStyle(14px, 40px, rgb(7, 17, 27));
        }
        i {
          float: right;
          margin-right: 17px;
          .baseStyle(12px, 40px, rgb(0, 160, 220));
        }
      }
      .main-ct {
        padding: 0 18px 22px;
        box-sizing: border-box;
        li {
          height: 48px;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          line-height: 48px;
          .food-name {
            .baseStyle(16px, 24px, rgb(7, 17, 27));
            display: inline-block;
          }
          .price {
            float: right;
            .baseStyle(12px, 48px, rgb(240, 20, 20), 700);
            i {
              font-size: 14px;
            }
          }
          .num-ctrl {
            float: right;
            margin-left: 12px;
            left: 48px;
            height: 100%;
            i {
              display: inline-block;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              text-align: center;
              .baseStyle(10px, 16px, #00a0dc, 600);
              border: 2px solid #00a0dc;
              &.increase {
                background: #00a0dc;
                color: #fff;
              }
            }
            b {
              width: 24px;
              display: inline-block;
              text-align: center;
              .baseStyle(10px, 24px, rgb(147, 153, 159), 700)
            }
          }
        }
      }
    }
  }
</style>
