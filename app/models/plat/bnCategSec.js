const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const colection = 'BnCategSec';
const dbSchema = new Schema({
	code: {unique: true, type: String },	// 分类名称。 比如：PELLI
	nome: String,							// 此分类的意大利语名称
	nomeEN: String,							// 此分类的英文名称
	nomeCN: String,							// 分类的中文名称

	bnCategFir: {type: ObjectId, ref: 'BnCategFir'},	// 对应的一级分类

	weight: Number,							// 权重， 排序用的
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {} else {}
	next();
});

const db = mongoose.model(colection, dbSchema);

module.exports = db;