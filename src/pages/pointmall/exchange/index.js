// 兑换次数
import $ from 'jquery';
import Vue from 'vue';

import config from 'commons/config';
import AndroidClient from 'commons/AndroidClient';
import Toast from 'commons/toast';

import "styles/common.styl";
import styles from './styles.styl';


let baseUnit = 3;
let exchangeAjax = 'auth/draw/exchange.do';

//AndroidClient.setActionBar('兑换次数', true, false, '');

let exchangeInstance = new Vue({

	el: '#vue-root',

	data: {
		base: baseUnit,
		count: 1,
		total: 0,
		enable:false,
		model:{
			c: '',
			model: '',
			imei: '',
			nt: '',
			cn:'',
			token:''
		}
	},

	mounted: function() {
		this.total = this.$refs.total.getAttribute('data-total');
		if(this.total<this.base){
			this.count=0;
		}else{
			this.enable = true;
		}
	},

	computed: {
		overplus: function() {
			return this.total - this.consume
		},
		consume: function() {
			return this.count * this.base
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

	methods: {
		substract: function() {
			if (this.count - 1 >= 0) {
				this.count = this.count - 1;
			}
		},
		add: function() {
			if ((this.count + 1) * this.base <= this.total) {
				this.count = this.count + 1;
			}
		},
		submit: function() {
			let self = this;
			self.model.c = self.count;
			$.ajax({
				url: exchangeAjax,
				type: 'POST',
				data: self.model,
				success: function(result) {
					let  status,message;
					status = result.r;
					message = result.m;
					Toast.showToast(message);
					if(status==200){
						setTimeout(function(){
							window.location.href = 'auth/drawact.do';
						},1600);
						return;
					}
						
				},
				error:function(){
					
					Toast.showToast('&#32593;&#32476;&#24322;&#24120;&#65292;&#35831;&#31245;&#21518;&#20877;&#35797;');
				}
			})
		}
	}
})