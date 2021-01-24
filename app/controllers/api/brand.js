const Conf = require('../../../config/conf.js');
const Brand = require('../../models/basic/brand');
const MdFilter = require('../../middle/middleFilter');

exports.brandFunc = async(req, res) => {
	// console.log("/brand")
	try {
		const crUser = req.user;
		const brandId = req.params.brandId;
		const {param, filter} = brandParamFilter(req.params.brandId, crUser);
		const brand = await Brand.findOne(param, filter)
		.populate("nation", "code")
		.populate({path: "bnCategSec", populate: {path: "bnCategFir"}})
		.populate({path: "discounts", populate: {path: "stream"}})
		if(!brand) return res.json({status: 400, message: "没有此品牌"});
		// console.log(brand)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {brand}
		});
	} catch(error) {
		console.log(error)
		res.json({status: 400, message: error})
	}
}
const brandParamFilter = (brandId, crUser) => {
	const param = {
		"firm": crUser.firm,
		"_id": brandId
	};

	const filter = {'pwd': 0, 'refreshToken': 0};

	if(!Conf.roleAdmins.includes(crUser.role)) {
		param.stream = crUser.stream;
	}

	return {param, filter};
}

exports.brandNewFunc = async(req, res) => {
	try {
		const obj = req.body.obj;
		const crUser = req.user;
		if(crUser.role >= obj.role) return res.json({status: 403, message: "您的权限不足"});
		obj.code = await MdFilter.userCode_FilterProm(obj.code);
		const existUser = await User.findOne({"code": obj.code, "firm": obj.firm});
		if(existUser) return res.json({status: 400, message: '已经有此账号, 请重更换账号'});

		obj.pwd = await MdFilter.userPwdBcrypt_FilterProm(obj.pwd);
		obj.firm = crUser.firm;

		const _object = new User(obj)
		const newUser = await _object.save();
		res.json({status: 200, message: '创建成功'})
	} catch(error) {
		console.log(error)
		res.json({status: 400, message: error})
	}
}

exports.brandsFunc = async(req, res) => {
	// console.log("/brands")
	try{
		const crUser = req.user;
		const {param, filter, sortBy, page, pagesize, skip} = brandsParamFilter(req, crUser);

		const count = await Brand.countDocuments(param);
		// console.log(count);

		const brands = await Brand.find(param, filter)
		.populate("nation", "code")
		.populate("bnCategSec", "code")
		.skip(skip).limit(pagesize)
		.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
		// console.log(count)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {brands, count, page, pagesize}
		});
	} catch(error) {
		return res.json({status: 500, message: '系统登录错误, 请联系管理员。 错误码: get/brands[1]'})
	}
}

const brandsParamFilter = (req, crUser) => {
	let param = {
		"firm": crUser.firm,
	};
	const filter = {};
	const sortBy = {};

	if(req.query.nome) {
		let symbConb = String(req.query.nome)
		symbConb = symbConb.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		symbConb = new RegExp(symbConb + '.*');
		param["nome"] = {'$in': symbConb};
	}

	if(!Conf.roleAdmins.includes(crUser.role)) {
		filter.discounts = 0
	}

	if(req.query.sortKey && req.query.sortVal) {
		let sortKey = req.query.sortKey;
		let sortVal = parseInt(req.query.sortVal);
		if(!isNaN(sortVal) && (sortVal == 1 || sortVal == -1)) {
			sortBy[sortKey] = sortVal;
		}
	}

	sortBy['shelf'] = -1;
	sortBy['updAt'] = -1;

	const {page, pagesize, skip} = MdFilter.page_Filter(req);
	return {param, filter, sortBy, page, pagesize, skip};
}
