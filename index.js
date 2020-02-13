const express = require("express");
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = require("./database/database")
const request = require("request-promise");
const cheerio = require("cheerio");
var Crawler = require("crawler");

const articlesController = require("./articles/articlesController")
const newsController = require("./noticias/noticiasController")
const previsaoController = require("./previsao/previsaoController")
const rastreioController = require("./rastreio/rastreioController")
const filmesController = require("./filmes/filmesController")
const fotosController = require("./fotos/fotosController")

const Article = require("./articles/Article")
const Noticias = require("./noticias/Noticias")
const Rastreio = require("./rastreio/Rastreio")
const Fotos = require("./fotos/Fotos")




//Setando uma view engina
app.set('view engine', 'ejs');

//Configurando arquivos staticos como css, js e imagens
app.use(express.static('public'));

//Configurando o body-parser
/*app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());*/

//Conectando ao banco de dados

connection
    .authenticate()
    .then(() => {
        console.log('Conexão com sucesso!')
    }).catch((error) => {
        console.log(error)
    })

app.use("/", rastreioController);
app.use("/", newsController);
app.use("/", articlesController);
app.use("/", previsaoController);
app.use("/", filmesController);
app.use("/", fotosController);

app.get("/admin/error", (req, res) => {
    res.render("error")
})

//Criando rota
app.get("/", (req, res) => {
    res.render('index')
})




app.use(express.static("public"));
app.get("/", function(req, responsed) {
  responsed.sendFile(__dirname + "/views/index.html");
});

