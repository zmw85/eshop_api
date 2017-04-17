
module.exports = app => {
    app.use(require('../auth'));

    app.use('/*', (req,res,next) => {
        return res.status(404).json({status:404,data:'The requested resource could not be found.'});
    });

    // error handling
    app.use((err, req, res, next) => {
        res.status(err.status || 500)
            .json({
                message: err.message,
                error: app.get('env') === 'dev' ? err : {}
            })
            .end();
    });

};
