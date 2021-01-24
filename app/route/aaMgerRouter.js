const Mger = require('../controllers/local/mger/mger');
const User = require('../controllers/local/mger/user');
const MdRole = require('../middle/local/middleRole')

module.exports = function(app){
	app.get('/', Mger.index);
	app.post('/loginUser', Mger.loginUser);
	app.get('/logout', Mger.logout);

	app.get('/mger', MdRole.mgerIsLogin, Mger.mger);

	/* =================================== User =================================== */
	app.get('/users', MdRole.mgerIsLogin, User.users)
	app.post('/userNew', MdRole.mgerIsLogin, User.userNew)
	app.get('/user/:userId', MdRole.mgerIsLogin, User.user)
	app.get('/userDel/:userId', MdRole.mgerIsLogin, User.userDel)

	app.post('/userUpdInfo', MdRole.mgerIsLogin, User.userUpd)
	app.post('/userUpdPwd', MdRole.mgerIsLogin, User.userUpd)
};