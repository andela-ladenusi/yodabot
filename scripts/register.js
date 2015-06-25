var _ 				= require('lodash');
var apiHost 	= process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {

	// listen for the register command from a user and then,
	// tell the user the format in which to supply their
	// github username.
	robot.respond(/register/i, function (response) {
		return robot.emit('slack-attachment', {
			content					: {
				color 				: '#439FE0',
				fallback			: "What's your github username?",
				pretext				: 'Give me your github username in the following format:',
				text					: '`gh-user @username`',
				mrkdwn_in			: ['text']
			},
			channel					: response.message.user.name
		});
	});

	// listen for the Github user command (gh-user) from a user.
	robot.respond(/gh-user @(.*)/i, function (response) {
		// create a user object from the message sent to the bot.
		var user 		= {
			channel		: response.message.rawMessage.channel,
			slack 		: response.message.user.id,
			username	: response.message.user.name,
			email 		: response.message.user.email_address,
			github 		: response.match[1]
		};

		var setSkills = function (user, skills) {
			return user.skills = skills;
		};

    var skills 	= [],
    		url 		= 'https://api.github.com/users/' + user.github + '/repos';

    robot.http(url)
    .get()(function (err, get_res, repositories) {
      if (err) {
        console.log("Unable to fetch github repos.");
        return get_res.send(err);
      }

      var i, repos = JSON.parse(repositories);

      for (i = 0; i < repos.length; i++) {
        if (repos[i].language) {
          skills.push(repos[i].language);
        }
      }
      skills = _.uniq(skills);
      setSkills(user, skills);

      robot.http(apiHost + '/users/register')
      .headers({'Content-Type': 'application/json'})
      .post(JSON.stringify(user))(function (err, post_res, data) {
        if (err) {
          console.log('Encountered an error - ' + err);
          return post_res.send(err);
        }

        if (!data.error) {
	        return robot.emit('slack-attachment', {
						content					: {
							color 				: 'good',
							fallback			: "You have been successfully registered",
							pretext				: 'You have been successfully registered',
							title					: 'Your Skills',
							text					: '`' + user.skills.toString().replace(/,/g, ', ') + '`',
							mrkdwn_in			: ['text', 'pretext']
						},
						channel					: user.username
					});
	      }
      });
    });
	});
};
