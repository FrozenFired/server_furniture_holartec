const Index = require('../controllers/local/ader/index');

const Ader = require('../controllers/local/ader/ader'); // ct control

const Firm = require('../controllers/local/ader/firm')
const User = require('../controllers/local/ader/user')
const Nation = require('../controllers/local/ader/nation')
const BnCategFir = require('../controllers/local/ader/bnCategFir')
const BnCategSec = require('../controllers/local/ader/bnCategSec')

const MdRole = require('../middle/local/middleRole')

const multipart = require('connect-multiparty')
const postForm = multipart();

module.exports = function(app){

	/* index --------------- Ader 首页 登录页面 登录 登出---------------------- */
	app.get('/ader', Index.aderHome)
	app.get('/aderLogin', Index.aderLogin)
	app.post('/loginAder', Index.loginAder)
	app.get('/aderLogout', Index.aderLogout)

	/* index -------------------- 添加删除(后期要关闭) ----------------------------- */
	app.get('/aderAdd', Ader.aderAdd)
	app.post('/aderNew', Ader.aderNew)
	app.get('/aderDel/:id', MdRole.aderIsLogin, Ader.aderDel)

	app.get('/aders', MdRole.aderIsLogin, Ader.aders)
	app.get('/ader/:id', MdRole.aderIsLogin, Ader.ader)

	/* Firm ---------------------- Firm ---------------------------------- */
	app.get('/adFirms', MdRole.aderIsLogin, Firm.adFirms)
	app.get('/adFirm/:id', MdRole.aderIsLogin, Firm.adFirm)
	app.get('/adFirmDel/:id', MdRole.aderIsLogin, Firm.adFirmDel)

	app.get('/adFirmAdd', MdRole.aderIsLogin, Firm.adFirmAdd)
	app.post('/adFirmNew', MdRole.aderIsLogin, Firm.adFirmNew)
	app.post('/adFirmUpd', MdRole.aderIsLogin, Firm.adFirmUpd)

	/* user ---------------------- user ---------------------------------- */
	app.get('/adUsers', MdRole.aderIsLogin, User.adUsers)
	app.get('/adUser/:id', MdRole.aderIsLogin, User.adUser)
	app.get('/adUserDel/:id', MdRole.aderIsLogin, User.adUserDel)

	app.post('/adUserUpdInfo', MdRole.aderIsLogin, User.adUserUpdInfo)
	app.post('/adUserUpdCode', MdRole.aderIsLogin, User.adUserUpdCode)
	app.post('/adUserUpdPwd', MdRole.aderIsLogin, User.adUserUpdPwd)

	app.get('/adUserAdd', MdRole.aderIsLogin, User.adUserAdd)
	app.post('/adUserNew', MdRole.aderIsLogin, User.adUserNew)

	/* nation ---------------------- nation ---------------------------------- */
	app.get('/adNations', MdRole.aderIsLogin, Nation.adNations)
	app.get('/adNation/:id', MdRole.aderIsLogin, Nation.adNation)
	app.get('/adNationDel/:id', MdRole.aderIsLogin, Nation.adNationDel)

	app.post('/adNationUpdInfo', MdRole.aderIsLogin, Nation.adNationUpdInfo)
	app.post('/adNationUpdCode', MdRole.aderIsLogin, Nation.adNationUpdCode)

	app.get('/adNationAdd', MdRole.aderIsLogin, Nation.adNationAdd)
	app.post('/adNationNew', MdRole.aderIsLogin, Nation.adNationNew)

	/* bnCategFir ---------------------- bnCategFir ---------------------------------- */
	app.get('/adBnCategFirs', MdRole.aderIsLogin, BnCategFir.adBnCategFirs)
	app.get('/adBnCategFir/:id', MdRole.aderIsLogin, BnCategFir.adBnCategFir)
	app.get('/adBnCategFirDel/:id', MdRole.aderIsLogin, BnCategFir.adBnCategFirDel)

	app.post('/adBnCategFirUpdInfo', MdRole.aderIsLogin, BnCategFir.adBnCategFirUpdInfo)
	app.post('/adBnCategFirUpdCode', MdRole.aderIsLogin, BnCategFir.adBnCategFirUpdCode)

	app.get('/adBnCategFirAdd', MdRole.aderIsLogin, BnCategFir.adBnCategFirAdd)
	app.post('/adBnCategFirNew', MdRole.aderIsLogin, BnCategFir.adBnCategFirNew)

	/* bnCategSec ---------------------- bnCategSec ---------------------------------- */
	app.get('/adBnCategSecs', MdRole.aderIsLogin, BnCategSec.adBnCategSecs)
	app.get('/adBnCategSec/:id', MdRole.aderIsLogin, BnCategSec.adBnCategSec)
	app.get('/adBnCategSecDel/:id', MdRole.aderIsLogin, BnCategSec.adBnCategSecDel)

	app.post('/adBnCategSecUpdInfo', MdRole.aderIsLogin, BnCategSec.adBnCategSecUpdInfo)
	app.post('/adBnCategSecUpdCode', MdRole.aderIsLogin, BnCategSec.adBnCategSecUpdCode)

	app.get('/adBnCategSecAdd', MdRole.aderIsLogin, BnCategSec.adBnCategSecAdd)
	app.post('/adBnCategSecNew', MdRole.aderIsLogin, BnCategSec.adBnCategSecNew)
}