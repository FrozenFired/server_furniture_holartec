const Conf = require('../../../../config/conf.js');
const Stint = require('../../../../config/stint.js');
const MdFilter = require('../../../middle/middleFilter');
const _ = require('underscore');

const Nation = require('../../../models/plat/nation');

exports.adNations = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const nations = await Nation.find().sort({'weight': -1})
		return res.render('./ader/nation/list', {title: '国家列表', crAder, nations })
	} catch(error) {
		return res.redirect('/?info=adNations,Error&error='+error)
	}
}

exports.adNationAdd = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		return res.render('./ader/nation/add', {title: 'Add 国家', crAder})
	} catch(error) {
		return res.redirect('/?info=adNationAdd,Error&error='+error)
	}
}

exports.adNationNew = async(req, res) => {
	try{
		const obj = req.body.obj

		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.nation.code.regexp);
		if(!regexp.test(obj.code)) {
			return res.redirect('/?info=国家编码只能由字母组成');
		} else if(obj.code.length < Stint.extent.nation.code.min || obj.code.length > Stint.extent.nation.code.max) {
			return res.redirect('/?info=国家编码长度至少是'+Stint.extent.nation.code.min+'个字符 最多是'+Stint.extent.nation.code.max+'个字符');
		}
				
		const nationSame = await Nation.findOne({'code': obj.code});
		if(nationSame) return res.redirect('/?info=已有此国家编码，请重新注册');

		const _object = new Nation(obj)
		const nationSave = await _object.save();
		return res.redirect('/adNations')
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adNationNew,Error&error='+error)
	}
}

exports.adNationUpdInfo = async(req, res) => {
	try{
		const obj = req.body.obj
		if(obj.code) return res.redirect('/?info=不允许有账户参数');
		
		const nation = await Nation.findOne({'_id': obj._id})
		if(!nation) return res.redirect('/?info=没有找到此国家');
		
		const _object = _.extend(nation, obj)
		const nationSave = await _object.save();
		return res.redirect("/adNation/"+nationSave._id)
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adNationUpdInfo,Error&error='+error)
	}
}
exports.adNationUpdCode = async(req, res) => {
	try{
		const nationId = req.body.nationId
		const nation = await Nation.findOne({'_id': nationId})
		if(!nation) return res.redirect('/?info=没有找到此国家');

		code = req.body.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.nation.code.regexp);
		if(!regexp.test(code)) {
			return res.redirect('/?info=国家编码只能由字母组成');
		} else if(code.length < Stint.extent.nation.code.min || code.length > Stint.extent.nation.code.max) {
			return res.redirect('/?info=国家编码长度至少是'+Stint.extent.nation.code.min+'个字符 最多是'+Stint.extent.nation.code.max+'个字符');
		}

		const nationSame = await Nation.findOne({'code': code}).where('_id').ne(nation._id);
		if(nationSame) return res.redirect('/?info=已有此国家编码');

		nation.code = code;
		const nationSave = await nation.save();
		return res.redirect("/adNation/"+nationSave._id);
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adNationUpdCode,Error&error='+error)
	}
}

exports.adNation = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const nation = await Nation.findOne({'_id': id});
		if(!nation) return res.redirect('/?info=没有找到此国家编码');
		return res.render('./ader/nation/detail', {title: '国家详情', crAder, nation});
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adNation,Error&error='+error)
	}
}
exports.adNationDel = async(req, res) => {
	try{
		const id = req.params.id;
		const nationDel = await Nation.deleteOne({'_id': id});
		return res.redirect("/adNations");
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adNationDel,Error&error='+error)
	}
}