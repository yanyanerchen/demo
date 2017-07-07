import $ from 'jquery';
import Vue from 'vue';

import config from 'commons/config';
import infiniteScroll  from 'vue-infinite-scroll';

import "styles/common.styl";
import styles from './styles.styl'; 

new Vue({
	directives: { infiniteScroll }
})

var count = 0;

new Vue({
	el: '#app',

	data: {
		data: [],
		busy: false
	},

	methods: {
		loadMore: function() {
		  	this.busy = true;
		  	let self = this;
		  	console.log('1111')
		  	$.ajax({
		  		url: 'https://api.github.com/repos/typecho-fans/plugins/contents/',
		  		type: 'GET'
		  	}).then(function(data) {
		  		self.data = self.data.concat(data);
		  		self.busy = false;
		  	})
		}
	}
});