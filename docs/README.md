Hi, this is my nutrition app, TerpBites!

TerpBites dynamically scrapes nutritional data from the University of Maryland's dining services website, providing up-to-date nutrition facts for foods served at the campus diner. I used the BeautifulSoup Python library to extract nutritional details for each food item and stored this data in an AWS RDS database for secure and scalable storage.

To enable efficient data retrieval, I built a Flask-based RESTful API that connects to the database and serves nutritional data to the front end. The front-end application, developed with React.js, allows users to search for specific food items, view detailed nutritional information, and create personalized meal plans using a built-in meal tracker.
