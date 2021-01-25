const MdAuth = require('../middle/middleAuth');
const MdFiles = require('../middle/middleFiles');

const Brand = require('../controllers/api/brand');

module.exports = function(app){
	app.post('/api/brandNew', MdAuth.isBser, MdFiles.mkPicture, Brand.brandNewFunc);
	app.get('/api/brand/:brandId', MdAuth.isUser, Brand.brandFunc);
	app.get('/api/brands', MdAuth.isUser, Brand.brandsFunc)
	app.delete('/api/brandDel/:brandId', MdAuth.isBser, Brand.brandDelFunc)
};