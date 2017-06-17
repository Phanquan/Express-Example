const express = require('express')
const multer = require('multer')
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')
const shortid = require('shortid')

const app = express()

// -----Sử dụng midle-ware ---
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('public'))
//-----------------------------

// -----Cấu hình nunjucks------
nunjucks.configure('./views', {
    noCache: true,
    autoescape: true,
    express: app,
    watch: true
})

app.engine('html', nunjucks.render)
app.set('view engine', 'html')
//-----------------------------


//-------routing trang '/'-----
app.get('/', (req, res) => {
    res.render('Upload.html')
})
//-----------------------------

//----routing trang '/upload'-----
// Tạo id cho ảnh
let id = shortid.generate()
// Khởi tạo các thuộc tính của multer gán cho biến upload
const upload = multer({
    //cấu hình engine diskStorage gán cho thuộc tính stogare
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            //nơi chứa file upload
            cb(null, './public/uploads/')
        },
        filename: (req, file, cb) => {
            // Tạo tên file mới cho file vừa upload
            cb(null, id + '-' + file.originalname)
        }
    }),
    //cấu hình hàm phân loại file upload
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            // nếu file là image thì upload file.
            cb(null, true)
        } else {
            // nếu không phải thì bỏ qua phần upload
            cb(null, false)
        }
    }
})

app.post('/upload', upload.single('img'), (req, res, next) => { //upload file đơn
    // Bắt đầu upload
    console.log(req.file)
    if (next) { //nếu có lỗi thì báo lỗi
        console.log(next)
    }

    // Nếu file không tồn tại hoặc bỏ qua lúc fileFilter thì render lại trang với message mới
    if (!req.file) {
        res.render('Upload.html', {
            message: "no file to upload or file type is not supported"
        })
    } else { // nếu file qua được fileFilter thì upload và show ảnh thông qua nunjucjs render
        res.render('Upload.html', {
            message: `${req.file.originalname} is successfully uploaded.`,
            // img: `/uploads/${file.originalname}`
            img: `uploads/${req.file.filename}`
        })
    }
})
//----------------------------------


//--Khởi tạo server trên port 3000--
app.listen(3000, () => {
    console.log('app listening in port 3000')
})