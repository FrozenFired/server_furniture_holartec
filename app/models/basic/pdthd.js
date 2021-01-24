const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Pdthd';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},

	brand: {type: ObjectId, ref: 'Brand'},
	pdfir: {type: ObjectId, ref: 'Pdfir'},	// 所属系列
	pdsec: {type: ObjectId, ref: 'Pdsec'},

	code: String,
	price: Float,
	note: String,
	maters: [{type: String}], 			// 材质
	crafts: [{type: String}], 			// 工艺面料

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