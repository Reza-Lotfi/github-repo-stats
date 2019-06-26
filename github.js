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

    //change prompt to ask for number of weeks of repo history
    rl.setPrompt('enter the number of weeks of history you want to see (press enter to default to 1 year) (number must be between 1 and 52): ');

    //prompt user again
    rl.prompt();

  } else if (!repo.weeks) {

    //check if the default value was chosen. if it wasn't, check if it is a valid input. if it is, set that number of weeks.
    if (!input) {
      repo.weeks = 52;
    } else if (input < 1 || input > 52) {
      throw new Error('please enter a number of weeks between 1 and 52 (inclusive)');
    } else {
      repo.weeks = input;
    }

    //now make a GET request to the GitHub API
    axios.get(`https://api.github.com/repos/${repo.owner}/${repo.name}/stats/commit_activity`)
      .then(response => {

        //initialize commit counter array
        let dayCommits = [0, 0, 0, 0, 0, 0, 0];
  
        //count the total number of commits for each day of the week over the last year
        for (let i = 0; i < days.length; i++) {
          for (let j = 0; j < repo.weeks; j++) {
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
        console.log(`\n${mostCommittedDay} has had the most commits, ${mostCommitsOnADayOfWeek}, over the last ${repo.weeks} weeks.`);
        console.log(`On average, about ${(mostCommitsOnADayOfWeek/`${repo.weeks}`).toFixed(2)} commits were made on every ${mostCommittedDay} over the last ${repo.weeks} weeks.`);
  
        //return to the command line
        process.exit();
      })
      .catch(error => {
        //handle any errors
        throw new Error(error);
      });
  }
});
