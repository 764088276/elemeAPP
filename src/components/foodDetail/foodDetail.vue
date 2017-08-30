<template>
  <div id="food-detail" v-if="detail">
    <div class="iconfont close">
      <span @click="closeDetail()">&#xe612;</span>
    </div>
    <img :src="detail.image" alt="">
    <div class="food-desc">
      <h2>{{detail.name}}</h2>
      <p>
        <span>月售{{detail.sellCount}}</span>
        <i>好评率{{detail.rating}}%</i>
      </p>
      <div class="price">
        <span>￥<i>{{detail.price}}</i></span>
        <span v-if="detail.oldPrice">￥<i>{{detail.oldPrice}}</i></span>
      </div>
      <div class="add-to" @click="addToShopCart(detail.name,detail.price)">
        加入购物车
      </div>
    </div>
    <div class="food-info" v-if="detail.info">
      <h2>商品介绍</h2>
      <p>{{detail.info}}</p>
    </div>
    <div class="food-ratings">

      <div class="ct-filter">
        <h2>商品评价</h2>
        <ul class="rating-type">
          <li :class="{current:typeChose==2}" @click="changeType(2)">全部<i>{{allRatings}}</i></li>
          <li :class="{current:typeChose==0}" @click="changeType(0)">推荐<i>{{satisfied}}</i></li>
          <li :class="{current:typeChose==1}" @click="changeType(1)">吐槽<i>{{unsatisfied}}</i></li>
        </ul>
        <div class="read-only" @click="showCtOnly">
          <i class="iconfont" v-show="checkBox">&#xe616;</i>
          <i class="iconfont" v-show="!checkBox">&#xe62c;</i>
          <span>只看有内容的评价</span>
        </div>

      </div>
      <ul class="ratings-ct">
        <li v-for="rating in filterRatings">
          <div class="user">
            <time>{{timeTrans(rating.rateTime)}}</time>
            <div class="user-info">
              <span>{{rating.username}}</span>
              <img :src="rating.avatar">
            </div>
          </div>
          <div class="text">
            <i class="iconfont unsatisfied" v-if="rating.rateType">&#xe601;</i>
            <i class="iconfont satisfied" v-if="!rating.rateType">&#xe60c;</i>
            <p>{{rating.text}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer-block"></div>
  </div>
</template>

<script>
  import bus from "../common/eventBus";
  import BS from "better-scroll";
  export default{
    data(){
      return {
        checkBox: false,
        allRatings: 0,
        satisfied: 0,
        unsatisfied: 0,
        typeChose: 2,
        filterRatings: [],
        getData: false,
        close: true
      }
    },
    props: ["detail"],
    created(){
      this.close = true;
    },
    updated(){
      if (!this.getData) {
        this.filterRatings = this.detail.ratings;
        this.detail.ratings.forEach((item) => {
          this.allRatings++;
          if (item.rateType == 0) {
            this.satisfied++
          } else {
            this.unsatisfied++
          }
        });
        this.getData = true;
      }
    },
    methods: {
      timeTrans(time){
        let date = new Date(time);
        let y = date.getFullYear();
        let M = date.getMonth() + 1;
        let d = date.getDay();
        let hour = date.getHours();
        let m = date.getMinutes();
        let s = date.getSeconds();
        return y + "-" + M + "-" + d + " " + hour + ":" + m + ":" + s
      },
      changeType(index){
        this.typeChose = index;
        this.filterRatings = [];
        for (let i = 0; i < this.detail.ratings.length; i++) {
          if (this.detail.ratings[i].rateType == index || index == 2) {
            this.filterRatings.push(this.detail.ratings[i]);
            if (this.checkBox && this.detail.ratings[i].text == "") {
              this.filterRatings.pop();
            }
          }
        }
      },
      showCtOnly(){
        this.checkBox = !this.checkBox;
        this.filterRatings = [];
        this.detail.ratings.forEach((item, index, arr) => {
          if (this.checkBox) {
            if ((item.rateType == this.typeChose || this.typeChose == 2) && item.text != "") {
              this.filterRatings.push(item)
            }
          } else {
            if (item.rateType == this.typeChose || this.typeChose == 2) {
              this.filterRatings.push(item)
            }
          }
        })
      },
      addToShopCart(name, price){
        bus.$emit("getData", {
          name: name,
          price: price,
          num: 1
        })
      },
      closeDetail(){
        this.$emit("close", true);
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

  ::-webkit-scrollbar {
    width: 0;
  }

  #food-detail {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    overflow: auto;
    background: #f3f5f7;
    z-index: 1000;
    width: 100%;
    .close {
      width: 100%;
      position: fixed;
      top: 0;
      background: rgba(0, 0, 0, 0.3);
      padding: 0 15px;
      .baseStyle(22px, 40px, white);
      box-sizing: border-box;
    }
    & > img {
      width: 100%;
      height: 375px;
    }
    .food-desc {
      padding: 18px;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      h2 {
        width: 100%;
        .baseStyle(14px, 14px, rgb(7, 17, 27), 700);
      }
      p {
        margin-top: 8px;
        .baseStyle(10px, 10px, rgb(147, 153, 159));
        span {
          float: left;
          margin-right: 12px;
        }
      }
      .price {
        margin-top: 18px;
        overflow: hidden;
        span {
          float: left;
          &:first-child {
            .baseStyle(10px, 24px, rgb(240, 20, 20));
            i {
              font-size: 14px;
              font-weight: 700;
            }
          }
          &:nth-child(2) {
            .baseStyle(10px, 24px, rgb(147, 153, 159));
            text-decoration: line-through;
            i {
              font-weight: 700;;
            }
          }
        }
      }
      .add-to {
        border-radius: 12px;
        background: rgb(0, 160, 220);
        .baseStyle(10px, 12px);
        padding: 6px 12px;
        box-sizing: border-box;
        position: absolute;
        bottom: 18px;
        right: 18px;
      }
    }
    .food-info {
      width: 100%;
      margin-top: 16px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      padding: 18px;
      box-sizing: border-box;
      h2 {
        width: 100%;
        .baseStyle(14px, 14px, rgb(7, 17, 27));
      }
      p {
        margin-top: 6px;
        box-sizing: border-box;
        .baseStyle(12px, 24px, rgb(77, 85, 93));
        padding: 0 8px;
      }
    }
    .food-ratings {
      width: 100%;
      margin-top: 16px;
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      .ct-filter {
        width: 100%;
        padding: 18px 18px 0;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        box-sizing: border-box;
        h2 {
          width: 100%;
          .baseStyle(14px, 14px, rgb(7, 17, 27));
        }
        ul {
          padding: 18px 0;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          overflow: hidden;
          li {
            float: left;
            padding: 8px 12px;
            .baseStyle(14px, 16px, rgb(77, 85, 93));
            background: #ccecf8;
            margin-right: 8px;
            border-radius: 2px;
            i {
              font-size: 12px;
            }
            &.current {
              background: #00a0dc;
              color: white;
            }
          }
        }
        .read-only {
          width: 100%;
          padding: 12px 0;
          .baseStyle(12px, 12px, rgb(147, 153, 159))
        }
      }
      .ratings-ct {
        padding: 0 18px;
        width: 100%;
        box-sizing: border-box;
        li {
          padding: 16px 0;
          border-bottom: 1px solid #e6e7e8;
          .user {
            width: 100%;
            .baseStyle(10px, 12px, rgb(147, 153, 159));
            overflow: hidden;
            time {
              float: left;
            }
            .user-info {
              float: right;
              img {
                width: 12px;
                border-radius: 50%;
                float: right;
                margin-left: 6px;
              }
            }
          }
          .text {
            width: 100%;
            margin-top: 6px;
            .baseStyle(12px, 24px, rgb(7, 17, 27));
            overflow: hidden;
            i {
              float: left;
              margin-right: 4px;
              &.unsatisfied {
                .baseStyle(12px, 24px, rgb(147, 153, 159));
              }
              &.satisfied {
                .baseStyle(12px, 24px, rgb(0, 160, 220));
              }
            }
          }
        }
      }
    }
    .footer-block {
      width: 100%;
      height: 47px;
    }
  }
</style>
