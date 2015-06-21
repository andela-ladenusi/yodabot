var _ 				= require('lodash');
var apiHost 	= process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {
	robot.hear(/q: (.*) #\[(.*)\]/i, function (response) {
    var question 	= JSON.stringify({
      uid					: response.message.user.id,
      username    : response.message.user.name,
      body				: response.match[1],
      tags				: response.match[2]
    });

    robot.http(apiHost + '/questions')
    .headers({'Content-Type': 'application/json'})
    .post(question)(function (err, res, body) {
      if(err) {
        console.log('Encountered an error - ' + err);
        return 'Encountered an error - ' + err;
      }
      console.log(body);
      return 'The question was successfully sent';
    });
    response.send('Thank you for your question.\nI will let you know as soon as there\'s any response to your question.');
	});
};