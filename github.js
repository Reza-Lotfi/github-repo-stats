//require dependencies
const axios = require('axios');
const readline = require('readline');

//initialize global variables
let repo = {};
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//open a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\nenter the username of the person or organization who owns the repo (case insensitive): '
});

//prompt the user for input
rl.prompt();

//handle user input
rl.on('line', input => {
  if (!repo.owner) {
    //first input for repo owner
    repo.owner = input;
    
    //change prompt to ask for repo name now
    rl.setPrompt('enter the name of the repo you want information about (case insensitive): ');
    
    //prompt user again
    rl.prompt();
  } else if (!repo.name) {
    //second input for repo name
    repo.name = input;

    //now make a GET request to GitHub API
    axios.get(`https://api.github.com/repos/${repo.owner}/${repo.name}/stats/commit_activity`)
      .then(response => {
        let dayCommits = [0, 0, 0, 0, 0, 0, 0];

        //count the total number of commits for each day of the week over the last year
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < response.data.length; j++) {
            dayCommits[i] += response.data[j].days[i];
          }
        }

        return dayCommits;
      })
      .then(dayCommits => {
        //find the highest number of commits for a day of the week (this gets used later)
        const mostCommitsOnADayOfWeek = Math.max(...dayCommits);
        
        //find the day of the week with the most commits
        const mostCommittedDay = days[dayCommits.indexOf(mostCommitsOnADayOfWeek)];

        //output the findings to the user
        console.log(`\n${mostCommittedDay} has had the most commits, ${mostCommitsOnADayOfWeek}, over the last year.`);
        console.log(`On average, about ${(mostCommitsOnADayOfWeek/52).toFixed(2)} commits were made on every ${mostCommittedDay} over the last year.`);

        //return to the command line
        process.exit();
      })
      .catch(error => {
        //handle any errors
        throw new Error(error);
      });
  }
});
