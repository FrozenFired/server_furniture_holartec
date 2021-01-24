const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const colection = 'PrdNome';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},

	code: String,						// 暂时不用
	nome: String,						// 默认名称 
	nomeEN: String,						// 英文名称 以英文为默认值
	nomeCN: String,						// 中文名称
	nomeIt: String,						// 意大利文

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