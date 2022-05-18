const express = require("express");
var mongo = require("mongodb");
const app = express();
const port = 2000;
const database = "mydb";

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/initdb", (req, resp) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/mydb";

  MongoClient.connect(url, function (err, db) {
    if (err) {
      resp.send("errore");
    }
    console.log("Database created!");
    db.close();
    resp.send("Database Creato");
  });
});
app.get("/initcontent", (req, resp) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.createCollection("customers", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
});

app.get("/initdata", (req, resp) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("customers").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
});
app.get("/insertmovie", (req, resp) => {
  const titolo = req.query.titolo;
  const genere = req.query.genere;
  let dati = {
    titolo: titolo,
    genere: genere,
  };
  inserisciValori("movies", dati);
});

const inserisciValori = (collectionName, object) => {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    dbo.collection(collectionName).insertOne(object, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
};

const ricercaValori = (collectionName, object) => {
  return new Promise((resolve) => {
    var MongoClient = require("mongodb").MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db(database);
      dbo
        .collection(collectionName)
        .findOne({ object }, function (err, result) {
          if (err) throw err;
          db.close();
          if (result != null && result != undefined) resolve(true);
          else resolve(false);
        });
    });
  });
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/api/caching", (req, resp) => {
  /*
    1- vedere che richiesta sta facendo l'utente
    2- controllare se il dato esiste nel Database
        se il dato è presente nel database, restituire il dato
        altrimenti se il dato non esiste fare la fetch dalla API
        e poi inserire il dato nel database
    */
  const titolo = req.query.titolo;
  const genere = req.query.genere;
  let dati = {
    titolo: titolo,
    genere: genere,
  };
  const risp = await ricercaValori("movies", dati)
  if (risp) resp.send(dati);
  else inserisciValori("movies", dati);
});
