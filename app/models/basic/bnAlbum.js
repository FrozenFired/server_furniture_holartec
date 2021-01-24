// 图册
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const colection = 'BnAlbum';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},

	/* ===================== 不可更改 ===================== */
	brand: {type: ObjectId, ref: 'Brand'},
	year: Number,

	nome: String, 								// * 品牌名
	description: String,						// !描述

	photo: String,								// 封面
	pdf: String,								// 封面

	shelf: Number,	// 上架 下架
	weight: Number,	// 权重 排序用的

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