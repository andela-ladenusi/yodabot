var _ 				= require('lodash');
var apiHost 	= process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {
	robot.router.post('/experts', function (req, res) {
    var i, qid, question, expert, expertsObj = req.body;
    question 	= expertsObj.question;
    console.log(expertsObj);
    if (!expertsObj.experts) {
    	var attachment 		= {
				content					: {
					color 				: 'warning',
					fallback			: ":cry: There are currently no experts for your question",
					pretext				: ':cry: *There are currently no experts for your question*',
					text					: '_Why not try to ask the same question with different & simpler tags, maybe?_',
					mrkdwn_in			: ['fallback', 'text', 'pretext']
				},
				channel					: question.username
			};

			robot.emit('slack-attachment', attachment);
			setTimeout(function () {
    		attachment.channel = 'yoda-log';
    		attachment.content.color = 'danger';
    		attachment.content.pretext = '*New question from* `' + question.username + '`';
    		attachment.content.fallback = attachment.content.pretext;
    		attachment.content.text = '*Question:* ' + question.body;
    		robot.emit('slack-attachment', attachment);
    	}, 2000);
    	return res.status(404).send('I am sorry, but there are currently no experts for your question');
    }

    for (i = 0; i < expertsObj.experts.length; i++) {
    	expert 		= expertsObj.experts[i];
    	qid				= question.id.substr(-8).toLowerCase();

    	if (expert.username && (expert.slack !== question.userId)) {
    		var attachment 		= {
					content					: {
						color 				: '#439FE0',
						fallback			: "A question requires your expertise",
						pretext				: '*A Question Requires Your Expertise*',
						author_name		: 'qid: ' + qid,
						mrkdwn_in			: ['text', 'pretext']
					},
					channel					: expert.username
				};

				attachment.content.text = '*Question:* ' + question.body
																// + '\n>_If you wish to decline this question, click_'
																// + ' <http://localhost:8080/question/decline|Decline>'
																+ '\n\n_Give your answer in this format:_ `a[' + qid + '] Your answer`';

	    	robot.emit('slack-attachment', attachment);
	    	setTimeout(function () {
	    		attachment.channel = 'yoda-log';
	    		attachment.content.pretext = '*New question from* `' + question.username + '`';
	    		attachment.content.fallback = attachment.content.pretext;
	    		attachment.content.text = '*Question:* ' + question.body;
	    		robot.emit('slack-attachment', attachment);
	    	}, 2000);
	    	console.log('Question has been sent to - ', expert.username);
	    }
    }
    res.status(200).send('Question has been sent to the experts');
  });
};
