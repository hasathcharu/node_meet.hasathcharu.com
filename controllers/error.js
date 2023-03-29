const version = require('../utils/version').version;
exports.get404 = (req, res, next) => {
    let theme = 0;
    if(req.session.isLoggedIn){
        theme = req.session.user.theme;
    }
    res.status(404).render('error/error', { 
        pageTitle: 'Page Not Found',
        pageInfo: 'Sorry the link you followed is broken :(',
        path: '/404' ,
        version: version,
        isLoggedIn: req.session.isLoggedIn,
        user: req.session.user,
        userPage: false,
        version:version,
        theme:theme,
    });
};