import $ from 'jquery';

import "styles/common.styl";
import addrStyles from './address.styl';
import AndroidClient from 'commons/AndroidClient';

export default function() {
	// 设置title
	AndroidClient.setActionBar('我的收获地址',true,false,'编辑');

	// 右边按钮点击跳转到编辑页面
	AndroidClient.onActionBarRightButtonClick(function() {
		location.href = 'edit.html';
	})
	console.log($('#J_confirm'))
	$('#J_confirm').on('click', function(evt) {
		console.log(evt)
	})
}

