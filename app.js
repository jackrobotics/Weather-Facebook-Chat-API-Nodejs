/*
	Requirement NODEJS
		- facebook-chat-api
		- google-translate
		- restler
*/

/* ### START CONFIG ### */
var facebookEmail = 'emailfacebook';
var facebookPassword = 'passwordfacebook';
var APIGOOGLE = 'apigoogle';
var APIWUNDERGROUND = 'apiwunderground';
/* ###  END CONFIG  ### */

var login = require("facebook-chat-api");
var googleTranslate = require('google-translate')(APIGOOGLE);
var rest = require('restler');

//LOGIN FACEBOOK
login({email: facebookEmail, password: facebookPassword}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.listen(function callback(err, message) {
    	var weatherText = /^พยากรอากาศ(.*?)$/
    	var _weatherText = message.body.match(weatherText);
    	if(_weatherText)
    	{
    		var weatherCity = _weatherText[1];
	    	googleTranslate.translate(weatherCity, 'en', function(err, translation) {
				var EN_City = translation.translatedText;
				rest.get('http://api.wunderground.com/api/'+APIWUNDERGROUND+'/forecast/lang:TH/q/TH/'+EN_City+'.json').on('complete', function(result) {
					if (result instanceof Error) {
					    console.log('Error:', result.message);
					    this.retry(5000); // try again after 5 sec 
					} else {
						var fx = result.forecast.txt_forecast.forecastday;
				    	var ans=fx[2].title + ' : ' +fx[2].fcttext;
				    	ans += "\n" + fx[3].title + ' : ' +fx[3].fcttext;
				    	api.sendMessage("พยากรอากาศ : "+weatherCity+"\n"+ans, message.threadID);
					}
				});
			});
    	}
    });
});
