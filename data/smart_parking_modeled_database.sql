/*User info*/

CREATE TABLE USERINFO ( 

    UserID SERIAL NOT NULL UNIQUE, 
    AccUsername varchar(16) NOT NULL UNIQUE, 
    AccPassword varchar(100) NOT NULL, 
    Email varchar(100) NOT NULL, 
    CarModel varchar(100), 
    PRIMARY KEY(UserID)

);

/*Spot info*/ 

CREATE TABLE SPOT ( 

    SpotID SERIAL NOT NULL UNIQUE, 
    SplocationInfo varchar(100) NOT NULL, 
    SpCoordinates POINT NOT NULL,
    PRIMARY KEY (SpotID)

);

/*Charger info*/

CREATE TABLE CHARGER ( 

    ChargerID SERIAL NOT NULL UNIQUE, 
    ChAvailability BOOLEAN NOT NULL, 
    ChPower varchar(100) NOT NULL, 
    ChType varchar(100) NOT NULL, 
    ChPrice varchar(100) NOT NULL,
    ChSpotID INTEGER NOT NULL UNIQUE, 
    FOREIGN KEY (ChSpotID) REFERENCES SPOT (SpotID), 
    PRIMARY KEY (ChargerID)

);