let express = require('express');
let router = express.Router();
let Mock = require('mockjs');


router.all('/address.do', (req, res) => {
	let data = {//300　积分不足400　兑换错误500　商品已抢光
		"r":100, 
		"m":"兑换成功/保存成功"

	}
	res.json(data);
})

// 商品兑换接口
router.all('/exchange.do', (req, res) => {
	let data = {
		r: 100,
		m: '虚拟物品兑换成功'
	}
	res.json(data);
})

// 商品详情接口
router.all('/detail.do', (req, res) => {
	let data = {
		r: 200,
		m: '兑换成功'
	}
	res.json(data);
})


module.exports = router;