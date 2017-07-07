import config from 'commons/config';
import util from 'commons/util';
import address from './address';
import edit from './edit';

let module = util.getModule();

// 我的收货地址
if (module == 'address') {
	address()
}
// 编辑收货地址
if (module == 'edit') {
	edit() 
}