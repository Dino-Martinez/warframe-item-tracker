# warframe-item-tracker <img width=60px height=50px src="https://i.imgur.com/d83giGW.png"/>
Warframe Scraper is a tool for players to see advanced data from the [Warframe Market](https://warframe.market/)

a React App for spying on the price of items on the warframe market

[Grading Rubric](https://github.com/Make-School-Courses/INT-1.2-AND-INT-2.2-Winter-Intensive/blob/master/README.md)

[Intensive Proposal](https://docs.google.com/document/d/10gTzVC7n29sxIkKQi_h7YWIZxiUGQP3KlLyP1_zlV5w/edit?usp=sharing)

## How to use:
As of right now, our project is not deployed to any live domain. In order to see it in action, you will have to download/clone it onto your computer and then follow some simple steps.
1. Open terminal and navigate to the repo. Once there, run "yarn" - this will install all necessary JavaScript dependencies.
2. Navigate into the api folder and run "pip install -r requirements.txt" - this will install all necessary python dependencies.
3. Now that all dependencies are available, it's time to run the project. First you will need to open up 4 terminal windows, 3 at the api directory and one at the top level of the repo.
4. In one of the three api windows, run "python db_updater.py" - this will initialize the local db, as well as complete our websocket fetch cycle
5. In the second api window, run "python api.py" - this will start our flask back end, preparing it to deliver databse info to our front end
6. In the final api window, run "python websockets.py" - this will connect our websocket to wf.m and await any new orders, updating the database accordingly.
7. In the window at the top level, simply run "yarn start" - this will start up the react front end to display all the data!

## Roadmap:
| Skateboard ✓✓✓                  | Bike ✓✓✓ | Car ✓✓✓ |
|:------------------------------- |:-------- |:------- |
| <ul><li>Build Website with navigation and mock data using React </li><li>Implement Search Feature using Warframe Market API</li></ul> | <ul><li>Build database that tracks items data from the API</li><li>CRUD for watchlist</li><li>Display useful error messages</li></ul> | <ul><li>Auto Fill Search Bar</li><li>Notifications on watchlist</li></ul>|

## Extras:
- Graph historical prices on item page ✓
- Link item pages via their sets
- Paginate watchlist

## TODO:
- Finish building db periodically from api call ✓
- Add front end CRUD for watchlist (add/remove buttons) ✓
- Loading screen animation ✓
- Display information if an api call/db query is bad ✓
- Convert from api calls to receiving webhooks ✓
- Add urgency check in backend for the watchlist ✓
- Add notifications table on watch list for items that are urgent ✓
- Complete fetch cycle with api calls every hour or so ✓
- Deploy to live server through heroku
- Tackle extras
- Clean up codebase
- Convert backend to Express
