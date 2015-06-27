module.exports = function (robot) {
	var env = process.env.NODE_ENV || 'development';

	if (env === 'production') {
		var apiHost = process.env.YODABOT_API_URL || 'http://localhost:5555';
		// keep the yodabotapi server alive;
		setInterval(function() {
	    robot.http(apiHost)
	    .get()(function (err, res, body) {
	    	if (err) {
	    		return err;
	    	}
	    	console.log('This is the response from the API server: ', body);
	    });
		}, 300000);
	}

	robot.respond(/help|hello|hi/i, function (response) {
		var message = 'Thank you for getting in touch.\nBelow is the current list of available commands'
								+ '\n> `register` - To register your github account and your slack details with me'
								+ '\n\n> `gh-user @yourgithubusername` - To allow me connect with your github account and pull your skillset'
								+ '\n\n> `show-skills` - To list your skills from your skillset'
                + '\n\n> `add-skill #[skill]` - To add to your skillset, if you have more than the skills pulled from your github repos. e.g `add-skill #[Java, SQL]`'
                + '\n\n> `remove-skill #[skill]` - To remove from your skillset e.g `remove-skill #[Java, SQL]`'
                + '\n\n> `taglist` - To list all available tags from all the users'
								+ '\n\n> `q: Your question? #[tag]` - To ask a question, use this format and ask the question. You must also include, at least, a tag(s) in the tag identifier, and you can also have comma-separated tags in the tag identifier - `#[Java, SQL]`'
								+ '\n\n> `a[xxxxxxxx] Your answer` - You can answer a question in this format, where `xxxxxxxx` is the id of the question I may send to you'
		response.reply(message);
	});
};
