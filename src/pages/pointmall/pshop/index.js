import $ from 'jquery';
import Vue from 'vue';
import config from 'commons/config';
import AndroidClient from 'commons/AndroidClient';

import 'styles/common.styl';
import 'styles/slick.styl';
import './styles.styl';


AndroidClient.setActionBar('积分商城', true, true, '');

$(function() {
   $(".slider").slick({
        dots: true,
        infinite: true,
        arrows: false      
   });
   $(".news-list").Scroll({
        line: 1,
        speed: 700,
        timer: 5000
    });
   $(".pro-menu a").on('click',function(e){
      e.preventDefault();
      $(".pro-menu a").removeClass('active');
      $(this).addClass('active');
      var n = $(this).index();
      $(".pro-list").removeClass('active').eq(n).addClass('active');;
   });
   let menu = new Vue({
       el:'#menu',
       data:{
          model:{
            model:'',
            imei:'',
            token:'',
            ch:'',
            nt:''
          }
       },
        created() {
          let self = this;
          // 获取imei
          AndroidClient.getImei();
          AndroidClient.onGetImei(function(imei) {
            self.model.imei = imei;
          })
          // 获取手机型号
          AndroidClient.onGetPhoneModel(function(model) {
            self.model.model = model;
          })
          // 获取token
          AndroidClient.getToken();
          AndroidClient.onGetToken(function(token) {
            self.model.token = token;
          })
        },
        mounted() {
          this.model.ch = this.$refs.ch.getAttribute('data-init-value');
        },
        computed:{
          modelToString : function(){
            let parastr='';
            for(let key in this.model){
              parastr += key + '=' + this.model[key]+'&';
            }
            return parastr;
          }
        }
   });
   let pro = new Vue({
       el:'#pro',
       data:{
         modelToString : menu.modelToString
       }
  });

})