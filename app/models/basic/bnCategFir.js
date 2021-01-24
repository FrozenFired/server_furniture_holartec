const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const colection = 'BnCategFir';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},

	code: {unique: true, type: String },	// 分类名称。 比如：PELLI
	nomeIT: String,							// 此分类的英文名称
	nomeEN: String,							// 此分类的英文名称
	nomeCN: String,							// 分类的中文名称

	bncatesecs: [{type: ObjectId, ref: 'BnCategSec'}],	// 包含的二级分类

	weight: Number,							// 权重， 排序用的

	crter: {type: ObjectId, ref: 'User'},		// 创建者
	upder: {type: ObjectId, ref: 'User'},		// 最近更新者
	crtAt: Date,	// 创建的时间
	updAt: Date,	// 最近更新的时间
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {
		this.crtAt = this.updAt = Date.now();
		if(!brandcount) brandcount = 0;
		if(!weight) weight = 0;
	} else {
		this.updAt = Date.now();
	}
	next();
});

const db = mongoose.model(colection, dbSchema);

module.exports = db;