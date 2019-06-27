Hi curious reader!

**INSTRUCTIONS**

- I used axios as my only dependency to make requests to the GitHub API. To install it, please enter ```npm install``` in the command line while in the root directory.

- To run the program, please enter ```node github.js``` in the command line while in the root directory (assuming you have Node succesfully installed on your computer).

- I tried to make the rest of the program self-explanatory :). I also added comments throughout my code to make it more readable.

**NOTES**

- According to the GitHub Docs, 'Computing repository statistics is an expensive operation, so we try to return cached data whenever possible. If the data hasn't been cached when you query a repository's statistics, you'll receive a 202 response; a background job is also fired to start compiling these statistics. Give the job a few moments to complete, and then submit the request again. If the job has completed, that request will receive a 200 response with the statistics in the response body.'

- In other words, if you try to get stats about a repo and get 0 commits back, please try again after a few moments. I tested my code many times throughout development and only ran into this issue when querying a repo for the first time.

- I'm aware I could have used the built-in http module in the standard node library, but I wanted my code to be more readable.

- I hope you all like my work! :)
