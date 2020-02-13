const express = require("express")
const request = require("request")
const cheerio = require("cheerio")
const router = express.Router()

router.get("/admin/filmes-em-cartaz", (req, res) => {
        request('https://www.imdb.com/showtimes/', function(err, res, body) {
            if (err) console.log("Erro:" + err);
            var $ = cheerio.load(body, { decodeEntities: false });
            $('.list_item').each(function() {
                var title = $(this).find('span[itemprop=name]').html();
                var sinopse = $(this).find(".synopsis").html();
                console.log(title + "\n")
            });
        })
    })





module.exports = router;