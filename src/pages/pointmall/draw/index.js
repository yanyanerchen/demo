import $ from 'jquery';
import Vue from 'vue';

import config from 'commons/config';
import Toast from 'commons/toast';
import Dialog from 'commons/dialog';
import AndroidClient from 'commons/AndroidClient';
import drawact from './drawact';
import drawgrid from './drawgrid';
import util from 'commons/util';


import "styles/common.styl";
import styles from './styles.styl';

let mod = util.getModule();

if (mod === 'drawact') {
	drawact();
}

if (mod === 'drawgrid') {
	drawgrid();
}


let draw = new Vue({
	el:'#draw',
	data :{
		url : 'auth/draw/luck.do',//
		issetting : false,
		times:1,
		awardno:'6',
		awardname:'',
		awardtype:'',
		addr:'',
		isshowaddr:false,
		status:1, //1:可以抽奖，2：抽奖结果展示
		angle : [0,45,90,135,180,225,270,315],
		nowangle : 0,
		toangle :0,
		grid :{
			index:0,    //当前转动到哪个位置，起点位置
		    count:8,    //总共有多少个位置
		    timer:0,    //setTimeout的ID，用clearTimeout清除
		    speed:20,    //初始转动速度
		    times:0,    //转动次数
		    cycle:50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
		    prize:-1,    //中奖位置
		},
		model:{
			model: '',
			imei: '',
			nt: '',
			ch:'',
			token:''
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
	},
	methods:{
		scrollNews : function(){
			$(".draw-wnews").Scroll({
			    line:1,
			    speed:700,
			    timer:5000
			});
		},
		getAward : function(type){//1:大转盘 2：九宫格  
			if(this.status!=1){
				return;
			}
			this.status = 0;
			//console.log("haha:"+this.model.ch);
			// 获取token
			AndroidClient.getToken();
			AndroidClient.onGetToken(function(token) {
				self.model.token = token;
			});
			let self = this;
			$.ajax({	
				type : 'POST',
				url:self.url, 
				data : self.model,
				dataType:'JSON',
				timeout : 60000,
				success:function(data){
					
					if(data.st!=1){
						self.showError(data.st);
						return;
					}
					self.times = data.rc;
					self.awardno = data.seq;
					self.awardname = data.name; 
					self.awardtype = data.pt;
					self.isshowaddr = (data.u == undefined)? false : true;
					if(data.u != undefined){
						self.addr = data.u;
					}
					self.toangle = self.angle[self.awardno-1];
					if(type==1){
						self.runPlate();
						return;
					}
					if(type==2){
						self.runGrid();
						return;
					}
				
				},
				error:function(){
					self.showError(0);
				}

			})
		},
		runPlate:function(){
			let self = this;
   			$("#drawPoint").rotate({
				angle:self.nowangle, 
				duration: 8000, 
				animateTo: self.toangle+2160, //angle是图片上各奖项对应的角度，1440是我要让指针旋转4圈。所以最后的结束的角度就是这样子^^
				easing:$.easing.easeInOutQuint,
				callback:function(){
					self.status = 2;
					self.nowangle = self.toangle;
					self.showResult(self.awardtype,self.awardname);
					setTimeout(function(){
						self.status = 1;
					},1400);
				}
			}); 
		},
		runGrid:function(){
			this.grid.speed=180;
            this.rollGrid(); 
		},
		initGrid : function(id){
			let gridWrap,gridItem;
			if ($("#"+id).find(".draw-award").length>0) {
	            gridWrap = $("#"+id);
	            gridItem = gridWrap.find(".draw-award");
	            this.grid.obj = gridWrap;
	            this.grid.count = gridItem.length;
	            gridWrap.find(".award"+this.grid.index).addClass("pointer");
	        };
		},
		rollNext : function(){
			let grid = this.grid;
			let index = grid.index;
	        let count = grid.count;
	        let gridWrap = grid.obj;
	        gridWrap.find(".award"+index).removeClass("pointer");
	        index += 1;
	        if (index>count) {
	            index = 1;
	        };
	        gridWrap.find(".award"+index).addClass("pointer");
	        grid.index=index;
	        return false;
		},
		rollGrid : function(){
			let self = this, grid = this.grid;
			grid.times ++;
			this.rollNext();
		    if (grid.times > grid.cycle+10 && grid.prize==grid.index) {
		        clearTimeout(grid.timer);
		        grid.prize=-1;
		        grid.times=0;
		        self.status = 2;
				setTimeout(function(){
					self.showResult(self.awardtype,self.awardname);
					setTimeout(function(){
						self.status = 1;
					},500);
				},800);
		    }else{
		        if (grid.times<grid.cycle) {
		            grid.speed -= 10;
		        }else if(grid.times==grid.cycle) {
			            grid.prize = this.awardno;        
			    }else{
		            if (grid.times > grid.cycle+10 && ((grid.prize==0 && grid.index==7) || grid.prize==grid.index+1)) {
		                grid.speed += 110;
		            }else{
		                grid.speed += 20;
		            }
		        }
		        if (grid.speed<40) {
		            grid.speed=40;
		        };
		        grid.timer = setTimeout(this.rollGrid,grid.speed);//循环调用
		    }
		    return false;
		},
		showResult : function(type,name){
			let title,content,negativeBtnText,positiveBtnText,negativeUrl,positiveUrl;
			title = '&#20013;&#22870;&#25552;&#31034;';
			content = '&#24685;&#21916;&#26412;&#27425;&#25277;&#22870;&#33719;&#24471;'+name;
			if(this.awardtype!=1){
				negativeBtnText = '&#25105;&#30693;&#36947;&#20102;';

			}else if(this.isshowaddr){
				let addrText;
				addrText = '<p class="addr">&#25910;&#36135;&#20154;&#65306;'+this.addr.name+'<br>&#25163;&#26426;&#65306;'+this.addr.tel+'<br>&#81;&#81;&#65306;'+this.addr.qq+'<br>&#22320;&#22336;&#65306;'+this.addr.addr+'</p>';
				content += '&#65292;&#35831;&#30830;&#35748;&#20197;&#19979;&#25910;&#36135;&#22320;&#22336;&#26080;&#35823;&#65292;&#20445;&#35777;&#22870;&#21697;&#30340;&#27491;&#24120;&#21457;&#25918;&#12290;'+addrText;
				negativeBtnText = '&#32534;&#36753;';
				positiveBtnText = '&#30830;&#35748;';
				negativeUrl = 'auth/pshop/addresspage.do';

			}else{
				content += '&#65292;&#35831;&#22312;&#26377;&#25928;&#26399;&#51;&#48;&#22825;&#20869;&#22635;&#20889;&#35814;&#32454;&#25910;&#36135;&#22320;&#22336;&#65292;&#20197;&#30830;&#20445;&#22870;&#21697;&#27491;&#24120;&#21457;&#25918;&#12290;&#32;&#20320;&#21487;&#20197;&#22312;&#29992;&#25143;&#20013;&#24515;&#45;&#27599;&#26085;&#25277;&#22870;&#30028;&#38754;&#20013;&#28857;&#20987;&#21491;&#19978;&#35282;&#22270;&#26631;&#65292;&#22635;&#20889;&#25910;&#36135;&#22320;&#22336;&#12290;';
				negativeBtnText = '&#25105;&#30693;&#36947;&#20102;';
				positiveBtnText = '&#22635;&#20889;&#25910;&#36135;&#22320;&#22336;';
				positiveUrl = 'auth/pshop/addresspage.do';

			}
			Dialog.showDialog(title,content,negativeBtnText,positiveBtnText,negativeUrl,positiveUrl);
			

		},
		showError:function(status){
			let self = this;
			setTimeout(function(){
				self.status = 1;
			},1400);
			if(status==-2 || status==-3){
				this.issetting = true;
				return;
			}
			if(status == -4){
				Toast.showToast('&#25277;&#22870;&#27425;&#25968;&#24050;&#29992;&#23436;&#65292;&#35831;&#20351;&#29992;&#31215;&#20998;&#20817;&#25442;&#12290;');
				return;
			}
			Toast.showToast('&#32593;&#32476;&#24322;&#24120;&#65292;&#35831;&#31245;&#21518;&#20877;&#35797;');
		},
		
	}
});
let rule = new Vue({
	el:'#rule',
	data:{
		modelToString : draw.modelToString
	}
});
$(function(){
	draw.scrollNews();
	draw.initGrid('draw');
});

