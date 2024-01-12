const express = require("express");
const mongoose = require("mongoose");
const UserRoutes=require("./routes/utilisateur")
//sur mongo local
mongoose
  .connect("mongodb://localhost:27017/dstest", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connexion a MongoDB reussie!"))
  .catch((e) => console.log("connexion a MongoDB échouée!", e));

const app = express();

app.use(express.json()); //pour que les données de post se mettent dans le body et va afficher le contenu de body sous forme json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Heders",
    "Origin,X-Requsted-With,Content,Accept,Content-Type,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );
  next();
});
app.use("/api/users", UserRoutes);
module.exports = app;