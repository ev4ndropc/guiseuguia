const express = require("express");
const router = express.Router();
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
        }if(fs.existsSync('public/img/promocoes/promocao6.png')){
            var img6 = "promocao6.png";
        } else {

        }
    } catch (err) {
        console.error(err);
    }
    res.render("promocao/index", {
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        img5: img5,
        img6: img6
    })
});


router.post("/delete", (req, res) =>{
        var imagemId = req.body.imagemId
        fs.unlink("public/img/promocoes/"+imagemId+"", (err) => {
            if (err) {
                console.log("failed to delete local image:"+err);
            } else {
                console.log('successfully deleted local image');                                
            }
        });
    res.redirect("/promocao")
})

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
        }if(fs.existsSync('public/img/promocoes/promocao6.png')){
            var img6 = "promocao6.png";
        } else {

        }
    } catch (err) {
        console.error(err);
    }
    res.render("promocao/index", {
        img1: img1,
        img2: img2,
        img3: img3,
        img4: img4,
        img5: img5,
        img6: img6
    })
    
});

module.exports = router;