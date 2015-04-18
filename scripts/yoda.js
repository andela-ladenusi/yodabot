module.exports = function (robot) {
	
	robot.hear(/#+/i, function (res) {
		res.send('Thank you for your question.\nI will let you know as soon as there\'s any response to your question.');
		// console.log(res.message.user, res.match);
		var user = res.message.user;
		user.question = res.message.rawText;
		user.tag = res.match[0];
		console.log(user);
		robot.http('http://localhost:5555/questions')
		.post(user)(function (err, res, body) {
			if(err) {
				console.log('Encountered an error');
				return;
			}
			console.log('Successfully sent data!');
			res.user = user;
		});
	});

	robot.router.post('/experts', function (req, res) {
		var experts = JSON.parse(req.body);
		console.log(experts);
		console.log(experts.payload)
		robot.messageRoom('yoda-masters', experts);
		res.end('Got data here');
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
								// robot.http('https://slack.com/api/chat.postMessage')
								// robot.messageRoom(group.members[j], 'Yoda Wants You - ' + group.members[j]);
							}
						}
					}
				}
			});
		}
	};
	yodaMaster.getGroupMembers();
};