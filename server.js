const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/mp3/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "static")));

app.get('/', (req, res) => {
    fs.readFile("static/index.html", 'utf8', function (error, html) {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end();
    });
});

app.get('/upload', (req, res) => {
    fs.readFile("static/upload.html", 'utf8', function (error, html) {
        if (error) {
            console.error("Error reading file:", error);
            res.status(500).send("Error reading HTML file");
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end(html);
    });
});

app.get('/getFiles', (req, res) => {
    const folder = req.query.folder;
    const folderPath = path.join(__dirname, 'static', folder);

    fs.readdir(folderPath, (err, files) => {
        res.json({ files });
    });
});

app.get('/static/mp3/:album/:image', (req, res) => {
    const { album, image } = req.params;
    const imagePath = path.join(__dirname, 'static', 'mp3', album, image);

    fs.readFile(imagePath, (err, data) => {
        const contentType = getImageContentType(image);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

app.get('/static/img/:name', (req, res) => {
    const { name } = req.params
    const imagePath = path.join(__dirname, 'static', 'img', name);

    fs.readFile(imagePath, (err, data) => {
        const contentType = getImageContentType(name);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

app.post('/uploadFiles', upload.any('files'), async (req, res) => {
    const title = req.body.name;
    const artist = req.body.creator;

    if (!title || !artist) {
        return res.status(400).send("Album Name or Creator Name is missing");
    }

    const destination = path.join(__dirname, 'static', 'mp3', title + " - " + artist);

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    req.files.forEach(file => {
        if (!file.originalname.startsWith("files-")) {
            const filePath = path.join(destination, file.originalname);
            fs.renameSync(file.path, filePath);
        }
    });


    res.redirect('/')
});


function getImageContentType(imageName) {
    const ext = path.extname(imageName).toLowerCase();
    switch (ext) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        default:
            return 'application/octet-stream';
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
