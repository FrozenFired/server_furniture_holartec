module.exports = function(app){
	require('./aaAderRouter')(app);
	require('./aaMgerRouter')(app);

	require('./authRouter')(app);
	require('./userRouter')(app);
	require('./platBasicRouter')(app);
	require('./productRouter')(app);
	require('./brandRouter')(app);
	require('./streamRouter')(app);
};