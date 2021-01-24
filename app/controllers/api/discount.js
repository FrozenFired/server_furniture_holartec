const Conf = require('../../../config/conf.js');
const Discount = require('../../models/stream/discount');
const Stream = require('../../models/stream/stream');
const Brand = require('../../models/basic/brand');
const MdFilter = require('../../middle/middleFilter');


exports.discountFunc = async(req, res) => {
	// console.log("/discount")
	try {
		const crUser = req.user;
		const discountId = req.params.discountId;
		const {param, filter} = discountParamFilter(req.params.discountId, crUser);
		const discount = await Discount.findOne(param, filter)
		.populate("brand", "nome")
		.populate("stream", "code")
		// .populate("discounts")
		// .populate({path: "discounts", populate: {path: "discount"}})
		if(!discount) return res.json({status: 400, message: "没有此品牌"});
		// console.log(discount)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {discount}
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}
const discountParamFilter = (discountId, crUser) => {
	const param = {
		"firm": crUser.firm,
		"_id": discountId
	};

	const filter = {'pwd': 0, 'refreshToken': 0};

	if(!Conf.roleAdmins.includes(crUser.role)) {
		param.discount = crUser.discount;
	}

	return {param, filter};
}

exports.discountNewFunc = async(req, res) => {
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
exports.discountsFunc = async(req, res) => {
	// console.log("/discounts")
	try{
		const crUser = req.user;
		const {param, filter, sortBy, page, pagesize, skip} = await discountsParamFilter(req, crUser);
		// console.log(param);

		const count = await Discount.countDocuments(param);
		// console.log(count);

		const discounts = await Discount.find(param, filter)
		.populate("brand", "nome")
		.populate("stream", "code")
		.skip(skip).limit(pagesize)
		.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
		// console.log(discounts)
		
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {discounts, count, page, pagesize}
		});
	} catch(error) {
		return res.json({status: 500, message: '系统登录错误, 请联系管理员。 错误码: get/discounts[1]'})
	}
}

const discountsParamFilter = async(req, crUser) => {
	let brandIds = [];
	if(req.query.brand) {
		let symbConb = String(req.query.brand)
		symbConb = symbConb.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		symbConb = new RegExp(symbConb + '.*');
		const brands = await Brand.find({"firm": crUser.firm, nome: {"$in": symbConb}}, {"_id": 1});
		for(let i=0; i<brands.length; i++) {
			brandIds.push(brands[i]._id);
		}
	}
	let streamIds = [];
	if(req.query.stream) {
		let symbConb = String(req.query.stream)
		symbConb = symbConb.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		symbConb = new RegExp(symbConb + '.*');
		const streams = await Stream.find({"firm": crUser.firm, code: {"$in": symbConb}}, {"_id": 1});
		for(let i=0; i<streams.length; i++) {
			streamIds.push(streams[i]._id);
		}
	}

	return new Promise((resolve, reject) => {
		try {
			const param = {"firm": crUser.firm};
			const filter = {};
			const sortBy = {};

			if(brandIds && brandIds.length > 0) {
				param.brand = {"$in": brandIds}
			}
			if(streamIds && streamIds.length > 0) {
				param.stream = {"$in": streamIds}
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
			resolve({param, filter, sortBy, page, pagesize, skip});
		} catch(error) {
			reject(error);
		}
	})
}
