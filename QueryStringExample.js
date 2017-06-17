const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
const bodyParser = require('body-parser')

// cấu hình nunjucks 
nunjucks.configure('./views', {
    noCache: true,
    express: app,
    autoescape: true,
    watch: true
})

// sử dụng midle-ware bodyParser
app.use(bodyParser.urlencoded({
    extended: true
}))

// cấu hình '/'
app.get('/', (req, res) => {
    res.render('QueryStringExample.html')
})

// cấu hình '/form'
app.get('/form', (req, res) => {
    // sau dấu '?' thì dùng req.query đối với thẻ form
    let a = parseInt(req.query.num1) // lấy ra num1=a ở url
    let b = parseInt(req.query.num2) // lấy ra num2=b ở url
    let sum = a + b // tính tổng
    // render lại với nunjucks
    res.render('QueryStringExample.html', {
        a: a, // truyền value của a sang views
        b: b, // tương tư
        sum: sum //
    })
})

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})