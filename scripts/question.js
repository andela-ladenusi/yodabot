var _ 				= require('lodash');
var apiHost 	= process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {
	robot.hear(/q: (.*) #\[(.*)\]/i, function (response) {
    var question 	= {
      uid					: response.message.user.id,
      username    : response.message.user.name,
      body				: response.match[1],
      tags				: response.match[2]
    };

    robot.http(apiHost + '/questions')
    .headers({'Content-Type': 'application/json'})
    .post(JSON.stringify(question))(function (err, res, body) {
      if(err) {
        console.log('Encountered an error - ' + err);
        return 'Encountered an error - ' + err;
      }
      console.log('This is the response from the api - ', body);
      // if (body.experts == null) {
      //   var attachment    = {
      //     content         : {
      //       color         : 'warning',
      //       fallback      : ":cry: There are currently no experts for your question",
      //       pretext       : ':cry: *There are currently no experts for your question*',
      //       text          : '_Why not try to ask the same question with different & simpler tags, maybe?_',
      //       mrkdwn_in     : ['fallback', 'text', 'pretext']
      //     },
      //     channel         : question.username
      //   };

      //   robot.emit('slack-attachment', attachment);
      //   setTimeout(function () {
      //     attachment.channel = 'yoda-log';
      //     attachment.content.color = 'danger';
      //     attachment.content.pretext = '*New question from* `' + question.username + '`';
      //     attachment.content.fallback = attachment.content.pretext;
      //     attachment.content.text = '*Question:* ' + question.body;
      //     robot.emit('slack-attachment', attachment);
      //   }, 2000);
      //   return;
      }
    });
    response.send('Thank you for your question.\nI will let you know as soon as there\'s any response to your question.');
	});
};
