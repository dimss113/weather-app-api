const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { parse } = require("path");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function(req, res){
    console.log("Server is starting at port 3000");
});


// from browser to internal server
app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    console.log("Post request received.");
    var cityName = req.body.cityName;
    const query = cityName.slice(0, 1).toUpperCase() + cityName.slice(1, cityName.length).toLowerCase(); 
    const apiKey = "ac75169be5d31d752c097775847978a0";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
    
    // from internal server to eksternal server
    https.get(url, function(respond){
        console.log(respond.statusCode);

        respond.on("data", function(data){
            console.log(data);
            const weatherData = JSON.parse(data);
            console.log(weatherData);
            // JSON.stringify for string casting
            
            // getting data from weather data object
            const temp = weatherData.main.temp;
            const desc = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            console.log(temp);
            console.log(desc);
            
            // change the h1 
            // const weatherCond = "The weather condition in London is " + desc;
            // const tempCond = "The temperatur in London is " + temp + " degrees Celcius";
            // $("h1").text(weatherCond);
            // $("h1").append("<h1>" + tempCond + "</h1>");
            res.write("<p>The weather is currently " + desc + "</p>");
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius</h1>");
            res.write("<img src='" + imageUrl + "' alt=''>");
            res.send();
        });
    });    
});
