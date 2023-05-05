const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const config = require("./config.js");

const app = express();
const port = process.env.PORT || 3000;

// Configuration pour utiliser Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration pour servir les fichiers statiques
app.use(express.static("public"));

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Route pour récupérer tous les utilisateurs
app.get("/api/users", (req, res) => {
  const connection = mysql.createConnection(config);
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs : " + error
      );
      res.sendStatus(500);
      return;
    }

    res.json(results);
  });

  connection.end();
});

// Route pour ajouter un utilisateur
app.post("/api/users", (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    website: req.body.website,
  };

  const connection = mysql.createConnection(config);
  const query = "INSERT INTO users SET ?";
  connection.query(query, user, (error, result) => {
    if (error) {
      console.error("Impossible d'ajouter l'utilisateur : ", error);
      res.sendStatus(500);
      return;
    }

    user.id = result.insertId;
    res.json(user);
  });

  connection.end();
});

// Route pour mettre à jour un utilisateur
app.put("/api/users/:id", (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    website: req.body.website,
  };

  const connection = mysql.createConnection(config);
  const query = "UPDATE users SET ? WHERE id = ?";
  connection.query(query, [user, req.params.id], (error, result) => {
    if (error) {
      console.error("Impossible de mettre à jour l'utilisateur : ", error);
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200);
  });

  connection.end();
});

// Route pour supprimer un utilisateur
app.delete("/api/users/:id", function (req, res) {
  const id = req.params.id;
  const sql = "DELETE FROM users WHERE id = ?";
  const connection = mysql.createConnection(config);
  connection.query(sql, [id], function (error, result) {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }
    res.sendStatus(200);
  });
  connection.end();
});

app.get("/api/users/:column", (req, res) => {
  const column = req.params.column;
  const direction = req.query.direction || "ASC"; // Par défaut, trier par ordre croissant
  const connection = mysql.createConnection(config);
  const sql = `SELECT * FROM users ORDER BY ${column} ${direction}`;
  connection.query(sql, (error, results) => {
    if (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs : " + error
      );
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
  connection.end();
});

app.get("/api/users/search/:term", function (req, res) {
  const term = req.params.term;
  const sql = "SELECT * FROM users WHERE name LIKE ?";
  const query = "%" + term + "%";
  const connection = mysql.createConnection(config);

  connection.query(sql, query, function (error, results) {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    res.json(results);
  });

  connection.end();
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
