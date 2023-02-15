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
    ChSpotID INTEGER NOT NULL, 
    FOREIGN KEY (ChSpotID) REFERENCES SPOT (SpotID), 
    PRIMARY KEY (ChargerID)

);

/*Trip info*/ 

CREATE TABLE TRIP ( 

    TripID SERIAL NOT NULL UNIQUE, 
    TripName varchar(100) NOT NULL, 
    TripUserID INTEGER NOT NULL, 
    PRIMARY KEY (TripID)

);

/*Reservation info*/ 

CREATE TABLE RESERVATION ( 

    ReservationID SERIAL NOT NULL UNIQUE, 
    ResDate varchar(10) NOT NULL, 
    ResStartTime varchar(5) NOT NULL, 
    ResEndTime varchar(5) NOT NULL,
    ResUserID INTEGER NOT NULL,
    ResChargerID INTEGER NOT NULL, 
    ResSpotID INTEGER NOT NULL, 
    ResTripID INTEGER,
    FOREIGN KEY (ResUserID) REFERENCES USERINFO (UserID),
    FOREIGN KEY (ResChargerID) REFERENCES CHARGER (ChargerID),
    FOREIGN KEY (ResSpotID) REFERENCES SPOT (SpotID),
    FOREIGN KEY (ResTripID) REFERENCES TRIP (TripID),
    PRIMARY KEY(ReservationID)

);
