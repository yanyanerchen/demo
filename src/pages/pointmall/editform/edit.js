import $ from 'jquery';
import Vue from 'vue';
import VueForm from 'vue-form';

import edit from './edit';
import AndroidClient from 'commons/AndroidClient';
import Toast from 'commons/toast';

import "styles/common.styl";
import "styles/iosselect.styl";
import editStyles from './edit.styl';



export default function() {

	// 设置title
	AndroidClient.setActionBar('舍弃',false,false,'保存');
	// 右侧按钮不可点击
	AndroidClient.setActionBarRightBtnDisable(false);
	// 舍弃按钮事件，返回上一页面
	AndroidClient.onActionBarTitleClick(function() {
		history.go(-1);
	});

	let saveAjax = 'auth/pshop/address.do',
	streetAjax = 'service/addr.do';

	Vue.use(VueForm);

	let addressFrom = new Vue({
		el: '#vue-root',
		data: {
			formState: {},
			model: {
				receiver: '',
				qq: '',
				tel: '',
				model: '',
				imei: '',
				nt: '',
				h: '',
				pid: '',
				cid: '',
				coid: '',
				tid: '',
				ch:'',
				gid:'',
				token:''
			},
			address: {},
			addrText: '',
			street:'',
			issubmit : false,
			submittext :'',
			maxLen:80,
			minLen:5
		},
		watch: {
			'formState.$valid': function(valid) {
				AndroidClient.setActionBarRightBtnDisable(valid);
				this.issubmit = valid;

			}
		},
		created() {
			let self = this;
			// 提交按钮事件监听
			AndroidClient.onActionBarRightButtonClick(function() {
				self.submit();
			});
			// 地址选择器监听
			AndroidClient.onSelectedAddress(function(addr) {
				self.setAddress(addr);
			});
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
			this.setEditValue();
		},
		
		methods: {
			setEditValue(){
				let formElem = this.$refs['address-form'].$el;
				this.model.receiver = formElem.receiver.getAttribute('data-init-value');
				this.model.qq = formElem.qq.getAttribute('data-init-value');
				this.model.tel = formElem.tel.getAttribute('data-init-value');
				this.model.h = formElem.h.getAttribute('data-init-value');
				this.model.gid = formElem.gid.getAttribute('data-init-value');
				this.model.ch = formElem.ch.getAttribute('data-init-value');
				let area = this.$refs.area.getAttribute('data-area').split(',');
				this.model.pid = area[0];
				this.model.cid = area[1];
				this.model.coid = area[2];
				this.model.tid = this.$refs.street.getAttribute('data-street');
				this.addrText = formElem.addrText.getAttribute('data-init-value');
				this.street = formElem.street.getAttribute('data-init-value');
				this.submittext = this.model.gid ? '确认兑换':'保存';
			},
			onSubmit() {
				if (this.formState.$invalid) {
					return
				}
				var self = this;
				$.ajax({
					url: saveAjax,
					type: 'POST',
					data: self.model //$.serialize(this.model)
				}).done(function(result) {
					self.showResult(result.r,result.m);
				})
			},
			trim(v,text){
				this.model[v] = $.trim(text);
			},

			setAddress(addr) {
				this.addrText = [addr.province, addr.city, addr.county].join('');
				this.address = addr;
				this.model.pid = addr.province_id;
				this.model.cid = addr.city_id;
				this.model.coid = addr.county_id;
			},

			// 选择省份城市
			selectAddress() {
				/*this.setAddress({
					"province_id":"12",
					"province":"广东",
					"city_id":"5",
					"city":"深圳",
					"county_id":"6",
					"county":"福田"});*/
				AndroidClient.showAddressDialog();
				let area ,oneLevelId,twoLevelId,threeLevelId,iosSelect,self;
				self = this;
				oneLevelId = this.model.pid;
				twoLevelId = this.model.cid;
				threeLevelId = this.model.coid;
			    iosSelect = new IosSelect(3, 
			        [province, city, country],
			        {
			            title: '地址选择',
			            itemHeight: 35,
			            relation: [1, 1, 0, 0],
			            oneLevelId: oneLevelId,
			            twoLevelId: twoLevelId,
			            threeLevelId: threeLevelId,
			            callback: function (selectOneObj, selectTwoObj, selectThreeObj) {

			            	self.addrText = selectOneObj.n + selectTwoObj.n + selectThreeObj.n;
			            	if(self.model.coid!=selectThreeObj.i){
			            		self.model.tid = 0;
			            		self.street = '';
			            	}
			            	self.model.pid = selectOneObj.i;
			            	self.model.cid = selectTwoObj.i;
			            	self.model.coid = selectThreeObj.i;

			            	self.$refs.area.setAttribute('data-area',selectOneObj.i+','+selectTwoObj.i+','+selectThreeObj.i);
			            }
			    });
			    
				
			},
			// 选择街道
			selectStreet() {
				let self=this,countryId = this.model.coid, streetId = this.model.tid;
				if(countryId==='0'){
					Toast.showToast('&#35831;&#22635;&#20889;&#25152;&#22312;&#22320;&#21306;');
					return;
				}
				let streetData = function(callback){
					$.ajax({
						type : 'POST',
						url : streetAjax,
						data : {
							model: self.model.model,
							imei: self.model.imei,
							nt: '',
							coid: countryId,
						},
						success:function(result){
							callback(result.addrs);
						}				
					});
					
				
				}
				
		        let streetSelect = new IosSelect(1, 
		            [streetData],
		            {
		                title: '街道选择',
		                itemHeight: 50,
		                itemShowCount: 3,
		                oneLevelId: streetId,
		                showLoading: true,
		                callback: function (selectOneObj) {
		                   self.model.tid = selectOneObj.i;
		                   self.street = selectOneObj.n;
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
				Toast.showToast(message);
				
			}
		}
	});
}