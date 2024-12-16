# foodscraper
# foodscraper

TERPBITES NUTRITION APP
This is my deliverable for INST377 at UMD: a nutrition app that scrapes data from the UMD Dining Halls' nutritional website and displays it in an interactive interface. Users are able to view nutritional data for meals at the diner by searching for items, adding them, and incrementing serving sizes to match their meal. This application uses a Flask backend and a React frontend and uses an AWS RDS database for storage. The scraping logic is done in Python.

There is one endpoint that is used to retrieve from the database. The scraping process (run_scraping) handles bulk insertion directly into the database. This happens outside of the API endpoint.

The main feature of the frontend is a dynamic search bar component that allows users to input a food name and optionally filter results by location (e.g., "251 North," "South," or "Yahentamitsi"). The search functionality is optimized with debouncing, ensuring efficient API calls to the backend as users type, minimizing unnecessary requests. When a query is submitted, the frontend sends a GET request to the backend API, retrieves the data, and displays the results in real time. The frontend is built with React and updates in real time as users interact with it.

The app is targeted for web browsers and doesn't support iOS or Android. I wasn't able to get it deployed on Vercel, so for now it can only be run on localhost.

DEVELOPER MANUAL
_______________________________________________________________________________________________________________________________________________________________________
Prerequisites:
Python 3.x
Node.js & npm
MySQL Server
_______________________________________________________________________________________________________________________________________________________________________
PLEASE READ!!!!!!!
I was in the process of trying to deploy the application on the main branch but couldn't get it deployed. To demo the app itself on localhost, switch to the "demo_branch" branch using this command:
  git checkout demo_branch

The details for the endpoint are in a .env file in the root directory of the project. To add new endpoints and connect them, update the .env file and update the corresponding value in db_connection.py
_______________________________________________________________________________________________________________________________________________________________________

LAUNCHING THE APP:
Step 1: Clone Repository

Step 2: Install dependencies
  pip install -r requirements.txt
  
Step 2.5: Perform scraping (if not already done)
  (From project root directory)
  python3 scrape.py

Step 3: Launch Backend
  (In project root directory)
  python3 app.py

Step 4: Launch Frontend
  (From project root directory)
  cd foodscraper-frontend
  npm run dev

The app should launch, if data doesn't display on the front-end it is likely an issue with the database or the url in the SearchBar.jsx component. The URL is easy to find when you open the file; it is what determines the API endpoint that the frontend retrieves data from. Make sure that it is set to localhost if launching on localhost.
_______________________________________________________________________________________________________________________________________________________________________
ENDPOINTS:

The frontend is connected to the backend through the SearchBar.jsx component which makes a GET request to my backend API. The url that connects the frontend will look something like:
    let url = `http://localhost:5000/api/food?food_name=${encodeURIComponent(inputValue)}`;

The backend API is located at the bottom of app.py. It looks like this:
  @app.route('/api/food', methods=['GET'])

It is responsible for:
Handling food data retrieval using a GET request to the /api/food endpoint.
It supports querying food items by Name (required) and Location (optional).

The connect_to_mysql() function (imported from db_connection.py) establishes a connection to the MySQL database.
_______________________________________________________________________________________________________________________________________________________________________
PROJECT STRUCTURE:
FOODSCRAPER
├── foodscraper-frontend
│   ├── src
│   │   ├── assets
│   │   └── complements
│   │       ├── NutritionModal.css
│   │       ├── NutritionModal.jsx
│   │       ├── SearchBar.css
│   │       ├── SearchBar.jsx
│   │       ├── SearchResult.css
│   │       ├── SearchResult.jsx
│   │       ├── SearchResultsList.css
│   │       ├── SearchResultsList.jsx
│   │       ├── SelectedItemsList.css
│   │       └── SelectedItemsList.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── frontend
│   └── dist
│       ├── assets
│       └── index.html
├── node_modules
├── .env
├── app.py
├── config.py
├── db_connection.py
├── package-lock.json
├── package.json
├── README.md
├── requirements.txt
├── scrape.py
├── test_query.py
└── vite.config.js
