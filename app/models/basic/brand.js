const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Brand';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	/* ===================== 基本信息 ===================== */
	code: String,									// * #品牌编号 暂时不用
	nome: String, 									// * 品牌名
	logo: String, 									// * logo
	bnCategSec: {type: ObjectId, ref: 'BnCategSec'},	// 对应的二级分类
	despCateg: String, 									// 自定义 材料 描述 三级分类
	firmNome: String, 								// 所属公司名称
	nation: {type: ObjectId, ref: 'Nation'},		// 所属国家
	website: String,	// 网址备注
	webNote: String,	// 网址备注

	pcycle: String,									// !生产周期
	crtAt: Date,
	updAt: Date,
	crter: {type: ObjectId, ref: 'User'},
	upder: {type: ObjectId, ref: 'User'},

	prdNomes: [{type: ObjectId, ref: 'PrdNome'}],	// 品牌下的品类
	/* ===================== 品牌推广 ==================== */
	bnAlbums: [{type: ObjectId, ref: 'BnAlbum'}],	// 图册
	description: String, 							// !描述
	photo: String,									// 公司海报
	photos: [{type: String}],
	shelf: Number,									// 上架 下架
	weight: Number,									// 权重 排序用的

	/* ===================== 采购折扣管理 ==================== */
	discount: {type: ObjectId, ref: 'Discount'},
	discounts: [{type: ObjectId, ref: 'Discount'}],
	// 价格表
	pircelist: {type: ObjectId, ref: 'BnPricelist'},	// 价格单
	pircelists: [{type: ObjectId, ref: 'BnPricelist'}],	// 历史价格单

});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = -1;
		if(!this.weight) this.weight = 0;
		this.updAt = this.crtAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);