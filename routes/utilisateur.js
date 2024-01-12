const express = require("express");
const router = express.Router();
const auth = require("../middelware/auth");
const UserController = require("../controllers/utilisateur");
//find tout
router.post("/add-admin", UserController.addAdmin);
router.post('/register', UserController.registerAuthor);
router.post('/signin', UserController.login);
router.put('/validate/:id', UserController.validateAuthor);
router.post('/addpublication',auth.loggedMiddleware , auth.isauteur, UserController.addpublication);
router.get('/getpublication',auth.loggedMiddleware , auth.isauteur, UserController.getPublication);
router.get('/getDetails',auth.loggedMiddleware , auth.isauteur, UserController.getDetails);
module.exports = router;