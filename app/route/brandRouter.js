const MdAuth = require('../middle/middleAuth');

const Brand = require('../controllers/api/brand')

module.exports = function(app){
	app.post('/api/brandNew', MdAuth.isBser, Brand.brandNewFunc);
	app.get('/api/brand/:brandId', MdAuth.isBser, Brand.brandFunc);
	app.get('/api/brands', MdAuth.isUser, Brand.brandsFunc)

};