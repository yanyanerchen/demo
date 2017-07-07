import $ from 'jquery';
import Vue from 'vue';

import config from 'commons/config';
import AndroidClient from 'commons/AndroidClient';
import Dialog from 'commons/dialog';
import Toast from 'commons/toast';

import "styles/common.styl"; 
import "styles/slick.styl";
import styles from './styles.styl';

//AndroidClient.setActionBar('商品详情', true);

$(".slider").slick({
     dots: true,
     infinite: true,
     arrows: false      
});
let proExchange = new Vue({
	el : '#proExchange',
	data : {
		issoldout : '',
		isexchange : false,
		model:{
            model:'',
            imei:'',
            token:'',
            ch:'',
            nt:'',
            gid: '',
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
	mounted: function() {
		this.issoldout = this.$refs.issoldout.getAttribute('data-issoldout');
		this.gid = this.$refs.gid.getAttribute('data-gid');
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
    },
	methods:{
		exchange : function(){
			if(this.isexchange){
				return;
			}
			this.isexchange = true;
			let self = this;
			$.ajax({
				type : "POST",
				url : "auth/pshop/exchange.do",
				cache : false,
				data : self.model,
				timeout : 60000,
				success : function(result){
					if(result.r == 100){
						window.location.href="auth/pshop/addresspage.do?"+self.modelToString;
						return;
					}
					self.showResult(result.r,result.m);
				},
				complete : function(){
					self.isexchange = false;
				}
			});
		},
		showResult : function(status,message){
			let title,negativeBtnText;
			negativeBtnText = "&#25105;&#30693;&#36947;&#20102;";
			if(status==300){
				title = "&#31215;&#20998;&#25552;&#31034;";
				Dialog.showDialog(title,message,negativeBtnText);
				return;
			}else{
				title = "&#20817;&#25442;&#25552;&#31034;";

			}
			 if(status==500){
				this.issoldout = 'true';
				return;
			 }
			Toast.showToast(message);
			
		}
	}
});