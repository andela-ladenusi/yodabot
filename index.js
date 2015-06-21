var shell = require('shelljs');
console.log("Starting Yodabot");
shell.exec('HUBOT_SLACK_TOKEN=xoxb-4491956418-LUBmGhLmi2Mve6KJzOYZZvGV ./bin/hubot --adapter slack');