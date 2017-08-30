<template>
  <div v-if="goods" class="goods-ct" ref="allWrapper">
    <div class="food-name" ref="menuWrapper">
      <ul>
        <li v-for="(good,index) in goods" class="menu-wrapper-hook" :class="{current:menuCur==index}"
            @click="selectFood(index)">
          <p>
          <span>
            {{good.name}}
          </span>
          </p>
        </li>
      </ul>
    </div>
    <div ref="goodsWrapper">
      <ul class="main-food">
        <li v-for="type in goods" class="goods-wrapper-hook">
          <h3>{{type.name}}</h3>
          <ul class="food-list">
            <li v-for="food in type.foods">
              <img :src="food.icon" alt="" @click="showDetail(food)">
              <div class="food-detail" @click="showDetail(food)">
                <h4 class="name">{{food.name}}</h4>
                <span class="food-des">{{food.description}}</span>
                <p class="sold-num">
                  <span>月售{{food.sellCount}}</span>
                  <i>好评率{{food.rating}}%</i>
                </p>
                <p class="price">
                  <span class="cur-price">￥{{food.price}}</span>
                  <i class="old-price" v-if="food.oldPrice">￥{{food.oldPrice}}</i>
                </p>
              </div>
              <span class="num-ctrl">
            <i class="decrease iconfont" @click="decreaseFood(food.name,food.price)" v-show="calFoodNum(food.name)>0">&#xe61e;</i>
            <b class="num" v-show="calFoodNum(food.name)>0">{{calFoodNum(food.name)}}</b>
            <i class="increase iconfont" @click="increaseFood(food.name,food.price)">&#xe61f;</i>
          </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <transition name="scale">
    <food-detail :detail="curFoodDetail" v-show="foodDetailShow" v-on:close="closeDetail"></food-detail>
    </transition>
  </div>
</template>

