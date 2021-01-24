const MdAuth = require('../middle/middleAuth');

const Stream = require('../controllers/api/stream');
const Discount = require('../controllers/api/discount');

module.exports = function(app){
	app.post('/api/streamNew', MdAuth.isBser, Stream.streamNewFunc);
	app.get('/api/stream/:streamId', MdAuth.isBser, Stream.streamFunc);
	app.get('/api/streams', MdAuth.isUser, Stream.streamsFunc)

	app.post('/api/discountNew', MdAuth.isBser, Discount.discountNewFunc);
	app.get('/api/discount/:discountId', MdAuth.isBser, Discount.discountFunc);
	app.get('/api/discounts', MdAuth.isUser, Discount.discountsFunc)
};