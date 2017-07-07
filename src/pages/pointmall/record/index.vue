<script>

import $ from 'jquery';
import Vue from 'vue';
import Scroll from 'components/scroll';
import styles from './styles.styl'; 

export default{
    data (){
        return {
            counter : 1, //默认已经显示出15条数据 count等于一是让从16条开始加载
            num : 15,  // 一次显示多少条
            pageStart : 0, // 开始页数
            pageEnd : 0, // 结束页数
            listdata: [], // 下拉更新数据存放数组
            downdata: []  // 上拉更多的数据存放数组
        }
    },       
    mounted: function() {
        console.log("test");
            this.getList();
        },
        methods: {
            getList(){
                let self = this;
                $.ajax({
                    url:'auth/draw/record.do',
                    method:'GET',
                    success:function(result){
                        self.listdata = result.rs;
                    }
                });
            },
            onRefresh(done) {
                  this.getList();
             
                  done() // call done
            
            },
            onInfinite(done) {
                let vm = this;
                vm.$http.get('https://api.github.com/repos/typecho-fans/plugins/contents/')
                    .then((response) => {
                        vm.counter++;
                        vm.pageEnd = vm.num * vm.counter;
                        vm.pageStart = vm.pageEnd - vm.num;
                        let arr = response.data;
                        let i = vm.pageStart;
                        let end = vm.pageEnd;
                        for(; i<end; i++){
                            let obj ={};
                            obj["name"] = arr[i].name;
                            vm.downdata.push(obj);
                            if((i + 1) >= response.data.length){
                                this.$el.querySelector('.load-more').style.display = 'none';
                                return;
                            }
                        }
                        done() // call done
                    }, (response) => {
                        console.log('error');
                    });
                }
            },
            components : {
                'v-scroll': Scroll
            }
        }
    };
<script>