module.exports = function (robot) {
	
	robot.hear(/\<q\> (.*) #(.*)/i, function (res) {
		res.send('Thank you for your question.\nI will let you know as soon as there\'s any response to your question.');
		console.log(res.match);
		var user = JSON.stringify({
			id: res.message.user.id,
			body: res.match[1],
			tags: res.match[2]
		});
		console.log(user);

		robot.http('http://yodabot-api.herokuapp.com/questions')
		.headers({'Content-Type': 'application/json'})
		.post(user)(function (err, res, body) {
			console.log(err);
			console.log('\n', res);
			console.log('\nThis is the body of the POST ' + body);
			if(err) {
				console.log('Encountered an error - ' + err);
				return;
			}
			console.log('Successfully sent data!');
			res.user = user;
		});
	});

	robot.router.post('/experts', function (req, res) {
		var experts = req.body;
		console.log(experts);
		robot.messageRoom('yoda-masters', 'Here are the experts: ' + experts.user.slack);
		res.end('Data received by Master Yoda');
	});

	var yodaMaster = {
		getGroupMembers: function() {
			robot.http('https://slack.com/api/groups.list?token=xoxp-2853699384-2973559118-3689875758-4bb292')
			.get()(function (err, res, body) {
				if(err) {
					console.log('Encountered an error!');
					return;
				}
				var req = JSON.parse(body);
				// console.log(req.groups);
				for(var i = 0; i < req.groups.length; i++) {
					if(req.groups[i].id === 'G04F44C29') {
						var group = req.groups[i];
						console.log(group);
						for(var j = 0; j < group.members.length; j++) {
							if(group.members[j] !== 'U04EFU4CA') {
								// console.log(group.members);
								var url = 'https://slack.com/api/chat.postMessage?token=xoxb-4491956418-LUBmGhLmi2Mve6KJzOYZZvGV&';
								url += 'channel=' + group.members[j] + '&username=yodabot&text=Master Yoda Wants You';
								// robot.http(url).
								// post()(function (err, res, body) {
								// 	if(err) {
								// 		return err;
								// 	}
								// });
								robot.messageRoom('yoda-masters', 'Master Yoda Wants You - ' + group.members[j]);
								// robot.http('http://localhost:5555/user/register')
								// .post(member)(function (req, res) {
								// 	var 
								// });
							}
						}
					}
				}
			});
		}
	};


	robot.hear(/\<a\> (.*) #(.*)/i, function (res) {
		res.send('Wonderful mind!.\nLet\'s see if what you bring in makes you a master or an apprentice still.');
		console.log(res.match);
		var answer = JSON.stringify({
			id: res.message.user.id,
			name: res.message.user.name,
			email_address: res.message.user.email_address,
			content: res.match[1],
			question_id: res.match[2]
		});
		var apprenticeId;
		console.log(answer);

		robot.http('http://yodabot-api.herokuapp.com/answers')
		.headers({'Content-Type': 'application/json'})
		.post(answer)(function (err, res, body) {
			console.log(err);
			console.log('\n', res);
			console.log('\nThis is the body of the POST ' + body);
			if(err) {
				console.log('Encountered an error - ' + err);
				return;
			}
			console.log('Successfully sent data!');
			res.answer = answer;
		});
    var url = 'https://knowledgebot.firebaseio.com/questions/' + answer.question_id + '.json';
		robot.http(url)
			.get()(function (err, res, body) {
				if(err) {
					console.log('Encountered an error!');
					return;
				}
				apprenticeId = JSON.parse(body).userId;
			});
		var msgAnswer = 'https://slack.com/api/chat.postMessage?token=xoxb-4491956418-LUBmGhLmi2Mve6KJzOYZZvGV&';
				msgAnswer += 'channel=' + apprenticeId + '&username=yodabot&text=' + answer.content;
				console.log(msgAnswer);
		robot.http(msgAnswer).
		post()(function (err, res, body) {
			if(err) {
				return err;
			}
		});

	});
	yodaMaster.getGroupMembers();
};