const BaseController = require("./base.controller");
const UserService = require("../services/appuser.service");
const bcrypt = require("bcrypt");
const { JWT_SECRET , HASH_PREFIX } = require("../configs/auth.config");
const jwt = require("jsonwebtoken");
const MailerService = require("../services/mailer.service");
const authconfig = require("../configs/auth.config");

class AuthController extends BaseController {

    getUser = async(mail) =>{
        const service = new UserService();
        const users = await service.select({where:`mail = '${mail}'`});
        return users.length === 1 ? users.pop(): null;
    }

    getUsers = async() =>{
        const service = new UserService();
        const users = await service.select();
        return users;
    }
    /* Checking if the email exists in the database. */
    login = async (req) => {
        const service = new UserService();
        const results = await service.select({
           where: `mail = '${req.body.mail} '` ,
        });
        const appuser = results.length === 1 ? results.pop() : null;
        let m = bcrypt.hashSync('test',8);
        console.log(m);
        if(!appuser){
            console.log('req', req.body.password);
            const result = await bcrypt.compare(req.body.password, `${HASH_PREFIX + appuser.password}`);
            if (result){
                const token = jwt.sign({id: appuser.id_app_user, mail: appuser.mail}, /*password: appuser.password},*/JWT_SECRET,{ expiresIn: "1d"}); //dans react sub
                let response = {id: appuser.id_app_user, mail: appuser.mail, /*password: appuser.password*/ token:token, result: true,message: "bienvenue !"};
                console.log(response);
                return response
            }
            return {result: false, message: "identifiant incorrect !"};
        }
        return "login";
    }
    ///*****mehtod refresh ------ renvoi les infos user a partir du cookie **///
    refresh = async (req) => {
        const token = req.cookies.token;
        console.log('token recupéré',token);
        let payload;
        try{
            payload = jwt.verify(token, JWT_SECRET);
            console.log('payload', payload);
        }
        catch{
            return {result: false, message: "payload incorrect !"};
        }
        if (payload){
            let appuser = {
                'id':payload.id,
                'mail':payload.mail,
                'password':payload.password
            }
            console.log(appuser);
            if(appuser){
                return appuser
            }
            else{
                return {result: false, message: "payload incorrect3 !"};
            }
        }
        return {result: false, message: "payload incorrect2 !"};


    }
    register = async (req) => {
         //return "register";
        if(req.method !== 'POST') return {status:405};
        
        const appuser = await this.getUser(req.body.mail);
        if(!appuser){
            const payload = {mail:req.body.mail,password:req.body.password,pseudo:req.body.pseudo};
            const token = jwt.sign(payload, authconfig.JWT_SECRET, { expiresIn: '1d'});

         const html = 
            `

              <b>Confirmez votre Inscription : </b>
              <a href="http://localhost:3000/RegisterValidation?t=${encodeURIComponent(token)}" target="_blank">Confirmer</a>
              `;
             await MailerService.sendMail({to: req.body.mail, subject:"Confirmer votre inscription", html});
            return true;
        }
        return false;
    }
 /* This is checking if the token is valid. If it is, it will return the user's role. */
    validate = async (req) => {

        const token = req.body.token;
        let payload;
        try{
            payload = jwt.verify(token, authconfig.JWT_SECRET);
        }
        catch{
            return {data:{completed:false, message:"Désolé une erreur est survenue ..."}};
        }
        if(payload){
            const service = new UserService();
            const password = (await bcrypt.hash(payload.password,8)).replace(authconfig.HASH_PREFIX,'');
            const user = await service.insertUser({mail:payload.mail, password:password,pseudo:payload.pseudo});
            return user ?
                {data:{completed:true, message:"Bienvenu sur Family Cuisine, votre compte a bien etais activé, vous pouvez vous connecter"}} :
                {data:{completed:false, message:"Une erreur est survenue ...."}} ;
        }
        return {data:{completed:false, message:"L'activation de votre compte a expiré, réinscriver vous ..."}};
    }


        // let data = {completed:true, message: "bienvenue !"};
        // return data;
    
    
       
        //verif mail 
        
        //recueper le token 
        //hash new pass
        //insere new pass bdd
        renewpass = async (req) => {
            if(req.method !== 'POST') return {status:405};
        
            const token = req.body.token;
            let payload
            let appuser
            try{
              payload = jwt.verify(token,authconfig.JWT_SECRET);
              appuser = await this.getappuser(payload.mail);
            }
            catch{
              return {data:{completed:false, message:"Désolé une erreur est survenue ..."}};
            }
            if(payload){
              const usermodify = new UserService();
              const password = (await bcrypt.hash(req.body.password1,8)).replace(authconfig.HASH_PREFIX,'');
              const rows = await usermodify.updateappser({where : appuser.id_app_user ,password:password});
            return true;
          }
          
          return false;
          
        
        
    }
    renewmail = async (req) =>{
        if(req.method !== 'POST') return {status:405};
        
        const appuser = await this.getappuser(req.body.mail);
        if(appuser){
          const payload = {mail: req.body.mail};
          const token = jwt.sign(payload, authconfig.JWT_SECRET, { expiresIn: '1d'});
          const html = 
          `
          <b>Confirmez votre inscription : </b>
          <a href="http://localhost:3000/RenewPassword2?t=${encodeURIComponent(token)}" target="_blank">Confirmer</a>
          
          `;
        //   await MailerService.sendMail({to: req.body.mail, subject:"Confirmer votre inscription", html});
        //     return true;
        }
        return false;
    
      }
  /* The above code is checking if the user has a valid token. If they do, it will return the user's
  role. */
    Account = async (req) => {
        const auth = req.cookies.token.auth;
        if(auth){
            const result = jwt.verify(auth, config.JWT_SECRET);
            if(result){
                return {result:true, role:result.role}
        }
    }
    return {result:false, role:0}
    }
}

module.exports = AuthController;
