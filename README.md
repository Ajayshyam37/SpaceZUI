# Getting Started with SpaceZUI

## Setting Up SpaceZUI on your local environment

To set up the SpaceZUI project in your local environment follow the below steps.

### `npm install`

This will install the required npm libraries. If npm is not installed on your machine you can refer [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to set up npm on your machine.

### `npm run build`

Running the 'npm run build' command will trigger a build process that generates a production-ready version of your application or library by transpiring, bundling, and optimizing your code and assets.

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


## Landing Page

Once the npm start command runs you should be able to see a landing page like below. (Please note that the items might differ based on the database values at that point in time)

![Landing Page](https://drive.google.com/uc?export=view&id=1fn6uDafnhfenPM8gPxuUcB9ikvGRQnHb)

## Add New Spacecraft

To add a new SpaceCraft simply click the New button on the right-hand corner and that will create a new launch vehicle.


## Initiating Spacecraft

To initiate a Spacecraft click on the desired waiting spacecraft and you will then see an option to initiate the launch. With a click of that button, the launch will be initiated.

![Launch](https://drive.google.com/uc?export=view&id=1gV_4djasSGXr2gLPYWVlPWi_KPGrfBt5)


You'll then be prompted to select a file from your file explorer. The file should be of type *.txt

The text file should contain the below information.

        lvName: "YOUR SPACE CRAFT NAME"
        lvOrbit:10000 //SPACE CRAFT ORBIT RADIUS
        plInfo://PATH TO PAYLOAD CONFIGURATION FILE.

The PayLoad Configuration File Should consists of the following information.

        plName: "YOUR PAYLOAD NAME"
        plType: "PAYLOAD TYPE" //Communication, Spy, Scientific

## Active Spacecraft

After successfully completing the Launch process the Spacecraft initiated will now show up under Active Spacecraft.

By Clicking on Data you can view the SpaceCrafts Data.
By Clicking on DeOrbit you can Deorbit the SpaceCraft.

![Active](https://drive.google.com/uc?export=view&id=1Ch-ZTOXW5QOADLd7fUSCqZkNjVJqIZ7s)

## Communications

The Communications Page is Divided into Two Layouts Telemetry and PayLoad.

## Telemetery

This layout shows the active telemetry information of SpaceCraft it updates the list with the latest telemetry every 10s.

You have the option to Start and Stop it.

![Telemetry](https://drive.google.com/uc?export=view&id=13213EBHQxz1Y4rWRgi_Bm_y1Jz5Ljiau)

## PayLoad
This layout gives the user the option to Launch a PayLoad only after the Spacecraft has reached Orbit.

After the PayLoad is launched you can start the PayLoad data, this will generate random data and display it on the page based on the payload type we configured while launching.

You have the option to Start and Stop the Payload Data and also DeOrbit it.

![PayLoad](https://drive.google.com/uc?export=view&id=1Etq5I8s-gvtOUgakg20Wr4lGG32-_LVE) 


