import { AfterViewInit, Component, ElementRef, NgModule, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPrintDirective } from 'ngx-print';
import { ColorPickerModule } from 'ngx-color-picker';



@Component({
  selector: 'app-root',
  imports: [FormsModule, NgxPrintDirective, ColorPickerModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App implements OnInit, AfterViewInit {
  jsonInput: string = '';
  scriptName: string = '';
  author: string = '';
  characters: string[] = [];
  fullJsonSplit: any;
  filteredJinxes: {
    char1: string,
    char2: string,
    reason: string,
  }[] = [];
  filteredJinxes2: {
    char1: string,
    char2: string,
    reason: string,
  }[] = [];
  bootlegger: string[] = [];
  firstOrder: any;
  otherOrder: any;
  stormcaught: string = 'none';
  stormcaughtOld: any;
  hbchar: any;
  showBoot: boolean = false;
  showDjinn: boolean = false;
  rows: any;
  page1height: string = '';

  imageSelection: string = 'SVG'
  imageOverwriteText: string = ''
  invertOther: boolean = false;
  showPlayerCount: boolean = true;
  showCharBottom: boolean = true;
  showNpcNames: boolean = true;
  jsonError:boolean = false;

  invertOtherDeg: string = '0deg'
  showFirstNightText: string = ''
  showOtherNightText: string = ''

  goodCharColor: string = '#0b6aaf'
  evilCharColor: string = '#760A0D'
  scriptNameColor: string = 'maroon'

  loricColor:string = '#6f854d'
  fabledColor:string = '#7a6550'
  travColor:string = '#500050'

  scriptFontSize: string = '34px'
  abilityLineHeight: string = '1.2';

  townsfolk: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  outsiders: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  minions: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  demons: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []

  townsfolkPage1: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  outsidersPage1: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  minionsPage1: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  demonsPage1: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []

  trav: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []
  npcs: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string
  }[] = []

  test: string = ''

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    const excludedIds = ['dawn', 'dusk', 'minioninfo', 'demoninfo']

    this.charData = this.charData.map(char => {
      if (excludedIds.includes(char.ID)) {
        return char; // leave unchanged
      }

      return {
        ...char,
        Image: 'https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/SVG/' + char.ID + '.svg'
      };
    });


    this.charData = this.charData.map(char => ({
      ...char,
      Image2: char.Image
    }));



  }

  ngAfterViewInit() {

  }

onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const reader = new FileReader();

  reader.onload = () => {
    this.jsonInput = ''
    this.jsonInput = reader.result as string;
    try{
    this.create()}
    catch(error){
      this.create()
    }
  };

  reader.readAsText(file);

}





  //Images---------------
  imageOverwrite() {

    let baseUrl
    let ext

    if (this.imageSelection === "SVG") {
      baseUrl = 'https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/SVG/'
      ext = '.svg'
    } else if (this.imageSelection === "PNG") {
      baseUrl = 'https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/PNG/'
      ext = '.png'
    } else {
      baseUrl = this.imageOverwriteText.split("{")[0]
      ext = this.imageOverwriteText.split("}")[1]
    }

    const excludedIds = ['dawn', 'dusk', 'minioninfo', 'demoninfo']

    this.charData = this.charData.map(char => {
      if (excludedIds.includes(char.ID)) {
        return char; // leave unchanged
      }

      return {
        ...char,
        Image: `${baseUrl}${char.ID}${ext}`
      };
    });

    this.create()

  }

  resetImages() {
    this.charData = this.charData.map(char => ({
      ...char,
      Image: char.Image2 ? char.Image2 : ''
    }));

    this.imageOverwriteText = ''
    this.create()
  }

  onImageError(event: Event, ID: string) {
    const img = event.target as HTMLImageElement;
    img.src = this.getImage2ForID(ID)
  }

  resetColors(){
    this.scriptNameColor = 'maroon'
      this.goodCharColor = '#0b6aaf'
      this.evilCharColor = '#760A0D'
      this.fabledColor = '#7a6550'
      this.loricColor = '#6f854d'
      this.travColor = '#500050'
    }

  
  lightColors(){
      this.scriptNameColor = 'brown'
      this.goodCharColor = '#0000ff'
      this.evilCharColor = '#ff0000'
      this.fabledColor = '#aa9e00ff'
      this.loricColor = '#8ac729ff'
      this.travColor = '#bd00bdff'
  }

   
  blackColors(){
      this.scriptNameColor = 'black'
      this.goodCharColor = 'black'
      this.evilCharColor = 'black'
      this.fabledColor = 'black'
      this.loricColor = 'black'
      this.travColor = 'black'
  }



  //-------------------------

  async paste() {
    try {
      const clipboard = await navigator.clipboard.readText();
      this.jsonInput = clipboard;
      this.cd.detectChanges();
          try{
    this.create()}
    catch(error){
      this.create()
    }
    this.cd.detectChanges();


    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  }



  create() {
    try {
      this.fullJsonSplit = JSON.parse(this.jsonInput)
            this.jsonError = false
    } catch (error) {
      this.jsonError = true
    }

    this.jsonInput = JSON.stringify(this.fullJsonSplit,null,2)

      //set script name
      this.scriptName = this.fullJsonSplit[0].name;

      //set author name
      this.author = this.fullJsonSplit[0].author;

      //set bootlegger
      if (this.fullJsonSplit[0].bootlegger) {
        this.bootlegger = this.fullJsonSplit[0].bootlegger
      } else {
        this.bootlegger = []
      }
      //-----------------------------
      //Characters
      this.characters = []

      for (let i = 1; i < this.fullJsonSplit.length; i++) {


        //if json item has id 
        if (this.fullJsonSplit[i].id) {

          //if id is an official character
          if (this.charData.find(innerArray =>
            innerArray.ID === this.fullJsonSplit[i].id)) {

            this.characters.push(this.fullJsonSplit[i].id)

            //if hb character
          } else {

            this.hbchar = this.fullJsonSplit[i];

            //add hb char to charData and characters array
            this.charData.push({
              ID: this.hbchar.id,
              Name: this.hbchar.name,
              Ability: this.hbchar.ability,
              Team: this.hbchar.team,
              Image: this.hbchar.image,
              Image2: this.hbchar.image,
            });

            this.characters.push(this.hbchar.id)

            //add hb jinxes to jinxData
            if (this.hbchar.jinxes) {
              for (let i = 0; i < this.hbchar.jinxes.length; i++) {
                this.jinxData.push(
                  {
                    char1: this.hbchar.id,
                    char2: this.hbchar.jinxes[i].id,
                    reason: this.hbchar.jinxes[i].reason
                  }
                )
              }
            }
            //add to night order

            if (this.hbchar.firstNight > 0) {
              this.nightOrderData.push({
                order: this.hbchar.firstNight,
                firstNight: this.hbchar.id,
                otherNights: ""
              })
            }


            if (this.hbchar.otherNight > 0) {
              this.nightOrderData.push({
                order: this.hbchar.otherNight,
                firstNight: "",
                otherNights: this.hbchar.id
              })
            }
          }

          //if split does not have id add to characters
        } else if (this.fullJsonSplit[i]) {

          this.characters.push(this.fullJsonSplit[i])
        }
      }
      this.stormcaughtUpdate()


      //-------------------------------------------
      //set character lists

      //get list of townsfolk
      this.townsfolk = this.setcharacters(this.townsfolk, "townsfolk")

      this.townsfolkPage1 = this.reorderForColumns(this.townsfolk)


      //get list of outsiders
      this.outsiders = this.setcharacters(this.outsiders, "outsider")

      this.outsidersPage1 = this.reorderForColumns(this.outsiders)


      //get list of minions
      this.minions = this.setcharacters(this.minions, "minion")

      this.minionsPage1 = this.reorderForColumns(this.minions)


      //get list of demons
      this.demons = this.setcharacters(this.demons, "demon")

      this.demonsPage1 = this.reorderForColumns(this.demons)



      //get list of trav
      this.trav = this.setcharacters(this.trav, "traveller")



      //get list of npcs, not including djinn
      this.npcs = this.charData
        .filter(item =>
          this.characters.includes(item.ID)
          && (item.Team === "loric" || item.Team === 'fabled')
          && item.ID != 'djinn'
          && item.ID != 'bootlegger'
        )

      if ((!this.showBoot && this.bootlegger.length > 0) || (this.characters.includes("bootlegger") && !this.showBoot)) {
        this.npcs.push({
          "ID": "bootlegger",
          "Name": "Bootlegger",
          "Ability": "This script has homebrew characters or rules.",
          "Team": "loric",
          "Image": this.getImageForID("bootlegger")
        })
      }


      //---------------------------------------------
      //Jinxes - get array of jinxes
      this.updateJinxes()

      
        if (this.showDjinn && this.filteredJinxes2.length > 0) {
        this.npcs.push({
          "ID": "djinn",
          "Name": "Djinn",
          "Ability": "Use the Djinn's special rule. All players know what it is.",
          "Team": "fabled",
          "Image": this.getImageForID("djinn")
        })
      }



      //----------------------------------------------------
      //Night Order

      //filter out travellers from characters
      const nightOrderInput = this.characters.filter(id =>
        this.charData.find(d => d.ID === id)?.Team !== 'traveller'
      );

      //add meta info to first night
      let firstNightInput = nightOrderInput

      firstNightInput.push("dawn", "dusk", "minioninfo", "demoninfo")

      //filter night order
      const firstFiltered = this.nightOrderData
        .filter(item => firstNightInput.includes(item.firstNight))

      //sort night order
      firstFiltered.sort((a, b) => a.order - b.order);

      //set first order
      this.firstOrder = firstFiltered.map(item => item.firstNight);



      //add meta info to other night
      let otherNightInput = nightOrderInput

      otherNightInput.push("dawn", "dusk")

      //filter night order
      const otherFiltered = this.nightOrderData
        .filter(item => otherNightInput.includes(item.otherNights))

      //sort night order
      otherFiltered.sort((a, b) => a.order - b.order);

      //set first order
      this.otherOrder = otherFiltered.map(item => item.otherNights);

      //Set Row Height-----------------
      this.rows =
        Math.ceil(this.townsfolk.length / 2) +
        Math.ceil(this.outsiders.length / 2) +
        Math.ceil(this.minions.length / 2) +
        Math.ceil(this.demons.length / 2)

      this.page1height = ""
      if (this.rows >= 13) {
        this.page1height = "100%"
      } else {
        this.page1height = this.rows * 7.8 + "%"
      }

      //decrease line height if 15+ rows to fit on page
      if (this.rows >=15){
        this.abilityLineHeight = '1';
      }else{
        this.abilityLineHeight = '1.2';
      }

      this.updateCSS()

    this.cd.detectChanges();
  }

  updateCSS(){

      //if firstnight text goes too long, remove it
      if (this.firstOrder.length >= 23) {
        this.showFirstNightText = 0 + 'mm'
        
      } else {
        this.showFirstNightText = 6 + 'mm'
        
      }

      //if othernight text goes too long, remove it
      if (this.otherOrder.length >= 23) {
        this.showOtherNightText = 0 + 'mm'
        
      } else {
        this.showOtherNightText = 6 + 'mm'
        
      }

      //----Invert other night
      if (!this.invertOther) {
        this.invertOtherDeg = "rotate(0deg)"
        
      } else {
        this.invertOtherDeg = "rotate(180deg)"
      }
    }







  //--------------Other functions
  // Get image from charData by id
  getImageForID(inputID: string): string {
    const match = this.charData.find(item => item.ID === inputID);
    return match ? match.Image : "not found";
  }

  getImage2ForID(inputID: string): string {
    const match = this.charData.find(item => item.ID === inputID);
    return match ? (match.Image2 ? match.Image2 : "not found") : "not found";
  }

  // Get name from charData by id
  getNameForID(inputID: string): string {
    const match = this.charData.find(item => item.ID === inputID);
    return match ? match.Name : "not found";
  }


  //Updates-------------

  stormcaughtUpdate() {
    if (this.stormcaughtOld != this.stormcaught) {
      this.jinxData.unshift(
        {
          char1: this.stormcaught,
          char2: "stormcatcher",
          reason: this.stormcaught
        }
      )

      this.jinxData = this.jinxData.filter
        (jinx => jinx.reason != this.stormcaughtOld)
    }

    if (!(this.stormcaught == "none" || this.stormcaught == 'Set Stormcaught Character' || !this.stormcaught)) {
      //this.characters = this.characters.filter(char => char != "stormcatcher"); 

      this.characters.push("stormcatcher")
    }

    this.updateJinxes();
    this.cd.detectChanges();
    this.stormcaughtOld = this.stormcaught;


  }

  updateJinxes() {
    this.filteredJinxes =
      this.jinxData.filter(jinx =>
        this.characters.includes(jinx.char1) &&
        this.characters.includes(jinx.char2));

    this.filteredJinxes2 =
      this.jinxData.filter(jinx =>
        this.characters.includes(jinx.char1) &&
        this.characters.includes(jinx.char2) &&
        jinx.char2 != 'stormcatcher');
  }

  //reorder for page1
  reorderForColumns<T>(array: T[]): T[] {
    const result: T[] = [];
    const rows = Math.ceil(array.length / 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 2; col++) {
        const index = col * rows + row;
        if (index < array.length) {
          result.push(array[index]);
        }
      }
    }

    return result;
  }

  //set characters
  setcharacters(set: any, setname: string) {
    set = this.charData
      .filter(item =>
        this.characters.includes(item.ID)
        && item.Team === setname
      ).sort((a, b) =>
        this.characters.indexOf(a.ID) -
        this.characters.indexOf(b.ID)
      );
    return set;
  }

  //data---------------


  charData: {
    ID: string,
    Name: string,
    Ability: string,
    Team: string,
    Image: string,
    Image2?: string,
  }[] = [
      {
        "ID": "acrobat",
        "Name": "Acrobat",
        "Ability": "Each night*, choose a player: if they are or become drunk or poisoned tonight, you die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "alchemist",
        "Name": "Alchemist",
        "Ability": "You have a Minion ability. When using this, the Storyteller may prompt you to choose differently.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "alsaahir",
        "Name": "Alsaahir",
        "Ability": "Each day, if you publicly guess which players are Minion(s) and which are Demon(s), good wins.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "amnesiac",
        "Name": "Amnesiac",
        "Ability": "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "artist",
        "Name": "Artist",
        "Ability": "Once per game, during the day, privately ask the Storyteller any yes/no question.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "atheist",
        "Name": "Atheist",
        "Ability": "The Storyteller can break the game rules & if executed, good wins, even if you are dead. [No evil characters]",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "balloonist",
        "Name": "Balloonist",
        "Ability": "Each night, you learn a player of a different character type than last night. [+0 or +1 Outsider]",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "banshee",
        "Name": "Banshee",
        "Ability": "If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "bountyhunter",
        "Name": "Bounty Hunter",
        "Ability": "You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "cannibal",
        "Name": "Cannibal",
        "Ability": "You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "chambermaid",
        "Name": "Chambermaid",
        "Ability": "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "chef",
        "Name": "Chef",
        "Ability": "You start knowing how many pairs of evil players there are.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "choirboy",
        "Name": "Choirboy",
        "Ability": "If the Demon kills the King, you learn which player is the Demon. [+the King]",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "clockmaker",
        "Name": "Clockmaker",
        "Ability": "You start knowing how many steps from the Demon to its nearest Minion.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "courtier",
        "Name": "Courtier",
        "Ability": "Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "cultleader",
        "Name": "Cult Leader",
        "Ability": "Each night, you become the alignment of an alive neighbor. If all good players choose to join your cult, your team wins.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "dreamer",
        "Name": "Dreamer",
        "Ability": "Each night, choose a player (not yourself or Travellers): you learn 1 good and 1 evil character, 1 of which is correct.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "empath",
        "Name": "Empath",
        "Ability": "Each night, you learn how many of your 2 alive neighbors are evil.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "engineer",
        "Name": "Engineer",
        "Ability": "Once per game, at night, choose which Minions or which Demon is in play.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "exorcist",
        "Name": "Exorcist",
        "Ability": "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "farmer",
        "Name": "Farmer",
        "Ability": "When you die at night, an alive good player becomes a Farmer.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "fisherman",
        "Name": "Fisherman",
        "Ability": "Once per game, during the day, visit the Storyteller for some advice to help your team win.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "flowergirl",
        "Name": "Flowergirl",
        "Ability": "Each night*, you learn if a Demon voted today.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "fool",
        "Name": "Fool",
        "Ability": "The first time you die, you don't.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "fortuneteller",
        "Name": "Fortune Teller",
        "Ability": "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "gambler",
        "Name": "Gambler",
        "Ability": "Each night*, choose a player & guess their character: if you guess wrong, you die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "general",
        "Name": "General",
        "Ability": "Each night, you learn which alignment the Storyteller believes is winning: good, evil, or neither.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "gossip",
        "Name": "Gossip",
        "Ability": "Each day, you may make a public statement. Tonight, if it was true, a player dies.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "grandmother",
        "Name": "Grandmother",
        "Ability": "You start knowing a good player & their character. If the Demon kills them, you die too.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "highpriestess",
        "Name": "High Priestess",
        "Ability": "Each night, learn which player the Storyteller believes you should talk to most.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "huntsman",
        "Name": "Huntsman",
        "Ability": "Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "innkeeper",
        "Name": "Innkeeper",
        "Ability": "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "investigator",
        "Name": "Investigator",
        "Ability": "You start knowing that 1 of 2 players is a particular Minion.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "juggler",
        "Name": "Juggler",
        "Ability": "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "king",
        "Name": "King",
        "Ability": "Each night, if the dead equal or outnumber the living, you learn 1 alive character. The Demon knows you are the King.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "knight",
        "Name": "Knight",
        "Ability": "You start knowing 2 players that are not the Demon.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "librarian",
        "Name": "Librarian",
        "Ability": "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "lycanthrope",
        "Name": "Lycanthrope",
        "Ability": "Each night*, choose an alive player. If good, they die & the Demon doesn’t kill tonight. One good player registers as evil.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "magician",
        "Name": "Magician",
        "Ability": "The Demon thinks you are a Minion. Minions think you are a Demon.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "mathematician",
        "Name": "Mathematician",
        "Ability": "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "mayor",
        "Name": "Mayor",
        "Ability": "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "minstrel",
        "Name": "Minstrel",
        "Ability": "When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "monk",
        "Name": "Monk",
        "Ability": "Each night*, choose a player (not yourself): they are safe from the Demon tonight.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "nightwatchman",
        "Name": "Nightwatchman",
        "Ability": "Once per game, at night, choose a player: they learn you are the Nightwatchman.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "noble",
        "Name": "Noble",
        "Ability": "You start knowing 3 players, 1 and only 1 of which is evil.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "oracle",
        "Name": "Oracle",
        "Ability": "Each night*, you learn how many dead players are evil.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "pacifist",
        "Name": "Pacifist",
        "Ability": "Executed good players might not die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "philosopher",
        "Name": "Philosopher",
        "Ability": "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "pixie",
        "Name": "Pixie",
        "Ability": "You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "poppygrower",
        "Name": "Poppy Grower",
        "Ability": "Minions & Demons do not know each other. If you die, they learn who each other are that night.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "preacher",
        "Name": "Preacher",
        "Ability": "Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "princess",
        "Name": "Princess",
        "Ability": "On your 1st day, if you nominated & executed a player, the Demon doesn’t kill tonight.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "professor",
        "Name": "Professor",
        "Ability": "Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "ravenkeeper",
        "Name": "Ravenkeeper",
        "Ability": "If you die at night, you are woken to choose a player: you learn their character.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "sage",
        "Name": "Sage",
        "Ability": "If the Demon kills you, you learn that it is 1 of 2 players.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "sailor",
        "Name": "Sailor",
        "Ability": "Each night, choose an alive player: either you or they are drunk until dusk. You can't die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "savant",
        "Name": "Savant",
        "Ability": "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "seamstress",
        "Name": "Seamstress",
        "Ability": "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "shugenja",
        "Name": "Shugenja",
        "Ability": "You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "slayer",
        "Name": "Slayer",
        "Ability": "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "snakecharmer",
        "Name": "Snake Charmer",
        "Ability": "Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "soldier",
        "Name": "Soldier",
        "Ability": "You are safe from the Demon.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "steward",
        "Name": "Steward",
        "Ability": "You start knowing 1 good player.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "tealady",
        "Name": "Tea Lady",
        "Ability": "If both your alive neighbors are good, they can't die.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "towncrier",
        "Name": "Town Crier",
        "Ability": "Each night*, you learn if a Minion nominated today.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "undertaker",
        "Name": "Undertaker",
        "Ability": "Each night*, you learn which character died by execution today.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "villageidiot",
        "Name": "Village Idiot",
        "Ability": "Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots. 1 of the extras is drunk]",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "virgin",
        "Name": "Virgin",
        "Ability": "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "washerwoman",
        "Name": "Washerwoman",
        "Ability": "You start knowing that 1 of 2 players is a particular Townsfolk.",
        "Team": "townsfolk",
        "Image": ""
      },
      {
        "ID": "barber",
        "Name": "Barber",
        "Ability": "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "butler",
        "Name": "Butler",
        "Ability": "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "damsel",
        "Name": "Damsel",
        "Ability": "All Minions know a Damsel is in play. If a Minion publicly guesses you (once), your team loses.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "drunk",
        "Name": "Drunk",
        "Ability": "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "golem",
        "Name": "Golem",
        "Ability": "You may only nominate once per game. When you do, if the nominee is not the Demon, they die.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "goon",
        "Name": "Goon",
        "Ability": "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "hatter",
        "Name": "Hatter",
        "Ability": "If you died today or tonight, the Minion & Demon players may choose new Minion & Demon characters to be.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "heretic",
        "Name": "Heretic",
        "Ability": "Whoever wins, loses & whoever loses, wins, even if you are dead.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "hermit",
        "Name": "Hermit",
        "Ability": "You have all Outsider abilities. [-0 or -1 Outsiders]",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "klutz",
        "Name": "Klutz",
        "Ability": "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "lunatic",
        "Name": "Lunatic",
        "Ability": "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "moonchild",
        "Name": "Moonchild",
        "Ability": "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "mutant",
        "Name": "Mutant",
        "Ability": "If you are ''mad'' about being an Outsider, you might be executed.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "ogre",
        "Name": "Ogre",
        "Ability": "On your 1st night, choose a player (not yourself): you become their alignment (you don't know which) even if drunk or poisoned.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "plaguedoctor",
        "Name": "Plague Doctor",
        "Ability": "When you die, the Storyteller gains a Minion ability.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "politician",
        "Name": "Politician",
        "Ability": "If you were the player most responsible for your team losing, you change alignment & win, even if dead.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "puzzlemaster",
        "Name": "Puzzlemaster",
        "Ability": "1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "recluse",
        "Name": "Recluse",
        "Ability": "You might register as evil & as a Minion or Demon, even if dead.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "saint",
        "Name": "Saint",
        "Ability": "If you die by execution, your team loses.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "snitch",
        "Name": "Snitch",
        "Ability": "Each Minion gets 3 bluffs.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "sweetheart",
        "Name": "Sweetheart",
        "Ability": "When you die, 1 player is drunk from now on.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "tinker",
        "Name": "Tinker",
        "Ability": "You might die at any time.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "zealot",
        "Name": "Zealot",
        "Ability": "If there are 5 or more players alive, you must vote for every nomination.",
        "Team": "outsider",
        "Image": ""
      },
      {
        "ID": "assassin",
        "Name": "Assassin",
        "Ability": "Once per game, at night*, choose a player: they die, even if for some reason they could not.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "boffin",
        "Name": "Boffin",
        "Ability": "The Demon (even if drunk or poisoned) has a not-in-play good character’s ability. You both know which.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "baron",
        "Name": "Baron",
        "Ability": "There are extra Outsiders in play. [+2 Outsiders]",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "boomdandy",
        "Name": "Boomdandy",
        "Ability": "If you are executed, all but 3 players die. After a 10 to 1 countdown, the player with the most players pointing at them, dies.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "cerenovus",
        "Name": "Cerenovus",
        "Ability": "Each night, choose a player & a good character: they are ''mad'' they are this character tomorrow, or might be executed.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "devilsadvocate",
        "Name": "Devil's Advocate",
        "Ability": "Each night, choose a living player (different to last night): if executed tomorrow, they don't die.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "eviltwin",
        "Name": "Evil Twin",
        "Ability": "You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "fearmonger",
        "Name": "Fearmonger",
        "Ability": "Each night, choose a player. If you nominate & execute them, their team loses. All players know if you choose a new player.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "goblin",
        "Name": "Goblin",
        "Ability": "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "godfather",
        "Name": "Godfather",
        "Ability": "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "harpy",
        "Name": "Harpy",
        "Ability": "Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or one or both might die.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "marionette",
        "Name": "Marionette",
        "Ability": "You think you are a good character, but you are not. The Demon knows who you are. [You neighbor the Demon]",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "mastermind",
        "Name": "Mastermind",
        "Ability": "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "mezepheles",
        "Name": "Mezepheles",
        "Ability": "You start knowing a secret word. The 1st good player to say this word becomes evil that night.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "organgrinder",
        "Name": "Organ Grinder",
        "Ability": "All players keep their eyes closed when voting and the vote tally is secret. Each night, choose if you are drunk until dusk.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "pithag",
        "Name": "Pit-Hag",
        "Ability": "Each night*, choose a player & a character they become (if not-in-play). If a Demon is made, deaths tonight are arbitrary.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "poisoner",
        "Name": "Poisoner",
        "Ability": "Each night, choose a player: they are poisoned tonight and tomorrow day.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "psychopath",
        "Name": "Psychopath",
        "Ability": "Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "scarletwoman",
        "Name": "Scarlet Woman",
        "Ability": "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count.)",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "spy",
        "Name": "Spy",
        "Ability": "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "summoner",
        "Name": "Summoner",
        "Ability": "You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "vizier",
        "Name": "Vizier",
        "Ability": "All players know you are the Vizier. You cannot die during the day. If good voted, you may choose to execute immediately.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "widow",
        "Name": "Widow",
        "Ability": "On your 1st night, look at the Grimoire and choose a player: they are poisoned. 1 good player knows a Widow is in play.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "witch",
        "Name": "Witch",
        "Ability": "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "wizard",
        "Name": "Wizard",
        "Ability": "Once per game, choose to make a wish. If granted, it might have a price & leave a clue as to its nature.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "wraith",
        "Name": "Wraith",
        "Ability": "You may choose to open your eyes at night. You wake when other evil players do.",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "xaan",
        "Name": "Xaan",
        "Ability": "On night X, all Townsfolk are poisoned until dusk. [X Outsiders]",
        "Team": "minion",
        "Image": ""
      },
      {
        "ID": "alhadikhia",
        "Name": "Al-Hadikhia",
        "Ability": "Each night*, you may choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "fanggu",
        "Name": "Fang Gu",
        "Ability": "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "imp",
        "Name": "Imp",
        "Ability": "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "kazali",
        "Name": "Kazali",
        "Ability": "Each night*, choose a player: they die. [You choose which players are which Minions. -? to +? Outsiders]",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "legion",
        "Name": "Legion",
        "Ability": "Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "leviathan",
        "Name": "Leviathan",
        "Ability": "If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "lilmonsta",
        "Name": "Lil Monsta",
        "Ability": "Each night, Minions choose who babysits Lil' Monsta & \"is the Demon\". Each night*, a player might die. [+1 Minion]",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "lleech",
        "Name": "Lleech",
        "Ability": "Each night*, choose a player: they die. You start by choosing a player: they are poisoned. You die if & only if they are dead.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "lordoftyphon",
        "Name": "Lord of Typhon",
        "Ability": "Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. -? to +? Outsiders]",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "nodashii",
        "Name": "No Dashii",
        "Ability": "Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "ojo",
        "Name": "Ojo",
        "Ability": "Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "po",
        "Name": "Po",
        "Ability": "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "pukka",
        "Name": "Pukka",
        "Ability": "Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "riot",
        "Name": "Riot",
        "Ability": "On day 3, Minions become Riot & nominees die but nominate an alive player immediately. This must happen.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "shabaloth",
        "Name": "Shabaloth",
        "Ability": "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "vigormortis",
        "Name": "Vigormortis",
        "Ability": "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor. [-1 Outsider]",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "vortox",
        "Name": "Vortox",
        "Ability": "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "yaggababble",
        "Name": "Yaggababble",
        "Ability": "You start knowing a secret phrase. For each time you said it publicly today, a player might die.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "zombuul",
        "Name": "Zombuul",
        "Ability": "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.",
        "Team": "demon",
        "Image": ""
      },
      {
        "ID": "apprentice",
        "Name": "Apprentice",
        "Ability": "On your 1st night, you gain a Townsfolk ability (if good) or a Minion ability (if evil).",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "barista",
        "Name": "Barista",
        "Ability": "Each night, until dusk, 1) a player becomes sober, healthy & gets true info, or 2) their ability works twice. They learn which.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "beggar",
        "Name": "Beggar",
        "Ability": "You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober and healthy.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "bishop",
        "Name": "Bishop",
        "Ability": "Only the Storyteller can nominate. At least 1 opposing player must be nominated each day.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "bonecollector",
        "Name": "Bone Collector",
        "Ability": "Once per game, at night*, choose a dead player: they regain their ability until dusk.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "bureaucrat",
        "Name": "Bureaucrat",
        "Ability": "Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "butcher",
        "Name": "Butcher",
        "Ability": "Each day, after the 1st execution, you may nominate again.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "cacklejack",
        "Name": "Cacklejack",
        "Ability": "Each day, choose a player: a different player changes character tonight.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "deviant",
        "Name": "Deviant",
        "Ability": "If you were funny today, you cannot die by exile.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "gangster",
        "Name": "Gangster",
        "Ability": "Once per day, you may choose to kill an alive neighbor, if your other alive neighbor agrees.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "gnome",
        "Name": "Gnome",
        "Ability": "All players start knowing a player of your alignment. You may choose to kill anyone who nominates them.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "gunslinger",
        "Name": "Gunslinger",
        "Ability": "Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "harlot",
        "Name": "Harlot",
        "Ability": "Each night*, choose a living player: if they agree, you learn their character, but you both might die.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "judge",
        "Name": "Judge",
        "Ability": "Once per game, if another player nominated, you may choose to force the current execution to pass or fail.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "matron",
        "Name": "Matron",
        "Ability": "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "scapegoat",
        "Name": "Scapegoat",
        "Ability": "If a player of your alignment is executed, you might be executed instead.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "thief",
        "Name": "Thief",
        "Ability": "Each night, choose a player (not yourself): their vote counts negatively tomorrow.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "voudon",
        "Name": "Voudon",
        "Ability": "Only you & the dead can vote. They don't need a vote token to do so. A 50% majority isn't required.",
        "Team": "traveller",
        "Image": ""
      },
      {
        "ID": "angel",
        "Name": "Angel",
        "Ability": "Something bad might happen to whoever is most responsible for the death of a new player.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "buddhist",
        "Name": "Buddhist",
        "Ability": "For the first 2 minutes of each day, veteran players may not talk.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "djinn",
        "Name": "Djinn",
        "Ability": "Use the Djinn's special rule. All players know what it is.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "doomsayer",
        "Name": "Doomsayer",
        "Ability": "If 4 or more players live, each living player may publicly choose (once per game) that a player of their own alignment dies.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "duchess",
        "Name": "Duchess",
        "Ability": "Each day, 3 players may choose to visit you. At night*, each visitor learns how many visitors are evil, but 1 gets false info.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "deusexfiasco",
        "Name": "Deus ex Fiasco",
        "Ability": "At least once per game, the Storyteller will make a mistake, correct it, and publicly admit to it.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "ferryman",
        "Name": "Ferryman",
        "Ability": "On the final day, all dead players regain their vote token.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "fibbin",
        "Name": "Fibbin",
        "Ability": "Once per game, 1 good player might get incorrect information.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "fiddler",
        "Name": "Fiddler",
        "Ability": "Once per game, the Demon secretly chooses an opposing player: all players choose which of these 2 players win.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "hellslibrarian",
        "Name": "Hell's Librarian",
        "Ability": "Something bad might happen to whoever talks when the Storyteller has asked for silence.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "revolutionary",
        "Name": "Revolutionary",
        "Ability": "2 neighboring players are known to be the same alignment. Once per game, 1 of them registers falsely.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "sentinel",
        "Name": "Sentinel",
        "Ability": "There might be 1 extra or 1 fewer Outsider in play.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "spiritofivory",
        "Name": "Spirit of Ivory",
        "Ability": "There can't be more than 1 extra evil player.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "toymaker",
        "Name": "Toymaker",
        "Ability": "The Demon may choose not to attack & must do this at least once per game. Evil players get normal starting info.",
        "Team": "fabled",
        "Image": ""
      },
      {
        "ID": "bigwig",
        "Name": "Big Wig",
        "Ability": "Each nominee chooses a player: until voting, only they may speak & they are mad the nominee is good or they might die.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "bootlegger",
        "Name": "Bootlegger",
        "Ability": "This script has homebrew characters or rules.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "gardener",
        "Name": "Gardener",
        "Ability": "The Storyteller assigns 1 or more players' characters.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "hindu",
        "Name": "Hindu",
        "Ability": "The first 4 players to die are immediately reincarnated as Travellers of the same alignment.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "pope",
        "Name": "Pope",
        "Ability": "There are duplicate good characters in play. They might also be bluffs.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "stormcatcher",
        "Name": "Storm Catcher",
        "Ability": "Name a good character. If in play, they can only die by execution, but evil players learn which player it is.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "tor",
        "Name": "Tor",
        "Ability": "Players don't know their character or alignment. They learn them when they die.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "ventriloquist",
        "Name": "Ventriloquist",
        "Ability": "If a player is mad as a fresh character during their nomination, they might not die if executed today.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "zenomancer",
        "Name": "Zenomancer",
        "Ability": "One or more players each have a goal. When achieved, that player learns a piece of true info.",
        "Team": "loric",
        "Image": ""
      },
      {
        "ID": "dusk",
        "Name": "",
        "Ability": "",
        "Team": "",
        "Image": "dusk.png"
      },
      {
        "ID": "minioninfo",
        "Name": "",
        "Ability": "",
        "Team": "",
        "Image": "minioninfo.png"
      },
      {
        "ID": "demoninfo",
        "Name": "",
        "Ability": "",
        "Team": "",
        "Image": "demoninfo.png"
      },
      {
        "ID": "dawn",
        "Name": "",
        "Ability": "",
        "Team": "",
        "Image": "dawn.png"
      }
    ]

  jinxData: {
    char1: string,
    char2: string,
    reason: string,
  }[] = [
      {
        "char1": "alchemist",
        "char2": "boffin",
        "reason": "If the Alchemist has the Boffin ability, the Alchemist does not learn what ability the Demon has."
      },
      {
        "char1": "alchemist",
        "char2": "marionette",
        "reason": "An Alchemist-Marionette has no Marionette ability & the Marionette is in play."
      },
      {
        "char1": "alchemist",
        "char2": "mastermind",
        "reason": "An Alchemist-Mastermind has no Mastermind ability & the Mastermind is not-in-play."
      },
      {
        "char1": "alchemist",
        "char2": "organgrinder",
        "reason": "If the Alchemist has the Organ Grinder ability, the Organ Grinder is in play. If both are sober, both are drunk."
      },
      {
        "char1": "alchemist",
        "char2": "spy",
        "reason": "An Alchemist-Spy has no Spy ability & a Spy is in play. After each execution, a living Alchemist-Spy may publicly guess a living player as the Spy. If correct, the Demon must choose the Spy tonight."
      },
      {
        "char1": "alchemist",
        "char2": "summoner",
        "reason": "The Alchemist-Summoner does not get bluffs, and chooses which Demon but not which player. If they die before this happens, evil wins. [No Demon]"
      },
      {
        "char1": "alchemist",
        "char2": "wraith",
        "reason": "An Alchemist-Wraith has no Wraith ability & a Wraith is in play. After each execution, a living Alchemist-Wraith may publicly guess a living player as the Wraith. If correct, the Demon must choose the Wraith tonight."
      },
      {
        "char1": "alchemist",
        "char2": "widow",
        "reason": "An Alchemist-Widow has no Widow ability & a Widow is in play. After each execution, a living Alchemist-Widow may publicly guess a living player as the Widow. If correct, the Demon must choose the Widow tonight."
      },
      {
        "char1": "bountyhunter",
        "char2": "kazali",
        "reason": "If the Kazali turns the Bounty Hunter into a Minion, an evil Townsfolk is not created."
      },
      {
        "char1": "bountyhunter",
        "char2": "philosopher",
        "reason": "If the Philosopher gains the Bounty Hunter ability, a Townsfolk might turn evil."
      },
      {
        "char1": "cannibal",
        "char2": "butler",
        "reason": "If the Cannibal gains the Butler ability, the Cannibal learns this."
      },
      {
        "char1": "cannibal",
        "char2": "juggler",
        "reason": "If the Juggler guesses on their first day and dies by execution, tonight the living Cannibal learns how many guesses the Juggler got correct."
      },
      {
        "char1": "cannibal",
        "char2": "princess",
        "reason": "If the Cannibal nominated, executed, & killed the Princess today, the Demon doesn’t kill tonight."
      },
      {
        "char1": "cannibal",
        "char2": "zealot",
        "reason": "If the Cannibal gains the Zealot ability, the Cannibal learns this."
      },
      {
        "char1": "mathematician",
        "char2": "chambermaid",
        "reason": "The Chambermaid can detect if the Mathematician will wake tonight."
      },
      {
        "char1": "mathematician",
        "char2": "drunk",
        "reason": "The Mathematician might learn if the Drunk's ability yielded false info or failed to work properly."
      },
      {
        "char1": "mathematician",
        "char2": "lunatic",
        "reason": "The Mathematician might learn if the Lunatic attacks a different player than the real Demon attacked."
      },
      {
        "char1": "mathematician",
        "char2": "marionette",
        "reason": "The Mathematician might learn if the Marionette's ability yielded false info or failed to work properly."
      },
      {
        "char1": "magician",
        "char2": "legion",
        "reason": "The Magician wakes with Legion and might register as evil. Legion knows if a Magician is in play, but not which player it is."
      },
      {
        "char1": "magician",
        "char2": "marionette",
        "reason": "If the Magician is alive, the Demon doesn't know which neighbor is the Marionette."
      },
      {
        "char1": "magician",
        "char2": "spy",
        "reason": "When the Spy sees the Grimoire, the Demon and Magician's character tokens are removed."
      },
      {
        "char1": "magician",
        "char2": "vizier",
        "reason": "If the Vizier is in play, the Magician has no ability but is immune to the Vizier's ability."
      },
      {
        "char1": "magician",
        "char2": "widow",
        "reason": "When the Widow sees the Grimoire, the Demon and Magician's character tokens are removed."
      },
      {
        "char1": "magician",
        "char2": "wraith",
        "reason": "After each execution, the living Magician may publicly guess a living player as the Wraith. If correct, the Demon must choose the Wraith tonight."
      },
      {
        "char1": "butler",
        "char2": "organgrinder",
        "reason": "If the Organ Grinder is causing eyes closed voting, the Butler may raise their hand to vote but their vote is only counted if their master voted too."
      },
      {
        "char1": "heretic",
        "char2": "baron",
        "reason": "Only 1 jinxed character can be in play."
      },
      {
        "char1": "heretic",
        "char2": "godfather",
        "reason": "Only 1 jinxed character can be in play."
      },
      {
        "char1": "heretic",
        "char2": "lleech",
        "reason": "Only 1 jinxed character can be in play."
      },
      {
        "char1": "heretic",
        "char2": "pithag",
        "reason": "Only 1 jinxed character can be in play."
      },
      {
        "char1": "heretic",
        "char2": "spy",
        "reason": "Only 1 jinxed character can be in play."
      },
      {
        "char1": "heretic",
        "char2": "widow",
        "reason": "Only 1 jinxed character can be in play."
      },
      {
        "char1": "plaguedoctor",
        "char2": "baron",
        "reason": "If the Storyteller would gain the Baron ability, up to two players become Outsiders."
      },
      {
        "char1": "plaguedoctor",
        "char2": "boomdandy",
        "reason": "If the Storyteller would gain the Boomdandy ability, a player becomes the Boomdandy."
      },
      {
        "char1": "plaguedoctor",
        "char2": "eviltwin",
        "reason": "If the Storyteller would gain the Evil Twin ability, a player becomes the Evil Twin."
      },
      {
        "char1": "plaguedoctor",
        "char2": "fearmonger",
        "reason": "If the Storyteller would gain the Fearmonger ability, a Minion gains it, and learns this."
      },
      {
        "char1": "plaguedoctor",
        "char2": "goblin",
        "reason": "If the Storyteller would gain the Goblin ability, a Minion gains it, and learns this."
      },
      {
        "char1": "plaguedoctor",
        "char2": "marionette",
        "reason": "If the Storyteller would gain the Marionette ability, one of the Demon's good neighbors becomes the Marionette."
      },
      {
        "char1": "plaguedoctor",
        "char2": "scarletwoman",
        "reason": "If the Storyteller would gain the Scarlet Woman ability, a Minion gains it, and learns this."
      },
      {
        "char1": "plaguedoctor",
        "char2": "spy",
        "reason": "If the Storyteller would gain the Spy ability, a Minion gains it, and learns this."
      },
      {
        "char1": "plaguedoctor",
        "char2": "wraith",
        "reason": "If the Storyteller would gain the Wraith ability, a Minion gains it, and learns this."
      },
      {
        "char1": "recluse",
        "char2": "ogre",
        "reason": "If the Recluse registers as evil to the Ogre, the Ogre learns that they are evil."
      },
      {
        "char1": "recluse",
        "char2": "sage",
        "reason": "The Recluse might register as the Demon to the Sage."
      },
      {
        "char1": "boffin",
        "char2": "cultleader",
        "reason": "If the Demon has the Cult Leader ability, they can’t turn good due to this ability."
      },
      {
        "char1": "boffin",
        "char2": "drunk",
        "reason": "The Demon cannot have the Drunk ability."
      },
      {
        "char1": "boffin",
        "char2": "goon",
        "reason": "If the Demon has the Goon ability, they can’t turn good due to this ability."
      },
      {
        "char1": "boffin",
        "char2": "heretic",
        "reason": "The Demon cannot have the Heretic ability."
      },
      {
        "char1": "boffin",
        "char2": "ogre",
        "reason": "The Demon cannot have the Ogre ability."
      },
      {
        "char1": "boffin",
        "char2": "politician",
        "reason": "The Demon cannot have the Politician ability."
      },
      {
        "char1": "boffin",
        "char2": "villageidiot",
        "reason": "If there is a spare token, the Boffin can give the Demon the Village Idiot ability."
      },
      {
        "char1": "cerenovus",
        "char2": "goblin",
        "reason": "The Cerenovus may choose to make a player mad that they are the Goblin."
      },
      {
        "char1": "marionette",
        "char2": "balloonist",
        "reason": "If the Marionette thinks that they are the Balloonist, an Outsider might have been added during setup."
      },
      {
        "char1": "marionette",
        "char2": "huntsman",
        "reason": "If the Marionette thinks that they are the Huntsman, the Damsel was added during setup."
      },
      {
        "char1": "marionette",
        "char2": "kazali",
        "reason": "If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor."
      },
      {
        "char1": "marionette",
        "char2": "lilmonsta",
        "reason": "If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor."
      },
      {
        "char1": "marionette",
        "char2": "summoner",
        "reason": "If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor."
      },
      {
        "char1": "mastermind",
        "char2": "vigormortis",
        "reason": "A Mastermind that has their ability keeps it if the Vigormortis dies."
      },
      {
        "char1": "pithag",
        "char2": "cultleader",
        "reason": "If the Pit-Hag turns an evil player into the Cult Leader, they can't turn good due to their own ability."
      },
      {
        "char1": "pithag",
        "char2": "damsel",
        "reason": "If a Pit-Hag creates a Damsel, the Storyteller chooses which player it is."
      },
      {
        "char1": "pithag",
        "char2": "goon",
        "reason": "If the Pit-Hag turns an evil player into the Goon, they can't turn good due to their own ability."
      },
      {
        "char1": "pithag",
        "char2": "ogre",
        "reason": "If the Pit-Hag turns an evil player into the Ogre, they can't turn good due to their own ability."
      },
      {
        "char1": "pithag",
        "char2": "politician",
        "reason": "If the Pit-Hag turns an evil player into the Politician, they can't turn good due to their own ability."
      },
      {
        "char1": "pithag",
        "char2": "villageidiot",
        "reason": "If there is a spare token, the Pit-Hag can create an extra Village Idiot. If so, the drunk Village Idiot might change."
      },
      {
        "char1": "scarletwoman",
        "char2": "alhadikhia",
        "reason": "If there would be two Demons, one of which was the Scarlet Woman, the Scarlet Woman becomes the Scarlet Woman again."
      },
      {
        "char1": "scarletwoman",
        "char2": "fanggu",
        "reason": "If there would be two Demons, one of which was the Scarlet Woman, the Scarlet Woman remains the Scarlet Woman."
      },
      {
        "char1": "spy",
        "char2": "damsel",
        "reason": "If the Spy is (or has been) in play, the Damsel is poisoned."
      },
      {
        "char1": "spy",
        "char2": "ogre",
        "reason": "The Spy registers as evil to the Ogre."
      },
      {
        "char1": "spy",
        "char2": "poppygrower",
        "reason": "If the Poppy Grower has their ability, the Spy does not see the Grimoire."
      },
      {
        "char1": "summoner",
        "char2": "clockmaker",
        "reason": "The Summoner registers as the Demon to the Clockmaker."
      },
      {
        "char1": "summoner",
        "char2": "courtier",
        "reason": "If the living Summoner has no ability, the Storyteller has the Summoner ability."
      },
      {
        "char1": "summoner",
        "char2": "engineer",
        "reason": "If the living Summoner is removed from play, the Storyteller has the Summoner ability."
      },
      {
        "char1": "summoner",
        "char2": "hatter",
        "reason": "If the Summoner creates a second living Demon, deaths tonight are arbitrary."
      },
      {
        "char1": "summoner",
        "char2": "kazali",
        "reason": "If the Summoner creates a second living Demon, deaths tonight are arbitrary."
      },
      {
        "char1": "summoner",
        "char2": "lordoftyphon",
        "reason": "If a Lord of Typhon is summoned, they must neighbor a Minion & their other neighbor becomes an evil Minion."
      },
      {
        "char1": "summoner",
        "char2": "pithag",
        "reason": "If the Summoner creates a second living Demon, deaths tonight are arbitrary."
      },
      {
        "char1": "summoner",
        "char2": "poppygrower",
        "reason": "If the Poppy Grower is alive on the 3rd night, the Summoner chooses which Demon but not which player."
      },
      {
        "char1": "summoner",
        "char2": "preacher",
        "reason": "If the living Summoner has no ability, the Storyteller has the Summoner ability."
      },
      {
        "char1": "summoner",
        "char2": "pukka",
        "reason": "The Summoner may summon a Pukka on the 2nd night instead of the 3rd."
      },
      {
        "char1": "summoner",
        "char2": "zombuul",
        "reason": "If the Summoner summons a dead player into the Zombuul, the Zombuul has already \"died once\"."
      },
      {
        "char1": "vizier",
        "char2": "alsaahir",
        "reason": "The Storyteller doesn't declare the Vizier is in play."
      },
      {
        "char1": "vizier",
        "char2": "courtier",
        "reason": "If the Vizier loses their ability, they learn this, and cannot die during the day."
      },
      {
        "char1": "vizier",
        "char2": "fearmonger",
        "reason": "The Vizier wakes with the Fearmonger, learns who they choose and cannot choose to immediately execute that player."
      },
      {
        "char1": "vizier",
        "char2": "investigator",
        "reason": "The Storyteller doesn't declare the Vizier is in play."
      },
      {
        "char1": "vizier",
        "char2": "politician",
        "reason": "The Politician might register as evil to the Vizier."
      },
      {
        "char1": "vizier",
        "char2": "preacher",
        "reason": "If the Vizier loses their ability, they learn this, and cannot die during the day."
      },
      {
        "char1": "vizier",
        "char2": "zealot",
        "reason": "The Zealot might register as evil to the Vizier."
      },
      {
        "char1": "widow",
        "char2": "damsel",
        "reason": "If the Widow is (or has been) in play, the Damsel is poisoned."
      },
      {
        "char1": "widow",
        "char2": "poppygrower",
        "reason": "If the Poppy Grower has their ability, the Widow does not see the Grimoire."
      },
      {
        "char1": "alhadikhia",
        "char2": "princess",
        "reason": "If the Princess nominated & executed a player on their 1st day, no one dies to the Al-Hadikhia tonight."
      },
      {
        "char1": "alhadikhia",
        "char2": "mastermind",
        "reason": "If the Al-Hadikhia dies by execution, and the Mastermind is alive, the Al-Hadikhia chooses 3 good players tonight: if all 3 choose to live, evil wins. Otherwise, good wins."
      },
      {
        "char1": "legion",
        "char2": "engineer",
        "reason": "If Legion is created, all evil players become Legion. If Legion is in play, the Engineer starts knowing this but has no ability."
      },
      {
        "char1": "legion",
        "char2": "hatter",
        "reason": "If Legion is created, all evil players become Legion. If Legion is in play, the Hatter has no ability."
      },
      {
        "char1": "legion",
        "char2": "minstrel",
        "reason": "If Legion died by execution today, Legion keeps their ability, but the Minstrel might learn they are Legion."
      },
      {
        "char1": "legion",
        "char2": "politician",
        "reason": "The Politician might register as evil to Legion."
      },
      {
        "char1": "legion",
        "char2": "preacher",
        "reason": "If the Preacher chooses Legion, Legion keeps their ability, but the Preacher might learn they are Legion."
      },
      {
        "char1": "legion",
        "char2": "summoner",
        "reason": "If Legion is summoned, all evil players become Legion."
      },
      {
        "char1": "legion",
        "char2": "zealot",
        "reason": "The Zealot might register as evil to Legion."
      },
      {
        "char1": "leviathan",
        "char2": "banshee",
        "reason": "Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Banshee dies & gains their ability."
      },
      {
        "char1": "leviathan",
        "char2": "exorcist",
        "reason": "If the Leviathan nominates and executes the Exorcist-chosen player, good wins."
      },
      {
        "char1": "leviathan",
        "char2": "farmer",
        "reason": "Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Farmer uses their ability but does not die."
      },
      {
        "char1": "leviathan",
        "char2": "grandmother",
        "reason": "If the Leviathan is in play and the Grandchild dies by execution, evil wins."
      },
      {
        "char1": "leviathan",
        "char2": "hatter",
        "reason": "The Leviathan cannot enter play after day 5."
      },
      {
        "char1": "leviathan",
        "char2": "innkeeper",
        "reason": "If the Leviathan nominates and executes an Innkeeper-protected player, good wins."
      },
      {
        "char1": "leviathan",
        "char2": "king",
        "reason": "If the Leviathan is in play, and at least 1 player is dead, the King learns an alive character each night."
      },
      {
        "char1": "leviathan",
        "char2": "mayor",
        "reason": "If the Leviathan and the Mayor are alive on day 5 & no execution occurs, good wins."
      },
      {
        "char1": "leviathan",
        "char2": "monk",
        "reason": "If the Leviathan nominates and executes the Monk-protected player, good wins."
      },
      {
        "char1": "leviathan",
        "char2": "pithag",
        "reason": "The Leviathan cannot enter play after day 5."
      },
      {
        "char1": "leviathan",
        "char2": "ravenkeeper",
        "reason": "Each night*, the Leviathan chooses an alive player (different to previous nights): a chosen Ravenkeeper uses their ability but does not die."
      },
      {
        "char1": "leviathan",
        "char2": "sage",
        "reason": "Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die."
      },
      {
        "char1": "leviathan",
        "char2": "soldier",
        "reason": "If the Leviathan nominates and executes the Soldier, good wins."
      },
      {
        "char1": "lilmonsta",
        "char2": "hatter",
        "reason": "If the Hatter dies & the Demon chooses Lil Monsta, they also choose a Minion to become."
      },
      {
        "char1": "lilmonsta",
        "char2": "poppygrower",
        "reason": "If Lil Monsta & the Poppy Grower are alive, Minions wake one by one, until one of them chooses to take the Lil Monsta token."
      },
      {
        "char1": "lilmonsta",
        "char2": "psychopath",
        "reason": "If the Psychopath is babysitting Lil Monsta, they die when executed."
      },
      {
        "char1": "lilmonsta",
        "char2": "magician",
        "reason": "If the Magician is alive, the Storyteller chooses which Minion babysits Lil Monsta."
      },
      {
        "char1": "lilmonsta",
        "char2": "scarletwoman",
        "reason": "If Lil Monsta dies with 5 or more players alive, the Scarlet Woman babysits Lil Monsta for the rest of the game."
      },
      {
        "char1": "lilmonsta",
        "char2": "vizier",
        "reason": "If the Vizier is babysitting Lil Monsta, they die when executed."
      },
      {
        "char1": "lleech",
        "char2": "mastermind",
        "reason": "If the Mastermind is alive and the Lleech host dies by execution, the Lleech lives but loses their ability."
      },
      {
        "char1": "lleech",
        "char2": "slayer",
        "reason": "If the Slayer slays the Lleech host, the host dies."
      },
      {
        "char1": "riot",
        "char2": "atheist",
        "reason": "During a riot, if the Storyteller is nominated, players vote. If they are \"about to die\", the game ends. If not, they nominate again."
      },
      {
        "char1": "riot",
        "char2": "banshee",
        "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Banshee dies & gains their ability."
      },
      {
        "char1": "riot",
        "char2": "exorcist",
        "reason": "If Riot nominates and executes the Exorcist-chosen player, good wins."
      },
      {
        "char1": "riot",
        "char2": "farmer",
        "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Farmer uses their ability but does not die."
      },
      {
        "char1": "riot",
        "char2": "grandmother",
        "reason": "If Riot is in play and the Grandchild dies by execution, evil wins."
      },
      {
        "char1": "riot",
        "char2": "innkeeper",
        "reason": "If Riot nominates and executes an Innkeeper-protected player, good wins."
      },
      {
        "char1": "riot",
        "char2": "king",
        "reason": "If Riot is in play, and at least 1 player is dead, the King learns an alive character each night."
      },
      {
        "char1": "riot",
        "char2": "mayor",
        "reason": "The Mayor may choose to stop the riot. If they do so when only 1 Riot is alive, good wins. Otherwise, evil wins."
      },
      {
        "char1": "riot",
        "char2": "monk",
        "reason": "If Riot nominates and executes the Monk-protected player, good wins."
      },
      {
        "char1": "riot",
        "char2": "ravenkeeper",
        "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Ravenkeeper uses their ability but does not die."
      },
      {
        "char1": "riot",
        "char2": "sage",
        "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die."
      },
      {
        "char1": "riot",
        "char2": "soldier",
        "reason": "If Riot nominates and executes the Soldier, good wins."
      },
      {
        "char1": "vortox",
        "char2": "banshee",
        "reason": "If the Vortox kills the Banshee, all players learn that the Banshee has died."
      },
      {
        "char1": "yaggababble",
        "char2": "exorcist",
        "reason": "If the Exorcist chooses the Yaggababble, the Yaggababble does not kill tonight."
      }
    ]

  nightOrderData: {
    order: number,
    firstNight: string,
    otherNights: string
  }[] = [
      {
        "order": 1,
        "firstNight": "dusk",
        "otherNights": "dusk"
      },
      {
        "order": 2,
        "firstNight": "lordoftyphon",
        "otherNights": "barista"
      },
      {
        "order": 3,
        "firstNight": "kazali",
        "otherNights": "bureaucrat"
      },
      {
        "order": 4,
        "firstNight": "apprentice",
        "otherNights": "thief"
      },
      {
        "order": 5,
        "firstNight": "barista",
        "otherNights": "harlot"
      },
      {
        "order": 6,
        "firstNight": "bureaucrat",
        "otherNights": "bonecollector"
      },
      {
        "order": 7,
        "firstNight": "thief",
        "otherNights": "philosopher"
      },
      {
        "order": 8,
        "firstNight": "boffin",
        "otherNights": "poppygrower"
      },
      {
        "order": 9,
        "firstNight": "philosopher",
        "otherNights": "sailor"
      },
      {
        "order": 10,
        "firstNight": "alchemist",
        "otherNights": "engineer"
      },
      {
        "order": 11,
        "firstNight": "poppygrower",
        "otherNights": "preacher"
      },
      {
        "order": 12,
        "firstNight": "yaggababble",
        "otherNights": "xaan"
      },
      {
        "order": 13,
        "firstNight": "magician",
        "otherNights": "poisoner"
      },
      {
        "order": 14,
        "firstNight": "minioninfo",
        "otherNights": "courtier"
      },
      {
        "order": 15,
        "firstNight": "snitch",
        "otherNights": "innkeeper"
      },
      {
        "order": 16,
        "firstNight": "lunatic",
        "otherNights": "wizard"
      },
      {
        "order": 17,
        "firstNight": "summoner",
        "otherNights": "gambler"
      },
      {
        "order": 18,
        "firstNight": "demoninfo",
        "otherNights": "acrobat"
      },
      {
        "order": 19,
        "firstNight": "king",
        "otherNights": "snakecharmer"
      },
      {
        "order": 20,
        "firstNight": "sailor",
        "otherNights": "monk"
      },
      {
        "order": 21,
        "firstNight": "marionette",
        "otherNights": "organgrinder"
      },
      {
        "order": 22,
        "firstNight": "engineer",
        "otherNights": "devilsadvocate"
      },
      {
        "order": 23,
        "firstNight": "preacher",
        "otherNights": "witch"
      },
      {
        "order": 24,
        "firstNight": "lilmonsta",
        "otherNights": "cerenovus"
      },
      {
        "order": 25,
        "firstNight": "lleech",
        "otherNights": "pithag"
      },
      {
        "order": 26,
        "firstNight": "xaan",
        "otherNights": "fearmonger"
      },
      {
        "order": 27,
        "firstNight": "poisoner",
        "otherNights": "harpy"
      },
      {
        "order": 28,
        "firstNight": "widow",
        "otherNights": "mezepheles"
      },
      {
        "order": 29,
        "firstNight": "courtier",
        "otherNights": "scarletwoman"
      },
      {
        "order": 30,
        "firstNight": "wizard",
        "otherNights": "summoner"
      },
      {
        "order": 31,
        "firstNight": "snakecharmer",
        "otherNights": "lunatic"
      },
      {
        "order": 32,
        "firstNight": "godfather",
        "otherNights": "exorcist"
      },
      {
        "order": 33,
        "firstNight": "organgrinder",
        "otherNights": "lycanthrope"
      },
      {
        "order": 34,
        "firstNight": "devilsadvocate",
        "otherNights": "princess"
      },
      {
        "order": 35,
        "firstNight": "eviltwin",
        "otherNights": "legion"
      },
      {
        "order": 36,
        "firstNight": "witch",
        "otherNights": "imp"
      },
      {
        "order": 37,
        "firstNight": "cerenovus",
        "otherNights": "zombuul"
      },
      {
        "order": 38,
        "firstNight": "fearmonger",
        "otherNights": "pukka"
      },
      {
        "order": 39,
        "firstNight": "harpy",
        "otherNights": "shabaloth"
      },
      {
        "order": 40,
        "firstNight": "mezepheles",
        "otherNights": "po"
      },
      {
        "order": 41,
        "firstNight": "pukka",
        "otherNights": "fanggu"
      },
      {
        "order": 42,
        "firstNight": "pixie",
        "otherNights": "nodashii"
      },
      {
        "order": 43,
        "firstNight": "huntsman",
        "otherNights": "vortox"
      },
      {
        "order": 44,
        "firstNight": "damsel",
        "otherNights": "lordoftyphon"
      },
      {
        "order": 45,
        "firstNight": "amnesiac",
        "otherNights": "vigormortis"
      },
      {
        "order": 46,
        "firstNight": "washerwoman",
        "otherNights": "ojo"
      },
      {
        "order": 47,
        "firstNight": "librarian",
        "otherNights": "alhadikhia"
      },
      {
        "order": 48,
        "firstNight": "investigator",
        "otherNights": "lleech"
      },
      {
        "order": 49,
        "firstNight": "chef",
        "otherNights": "lilmonsta"
      },
      {
        "order": 50,
        "firstNight": "empath",
        "otherNights": "yaggababble"
      },
      {
        "order": 51,
        "firstNight": "fortuneteller",
        "otherNights": "kazali"
      },
      {
        "order": 52,
        "firstNight": "butler",
        "otherNights": "assassin"
      },
      {
        "order": 53,
        "firstNight": "grandmother",
        "otherNights": "godfather"
      },
      {
        "order": 54,
        "firstNight": "clockmaker",
        "otherNights": "gossip"
      },
      {
        "order": 55,
        "firstNight": "dreamer",
        "otherNights": "hatter"
      },
      {
        "order": 56,
        "firstNight": "seamstress",
        "otherNights": "barber"
      },
      {
        "order": 57,
        "firstNight": "steward",
        "otherNights": "sweetheart"
      },
      {
        "order": 58,
        "firstNight": "knight",
        "otherNights": "sage"
      },
      {
        "order": 59,
        "firstNight": "noble",
        "otherNights": "banshee"
      },
      {
        "order": 60,
        "firstNight": "balloonist",
        "otherNights": "professor"
      },
      {
        "order": 61,
        "firstNight": "shugenja",
        "otherNights": "choirboy"
      },
      {
        "order": 62,
        "firstNight": "villageidiot",
        "otherNights": "huntsman"
      },
      {
        "order": 63,
        "firstNight": "bountyhunter",
        "otherNights": "damsel"
      },
      {
        "order": 64,
        "firstNight": "nightwatchman",
        "otherNights": "amnesiac"
      },
      {
        "order": 65,
        "firstNight": "cultleader",
        "otherNights": "farmer"
      },
      {
        "order": 66,
        "firstNight": "spy",
        "otherNights": "tinker"
      },
      {
        "order": 67,
        "firstNight": "ogre",
        "otherNights": "moonchild"
      },
      {
        "order": 68,
        "firstNight": "highpriestess",
        "otherNights": "grandmother"
      },
      {
        "order": 69,
        "firstNight": "general",
        "otherNights": "ravenkeeper"
      },
      {
        "order": 70,
        "firstNight": "chambermaid",
        "otherNights": "empath"
      },
      {
        "order": 71,
        "firstNight": "mathematician",
        "otherNights": "fortuneteller"
      },
      {
        "order": 72,
        "firstNight": "dawn",
        "otherNights": "undertaker"
      },
      {
        "order": 73,
        "firstNight": "leviathan",
        "otherNights": "dreamer"
      },
      {
        "order": 74,
        "firstNight": "vizier",
        "otherNights": "flowergirl"
      },
      {
        "order": 75,
        "firstNight": "",
        "otherNights": "towncrier"
      },
      {
        "order": 76,
        "firstNight": "",
        "otherNights": "oracle"
      },
      {
        "order": 77,
        "firstNight": "",
        "otherNights": "seamstress"
      },
      {
        "order": 78,
        "firstNight": "",
        "otherNights": "juggler"
      },
      {
        "order": 79,
        "firstNight": "",
        "otherNights": "balloonist"
      },
      {
        "order": 80,
        "firstNight": "",
        "otherNights": "villageidiot"
      },
      {
        "order": 81,
        "firstNight": "",
        "otherNights": "king"
      },
      {
        "order": 82,
        "firstNight": "",
        "otherNights": "bountyhunter"
      },
      {
        "order": 83,
        "firstNight": "",
        "otherNights": "nightwatchman"
      },
      {
        "order": 84,
        "firstNight": "",
        "otherNights": "cultleader"
      },
      {
        "order": 85,
        "firstNight": "",
        "otherNights": "butler"
      },
      {
        "order": 86,
        "firstNight": "",
        "otherNights": "spy"
      },
      {
        "order": 87,
        "firstNight": "",
        "otherNights": "highpriestess"
      },
      {
        "order": 88,
        "firstNight": "",
        "otherNights": "general"
      },
      {
        "order": 89,
        "firstNight": "",
        "otherNights": "chambermaid"
      },
      {
        "order": 90,
        "firstNight": "",
        "otherNights": "mathematician"
      },
      {
        "order": 91,
        "firstNight": "",
        "otherNights": "dawn"
      },
      {
        "order": 92,
        "firstNight": "",
        "otherNights": "leviathan"
      }
    ]

}


