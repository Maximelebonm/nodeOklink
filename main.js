require("./api/helpers/string.helper");

//initialisation de expresse

const express = require("express");

const app = express();

//////////////////////////////////////////////

//permet d'autoriser les requete provenant de localhost 3000 donc react front 

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:52371"],
    credentials:true
  })
);
///////////////////////////////////////////////

//permet de recupérer le json qui va arrivé
app.use(express.json());
///////////////////////////////////////////////

//*servira pour l'authentification 
//*meme chose mais pour le cookies "cookieParser" est inclus dans express 
//!avant il fallait tapé bodyPaser.json

const cookieParser = require("cookie-parser");
app.use(cookieParser());
///////////////////////////////////////////////


// on declare les routes

const routers = require("./api/routers");
const auth = require("./api/middelwares/auth.middewares")
for (const route in routers) {
  const router = new routers[route]().router;
  app.use(`/${route}`, router,auth);
}
///////////////////////////////////////////////
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});




/*Authentification – étape 4
Créer une base de données avec une table user (id/email/password/role/deleted)
Créer un fichier config dans l'api node qui servira pour la connection à la base de données.
Créer un service de base (BaseService) et un service UserService qui en hérite.
Dans BaseService, créer les méthodes :
- pour se connecter à la base de donnée (connect)
- pour exécuter une requête (query)
- pour faire un select avec une condition (select)
Testez à chaque étape.
Dans AuthController, coder la méthode login qui dois retourner : 
- si l'authentification s'est bien passée, un objet ayant cette structure :
{
    email,
     role,
    token,
    result : true,
    message
}
- si l'authentification ne s'est pas bien passée, un objet ayant cette structure :
{
    result : false,
    message
}*/