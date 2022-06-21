const res = require("express/lib/response");
const BaseRouter = require("./base.router");


//AuthRouter hérite de BaseRouter
class AuthRouter extends BaseRouter {


    //*******************creation du constructeur*****************//
    constructor() {
        super();
        this.initalizeRoutes(); // on initialise toute les route de AuthRouter
    }
    /////////////////////////////////////////////////////////////////

    //*****on defini toute les routes avec l'action du controller associé*****//

    initalizeRoutes = () => {
        // /auth/login
        this.router.post("/login", async (req, res, next) => {
            // const response = await this.controller.login(req);
            // res.json(response);
            next(this.controller.login);
            //TODO mettre en 3eme params NEXT voir video du 24/02/22 07:36 mn
        });
        // /auth/register
        this.router.post("/register", async (req, res, next) => {
            // const response = await this.controller.register(req);
            // res.json(response);
            next(this.controller.register);
        });
        // /auth/validate
        this.router.post("/validate", async (req, res, next) => {
            // const response = await this.controller.validate(req);
            // res.json(response);
            next(this.controller.validate);
        });
        // /auth/renew
        this.router.post("/renewpass", async (req, res, next) => {
            // const response = await this.controller.renewpass(req);
            // res.json(response);
            next(this.controller.renewpass);
        });
        this.router.get("/users", async (req, res, next) => {
            // const response = await this.controller.renewpass(req);
            // res.json(response);
            next(this.controller.getUsers);
        });
        // /auth/refresh_token
        this.router.post("/refresh_token", async (req, res, next) => {
            // const response = await this.controller.refresh(req);
            // res.json(response);
            next(this.controller.refresh);
        });
        //auth
        this.router.get("/", async (req, res, next) => {
            // const response = await this.controller.check(req);
            // res.json(response);
            next(this.controller.check);
        });
        this.router.post("/renewmail", async (req, res, next) => {
            // const response = await this.controller.renewmail(req);
            // res.json(response);
            next(this.controller.renewmail);
            console.log(response);

        });
            // /auth/Account
            this.router.get("/Account", async (req, res, next) => {
                // const response = await this.controller.refresh(req);
                // res.json(response);
                next(this.controller.Account);
            });
    }
}




module.exports = AuthRouter;
