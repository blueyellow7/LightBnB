# LightBnB

## Description
LightBnB is a simple app to allow home owners to rent out their homes to people on vacation, creating an alternative to hotels and bed and breakfasts. It also allows guests to make reservations of different properties for their vacations.
LightBnB utilizes a database that connects to a javascript application so that we can interact with the data of different homes and properties from the LightBnB web page. 

## Screentshots of Final Product
### Structure of the database
!["Databse ERD"](https://raw.githubusercontent.com/blueyellow7/LightBnB/main/docs/lightbnb_ERD.png)
### Login page
!["Login Page of Lightbnb"](https://raw.githubusercontent.com/blueyellow7/LightBnB/main/docs/login.png)
### Page to view your own reservations
!["My Reservations Pags"](https://raw.githubusercontent.com/blueyellow7/LightBnB/main/docs/my_reservations.png)
### Page to search for properties
!["Search Properties Page"](https://raw.githubusercontent.com/blueyellow7/LightBnB/main/docs/search.png)

## Installation
1. Clone the repository onto your local device using ```git clone git@github.com:blueyellow7/LightBnB.git```
3. Install dependencies using the `npm install` command.
3. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
4. Go to <http://localhost:3000/> in your browser.

## Dependencies
- Bycrypt
- Express
- Postgres
- Nodemon
- Cookie-session