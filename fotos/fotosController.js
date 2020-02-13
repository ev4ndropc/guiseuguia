const express = require("express")
const request = require("request")
const fs = require('fs')
const router = express.Router()

router.post("/fotos/procurar", (req, res) => {
    var codigo_img = req.body.codigo_img;
    if (codigo_img != undefined) {
        if (fs.existsSync('../public/img/fotos-carnaval/'+ codigo_img + '.png')) {
            console.log('Found file');
            res.render("fotos/resultado", { codigo_img: codigo_img })
        }else{
            console.log('File not found');
            res.redirect("/fotos/error")
        } 
    }else{
        res.redirect("/fotos/error")
    }
})

router.get("/fotos", (req, res) => {
    res.render("fotos/index")
})

router.get("/fotos/error", (req, res) => {
    res.render("fotos/error")
})
module.exports = router;