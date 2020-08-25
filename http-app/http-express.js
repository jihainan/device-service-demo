const express = require('express')
const app = express()
const port = 7788

app.post('/hello', (req, res) => {
    console.log('requset body', req)

    res.send('Hello World!')
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
