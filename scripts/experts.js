var _ 				= require('lodash');
var apiHost 	= process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {
	robot.router.post('/experts', function (req, res) {
    var i, qid, question, expert, expertsObj = req.body;
    console.log(expertsObj);

    for(i = 0; i < expertsObj.experts.length; i++) {
    	expert 		= expertsObj.experts[i];
    	question 	= expertsObj.question;
    	qid				= question.id.substr(-8).toLowerCase();

    	if(expert.username && (expert.slack !== question.userId)) {
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
	    	console.log('Question has been sent to - ', expert.username);
	    }
    }
    res.status(200).send('Question has been sent to the experts');
  });
};