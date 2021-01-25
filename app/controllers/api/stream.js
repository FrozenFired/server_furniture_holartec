const Conf = require('../../../config/conf.js');
const Stream = require('../../models/stream/stream');
const MdFilter = require('../../middle/middleFilter');

exports.streamFunc = async(req, res) => {
	// console.log("/stream")
	try {
		const crUser = req.user;
		const streamId = req.params.streamId;
		const {param, filter} = streamParamFilter(req.params.streamId, crUser);
		// console.log(param)
		const stream = await Stream.findOne(param, filter)
		.populate({path: "discounts", populate: {path: "brand"}})
		if(!stream) return res.json({status: 400, message: "没有此品牌"});
		// console.log(stream)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {stream}
		});
	} catch(error) {
		console.log(error)
		res.json({status: 400, message: error})
	}
}
const streamParamFilter = (streamId, crUser) => {
	const param = {
		"firm": crUser.firm,
		"_id": streamId
	};

	const filter = {'pwd': 0, 'refreshToken': 0};

	if(!Conf.roleAdmins.includes(crUser.role)) {
		param.stream = crUser.stream;
	}

	return {param, filter};
}

exports.streamNewFunc = async(req, res) => {
	try {
		const obj = req.body.obj;
		const crUser = req.user;
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
exports.streamsFunc = async(req, res) => {
	console.log("/streams");
	try{
		const crUser = req.user;
		const {param, filter, sortBy, page, pagesize, skip} = streamsParamFilter(req, crUser);
		console.log(param);

		const count = await Stream.countDocuments(param);
		// console.log(count);

		const streams = await Stream.find(param, filter)
		.skip(skip).limit(pagesize)
		.sort({'shelf': -1, 'weight': -1, 'updAt': -1})
		// console.log(count)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {streams, count, page, pagesize}
		});
	} catch(error) {
		return res.json({status: 500, message: '系统登录错误, 请联系管理员。 错误码: get/streams[1]'});
	}
}

const streamsParamFilter = (req, crUser) => {
	let param = {
		"firm": crUser.firm,
	};
	const filter = {};
	const sortBy = {};

	if(req.query.code) {
		let symbConb = String(req.query.code)
		symbConb = symbConb.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		symbConb = new RegExp(symbConb + '.*');
		param["code"] = {'$in': symbConb};
	}
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
