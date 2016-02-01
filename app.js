var request = require("request");
var cheerio = require("cheerio");
var crypto = require('crypto'); /*librairie*/
var fs = require('fs'); /*Initialisation des variables */
require('./server.js');
var url = "https://www.tisseo.fr/sites/default/files/ligne11.html";
var sha1 = createsha1(url);
var path = "cache/" + sha1;
var $;
var donnees = {
 "l11-bassocambo-empalot": {
   "name": "Ligne 11 Bassso",
   arrets: []
 }
}
/*Appel premiere fonction */
checkfile(url, traitement); /*Les fonctions */
function createsha1(url) { /* on lui donne un nom qu'il puisse utiliser - sa clef diffère selon l'url*/
var shasum = crypto.createHash("sha1"); /* creation d'une clef*/
shasum.update(url);
return shasum.digest('hex');
}

function checkfile(url, cb) {
 try {
   fs.accessSync(path, fs.F_OK); /*code executé sequentiellement */
   cb(fs.readFileSync(path, 'UTF8'))
   console.log("ce fichier existe");
 } catch (e) { /*on attrape l exception si il y en a une*/
   console.log("ce fichier n'existe pas");
   dumPage(url, cb);
 }
}

function dumPage(url, cb) {
 request(url, function(error, response, body) {
   if (!error) {
     cb(body);
     console.log("fichier créé");
     fs.writeFileSync(path, body);
   } else {
     console.log("Erreur :" + error);
   }
 })
}

function traitement(body) {
   $ = cheerio.load(body);                   //charge le body
   var tableau = $("#horaires table")[0];    
   var tablength = $($(tableau).find("tr")).length;
   recurseArrets(tableau);
   fs.writeFile('data/L-11.json', JSON.stringify(donnees))  //créé le fichier json et écrit notre objet dedans
   console.log('Fichier "outpoutre.json créé');
 }

 function recurseArrets(table) {
   var trbis = $(table).find("tr");
   for (var i = 1; i < trbis.length; i++) {
     var current = {};
     var ret = lirelignearrets($(trbis[i]));
     current.name = ret[0];
     current.horaires = ret[1];
     donnees["l11-bassocambo-empalot"].arrets.push(current);
   }
 }



// transform un objet en sa représentation en chaine de caractère
function lirelignearrets(ligne) {
   var tr = $(ligne); //var $$ = cheerio.load(tr);
   var horaires = lirelignehoraires($(tr).find("td"));
   var nom = $($(tr).find("th")[0]).text();
   return [nom, horaires];
 }

function lirelignehoraires(tds) { //return ["heure","heure"]
   //  var $$ = cheerio.load(tr);    
   var horairesTD = $(tds);
   var len = horairesTD.get().length;
   var tabhoraires = [];
   for (var j = 0; j < len; j++) {
     var td = horairesTD.get(j);
     tabhoraires.push($(td).html());
   }
   return tabhoraires;
 }