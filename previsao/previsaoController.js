const express = require("express");
var request = require('request');
var cheerio = require('cheerio');
const router = express.Router();

router.get("/admin/previsao", (req, res) => {
    res.render("admin/previsao/index")
})

router.post("/admin/previsao/", (req, res) => {
    var cidade = req.body.cidade;
    var estado = req.body.estado;
    if(cidade != undefined || estado != undefined){
        function dadosComGZIP(url, error) {
            request({
                url: url,
                gzip: true
            }, function(error, response, body) {
                if (error) throw new Error(error);
    
                var $ = cheerio.load(body, { decodeEntities: false });
    
                var subtitle = $('.d-flex.justify-content-center div.p-2.text-center').text()
                var dados = {
                    a: $('#main h2.text-center').text(),
                    b: $('.col-md-12>.block-title').text().split(")")
                }
                var imagensDia = {
                    a: $('.row.align-middle.justify-content-md-center div:first-child img').attr("src"), //Manhã
                    b: $('.row.align-middle.justify-content-md-center div:nth-child(2) img').attr("src"), //Tarde
                    c: $('.row.align-middle.justify-content-md-center div:nth-child(3) img').attr("src") //Noite
                }
                var temperaturasDia = {
                    a: $('.col-md-2.temperaturas.align-middle div:nth-child(2) span').text(),
                    b: $('.col-md-2.temperaturas.align-middle div:first-child span').text()
                }
                var outrasInfos = {
                    a: $('.row.align-middle.justify-content-md-center div:first-child span.text-center').text().split("(Brasília)"),
                    b: $('div:nth-child(2) .row.align-middle.justify-content-md-center div:nth-child(2) span.text-primary').text().split("%"),
                    c: $('div:nth-child(2) .row.align-middle.justify-content-md-center div:nth-child(2) span:not(.text-right, .text-primary)').text().split("°")
                }
                console.log(outrasInfos.a)
                var proximosDias = {
                    a: $('#main div:nth-of-type(5) div:first-child h5').html().split("<br>"),
                    b: $('#main div:nth-of-type(5) div:nth-child(2) h5').html().split("<br>"),
                    c: $('#main div:nth-of-type(5) div:nth-child(3) h5').html().split("<br>"),
                    d: $('#main div:nth-of-type(5) div:nth-child(4) h5').html().split("<br>"),
                    e: $('#main div:nth-of-type(5) div:nth-child(5) h5').html().split("<br>"),
                    //f: $('#main div:nth-of-type(5) div:nth-child(6) h5').html().split("<br>")
                }
                var proximosDiasImg = {
                    a: $('#main div:nth-of-type(5) div:first-child img').attr("src"),
                    b: $('#main div:nth-of-type(5) div:nth-child(2) img').attr("src"),
                    c: $('#main div:nth-of-type(5) div:nth-child(3) img').attr("src"),
                    d: $('#main div:nth-of-type(5) div:nth-child(4) img').attr("src"),
                    e: $('#main div:nth-of-type(5) div:nth-child(5) img').attr("src"),
                    f: $('#main div:nth-of-type(5) div:nth-child(6) img').attr("src")
                }
                var figcaption = {
                    a: $('#main div:nth-of-type(5) div:first-child figcaption').text(),
                    b: $('#main div:nth-of-type(5) div:nth-child(2) figcaption').text(),
                    c: $('#main div:nth-of-type(5) div:nth-child(3) figcaption').text(),
                    d: $('#main div:nth-of-type(5) div:nth-child(4) figcaption').text(),
                    e: $('#main div:nth-of-type(5) div:nth-child(5) figcaption').text(),
                    f: $('#main div:nth-of-type(5) div:nth-child(6) figcaption').text()
                }
    
                var temperaturaNextMin = {
                    a: $('#main div:nth-of-type(5) div:first-child .row span.text-primary').text(),
                    b: $('#main div:nth-of-type(5) div:nth-child(2) .row span.text-primary').text(),
                    c: $('#main div:nth-of-type(5) div:nth-child(3) .row span.text-primary').text(),
                    d: $('#main div:nth-of-type(5) div:nth-child(4) .row span.text-primary').text(),
                    e: $('#main div:nth-of-type(5) div:nth-child(5) .row span.text-primary').text(),
                    f: $('#main div:nth-of-type(5) div:nth-child(6) .row span.text-primary').text()
                }
    
                var temperaturaNextMax = {
                    a: $('#main div:nth-of-type(5) div:first-child .row span.text-danger').text(),
                    b: $('#main div:nth-of-type(5) div:nth-child(2) .row span.text-danger').text(),
                    c: $('#main div:nth-of-type(5) div:nth-child(3) .row span.text-danger').text(),
                    d: $('#main div:nth-of-type(5) div:nth-child(4) .row span.text-danger').text(),
                    e: $('#main div:nth-of-type(5) div:nth-child(5) .row span.text-danger').text(),
                    f: $('#main div:nth-of-type(5) div:nth-child(6) .row span.text-danger').text()
                }
    
                res.render("admin/previsao/resultado", {
                    dados: {
                        cidade: dados.a,
                        data: dados.b[0]
                    },
                    imagensDia: {
                        manha: imagensDia.a,
                        tarde: imagensDia.b,
                        noite: imagensDia.c
                    },
                    subtitle: {
                        subtitle: subtitle
                    },
                    temperaturasDia: {
                        maxima: temperaturasDia.a,
                        minima: temperaturasDia.b
                    },
                    nascerPor: {
                        nascerDoSol: outrasInfos.a[0],
                        porDoSol: outrasInfos.a[1]
                    },
                    ProbUv: {
                        probChuva: outrasInfos.b[0],
                        maxUv: outrasInfos.c[1]
                    },
                    proximosDias: {
                        proximo1: proximosDias.a[0],
                        dia1: proximosDias.a[1],
                        proximo2: proximosDias.b[0],
                        dia2: proximosDias.b[1],
                        proximo3: proximosDias.c[0],
                        dia3: proximosDias.c[1],
                        proximo4: proximosDias.d[0],
                        dia4: proximosDias.d[1],
                        proximo5: proximosDias.e[0],
                        dia5: proximosDias.e[1],
                        //proximo6: proximosDias.f[0],
                       // dia6: proximosDias.f[1]
                    },
                    proximosDiasImg: {
                        imagem1: proximosDiasImg.a,
                        imagem2: proximosDiasImg.b,
                        imagem3: proximosDiasImg.c,
                        imagem4: proximosDiasImg.d,
                        imagem5: proximosDiasImg.e,
                        imagem6: proximosDiasImg.f
                    },
                    figcaption: {
                        figcaption1: figcaption.a,
                        figcaption2: figcaption.b,
                        figcaption3: figcaption.c,
                        figcaption4: figcaption.d,
                        figcaption5: figcaption.e,
                        figcaption6: figcaption.f
                    },
                    temperaturaNext: {
                        min1: temperaturaNextMin.a,
                        min2: temperaturaNextMin.b,
                        min3: temperaturaNextMin.c,
                        min4: temperaturaNextMin.d,
                        min5: temperaturaNextMin.e,
                        min6: temperaturaNextMin.f,
    
                        max1: temperaturaNextMax.a,
                        max2: temperaturaNextMax.b,
                        max3: temperaturaNextMax.c,
                        max4: temperaturaNextMax.d,
                        max5: temperaturaNextMax.e,
                        max6: temperaturaNextMax.f,
                    }
    
                })
            })
        }
        dadosComGZIP('https://www.cptec.inpe.br/previsao-tempo/'+estado+'/'+cidade+'');
    }else{
        res.redirect("/admin/error")
    }
    

});



module.exports = router