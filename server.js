const express = require('express')
const path = require("path");
const multer = require("multer");
const fse = require('fs-extra');
const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 8080;

app.use(express.static(path.join(__dirname, "client")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/post", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "post.html"));
});

app.get("/gallery", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "gallery.html"));
});

const UPLOAD_PATH = path.join(__dirname, "client", "snaps");
var uploadSnaps = multer({
    storage:  multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, UPLOAD_PATH);
        },
        filename: function (req, file, cb) {
            let fn = file.originalname.replaceAll(":", "-");
            cb(null, fn);
        },
    })
}).single("image");
app.post("/saveSnap", function (req, res) {
    uploadSnaps(req, res, async (err) => {
        if(err) {
            res.json({
                success: false
            })
        } else {
            res.json({
                success: true
            })
        }
    })
});

app.get("/snaps", function (req, res) {
    let files = fse.readdirSync(UPLOAD_PATH);
    res.json({
        files
    });
});

if(externalUrl) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`Server locally running at http://${hostname}:${port}/ and from outside on ${externalUrl}`)
    })
} else {
    app.listen(port, function () {
        console.log(`Server running at http://localhost:${port}/`);
    });
}