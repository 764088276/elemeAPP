<template>
  <div id="ratings" v-if="seller">
    <div class="score-part">
      <div class="left-bar">
        <h2>{{seller.score}}</h2>
        <p>
          <span>综合评分</span>
          <span>高于周边商家{{seller.rankRate}}%</span>
        </p>
      </div>
      <div class="right-bar">
        <div>
          <span>服务态度</span>
          <star :score="seller.serviceScore" size="36" dis="3"></star>
          <i>{{seller.serviceScore}}</i>
        </div>
        <div>
          <span>食品质量</span>
          <star :score="seller.foodScore" size="36" dis="3"></star>
          <i>{{seller.foodScore}}</i>
        </div>
        <div>
          <span>送达时间</span>
          <i>{{seller.deliveryTime}}分钟</i>
        </div>
      </div>
    </div>
    <div class="comment-part">
      <div class="ct-type">
        <ul class="sort">
          <li :class="{current:choseType==2}" @click="changeType(2)">全部<i>{{allRatings}}</i></li>
          <li :class="{current:choseType==0}" @click="changeType(0)">满意<i>{{satisfied}}</i></li>
          <li :class="{current:choseType==1}" @click="changeType(1)">不满意<i>{{unsatisfied}}</i></li>
        </ul>
        <div class="read-only" @click="showCtOnly">
          <i class="iconfont" v-show="checkBox">&#xe616;</i>
          <i class="iconfont" v-show="!checkBox">&#xe62c;</i>
          <span>只看有内容的评价</span>
        </div>
      </div>
    </div>
    <ul class="ratings-ct">
      <li v-for="rating in filterRatings">
        <img :src="rating.avatar" alt="" class="avatar">
        <div class="rating-detail">
          <h4 class="username">
            <span>{{rating.username}}</span>
            <time>{{timeTrans(rating.rateTime)}}</time>
          </h4>
          <div class="userscore">
            <star size="36" :score="rating.score" dis="4"></star>
            <span v-if="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
          </div>
          <p>{{rating.text}}</p>
          <div class="recommand">
            <i class="iconfont satisfied" v-show="!rating.rateType">&#xe60c;</i>
            <i class="iconfont unsatisfied" v-show="rating.rateType">&#xe601;</i>
            <ul>
              <li v-for="x in rating.recommend">{{x}}</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import star from "../common/star.vue";
  export default{
    data(){
      return {
        seller: null,
        checkBox: false,
        ratings: [],
        filterRatings: [],
        allRatings: 0,
        satisfied: 0,
        unsatisfied: 0,
        choseType: 2
      }
    },
    created(){
      //商家信息数据的获取
      this.$http.get("/api/seller").then((res) => {
        this.seller = res.body.data;
      }, (res) => {
        console.log(res)
      });
      //评价信息的获取
      this.$http.get("/api/ratings").then((res) => {
        this.ratings = res.body.data;
        this.filterRatings = this.ratings;
        this.allRatings = this.ratings.length;
        for (let i = 0; i < this.ratings.length; i++) {
          if (this.ratings[i].rateType == 0) {
            this.satisfied++
          } else {
            this.unsatisfied++
          }
        }
      }, (err) => {
        console.log(err);
      })
    },
    components: {
      star
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
        this.choseType = index;
        this.filterRatings = [];
        for (let i = 0; i < this.ratings.length; i++) {
          if (this.ratings[i].rateType == index||index==2) {
            this.filterRatings.push(this.ratings[i]);
            if(this.checkBox&&this.ratings[i].text==""){
              this.filterRatings.pop();
            }
          }
        }
      },
      showCtOnly(){
        this.checkBox=!this.checkBox;
        this.filterRatings=[];
        this.ratings.forEach((item,index,arr)=>{
            if(this.checkBox){
                if((item.rateType==this.choseType||this.choseType==2)&&item.text!=""){
                    this.filterRatings.push(item)
                }
            }else{
                if(item.rateType==this.choseType||this.choseType==2){
                    this.filterRatings.push(item)
                }
            }
        })
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

  #ratings {
    position: absolute;
    height: 100%;
    background: #f3f5f7;
    overflow: auto;
    width: 100%;
    .score-part {
      padding: 18px 0;
      overflow: hidden;
      border-bottom: 2px solid #e6e7e8;
      background: #fff;
      .left-bar {
        float: left;
        box-sizing: border-box;
        width: 138px;
        border-right: 1px solid #e6e7e8;
        h2 {
          width: 100%;
          text-align: center;
          .baseStyle(24px, 28px, rgb(255, 153, 0));
        }
        p {
          width: 100%;
          margin: 6px 0 8px;
          text-align: center;
          span:first-child {
            display: block;
            .baseStyle(14px, 14px, rgb(7, 17, 27));
          }
          span:last-child {
            display: block;
            .baseStyle(10px, 10px, #93999f);
            margin-top: 8px;
          }
        }
      }
      .right-bar {
        float: left;
        .baseStyle(12px, 18px, rgb(7, 17, 27));
        padding-left: 12px;
        box-sizing: border-box;
        & > div {
          margin-top: 4px;
          span {
            display: inline-block;
            vertical-align: middle;
          }
          .star-com {
            margin: 0 4px;
          }
          i {
            display: inline-block;
            vertical-align: middle;
          }
          &:last-child {
            i {
              margin-left: 4px;
              color: #93999f
            }
          }
        }
      }
    }
    .comment-part {
      width: 100%;
      margin-top: 16px;
      border-top: 2px solid #e6e7e8;
      background: #fff;
      padding: 0 18px;
      box-sizing: border-box;
      border-bottom: 2px solid #e6e7e8;

      .ct-type {
        width: 100%;
        .sort {
          width: 100%;
          padding: 14px 0;
          border-bottom: 1px solid #e6e7e8;
          li {
            padding: 0 12px;
            background: #ccecf8;
            .baseStyle(14px, 30px, #4d555d);
            display: inline-block;
            margin-left: 7px;
            vertical-align: middle;
            &.current {
              background: #00a0dc;
              color: white;
            }
            i {
              font-size: 10px;
            }
          }
        }
        .read-only {
          padding: 10px 0;
          color: #93999f;
          font-size: 14px;
        }
      }
    }
    .ratings-ct {
      width: 100%;
      padding: 0 18px;
      box-sizing: border-box;
      background: #fff;
      > li {
        width: 100%;
        padding: 18px 0;
        overflow: hidden;
        border-bottom: 1px solid #e6e7e8;
        .avatar {
          width: 28px;
          height: 28px;
          float: left;
          border-radius: 50%;
        }
        .rating-detail {
          float: left;
          width: 90%;
          padding-left: 12px;
          box-sizing: border-box;
          .username {
            width: 100%;
            .baseStyle(10px, 12px, rgb(7, 17, 27));
            time {
              float: right;
              color: rgb(147, 153, 159);
            }
          }
          .userscore {
            width: 100%;
            margin: 4px 0 6px;
            .baseStyle(10px, 12px, #93999f);
            .star-com {
              vertical-align: middle;
            }
            & > span {
              display: inline-block;
              vertical-align: middle;
            }
          }
          & > p {
            width: 100%;
            .baseStyle(12px, 18px, rgb(7, 17, 27));
          }
          .recommand {
            width: 100%;
            margin-top: 8px;
            i {
              float: left;

              color: #00a0dc;
              &.unsatisfied {
                color: #b7bbbf;
              }
            }
            ul {
              float: left;
              width: 90%;
              li {
                display: inline-block;
                .baseStyle(9px, 16px, rgb(147, 153, 159));
                padding: 0 6px;
                border: 1px solid #e6e7e8;
                margin-left: 8px;
                margin-bottom: 4px;
              }
            }
          }
        }
      }
    }
  }
</style>
