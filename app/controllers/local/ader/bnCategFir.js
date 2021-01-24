const Conf = require('../../../../config/conf.js');
const Stint = require('../../../../config/stint.js');
const MdFilter = require('../../../middle/middleFilter');
const _ = require('underscore');

const BnCategFir = require('../../../models/plat/bnCategFir');

exports.adBnCategFirs = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const bnCategFirs = await BnCategFir.find().sort({'weight': -1})
		return res.render('./ader/bnCategFir/list', {title: '品牌一级分类列表', crAder, bnCategFirs })
	} catch(error) {
		return res.redirect('/?info=adBnCategFirs,Error&error='+error)
	}
}

exports.adBnCategFirAdd = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		return res.render('./ader/bnCategFir/add', {title: 'Add 品牌一级分类', crAder})
	} catch(error) {
		return res.redirect('/?info=adBnCategFirAdd,Error&error='+error)
	}
}

exports.adBnCategFirNew = async(req, res) => {
	try{
		const obj = req.body.obj

		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.categ.code.regexp);
		if(!regexp.test(obj.code)) {
			return res.redirect('/?info=品牌一级分类编码只能由字母组成');
		} else if(obj.code.length < Stint.extent.categ.code.min || obj.code.length > Stint.extent.categ.code.max) {
			return res.redirect('/?info=品牌一级分类编码长度至少是'+Stint.extent.categ.code.min+'个字符 最多是'+Stint.extent.categ.code.max+'个字符');
		}
				
		const bnCategFirSame = await BnCategFir.findOne({'code': obj.code});
		if(bnCategFirSame) return res.redirect('/?info=已有此编号，请重新注册');

		const _object = new BnCategFir(obj)
		const bnCategFirSave = await _object.save();
		return res.redirect('/adBnCategFirs')
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adBnCategFirNew,Error&error='+error)
	}
}

exports.adBnCategFirUpdInfo = async(req, res) => {
	try{
		const obj = req.body.obj
		if(obj.code) return res.redirect('/?info=不允许有账户参数');
		
		const bnCategFir = await BnCategFir.findOne({'_id': obj._id})
		if(!bnCategFir) return res.redirect('/?info=没有找到此品牌一级分类');
		
		const _object = _.extend(bnCategFir, obj)
		const bnCategFirSave = await _object.save();
		return res.redirect("/adBnCategFir/"+bnCategFirSave._id)
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adBnCategFirUpdInfo,Error&error='+error)
	}
}
exports.adBnCategFirUpdCode = async(req, res) => {
	try{
		const bnCategFirId = req.body.bnCategFirId
		const bnCategFir = await BnCategFir.findOne({'_id': bnCategFirId})
		if(!bnCategFir) return res.redirect('/?info=没有找到此品牌一级分类');

		code = req.body.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.categ.code.regexp);
		if(!regexp.test(code)) {
			return res.redirect('/?info=品牌一级分类编码只能由字母组成');
		} else if(code.length < Stint.extent.categ.code.min || code.length > Stint.extent.categ.code.max) {
			return res.redirect('/?info=品牌一级分类编码长度至少是'+Stint.extent.categ.code.min+'个字符 最多是'+Stint.extent.categ.code.max+'个字符');
		}

		const bnCategFirSame = await BnCategFir.findOne({'code': code}).where('_id').ne(bnCategFir._id);
		if(bnCategFirSame) return res.redirect('/?info=已有此编号');

		bnCategFir.code = code;
		const bnCategFirSave = await bnCategFir.save();
		return res.redirect("/adBnCategFir/"+bnCategFirSave._id);
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adBnCategFirUpdCode,Error&error='+error)
	}
}

exports.adBnCategFir = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const bnCategFir = await BnCategFir.findOne({'_id': id});
		if(!bnCategFir) return res.redirect('/?info=没有找到此编号');
		return res.render('./ader/bnCategFir/detail', {title: '品牌一级分类详情', crAder, bnCategFir});
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adBnCategFir,Error&error='+error)
	}
}
exports.adBnCategFirDel = async(req, res) => {
	try{
		const id = req.params.id;
		const bnCategFirDel = await BnCategFir.deleteOne({'_id': id});
		return res.redirect("/adBnCategFirs");
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adBnCategFirDel,Error&error='+error)
	}
}