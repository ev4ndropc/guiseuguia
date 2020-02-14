const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const connection = require("./database/database")
const request = require("request-promise");
const cheerio = require("cheerio");
var Crawler = require("crawler");
const {google} = require('googleapis');

const { Client, Location, MessageMedia } = require('whatsapp-web.js');
const client = new Client({puppeteer: {headless: true}, session: sessionCfg});

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

/*const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}*/


client.initialize();

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);

    if (!fs.existsSync(SESSION_FILE_PATH)) {
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
            if (err) {
                console.error(err);
            }
        });
    }
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});


client.on('message', async msg => {
  console.log('MESSAGE RECEIVED', msg);


  if (msg.body == 'menu') {
      client.sendMessage(msg.from, 'Aguarde, estamos carregando sua imagem.');
      image2base64('https://i.pinimg.com/originals/1f/87/90/1f8790df8b450fbf5c3b4a6b9db4f822.jpg') // you can also to use url
          .then(
              (response) => {
                  const base64 = response;
                  const mimetype = 'image/png';
                  const media = new MessageMedia(mimetype, base64);
                  client.sendMessage(msg.from, media);
              }
          )
          .catch(
              (error) => {
                  console.log(error); //Exepection error....
              }
          );

  }
});

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
  
    

// Enter your calendar ID below and service account JSON below
const calendarId = "iqsitscqq9p3tsacp07ci5tdm0@group.calendar.google.com";
const serviceAccount = {
  "type": "service_account",
  "project_id": "automatiz",
  "private_key_id": "22d0aed83c8558c1acd0814fe110e0d54a87aeca",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsqtt9vSssQ+o8\nhB0Aq/Dr6zASLp3Ps2za6du/+ELrBQtPN++QYRfBhzPSC2HGsjF/vfmG/dzZGU1i\nZWPYwUvNU43LgNWd/L7BBUUyFC+NKkP9pAovG5WpjPYphbDPAPaXDmNAFxh7FHov\nF7TeV3wQBRsgYwi/xtmLq/JcCpCWsrAi46nzx7jwYdCzv+ixwXc1uXyvsCYGttCY\ndloL4BgUyC6ahe2vtQnmiXAFOlpqhARyTqeRkrVchSc/PV2LlJwL5Kqg43WGJq+3\ng0f+WjaDYZzBjmjQxCYV6Sp3eji+ImIs2DM7UJyOj1BjUQ8fHmPv6xEMju+/Xxgl\nR72N/yNXAgMBAAECggEAVY/O90Zzq9o1quo+ovQRDR78sa3W9rLvOKWVBtJDesmD\nmqxZsp5iUryoMagBOiBYBfiCO2H1+8Cdh6o9aY4TfXovdA3yDPlPHz/404GMNLQi\ngAA3KbPOHHglDVtZy6IrD5yKExq+v1Lc3xQsxNbuO9QD5q8ciUfEyoEYtoJntryg\n3RLrWNXt+2N55p4+Hic5YjN/KbDHQRfOsV17ov1TKOXepTLS4+7v9K1SEyu9/7oB\nyTPG65ZkcQ+NKyk0BBoyKh2muR+Tbk3q0h4inl4uJKtx+H1MPpvFCJtc0ihUjagR\nuA3yoS5qWof7Ygy1XdPDMCvUMzknYTvkY7481OZqoQKBgQDnH8D2Dt9ZR20iQVI5\nZS3W8LAIOAtuhaFVr6gJMGr6GBnt4nHUB3BI0a1lXlNTyFLjItHkmUr+4TMpA6UZ\nL7wwhoxu4nc/KGzD8WEBdrweEEOSGqsF0Hwdn5W13Td3kUBPYnD024Y4iToR1CoG\n50unayve+rY6ti2S+erELCRFdwKBgQC/QG0ySDbAIMOLlZK1bs0mpkPgPYwTTh7l\n29tfsWoejol/pLv1Dx8iVd8NBld8SBk9se6Y21DmavScYZBJxZqr4cveT1zTGB0m\nRsBGG6XE9qNpI/CcwXJrCNNwNS12GFbh95YpODDO/eKNpM9W/sUaVUKltwJsJ+AW\n1vjffGcJIQKBgQDFoqCViAgzRuGqniLak4uMNgrBLHOSEdDw/aD6Ip4HuB5MDgv6\nHFZG3o2glfU5Op6uPbMwAGlh5F6kHsrJ68jH0fY6R4tixYWkVD74Snj4WD3/rLA7\n65iGmFUjy8PHibxtZadjqmhu5eFzJ3K8roJB6mH8bXTwZaI5AV5gW8K0ZwKBgD34\nrmmApN0UwMhWKzfHM4q2jX/38Y+/3Js25prXbj+AiGVoB8+cmsYRdTlPOMH4ytUG\n9v1o84n2VlTl+E8vTLMtc1YR+U4dnjRs8JjHFKwCD2leT/U7acvtDDZrxNNjh6Op\nCmtI3ef0tJiZMuZJn6ysu+/eoVZShXZhKjugn/KBAoGAVnVB4XQMsdOqSI/bLmEC\n1+P2Gs+iPSSovfPeo2M7k9KgDO5S/EF1IwdW89IedXoOEu4IDPNoV9RR5eHMX/OQ\nX/Eblpm693z3ZLGoYpYV64JCSFHWWKVFd9L+vGITVIh5fBtNbqPTy2JtUl7B5eVp\npLP+Sy2VqLYrATqYNXKpVZ4=\n-----END PRIVATE KEY-----\n",
  "client_email": "barbeariacalendar@automatiz.iam.gserviceaccount.com",
  "client_id": "109682010363952510050",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/barbeariacalendar%40automatiz.iam.gserviceaccount.com"
};
//const timeZone = 'America/Sao_Paulo';
const timeZoneOffset = '-03:00';

