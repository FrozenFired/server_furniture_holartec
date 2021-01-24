const Conf = require('../../../config/conf.js');
const Nation = require('../../models/plat/nation');
const BnCategFir = require('../../models/plat/bnCategFir');
const BnCategSec = require('../../models/plat/bnCategSec');
const MdFilter = require('../../middle/middleFilter');

exports.bnCategSecsFunc = async(req, res) => {
	try {
		const {param, filter, sortBy, page, pagesize, skip} = paramFilter_PlatBasic(req);
		if(req.query.bnCategFir) {
			const bnCategFir = await BnCategFir.findOne({"_id": req.query.bnCategFir});
			if(bnCategFir) param.bnCategFir = bnCategFir._id;
		}

		const count = await BnCategSec.countDocuments(param);
		const bnCategSecs = await BnCategSec.find(param, filter).skip(skip).limit(pagesize).sort(sortBy);
		// let isMore = 1; if(page*pagesize >= count) isMore = 0;

		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {bnCategSecs, count, page, pagesize}
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}
exports.bnCategFirsFunc = async(req, res) => {
	try {
		const {param, filter, sortBy, page, pagesize, skip} = paramFilter_PlatBasic(req);
		// console.log(param)
		const count = await BnCategFir.countDocuments(param);
		const bnCategFirs = await BnCategFir.find(param, filter).skip(skip).limit(pagesize).sort(sortBy);

		// let isMore = 1; if(page*pagesize >= count) isMore = 0;

		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {bnCategFirs, count, page, pagesize}
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}
exports.nationsFunc = async(req, res) => {
	try {
		const {param, filter, sortBy, page, pagesize, skip} = paramFilter_PlatBasic(req);
		// console.log(param)
		const count = await Nation.countDocuments(param);
		const nations = await Nation.find(param, filter).skip(skip).limit(pagesize).sort(sortBy);

		// let isMore = 1; if(page*pagesize >= count) isMore = 0;

		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {nations, count, page, pagesize}
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}


const paramFilter_PlatBasic = (req) => {
	const param = {};

	if(req.query.code) {
		let condition = String(req.query.code);
		condition = condition.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		condition = new RegExp(condition + '.*');
		param.code = {'$in': condition};
	}

	if(req.query.nome) {
		let condition = String(req.query.nome);
		condition = condition.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		condition = new RegExp(condition + '.*');
		param.nome = {'$in': condition};
	}

	if(req.query.nomeEN) {
		let condition = String(req.query.nomeEN);
		condition = condition.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		condition = new RegExp(condition + '.*');
		param.nomeEN = {'$in': condition};
	}

	if(req.query.nomeCN) {
		let condition = String(req.query.nomeCN);
		condition = condition.replace(/(\s*$)/g, "").replace( /^\s*/, '');
		condition = new RegExp(condition + '.*');
		param.nomeCN = {'$in': condition};
	}
	if(req.query.tel) {
		let condition = String(req.query.tel);
		condition = condition.replace(/(\s*$)/g, "").replace( /^\s*/, '');
		condition = new RegExp(condition + '.*');
		param.tel = {'$in': condition};
	}

	const filter = {};
	let sortBy = {};
	if(req.query.sortKey && req.query.sortVal) {
		let sortKey = req.query.sortKey;
		let sortVal = parseInt(req.query.sortVal);
		if(!isNaN(sortVal) && (sortVal == 1 || sortVal == -1)) {
			sortBy[sortKey] = sortVal;
		}
	}
	sortBy['weight'] = -1;
	sortBy['code'] = 1;

	const {page, pagesize, skip} = MdFilter.page_Filter(req, 10);
	return {param, filter, sortBy, page, pagesize, skip};
}