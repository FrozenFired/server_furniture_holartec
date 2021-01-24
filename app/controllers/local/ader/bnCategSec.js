const Conf = require('../../../../config/conf.js');
const Stint = require('../../../../config/stint.js');
const MdFilter = require('../../../middle/middleFilter');
const _ = require('underscore');

const BnCategSec = require('../../../models/plat/bnCategSec');
const BnCategFir = require('../../../models/plat/bnCategFir');

exports.adBnCategSecs = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const bnCategSecs = await BnCategSec.find().populate({
			path: 'bnCategFir',
			options: { sort: { weight: -1 }}
		}).sort({'bnCategFir': 1, "weight": -1});
		return res.render('./ader/bnCategSec/list', {title: '品牌二级分类列表', crAder, bnCategSecs });
	} catch(error) {
		return res.redirect('/?info=adBnCategSecs,Error&error='+error);
	}
}

exports.adBnCategSecAdd = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const bnCategFirs = await BnCategFir.find().sort({'weight': -1});
		return res.render('./ader/bnCategSec/add', {title: 'Add 品牌二级分类', crAder, bnCategFirs});
	} catch(error) {
		return res.redirect('/?info=adBnCategSecAdd,Error&error='+error);
	}
}

exports.adBnCategSecNew = async(req, res) => {
	try{
		const obj = req.body.obj

		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.categ.code.regexp);
		if(!regexp.test(obj.code)) {
			return res.redirect('/?info=品牌二级分类编码只能由字母组成');
		} else if(obj.code.length < Stint.extent.categ.code.min || obj.code.length > Stint.extent.categ.code.max) {
			return res.redirect('/?info=品牌二级分类编码长度至少是'+Stint.extent.categ.code.min+'个字符 最多是'+Stint.extent.categ.code.max+'个字符');
		}
		const bnCategFir = BnCategFir.findOne({"_id": obj.bnCategFir});
		if(!bnCategFir) return res.redirect('/?info=一级分类不存在');

		const bnCategSecSame = await BnCategSec.findOne({'code': obj.code});
		if(bnCategSecSame) return res.redirect('/?info=已有此编号，请重新注册');

		const _object = new BnCategSec(obj);
		const bnCategSecSave = await _object.save();
		return res.redirect('/adBnCategSecs');
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adBnCategSecNew,Error&error='+error);
	}
}

exports.adBnCategSecUpdInfo = async(req, res) => {
	try{
		const obj = req.body.obj;
		if(obj.code) return res.redirect('/?info=不允许有账户参数');
		
		const bnCategSec = await BnCategSec.findOne({'_id': obj._id});
		if(!bnCategSec) return res.redirect('/?info=没有找到此品牌二级分类');
		
		const _object = _.extend(bnCategSec, obj);
		const bnCategSecSave = await _object.save();
		return res.redirect("/adBnCategSec/"+bnCategSecSave._id);
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=adBnCategSecUpdInfo,Error&error='+error);
	}
}
exports.adBnCategSecUpdCode = async(req, res) => {
	try{
		const bnCategSecId = req.body.bnCategSecId;
		const bnCategSec = await BnCategSec.findOne({'_id': bnCategSecId});
		if(!bnCategSec) return res.redirect('/?info=没有找到此品牌二级分类');

		code = req.body.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.categ.code.regexp);
		if(!regexp.test(code)) {
			return res.redirect('/?info=品牌二级分类编码只能由字母组成');
		} else if(code.length < Stint.extent.categ.code.min || code.length > Stint.extent.categ.code.max) {
			return res.redirect('/?info=品牌二级分类编码长度至少是'+Stint.extent.categ.code.min+'个字符 最多是'+Stint.extent.categ.code.max+'个字符');
		}

		const bnCategSecSame = await BnCategSec.findOne({'code': code}).where('_id').ne(bnCategSec._id);
		if(bnCategSecSame) return res.redirect('/?info=已有此编号');

		bnCategSec.code = code;
		const bnCategSecSave = await bnCategSec.save();
		return res.redirect("/adBnCategSec/"+bnCategSecSave._id);
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=adBnCategSecUpdCode,Error&error='+error);
	}
}

exports.adBnCategSec = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const bnCategFirs = await BnCategFir.find().sort({'weight': -1});
		const bnCategSec = await BnCategSec.findOne({'_id': id}).populate('bnCategFir');
		if(!bnCategSec) return res.redirect('/?info=没有找到此编号');
		return res.render('./ader/bnCategSec/detail', {title: '品牌二级分类详情', crAder, bnCategFirs, bnCategSec});
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=adBnCategSec,Error&error='+error);
	}
}
exports.adBnCategSecDel = async(req, res) => {
	try{
		const id = req.params.id;
		const bnCategSecDel = await BnCategSec.deleteOne({'_id': id});
		return res.redirect("/adBnCategSecs");
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=adBnCategSecDel,Error&error='+error);
	}
}