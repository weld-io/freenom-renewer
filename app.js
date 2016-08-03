var async = require('async');
var request = require('request');
var moment = require('moment');

request.get('https://api.freenom.com/v2/domain/list', {
	qs: {
		results_per_page: 1000,
		email: process.env.FREENOM_EMAIL,
		password: process.env.FREENOM_PASSWORD
	},
	json: true
}, function(err, res, domains){
	async.eachSeries(domains.domain, function(domain, callback){
		// renew if domain expiration date is between 0 and 14 days from now (freenoms window)
		if ( !(moment(domain.expirationdate).diff(moment(), 'days') < 14 && moment(domain.expirationdate).diff(moment(), 'days') > -1) ) return callback();
		request.post('https://api.freenom.com/v2/domain/renew', {
			form: {
				domainname: domain.domainname,
				period: '12M',
				email: process.env.FREENOM_EMAIL,
				password: process.env.FREENOM_PASSWORD
			},
			json: true
		}, function(err, res, body){
			console.log(domain.domainname, body);
			callback();
		});								  
	});	
});								  
