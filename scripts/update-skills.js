var _         = require('lodash');
var apiHost   = process.env.YODABOT_API_URL || 'http://localhost:5555';

module.exports = function (robot) {
  robot.hear(/skillset: #\[(.*)\]/i, function (response) {

    var skills = JSON.stringify({
      skills: response.match[0]
    });

    robot.http(apiHost + '/users/skills')
    .headers({'Content-Type': 'application/json'})
    .post(skills)(function (err, res, body) {
      if(err) {
        console.log('Encountered an error - ' + err);
        return 'Encountered an error - ' + err;
      }
      console.log(body);
      return 'Skills successfully updated';
    });
    response.send('Thank you for updating your skills.');
  });
};
