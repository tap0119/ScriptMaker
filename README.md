# Madness Script Maker
A Blood on the Clocktower script pdf creator, with added customization options. [Click here for examples of PDFs](public/Examples)

For any feedback or questions, contact @Thomas04 on the Unoffical BOTC discord. 


#### https://madness-script-maker.vercel.app

## Features
* Upload a custom font file that can be used for the title, author, and character names.

* Choose between Unofficial PNG, SVG or your external character images

* Change title and author font size

* Options to center the title, and show author under the title

* Show Stormcaught character on the script like a jinx. Stormcaught character will also be indicated on the back page under Storm Catcher

* Show Bootlegger rules at the top or bottom of the script

* Full homebrew support

* Add a custom text mark next to homebrew characters

* Assign proxy tokens for characters to show on the script and back page

* Toggle showing Djinn on script page

* Toggle showing NPC names on script page

* Toggle inverting the other night order on back page

* Toggle player count image on back page

* Toggle showing all character images on back page footer (useful for pulling tokens with just the back page)

* Adjust colors for the Script name, author and names of characters

* Option to hide individual jinxes on the script 

* Dynamically adjust for teensyville or 25+ character scripts

* Save and load the current options selected with the script json. This will save all the options you have changed, except for the custom character image link. If you uploaded a custom font, the font name will be saved for reference. The json will still work the same if uploaded into the official script tool or online apps.  

## Screenshots 
<img src="./public/screenshots/1.png" width="500">
<img src="./public/screenshots/2.png" width="500">
<img src="./public/screenshots/3.png" width="500">
<img src="./public/screenshots/4.png" width="500">
<img src="./public/screenshots/5.png" width="500">
<img src="./public/screenshots/6.png" height="400">
<img src="./public/screenshots/7.png" height="400">
<img src="./public/screenshots/8.png" height="400">
<img src="./public/screenshots/9.png" height="400">
<img src="./public/screenshots/10.png" height="400">


## Running Locally
This project was created with Angular. 

To run locally, have npm and angular installed.

Run the command 'ng serve' in the ScriptMaker folder.

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

## Acknowledgements

* Blood on the Clocktower and all characters are copyright of The Pandemonium Intstitute and Steven Medway. This project is not endorsed by TPI.

* Unofficial character icons are sourced from https://github.com/tomozbot/botc-icons

* This project uses [Angular CLI](https://github.com/angular/angular-cli) version 21.1.3, [ngx-print](https://www.npmjs.com/package/ngx-print), [ngx-color-picker](https://www.npmjs.com/package/ngx-color-picker) and [bootstrap](https://getbootstrap.com)
