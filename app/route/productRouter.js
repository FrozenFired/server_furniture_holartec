const Pdfir = require('../models/basic/pdfir');
const MdAuth = require('../middle/middleAuth');

module.exports = function(app){
	app.get('/api/products',  MdAuth.isMger, async(req, res) => {
		// console.log(req.cookies)
		// if(req.cookies.test) {
		// 	console.log("again");
		// } else {
		// 	console.log('first')
		// 	res.cookie('test', 'test1')
		// }
		let page = 2;
		if(req.query.page && !isNaN(parseInt(req.query.page))) {
			page = parseInt(req.query.page);
		}
		let pagesize = 3;
		if(req.query.pagesize && !isNaN(parseInt(req.query.pagesize))) {
			pagesize = parseInt(req.query.pagesize);
		}
		let skip = (page-1)*pagesize;
		try{
			let param = {};
			let count = await Pdfir.countDocuments(param);
			// console.log(count);

			let pdfirs = await Pdfir.find(param)
			.skip(skip).limit(pagesize)
			.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
			// console.log(pdfirs)
			let isMore = 1;
			if(page*pagesize >= count) isMore = 0;

			return res.status(200).json({
				status: 200,
				message: '成功获取',
				data: {pdfirs, count, page, isMore}
			});
		} catch(error) {
			return res.json({status: 500, message: '系统错误, 请联系管理员。 错误码: get/products[1]'})
		}
	});
};