const serviceAccountAuth = new google.auth.JWT({
 email: serviceAccount.client_email,
 key: serviceAccount.private_key,
 scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');

if (intentName === "AgendarHorario") {
    let servicos = req.body.queryResult.parameters['servicos'];
    let data = req.body.queryResult.parameters['data'];
    let hora = req.body.queryResult.parameters['hora'];

    const dateTimeStart = new Date(Date.parse(data.split('T')[0] + 'T' + hora.split('T')[1].split('-')[0] + timeZoneOffset));
    const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
    const agendamentoString = formatData(new Date(data.split('T')[0])) + " as "+hora.split('T')[1].split('-')[0];

    return criarEventoCalendario(dateTimeStart, dateTimeEnd, servicos, data, hora).then(() =>{
        let mensagem = `Excelente, seu serviço esta agendado para ${agendamentoString} `;
        console.log(mensagem);
        responsed.json({"fulfillmentText": mensagem});
    }).catch(()=>{
        let mensagem = `Desculpa, não temos mais vagas para ${agendamentoString}. `;
        console.log(mensagem);
        responsed.json({"fulfillmentText": mensagem});

    })

}

//Creates calendar event in Google Calendar
function criarEventoCalendario (dateTimeStart, dateTimeEnd, servicos, data, hora) {
    return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: serviceAccountAuth, // List events for time period
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      }, (err, calendarResponse) => {
        // Check if there is a event already on the Calendar
        if (err || calendarResponse.data.items.length > 0) {
          reject(err || new Error('Requisição conflita com outros agendamentos'));
        } else {
          // Create event for the requested time period
          calendar.events.insert({ auth: serviceAccountAuth,
            calendarId: calendarId,
            resource: {summary: servicos , description: servicos,
              start: {dateTime: dateTimeStart},
              end: {dateTime: dateTimeEnd}}
          }, (err, event) => {
            err ? reject(err) : resolve(event);
          }
          );
        }
      });
    });
   }



function formatData(date){
    var nomeMes = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto",
        "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    var dia = date.getDate();
    var mesIndex = date.getMonth();
    var ano = date.getFullYear();

    return dia + '' +nomeMes[mesIndex] + '' + ano;
}
    
    
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