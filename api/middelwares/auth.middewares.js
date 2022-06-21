const jwt = require('jsonwebtoken');
const config = require('../configs/auth.config');

class AuthMiddleware {

/* The above code is checking to see if the route is restricted. If it is, it checks to see if the user
is logged in. If they are, it checks to see if the user has the correct permissions to access the
route. If they do, it calls the action and returns the data. If they don't, it returns an error. */
    static checkAuth = async (action, req, res, next) => {

        const route = Object.keys(config.RESTRICTED_ROUTES).find(route => req.originalUrl.match(route));
        if(route){
            const predicate = config.RESTRICTED_ROUTES[route];
            const auth = req.cookies.token;
            if(auth){
                const result = jwt.verify(auth, config.JWT_SECRET);
                if(result && predicate(result, res.locals)){
                    const data = await action(req, res);
                    return res.json(data);
                }
            }

            //todo faire les routes du middewares.
            return res.json({result:false, message:"Unauthorized access"});
        }
        const data = await action(req, res);
        return res.json(data);
      
    }
  
} 
module.exports = AuthMiddleware.checkAuth;

