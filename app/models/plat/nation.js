const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const colection = 'Nation';
const dbSchema = new Schema({
	code: {
		unique: true,
		type: String
	},
	nome: String, // 本国名字
	nomeEN: String,	// 英语名字
	nomeCN: String,	// 中文名字
	tel : String,
	weight:  { type: Number, default: 0 },
});

dbSchema.pre('save', function(next) {	
	if(this.isNew) {}
	next()
});

const db = mongoose.model(colection, dbSchema);

module.exports = db;