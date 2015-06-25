var _         = require('lodash');
var apiHost   = process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {
  robot.hear(/add-skill #\[(.*)\]/i, function (response) {
    console.log(response.match[1]);
    var slackID   = response.message.user.id;
    var skills    = {
      skills      : response.match[1].replace(/ /g, '').split(',')
    };

    robot.http(apiHost + '/users/' + slackID + '/skills/add')
    .headers({'Content-Type': 'application/json'})
    .post(JSON.stringify(skills))(function (err, res, body) {
      if(err) {
        console.log('Encountered an error - ' + err);
        return 'Encountered an error - ' + err;
      }
      console.log(body);
      return 'Skills successfully updated';
    });
    response.send('Thank you for updating your skills.');
  });

  robot.hear(/remove-skill #\[(.*)\]/i, function (response) {
    var slackID   = response.message.user.id;
    var skills    = {
      skills      : response.match[1].replace(/ /g, '').split(',')
    };

    robot.http(apiHost + '/users/' + slackID + '/skills/remove')
    .headers({'Content-Type': 'application/json'})
    .post(JSON.stringify(skills))(function (err, res, body) {
      if(err) {
        console.log('Encountered an error - ' + err);
        return 'Encountered an error - ' + err;
      }
      console.log(body);
      return 'Skills successfully updated';
    });
    response.send('Thank you for updating your skills.');
  });

  robot.hear(/show-skills/i, function (response) {
    var slackID = response.message.user.id;
    var username = response.message.user.name;
    robot.http(apiHost + '/users/' + slackID + '/skills')
    .headers({'Content-Type': 'application/json'})
    .get()(function (err, res, body) {
      if (err) {
        console.log('Encountered an error - ' + err);
        return 'Encountered an error - ' + err;
      }

      body = JSON.parse(body);
      if (body.error) {
        return response.send(body.error);
      }

      if (body.response) {
        return robot.emit('slack-attachment', {
          content         : {
            color         : 'good',
            fallback      : "Here are your skills",
            pretext       : 'Here are your skills',
            title         : 'Your Skills',
            text          : '`' + body.response.toString().replace(/,/g, ', ') + '`',
            mrkdwn_in     : ['text', 'pretext']
          },
          channel         : username
        });
      }
    });
  });
};
