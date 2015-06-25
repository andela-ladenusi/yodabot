var _ 					= require('lodash');
var apiHost 		= process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports 	= function (robot) {

	robot.hear(/a\[(.*)\] (.*)/i, function (response) {
    var answer = {
      slack					: response.message.user.id,
      username      : response.message.user.name,
      qid 					: response.match[1],
      content		 		: response.match[2]
    };

    response.send('Thank you for your response!');

    robot.http(apiHost + '/answers')
    .headers({'Content-Type': 'application/json'})
    .post(JSON.stringify(answer))(function (err, res, body) {
      if (err) {
        console.log('Encountered an error - ' + err);
        return err;
      }
      if (body) {
      	var data = JSON.parse(body);
      	var attachment 		= {
					content					: {
						color 				: 'good',
						fallback			: "Your question has received a response!",
						pretext				: '*Your Question Has Received A Response*',
						author_name		: 'Question: ' + data.body,
						mrkdwn_in			: ['text', 'pretext']
					},
					channel					: data.username
				};

				attachment.content.text = '*Response:* ' + data.answer.content;
																// + '\n>_Was this answer helpful?_'
																// + ' <http://localhost:8080/answers/yes?uname=' + data.username + '|Yes>'
																// + ' <http://localhost:8080/answers/no|No>';

	    	robot.emit('slack-attachment', attachment);

        setTimeout(function () {
          attachment.channel = 'yoda-log';
          attachment.content.fallback = attachment.content.pretext = '*New response from* `@' + answer.username + '`';
          attachment.content.text = '*Response:* ' + data.answer.content;

          robot.emit('slack-attachment', attachment);
        }, 2000);
      }
    });
  });
};