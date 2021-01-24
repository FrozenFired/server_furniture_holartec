const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Pdfir';							// 系列
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},

	brand: {type: ObjectId, ref: 'Brand'},			// 所属品牌

	code: String,									// 产品编号
	nome: String,									// 产品系列名称

	photo: String,									// 系列默认图片
	photos: [{type: String}],						// 系列其他图片

	prdNomes: [{type: ObjectId, ref: 'PrdNome'}],	// 所属品类
	prdCategSpace: {type: ObjectId, ref: 'PrdCateg'},

	description: String,							// 系列描述
	website: String,

	shelf: Number,									// 上架 下架
	weight: Number,									// 权重 排序用的
	crtAt: Date,
	updAt: Date,
	crter: {type: ObjectId, ref: 'User'},
	upder: {type: ObjectId, ref: 'User'},
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