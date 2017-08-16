var request = require("request");
var cheerio = require("cheerio");


var url = "http://games.espn.com/ffl/leagueoffice?leagueId=530668&seasonId=2016";
var leagueId = 530668;
var reqLoop = setInterval(doRequest, 2000);
// holds all of the league activity
var activity = [];

function doRequest(){
	request(url, function (error, response, body) {
		if (!error) {
			// load entire body into cheerio obj
			var $ = cheerio.load(body);
			// gets a list containing recent activity plus a lot of extra stuff
			// we just get description
			var list = $("#lo-recent-activity-list > li").find("li.recent-activity-description");
			// iterate over all of the activity
			list.each(function(i, ele){
				// description of what happened
				var $act = cheerio(this).find('a');
				var teamName;
				if($act.length === 1){
					teamName = 'LM';
				} else {
					teamName = $act.first().text();
				}
				console.log(teamName);
				if($act.length === 4){
					$act.next().next().next().prepend(' \n');
				}
				var act = cheerio(this).text();
				if(!arrayContains(activity,act)){
					activity.push(act);
					// console.log(leagueId + ': ' + teamName + '\n' + act);
					// send email
					// sendMail(act);
				} 
			});
		} else {
			console.log("We’ve encountered an error: " + error);
		}
	});		
}

function arrayContains(arr, ele){
	for(var i = 0; i < arr.length; i++){
		if(arr[i] === ele){
			return true;
		}
	}
	return false;
}


function sendMail(event){
	var nodemailer = require('nodemailer');

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
	    service: 'Mailgun', // no need to set host or port etc.
	    auth: {
			user: 'postmaster@sandboxf8a87460de9c4cee87023a1c757af556.mailgun.org',
	        pass: '108a6dbf0a1226cdd64ae5c934ad9dae'
	    }
	});

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: '"Keifer Caebe" <caebeman@gmail.com>', // sender address
	    to: 'caebeman@gmail.com', // list of receivers
	    subject: 'New Fantasy Transaction', // Subject line
	    text: event, // plaintext body
	    html: '<b>' + event + '</b>' // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return console.log(error);
	    }
	});
}


// TODO run on raspberry pi
// put activity in db so dont get dupluicate emails every time I start

