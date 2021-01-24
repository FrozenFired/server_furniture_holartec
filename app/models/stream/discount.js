const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Discount';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司

	/* ===================== 不可更改 ===================== */
	brand: {type: ObjectId, ref: 'Brand'},
	stream: {type: ObjectId, ref: 'Stream'},

	iva: String,						// iva
	discount: Number,					// 折扣
	note: String,						// 备注

	shelf: Number,	// 上架 下架
	weight: Number,	// 权重 排序用的
	crter: {type: ObjectId, ref: 'User'},
	upder: {type: ObjectId, ref: 'User'},
	crtAt: Date,
	updAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = 0;
		if(!this.weight) this.weight = 0;
		this.updAt = this.crtAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);