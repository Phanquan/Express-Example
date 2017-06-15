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
app.post('/upload', (req, res) => {
  // Khởi tạo các thuộc tính của multer gán cho biến upload
  const upload = multer({
    //cấu hình engine diskStorage gán cho thuộc tính stogare
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        //nơi chứa file upload
        cb(null, 'uploads/')
      },
      filename: (req, file, cb) => {
        // Tạo tên file mới cho file vừa upload
        cb(null, shortid.generate() + '-' + file.originalname)
      }
    }),
    //cấu hình hàm phân loại file upload
    fileFilter: (req, file, cb) => {
      //chỉ láy file image
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        console.log(file)
        // nếu file là image thì render lại trang với mes mới và upload file.
        return cb(res.render('Upload.html', {
          message: `${file.originalname} Upload Successed.`
        }), true)
      } else {
        // nếu không phải thì render lại trang với mes mới và bỏ qua phần upload
        return cb(res.render('Upload.html', {
          message: `${file.mimetype} files are not supported,only image files.`
        }), false)
      }
    }
  }).single('img') //upload file đơn

  // Bắt đầu upload
  upload(req, res, (err) => {
    if (err) { //nếu có lỗi thì báo lỗi
      console.log(err)
    }
  })
})
//----------------------------------


//--Khởi tạo server trên port 3000--
app.listen(3000, () => {
  console.log('app listening in port 3000')
})