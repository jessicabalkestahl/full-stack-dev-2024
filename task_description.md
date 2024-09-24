# Provide below a brief overview of your approach.
- So I have used Django for the backend as instructed and decided to use React for my front end. 
- Firstly I mapped the database provided into Django models and then created serializers for each model in order to convert the Django querysets, into native Python data types.
- Created the views access points and urls that would serve both my front end and the API. 
- Created my front end app called medical_devices in React in order to make my backend requests using axios.
- I deliberately left access points to get data from each table without removing any duplicates to give the user the option to render it, if they wish to.

# Provide below instructions on how to set up and run the project locally.
- Ensure you have node and npm installed.
- Install frontend dependencies: 
##### cd to medical_devices -> npm install.
- Install backend dependencies:
##### Create virtual environment -> Activate virtual environment -> pip install -r requirements.txt
- Run tests: 
##### Enter virtual environment -> cd backend -> python manage.py test
- Start backend: 
##### Enter virtual environment -> python manage.py runserver
- Start frontend: 
##### cd to medical_devices -> npm start
- Exemple of API request: 
##### import requests 
##### requests.get('http://127.0.0.1:8000/get_fda_data/', params={"device_name": "bonemri"})

# Provide below any assumptions or decisions you made while implementing the task.
- I have made the assumption that devices with the same name and same manufacturer were a duplicate. 
- I have made the assumption that while filtering for duplicates, the manufacturers were equal despite different capitalization and punctuation.
- I have made the decision of not returning all the entries in case the user didn't pass any device_name params on the request or on the UI search bar. 
- I have made the decision of rendering all the devices found under the query for the device_name in case the user wants to see it.

# Provide below any suggestions or recommendations for how you would expand on this functionality further. 
- I would firstly work on a Django migration to standardize the data across both tables and give it a foreign key for easier access between both tables.
- I could expand the options that the user could search a device for. i.e. search by manufacturers name.
- I could render some filters so the user wouldn't need to type the device name and just choose from a selection of dropdowns.
- I could limit the information on the columns to only show the most important ones and allow to click on each row and show more information about the selected device. i.e. a React modal