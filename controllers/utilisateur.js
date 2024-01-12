const User = require("../models/utilisateur");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Publication = require("../models/publication");

module.exports.addAdmin = (req, res) => {
    bcrypt
    .hash(req.body.motDePasse, 10)
    .then((hash) => {
    const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        login: req.body.login,
        motDePasse: hash,
        role: 'admin',
        statut: 'V', // Statut validé pour l'admin
    });
    user
    .save()
    .then((response) => {
      const newUser = response.toObject();
      delete newUser.password;
      res.status(201).json({
        user: newUser,
        message: "admin crée",
      });
    })
    .catch((error) => res.status(400).json({ error:error.message }));
})
.catch((error) => res.status(400).json({ error:error.message }));
};


module.exports.registerAuthor = async (req, res) => {
    try {
      // Créez un nouvel utilisateur avec le rôle 'author' et le statut 'EA' (en attente)
      const author = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        login: req.body.login,
      });
  
      // Sauvegardez l'auteur dans la base de données
      await author.save();
  
      res.status(201).json({ message: "Inscription en attente. Attendez la validation." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur lors de l'inscription de l'auteur" });
    }
  };



  module.exports.login=(req,res,next)=>{
    User.findOne({login:req.body.login})
    .then((user)=>{
       if(!user){
           return res
           .status(401)
           .json({message:"Login ou mot passe incorrecte"})
   
       }
       bcrypt
       .compare(req.body.motDePasse,user.motDePasse)
       .then((valid)=>{
        if(!valid){
           return res
           .status(401)
           .json({message:"Login ou mot passe incorrecte"})
        }
        res.status(200).json({
           token:jwt.sign({userId:user._id},"RANDOM_TOKEN_SECRET",{
               expiresIn:"24h",
           }),
       })
        })
        .catch((error)=>res.status(500).json({error}))
   
       })
       .catch((error)=>res.status(500).json({error}))
    };
  


    module.exports.validateAuthor = async (req, res) => {
        try {
          const authorId = req.params.id;
      
          console.log(`Tentative de validation de l'auteur avec l'ID : ${authorId}`);
      
          // Mettez à jour le statut de l'auteur à "V" (validé)
          const updatedAuthor = await User.findByIdAndUpdate(authorId, { statut: 'V' });
      
          console.log('Auteur mis à jour :', updatedAuthor);
      
          // Vérifiez si l'auteur a été trouvé
          if (!updatedAuthor) {
            console.log(`Auteur avec l'ID ${authorId} non trouvé.`);
            return res.status(404).json({ message: "Auteur non trouvé." });
          }
      
          // Hachez le mot de passe égal à son numéro de téléphone
          const hashedPassword = await bcrypt.hash(updatedAuthor.telephone, 10);
          updatedAuthor.motDePasse = hashedPassword;
          await updatedAuthor.save();
      
          res.status(200).json({ message: "Auteur validé avec succès." });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Erreur lors de la validation de l'auteur" });
        }
      };

      module.exports.addpublication = async (req, res) => {
        // Vérifiez le token dans le header de la requête
        const token = req.headers.authorization.split(' ')[1];
      
        try {
          const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
          const compteId = decodedToken.userId;
      
          // Recherchez le compte par son ID
          const compte = await User.findById(compteId);
      
          if (!compte) {
            return res.status(404).json({ erreur: 'Auteur non trouvé' });
          }
      
          // Créez une nouvelle publication attribuée à l'auteur connecté
          const publication = new Publication({
            titre: req.body.titre,
            contenu: req.body.contenu,
          });
      
          // Sauvegardez la publication dans la base de données
          await publication.save();
      
          // Ajoutez la référence de la publication à la liste des publications de l'auteur
          compte.publications.push(publication._id);
          await compte.save();
      
          res.status(201).json({ message: 'Publication ajoutée avec succès.' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erreur lors de l\'ajout de la publication' });
        }
      };



module.exports.getPublication = async (req, res) => {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
          const compteId = decodedToken.userId;
      
          // Recherchez le compte par son ID
          const compte = await User.findById(compteId).populate('publications');
      
          if (!compte) {
            return res.status(404).json({ erreur: 'Auteur non trouvé' });
          }
      
           // Renvoyez les détails des publications de l'auteur (y compris le contenu)
    const publicationsDetails = compte.publications.map((publication) => ({
        titre: publication.titre,
        contenu: publication.contenu,
        // exemple de résumé des 10 premiers caractères
        datePublication: publication.datePublication,
      }));
  
      res.status(200).json({
        publications: publicationsDetails,
        message: "success"
      });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            error: error.message,
            message: "Problème d'extraction des publications"
          });
        }
      };



      module.exports.getDetails = async (req, res) => {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
          const compteId = decodedToken.userId;
      
          // Recherchez le compte par son ID
          const compte = await User.findById(compteId).populate('publications');
      
          if (!compte) {
            return res.status(404).json({ erreur: 'Auteur non trouvé' });
          }
      
          // Renvoyez les détails des publications de l'auteur (y compris le contenu)
          const publicationsDetails = compte.publications.map((publication) => ({
            titre: publication.titre,
            contenu: publication.contenu,
            datePublication: publication.datePublication,
          }));
      
          // Excluez les champs sensibles
          const auteurDetails = {
            nom: compte.nom,
            prenom: compte.prenom,
            publications: publicationsDetails,
          };
      
          res.status(200).json({
            auteur: auteurDetails,
            message: "success",
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            error: error.message,
            message: "Problème d'extraction des publications",
          });
        }
      };
      

