const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Pdsec';			// 产品编号
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},

	brand: {type: ObjectId, ref: 'Brand'},
	pdfir: {type: ObjectId, ref: 'Pdfir'},	// 所属系列

	photo: String,		// 照片

	code: String,		// 产品编号
	nome: String,
	spec: String, 		// 产品规格 尺寸

	shelf: Number,	// 上架 下架
	weight: Number,	// 权重 排序用的

	crtAt: Date,
	updAt: Date,
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = 1;
		if(!this.weight) this.weight = 0;
		this.updAt = this.crtAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);