<script>
  import Bus from "../common/eventBus.js";
  import foodDetail from "../foodDetail/foodDetail.vue";
  import BetterScroll from "better-scroll";
  export default{
    data(){
      return {
        goods: [],
        curFoodDetail: null,
        menuScrollY: 0,
        goodsScrollY: 0,
        menuHeight: [],
        goodsHeight: [],
        shopCartFood: [],
        foodDetailShow:false,
        visHeight:''
      }
    },
    components: {
      foodDetail
    },
    computed:{
      menuCur(){
          for(let i=0;i<this.menuHeight.length;i++){
              let h1=this.goodsHeight[i];
              let h2=this.goodsHeight[i+1];
              if(!h2||this.goodsScrollY>=h1&&this.goodsScrollY<h2){
                  let menuList=this.$refs.menuWrapper.getElementsByClassName("menu-wrapper-hook");
                  let el=menuList[i];
                  if(this.menuHeight[i]>this.visHeight||this.menuScrollY>this.menuHeight[i]){
                      this.menuScroll.scrollToElement(el,500);
                  }
                  return i
              }
          }
      }
    },
    created(){
      this.$http.get("/api/goods").then((res) => {
        if (res.body.errno == 0) {
          this.goods = res.body.data;
          this.$nextTick(() => {
            this.initScroll();
            this.calHeight();
          });
        }
      }, (err) => {
        console.log(err)
      });
      Bus.$on("sendShopCartData", (data) => {
        this.shopCartFood = data;
      })
    },
    methods: {
      //计算数量
      calFoodNum(name){
          for(let i=0;i<this.shopCartFood.length;i++){
              if(name==this.shopCartFood[i].name){
                  return this.shopCartFood[i].num
              }
          }
      },
      //关闭食品详情页
      closeDetail(){
        this.foodDetailShow=false
      },
      //加入购物车
      increaseFood(name, price){
        Bus.$emit("getData", {
          name: name,
          price: price,
          num: 1
        });
      },
      decreaseFood(name,price){
        Bus.$emit("getData", {
          name: name,
          price: price,
          num: -1
        });
      },
      //展示购物车
      showDetail(food){
        this.curFoodDetail = food;
        this.foodDetailShow=true;
      },
      //betterScroll
      initScroll() {
        let foodName = document.querySelector("food-name");
        this.menuScroll = new BetterScroll(this.$refs.menuWrapper, {
          click: true, /*因为better-scroll会取消默认点击*/
          probeType: 3
        });
        this.menuScroll.on("scroll", (pos) => {
          this.menuScrollY = Math.abs(Math.round(pos.y));
        });
        this.goodsScroll = new BetterScroll(this.$refs.goodsWrapper, {
          probeType: 3,  //相当于探针，实时告知滚动位置
          click: true
        });
        this.goodsScroll.on("scroll", (pos) => {
          this.goodsScrollY = Math.abs(Math.round(pos.y));
        });
      },
      calHeight(){
//        计算menu的高度
        let menuChild = this.$refs.menuWrapper.getElementsByClassName("menu-wrapper-hook");
        let goodsChild = this.$refs.goodsWrapper.getElementsByClassName("goods-wrapper-hook");
        for (let i = 0; i < menuChild.length; i++) {
          this.menuHeight.push(menuChild[i].offsetTop);
          this.goodsHeight.push(goodsChild[i].offsetTop);
        }
        this.visHeight=this.$refs.allWrapper.clientHeight;
      },
      selectFood(index){
        let goods = this.$refs.goodsWrapper.getElementsByClassName("goods-wrapper-hook");
        let el = goods[index];
        this.goodsScroll.scrollToElement(goods[index], 500);
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

  .goods-ct {
    position: absolute;
    width: 100%;
    top: 174px;
    bottom: 46px;
    display: flex;
    overflow: hidden;
    //弹出的内容详情页
    .scale-enter-active,.scale-leave-active{
      transition:all 0.5s;
      transform:scale(1);
      opacity: 1;
    }
    .scale-enter,.scale-leave-to{
      transform:scale(0.00001);
      opacity:0;
    }
    .food-name {
      width: 80px; //不写,在android上有问题
      background: #f3f5f7;
      flex:0 0 80px;
      li {
        width: 100%;
        padding: 0 12px;
        box-sizing: border-box;
        background: #f3f6f7;
        &.current {
          background: #fff;
          color: rgb(240, 20, 20);
        }
        p {
          width: 100%;
          height: 100%;
          line-height: 54px;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        }
        span {
          display: inline-block;
          width: 100%;
          .baseStyle(12px, 14px, #07111b);
        }
      }
    }
    .main-food {
      flex: 1;
      & > li {

        display: block;
        & > h3 {
          border-left: 2px solid #d9dde1;
          box-sizing: border-box;
          .baseStyle(12px, 26px, #2c3238);
          background: #f3f5f7;
          padding-left: 14px;
        }
        .food-list {
          width: 70%;
          li {
            width: 100%;
            padding: 18px;
            box-sizing: border-box;
            position: relative;
            font-size: 10px;
            color: rgb(147, 153, 159);
            overflow: hidden;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            > img {
              width: 57px;
              height: 57px;
              float: left;
              margin-right: 10px;
            }
            .food-detail {
              display: block;
              .name {
                .baseStyle(14px, 14px, rgb(7, 17, 27))
              }
              .food-des {
                width: 60%;
                margin: 5px 0;
                line-height: 14px;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .sold-num {
                span {
                  float: left;
                  margin-right: 12px;
                }
              }
              .price {
                margin-top: 5px;
                position: relative;
                .cur-price {
                  .baseStyle(14px, 24px, #f01414, 700)
                }
                .old-price {
                  .baseStyle(10px, 24px, #93999f, 700);
                  text-decoration: line-through;
                }

              }
            }
            .num-ctrl {
              position: absolute;
              text-align: center;
              right: 18%;
              bottom: 20px;
              i {
                .baseStyle(12px, 16px, white);
                background: #00a0dc;
                display: inline-block;
                border-radius: 50%;
                width: 16px;
                height: 16px;
              }
              b {
                width: 16px;
                height: 16px;
                display: inline-block;
                text-align: center;
                .baseStyle(12px, 16px, #00a0dc);
              }
            }
          }
        }
      }
    }
  }

</style>
