const express = require("express");
const router = express.Router();
const Noticias = require("./Noticias")
const slugify = require("slugify")
const multer = require("multer")
const fs = require("fs")


const storage = multer.diskStorage({
    destination: function(req, file, cd){
        cd(null, "public/img/promocoes")
    },
    filename: function(req, file, cd){
        cd(null, file.originalname);
    }
})

const upload = multer ({storage})

router.post("/promocao/uploader",upload.single("file"), (req, res) =>{
    try {
        if(fs.existsSync('public/img/promocoes/promocao1.png')) {
            var img1 = "promocao1.png";
        }if(fs.existsSync('public/img/promocoes/promocao2.png')){
            var img2 = "promocao2.png";
        }if(fs.existsSync('public/img/promocoes/promocao3.png')){
            var img3 = "promocao3.png";
        }if(fs.existsSync('public/img/promocoes/promocao4.png')){
            var img4 = "promocao4.png";
        }if(fs.existsSync('public/img/promocoes/promocao5.png')){
            var img5 = "promocao5.png";
        } else {
            console.log('The file does not exist.');
        }
    } catch (err) {
        console.error(err);
    }
    res.render("promocao/index", {
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        img5: img5
    })
});

router.get("/promocao/", (req, res) =>{
    try {
        if(fs.existsSync('public/img/promocoes/promocao1.png')) {
            var img1 = "promocao1.png";
        }if(fs.existsSync('public/img/promocoes/promocao2.png')){
            var img2 = "promocao2.png";
        }if(fs.existsSync('public/img/promocoes/promocao3.png')){
            var img3 = "promocao3.png";
        }if(fs.existsSync('public/img/promocoes/promocao4.png')){
            var img4 = "promocao4.png";
        }if(fs.existsSync('public/img/promocoes/promocao5.png')){
            var img5 = "promocao5.png";
        } else {
            console.log('The file does not exist.');
        }
    } catch (err) {
        console.error(err);
    }
    res.render("promocao/index", {
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        img5: img5
    })
    
});

router.get("/admin/noticias/new", (req, res) =>{
    res.render("admin/noticias/new")
});

router.post("/add-noticias", (req, res) =>{
    var title = req.body.title;
    var news = req.body.news;
    if(title != undefined){

        Noticias.create({
            title: title,
            allowNull: false,
            news: news
        }).then(() => {
            res.redirect("/admin/noticias/");
        })

    }else{
        res.redirect("/admin/noticias/new")
    }
})

router.get("/admin/noticias", (req, res) => {

    Noticias.findAll({order:[
        ['id','DESC']
    ]}).then(noticias => {
        res.render("admin/noticias/index", {noticias: noticias})
    })

});

router.post("/noticias/delete", (req, res) =>{
    var id = req.body.id;
    if (id != undefined){
        if(!isNaN(id)){ //Não for um número

            Noticias.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/noticias')
            });
            
        }else{
            res.redirect('/admin/erro')
        }
    }else{
        res.redirect('/admin/erro')
    }
});

router.get("/admin/noticias/edit/:id", (req, res)=>{
    var id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/noticias")
    }

    Noticias.findByPk(id).then(noticias=>{
        if(noticias != undefined){
            res.render("admin/noticias/edit",{noticias: noticias})
        }else{
            res.redirect("/admin/noticias")
        }
    }).catch(erro =>{
        res.redirect("/admin/noticias")
    })
})

router.post("/noticias/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var news = req.body.news;
    
    Noticias.update({title: title, news: news}, {
        where:{
            id: id
        }
    }).then(() =>{
        res.redirect("/admin/noticias")
    })

});

router.get("/", (req, res) => {

    Noticias.findAll({order:[
        ['id','DESC']
    ]}).then(noticias => {
        res.render("index", {noticias: noticias})
    })

});

module.exports = router;