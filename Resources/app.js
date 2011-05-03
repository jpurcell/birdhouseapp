// --------------------------------------------------------
// app.js
//
// BirdHouse App for testing the BirdHouse class.
//
// Author: Joseph D. Purcell, iEntry Inc.
// Version: 0.2
// Designed for BirdHouse Version: 0.8
// Modified: May 2011
// --------------------------------------------------------

var win = Ti.UI.createWindow();
Ti.UI.setBackgroundColor('#FFF');

// INCLUDE & INIT BIRDHOUSE
Ti.include('./lib/birdhouse-debug.js');

var BH = new BirdHouse({
    consumer_key: "yourappsconsumerkey",
    consumer_secret: "yourappsconsumersecretwhichislonger",
    callback_url: "http://yourappsEXACTcallbackurl.com"
});

// ELEMENTS
var alertDialog = Ti.UI.createAlertDialog({
	title: 'BirdHouse Message',
	buttonNames: ['OK']
});
var activity = Ti.UI.createActivityIndicator({message:'Loading...'});

// CREATE THE TABLE
var actions = [
	{title:"Authorize",color:'#000',height:50},
	{title:"Deauthorize",color:'#000',height:50},
	{title:"Is Authorized",color:'#000',height:50},
	{title:"Send Tweet",color:'#000',height:50},
	{title:"Send Tweet with Default Text",color:'#000',height:50},
	{title:"Send URL Shortened Tweet",color:'#000',height:50},
	{title:"Shorten URL",color:'#000',height:50},
	{title:"Get Tweets",color:'#000',height:50},
	{title:"Custom API Call (Last 20 Public Tweets)",color:'#000',height:50}
];
var tableView = Ti.UI.createTableView({
	data: actions,
	backgroundColor:'#FFF'
});

// EVENT LISTENER
tableView.addEventListener('click',function(e){
	if (e.row.title=='Authorize') {
		BH.authorize(function (e){
			if (e===true) {
				alertDialog.message = 'Successfully authorized.';
			} else {
				alertDialog.message = 'Failed to authorize.';
			}
			alertDialog.show();
		});
	} else if (e.row.title=='Deauthorize') {
		BH.deauthorize(function(e){
			if (e===true) {
				alertDialog.message = 'Successfully deauthorized.';
			} else {
				alertDialog.message = 'Failed to deauthorize.';
			}
			alertDialog.show();
		});
	} else if (e.row.title=='Is Authorized') {
		alertDialog.message = 'Are you authorized? Answer is: '+BH.authorized();
		alertDialog.show();
	} else if (e.row.title=='Send Tweet') {
		BH.tweet(function(resp){
			if (resp===true) {
				alertDialog.message = 'Your tweet was sent!';
			} else {
				alertDialog.message = 'Your tweet was not sent :(';
			}
			alertDialog.show();
		});
	} else if (e.row.title=='Send Tweet with Default Text') {
		BH.tweet('Some default text.');
	} else if (e.row.title=='Send URL Shortened Tweet') {
		BH.short_tweet(function(resp){
			if (resp===true) {
				alertDialog.message = 'Your tweet was sent!';
			} else {
				alertDialog.message = 'Your tweet was not sent :(';
			}
			alertDialog.show();
		});
	} else if (e.row.title=='Shorten URL') {
		var urlwin = Ti.UI.createWindow({backgroundColor:'#FFF',fullscreen:true});
		var urllabel = Ti.UI.createLabel({text:'Enter url:',top:10,height:20,width:'auto'});
		var geturl = Ti.UI.createButton({title:'Shorten',height:20,width:75,bottom:10,right:10});
		var cancelgeturl = Ti.UI.createButton({title:'Cancel',height:20,width:75,bottom:10,left:10});
		var urlbox = Ti.UI.createTextArea({
			value:'http://www.ientry.com',
			height:70,
			width:300,
			top:60,
			color:'#000',
			textAlign:'left',
			borderWidth:2,
			borderColor:'#bbb',
			borderRadius:5
		});
		urlwin.add(urllabel);
		urlwin.add(cancelgeturl);
		urlwin.add(geturl);
		urlwin.add(urlbox);
		cancelgeturl.addEventListener('click',function(){
			urlwin.close();
		});
		urlwin.open();
		geturl.addEventListener('click',function(){
			BH.shorten_url(urlbox.value,function(shorturl){
				if (shorturl!=false) {
					alertDialog.message = 'Your shortened url is: '+shorturl;
				} else {
					alertDialog.message = 'URL was not shortened';
				}
				alertDialog.show();
				urlwin.close();
			});
		});
	} else if (e.row.title=='Get Tweets') {
		activity.show();
		BH.get_tweets(function(tweets){
			activity.hide();
			if (tweets===false) {
				alertDialog.message = 'Failed to get tweets.';
			} else {
				if (typeof(tweets)=='object' && tweets.length>0) {
					for (var i=0;i<tweets.length;i++) {
						Ti.API.info('tweet'+i+': '+tweets[i].text);
					}
				}
				alertDialog.message = 'Tweets were fetched, see log for the output.';
			}
			alertDialog.show();
		});
	} else {
		activity.show();
		BH.api('http://api.twitter.com/1/statuses/public_timeline.json','GET','',function(tweets){
			activity.hide();
			tweets = JSON.parse(tweets);

			if (tweets===false) {
				alertDialog.message = 'Failed to get tweets.';
			} else {
				if (typeof(tweets)=='object' && tweets.length>0) {
					for (var i=0;i<tweets.length;i++) {
						Ti.API.info('tweet'+i+': '+tweets[i].text);
					}
				}
				alertDialog.message = 'Tweets were fetched, see log for the output.';
			}
			alertDialog.show();
		});
	}
});

win.add(tableView);
win.open();

