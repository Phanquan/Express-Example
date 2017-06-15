const express = require('express')
const multer = require('multer')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const shortid = require('shortid')

const app = express()

app.use(bodyParser.urlencoded({
    extended: true
}))

nunjucks.configure('./views', {
    noCache: true,
    autoescape: true,
    express: app,
    watch: true
})

app.engine('html', nunjucks.render)
app.set('view engine', 'html')


app.get('/', (req, res) => {
    res.render('Upload.html')
})

app.upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },
        filename: (req, file, cb) => {
            cb(null, shortid.generate() + '-' + file.originalname)
        }
    }),
    fileFilter: (req, res, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    }
})


const uploadIMG = multer().single('img')

app.post('/upload', (req, res, next) => {
    uploadIMG((req, res, err) => {
        if (err) {
            res.render('Upload.html', {
                message: 'File is not supported'
            })
        } else {
            res.render('Upload.html', {
                message: 'Upload Successed'
            })
        }
    })
})


app.listen(3000, () => {
    console.log('app listening in port 3000')
})