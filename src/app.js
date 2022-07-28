const express = require('express');
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
const app = express();
const port = process.env.PORT ||3000

app.use(express.json())
app.use(reporterRouter)
app.use(newsRouter)


require('./db/mongoose')


 












app.listen(port,() => {
    console.log('listening on port ..')
})