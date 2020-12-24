require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

app.post('/photos', async (req, res) => {
    // got the api urls from https://github.com/sreejithvs333/nd032-c2-functional-programming-with-javascript-starter/blob/project/project/src/server/index.js
    let rover_name = req.body.rover
    let date = ''
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
    
    if (rover_name=='Spirit'){
        date = '2010-02-01'
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
    }
    else if (rover_name=='Opportunity'){
        date = '2018-06-04'
        url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?earth_date=${date}&api_key=${process.env.API_KEY}`
    }
    else {
        url=`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/latest_photos?api_key=${process.env.API_KEY}`
    }
    try {
        
        let roverObject = await fetch(url)
            .then(res => res.json())
        console.log(roverObject)
        rover_name!=='Curiosity' ? res.json({roverData:roverObject.photos}) : res.json({roverData:roverObject.latest_photos})
    } catch (err) {
        console.log('error:', err);
    }
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))