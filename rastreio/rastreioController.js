const express = require("express");
const router = express.Router();
const request = require("request");
var cheerio = require('cheerio');
const Rastreio = require("./Rastreio")

router.post("/admin/rastreio/resultado", (req, res) =>{
  var codigo = req.body.codigo;
  if (codigo != undefined){
          function dadosComGZIP (url) {
            request({
              url: url,
              gzip: true
            }, function(error, response, body) {
              if (error) throw new Error(error);
        
              var $ = cheerio.load(body, { decodeEntities: false });
              var ultimoStatus = {
                a: $('.container .card-header .main_title_3').text(),
                b: $('.container .card-header .linha_status li:first-child').text(),
                c: $('.container .card-header .linha_status li:nth-child(2)').text(),
                d: $('.container .card-header .linha_status li:nth-child(3)').text()
              }
             let abs = $('div.singlepost').map(function() {
                return history = {
                  a:$('div.singlepost li:first-child').text().split("Status:"),
                  b:$('div.singlepost li:nth-child(2)').text().split("Data  :"),
                  c:$('div.singlepost li:nth-child(3)').text().split("Local").join(":").split(":: ").join("Origem:").split("Origem:")
                } 
           
            }).get()
           if(abs == ""){
              res.redirect('/admin/rastreio/error')
            }else{
              res.render("admin/rastreio/resultado", {
                ultimoStatus:{
                  titulo: ultimoStatus.a,
                  status: ultimoStatus.b,
                  data: ultimoStatus.c,
                  local: ultimoStatus.d,
                },
                history: {
                  status1: history.a[1],
                  data1: history.b[1],
                  local1: history.c[1],
                  status2: history.a[2],
                  data2: history.b[2],
                  local2: history.c[2],
                  status3: history.a[3],
                  data3: history.b[3],
                  local3: history.c[3],
                  status4: history.a[4],
                  data4: history.b[4],
                  local4: history.c[4],
                  status5: history.a[5],
                  data5: history.b[5],
                  local5: history.c[5],
                  status6: history.a[6],
                  data6: history.b[6],
                  local6: history.c[6],
                  status7: history.a[7],
                  data7: history.b[7],
                  local7: history.c[7]
                },
                codigo: codigo
              })
            }
          })
        }
        // carregando dados de páginas com gzip
        dadosComGZIP('https://www.linkcorreios.com.br/?id='+codigo+''); //JU534225925BR  PM378999194BR
      }else{
          res.redirect('/admin/error')
      }
});

router.get("/admin/rastreio/error", (req, res) => {
  res.render("admin/rastreio/error")
})

router.get("/admin/rastreio/", (req, res) =>{
    res.render("admin/rastreio/index")
});

module.exports = router;