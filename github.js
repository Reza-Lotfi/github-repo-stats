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
    
    //check for valid input
    if (!input) {
      throw new Error('please input a valid repo owner username')
    }

    //first input for repo owner
    repo.owner = input;
    
    //change prompt to ask for repo name now
    rl.setPrompt('enter the name of the repo you want information about (case insensitive): ');
    
    //prompt user again
    rl.prompt();

  } else if (!repo.name) {
    
    //check for valid input
    if (!input) {
      throw new Error('please enter a valid repo name')
    }

    //second input for repo name
    repo.name = input;

    //change prompt to ask for number of weeks of repo history
    rl.setPrompt('enter the number of weeks of history you want to see (number must be between 1 and 52) (press enter to default to 1 year): ');

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

    //change the prompt to ask for sorted values in ascending or descending order
    rl.setPrompt('please specify if you\'d like to see the commit counts for each weekday in ascending or descending order (enter \'asc\' or \'desc\') (press enter to default to descending): ');

    //prompt user again
    rl.prompt();

  } else if (!repo.sort) {

    //check if the input is valid, then set the sort property accordingly
    if (input !== 'asc' && input !== 'desc' && input) {
      throw new Error('please enter only \'asc\' or \'desc\' (no quotation marks) or just press enter');
    } else if (!input || input === 'desc') {
      repo.sort = 'desc';
    } else {
      repo.sort = 'asc';
    }

    //now make a GET request to the GitHub API
    axios.get(`https://api.github.com/repos/${repo.owner}/${repo.name}/stats/commit_activity`)
      .then(response => {

        //initialize commit counter object
        let dayCommits = {};

        //count the total number of commits for each day of the week over the last year
        for (let i = 0; i < days.length; i++) {
          if (!dayCommits[days[i]]) {
            dayCommits[days[i]] = 0;
          }
          for (let j = 0; j < repo.weeks; j++) {
            dayCommits[days[i]] += response.data[j].days[i];
          }
        }
  
        return dayCommits;
      })
      .then(dayCommits => {
        
        //initialize an array of the weekdays sorted by their commit number
        let sortedDays;

        //populate that array with weekdays in either ascending or descending order
        if (repo.sort === 'asc') {
          sortedDays = Object.keys(dayCommits).sort((a, b) => {return dayCommits[a] - dayCommits[b]});
        } else {
          sortedDays = Object.keys(dayCommits).sort((a, b) => {return dayCommits[b] - dayCommits[a]});
        }

        console.log(`\nThe following are the average number of commits made per weekday over the last ${repo.weeks} weeks in ${repo.sort}ending order for ${repo.owner}\'s repo named \'${repo.name}\':\n`);

        //loop through the sorted array of weekdays and print each weekday's corresponding commit count average
        for (let i = 0; i < sortedDays.length; i++) {
          console.log(`${sortedDays[i]}, ${(dayCommits[sortedDays[i]]/`${repo.weeks}`).toFixed(2)} commits`)
        }
  
        //return to the command line
        process.exit();
      })
      .catch(error => {
        //handle any errors
        throw new Error(error);
      });
  }
});
