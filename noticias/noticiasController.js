const express = require("express");
const router = express.Router();
const Noticias = require("./Noticias")
const slugify = require("slugify")

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