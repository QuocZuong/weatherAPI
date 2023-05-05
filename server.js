const express = require("express")
const https = require("https");
const bodyParser = require("body-parser")

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))


app.get("/", function(req, res) { // gui file html cho user
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res) { // received input tu user va tra lai gia tri khi user press submit button
    console.log("Post request received")
    const query = req.body.cityInput;
    const unit = req.body.unitInput;
    const apiKey = req.body.apiKey;

    // rest api
    const urlWeatherAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&lang=vi&appid=" + apiKey + "&units=" + unit;
    https.get(urlWeatherAPI, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data)
            const city = weatherData.name;
            const country = weatherData.sys.country
            const temp = weatherData.main.temp

            // set icon for page from API
            const icon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            const output = "The temp of " + city + ", " + country + " is " + temp;

            res.set("Content-Type", "text/html; charset=utf-8")
            res.write("<img src = " + imageURL + ">" + "</img>")
            res.write("<h1>" + output + "</h1>")
            res.send()
        })
    })

})


app.listen(3000, function() {
    console.log("server is running on port 3000")
})