app.post("/Chatbot", function(req, responsed) {
var intentName = req.body.queryResult.intent.displayName;

  var c = new Crawler({
      maxConnections : 10,
      // This will be called for each crawled page
      callback : function (error, res, done) {
          if(error){
              console.log(error);
          }else{
              var $ = res.$;
              // $ is Cheerio by default
              //a lean implementation of core jQuery designed specifically for the server
              console.log($('title').text());
              
            var teste = $('title').text()
                if (intentName == "Noticias") {
              //variaveis das noticias
                  var titulos = {
                  a: "*"+$('tbody').find('tr:first-child th:nth-child(2)').text()+"*",
                  b: "*"+$('tbody').find('tr:nth-child(2) th:nth-child(2)').text()+"*",
                  c: "*"+$('tbody').find('tr:nth-child(3) th:nth-child(2)').text()+"*"
                  }
      
                  var noticias = {
                  a: $('tbody').find('tr:first-child th:nth-child(3)').text(),
                  b: $('tbody').find('tr:nth-child(2) th:nth-child(3)').text(),
                  c: $('tbody').find('tr:nth-child(3) th:nth-child(3)').text() 
                  }
                  
              //resposta das noticias
                if(titulos.a == "**"){
                    responsed.json({"fulfillmentText" : "Não temos nenhuma noticia no momento"});
                    return
                   }if(titulos.b == "**"){
                       responsed.json({"fulfillmentText" : 
                                    
                                 ""+titulos.a+" \n \n "+
                                 ""+noticias.a+"\n \n"
                                      
                                      });
                    }if(titulos.c == "**"){
                       responsed.json({"fulfillmentText" : 
                                    
                                 ""+titulos.a+" \n \n "+
                                 ""+noticias.a+"\n \n"+
  
                                 ""+titulos.b+" \n \n "+
                                 ""+noticias.b+"\n \n"
                                      
                                      });
                    }
                   else{
                    responsed.json({"fulfillmentText" :
                       
                         ""+titulos.a+" \n "+
                         ""+noticias.a+"\n \n"+
  
                        ""+titulos.b+" \n "+
                         ""+noticias.b+"\n \n"+
                              
                        ""+titulos.c+" \n "+
                         ""+noticias.c+"\n \n"+
                              
                          "\n \n*Bem útil né*❓ \n"+
                          "O que acha de me seguir no instagram❓ \n *https://www.instagram.com/guiseuguia/*"
                    })
                  }
                }
            
          }
          done();
      }
  });
  
  
  
  // Queue a list of URLs
  c.queue('https://guiseuguia.herokuapp.com/admin/noticias/');
  
    
    
    
  var b = new Crawler({
      maxConnections : 10,
      // This will be called for each crawled page
      callback : function (error, res, done) {
          if(error){
              console.log(error);
          }else{
              var $ = res.$;
              // $ is Cheerio by default
              //a lean implementation of core jQuery designed specifically for the server
              console.log($('title').text());
  
            if (intentName == "Previsao_do_Tempo") {
              //variaveis da temperatura
                  var titulos ={
                  a: $('.col-md-12').find('.block-title').first().text(),
                  b: $('.col-md-12 .d-flex.justify-content-center').find('.p-2.text-center').text()
                  }
  
                  var temperaturas = {
                  a: $('.temperaturas').find('.align-top.h3 > span').text(),
                  b: $('.temperaturas').find('.align-bottom.h3 > span').text()
                  }
                  var chuva = {
                  a: $('.col-md-12 .justify-content-md-center').find('.align-middle:nth-child(2) .text-center.text-primary').not(".boletins").text()
                  }
  
                  var nascer = {
                  a: $('.col-md-12 .justify-content-md-center:nth-child(2)').find('.text-center.align-middle strong').first().text(),
                  b: $('.col-md-12 .justify-content-md-center:nth-child(3)').find('.text-center.align-middle strong').text()
                  }
  
  
                  var next = {
                  a: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:first-child h5').text().split(/\d+/),
                  b: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(2) h5').text().split(/\d+/),
                  c: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(3) h5').text().split(/\d+/)
                  }
  
                  var nextprev = {
                  a: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:first-child figcaption').text(),
                  b: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(2) figcaption').text(),
                  c: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(3) figcaption').text()
                  }
  
                  var nextmax = {
                  a: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:first-child .row .text-right').text(),
                  b: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(2) .row .text-right').text(),
                  c: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(3) .row .text-right').text()
                  }
  
                  var nextmin = {
                  a: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:first-child .row .text-left').text(),
                  b: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(2) .row .text-left').text(),
                  c: $('.row.align-middle.justify-content-md-center').find('.align-middle.boletins:nth-child(3) .row .text-left').text()
                  }
              //resposta da temperatura
                  responsed.json({"fulfillmentText" :
                       
                         "*"+titulos.a+" - Atualizado %hour_of_day%:%minute%* \n"+
                         titulos.b+"\n \n"+
                         "_Mínima:_ " +temperaturas.a+"\n"+
                         "_Máxima:_ " +temperaturas.b+"\n"+
                         "_Precipitação:_ " +chuva.a+"\n \n"+
                         "*Próximos dias* \n \n"+
                          "*"+next.a[0]+"* \n"+
                          "_Previsão:_ "+nextprev.a+"\n"+
                          "_Mínima:_ "+nextmin.a+"\n"+
                          "_Máxima:_ "+nextmax.a+"\n \n"+
                              
                          "*"+next.b[0]+"* \n"+
                          "_Previsão:_ "+nextprev.b+"\n"+
                          "_Mínima:_ "+nextmin.b+"\n"+
                          "_Máxima:_ "+nextmax.b+"\n \n"+
                              
                          "*"+next.c[0]+"* \n"+   
                          "_Previsão:_ "+nextprev.c+"\n"+
                          "_Mínima:_ "+nextmin.c+"\n"+
                          "_Máxima:_ "+nextmax.c+"\n \n"+
  
                          "\n \n*Bem útil né*❓ \n"+
                          "O que acha de me seguir no instagram❓ \n *https://www.instagram.com/guiseuguia/*"
                        })
                  }
            
          }
          done();
      }
  });  
  
  b.queue('https://www.cptec.inpe.br/previsao-tempo/rj/nova-friburgo')

});

//Configurando servidor
app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor Rodando!");
})