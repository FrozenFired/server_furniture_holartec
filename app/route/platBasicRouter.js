const PlatBasic = require('../controllers/api/platBasic')

module.exports = function(app){
	app.get('/api/nations', PlatBasic.nationsFunc);
	app.get('/api/bnCategFirs', PlatBasic.bnCategFirsFunc);
	app.get('/api/bnCategSecs', PlatBasic.bnCategSecsFunc);
};

