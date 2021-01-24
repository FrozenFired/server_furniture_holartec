const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Stream';
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},		// 所属公司
	correspond: {type: ObjectId, ref: 'Firm'},	// 对应公司
	
	categStream: Number,					// 合作类型

	code: {type: String, required: true},					// 公司编号
	nome: String, 											// 公司名称 比如6B
	nick: String, 											// 公司代称 6B的代称可能是A公司 防止客户公司知道供应商
	note: String, 											// 备注
	nation: {type: ObjectId, ref: 'Nation'},		// 所属国家
	resp: String,// 负责人
	addr: String, 
	tel: String,
	email: String,
	contacts: [{							// 联系人
		contacter: String,
		tel: String,
		email: String
	}],

	ac: String,								// 首款比例
	sa: String,								// 尾款比例
	payNote: String,						// 首位款比例备注

	freight: String,						// 运输方式 	留用
	note: String,							// 备注		留用

	discounts: [{type: ObjectId, ref: 'Discount'}],

	shelf: Number,	// 上架 下架
	weight: Number,	// 权重 排序用的
	crtAt: Date,
	updAt: Date,
	crter: {type: ObjectId, ref: 'User'},
	upder: {type: ObjectId, ref: 'User'},
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