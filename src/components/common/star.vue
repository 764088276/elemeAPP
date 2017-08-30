<!--星星组件，需要传入3个参数，score,size,dis-->
<template>
  <div class="star-com">
    <span v-for="x in 5" class="star" :class="['star_'+size,'star_'+size+'_'+changeScore(x-1)]" :style="{margin:'0 '+dis}"></span>
  </div>
</template>

<script>
  export default{
    data(){
      return {
          type:"off"
      }
    },
    props: ['score', "size","dis"],
    methods: {
      changeScore: function (x) {
        var scoreInt = parseInt(this.score);
        var scoreFloat = this.score - scoreInt;
        var scoreNum=scoreInt + (scoreFloat > 0.3 ? (scoreFloat > 0.6 ? 1 : 0.5) : 0);
        if(scoreNum-x<=0){
            return "off"
        }else if(scoreNum-x>0.5){
            return "on"
        }else{
            return "half"
        }
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .star-com{
    display: inline-block;
    /*vertical-align: middle;*/
  }
  .star {
    display: inline-block;
    background-size: 100% 100% !important;
  }
  .star_24 {
    width: 10px;
    height: 10px;
    background: url("images/star24_off@2x.png");
    &.star_24_half {
      background: url("images/star24_half@2x.png");
    }
    &.star_24_on {
      background: url("images/star24_on@2x.png");
    }
  }

  .star_36 {
    width: 15px;
    height: 15px;
    background: url("images/star36_off@2x.png");
    &.star_36_half {
      background: url("images/star36_half@2x.png");
    }
    &.star_36_on {
      background: url("images/star36_on@2x.png");
    }
  }

  .star_48 {
    width: 20px;
    height: 19px;
    background: url("images/star48_off@2x.png");
    &.star_48_half {
      background: url("images/star48_half@2x.png");
    }
    &.star_48_on {
      background: url("images/star48_on@2x.png");
    }
  }
</style>
