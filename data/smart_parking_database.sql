/*Usre info*/

CREATE TABLE USER ( 

    UserID SERIAL NOT NULL, 
    AccUsername varchar(16) NOT NULL UNIQUE, 
    AccPassword varchar(100) NOT NULL, 
    E-mail varchar(100) NOT NULL, 
    CarModel varchar(100), 
    PRIMARY KEY(UserID)

);

/*Reservation info*/ 

CREATE TABLE RESERVATION ( 

    ReservationID SERIAL NOT NULL, 
    ResDuration INTERVAL NOT NULL, 
    ResDate DATE NOT NULL, 
    ResTime TIME NOT NULL, 


);
