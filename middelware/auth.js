const jwt = require("jsonwebtoken");
const UserModels = require("../models/utilisateur");



module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    UserModels.findOne({_id:userId})
      .then((UserModel) => {
        if (!UserModel) {
          res.status(404).json({
            message: "User non trouvé!",
          });
          
        } else {
          req.auth = {
            userId: userId,
            role:UserModel.role
          };
          next();
        }
      })
      .catch(() => {
        res.status(400).json({
          error: Error.message,
          message: "Données inva!ide",
        });
      });


  } catch (error) {
    res.status(401).json({ error:error.message });
  }
};


module.exports.isadmin = (req, res, next) => {
try{
    if(req.auth.role === "admin")
    {
      next();}
      else {
        res.status(403).json({ error:"no access to this route" });
      }
    
}

catch(e)
{
  res.status(401).json({ e:e.message });
}

};

module.exports.isuser = (req, res, next) => {
  try{
      if(req.auth.role === "user")
      {
        next();}
        else {
          res.status(403).json({ error:"no access to this route" });
        }
      
  }
  
  catch(e)
  {
    res.status(401).json({ e:e.message });
  }
  
  };

  module.exports.isauteur = (req, res, next) => {
    try{
        if(req.auth.role === "author")
        {
          next();}
          else {
            res.status(403).json({ error:"no access to this route" });
          }
        
    }
    
    catch(e)
    {
      res.status(401).json({ e:e.message });
    }
    
    };
  


