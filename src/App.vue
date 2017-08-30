<template>
  <div id="app">
    <div :class="{indexLayer:shopCartFilter}"></div>
      <my-header v-on:getFilter="layerShow" :shopCartFilter="shopCartFilter"></my-header>
    <div class="tab" :class="{filterLayer:filter||shopCartFilter}">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <div class="content" :class="{filterLayer:filter||shopCartFilter}">
      <router-view></router-view>
    </div>
    <my-footer :class="{filterLayer:filter}" v-on:getShopCart="shopCartPar"></my-footer>
  </div>
</template>

<script>
  import myHeader from "./components/header/header.vue";
  import myFooter from "./components/footer/footer.vue";
  export default {
    data(){
      return {
        filter: false,
        shopCartFilter:false
      }
    },
    name: 'app',
    components: {
      myHeader: myHeader,
      myFooter
    },
    methods: {
      layerShow: function (data) {
        this.filter = data;
      },
      shopCartPar(data){
        this.shopCartFilter=data;
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

  .tab {
    width: 100%;
    display: flex;
    height: 40px;
    .baseStyle(14px, 40px, rgb(240, 20, 20));
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .tab-item {
      float: left;
      flex: 1;
      height: 100%;
      text-align: center;
      & a {
        color: rgb(77, 85, 93);
        width: 100%;
        display: inline-block;
        text-decoration: none;
        &.router-link-active{
          color:rgb(240,20,20)
        }
      }
    }
  }

  #app > .content {
    width: 100%;
    /*通过改变这个高度来控制滚动部分的高度*/
    height:100%;
    z-index: 1000;
  }

  .filterLayer {
    filter: blur(5px);
  }
  .indexLayer{
    position:fixed;
    top:0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(7,17,27,0.8);
    z-index:1001;
  }
</style>
