import { Component, NgModule, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { NgxPrintDirective } from 'ngx-print';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, NgxPrintDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App implements OnInit{
  protected readonly title = signal('ScriptMaker');
  jsonInput:string = '';
  jsonStart:string = '';
  scriptName:string = ''
  author:string = '';
  characters:string = '';
  jsonSplit: any;
  characterSplit: any;
  filteredJinxes: any;
  firstOrder: any;
  otherOrder: any;
  bootlegger:[] =[]

  hbchar: any;
  hbsplit: any;
  hbimages: any;

  townsfolk: {
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
  }[] = []
  outsiders: {
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
  }[] = []
  minions: {
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
  }[] = []
  demons: {
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
  }[] = []
  trav: {
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
  }[] = []
  npcs: {
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
  }[] = []

  test:string = "0"

  ngOnInit(): void {
    console.log("loading!")
  }


  create() {
    this.jsonInput.replace(/(\r\n|\n|\r)/gm, "");

    //get start of json info
    this.jsonSplit = this.jsonInput.split("}");

    this.jsonStart = this.jsonSplit[0].replace("[","").concat("}")

    const obj = JSON.parse(this.jsonStart);

    //set script name
    this.scriptName = obj.name;
 
    //set author name
    this.author = obj.author;

    //set bootlegger
    this.bootlegger = obj.bootlegger

    //-----------------------------
    //Homebrew
     for (let i = 1; i < this.jsonSplit.length; i++) {
       if(this.jsonSplit[i].includes("\"id\"")) {

        //get text of current json split
        let currentloop = this.jsonSplit[i]

        //split so homebrew character is at hbsplit[1]
        this.hbsplit = currentloop.split("{")

        //parse [1] as a json connected with { and ]}
        this.hbchar = JSON.parse(("{").concat(this.hbsplit[1]).concat("]}"))

        //get images and split for first url
        let images = this.hbchar.image
        let imageurl = (images + '').split(',')[0]

        //populate new character
        let newchar =         
        {
           ID:this.hbchar.id,
           Name:this.hbchar.name,
           Ability:this.hbchar.ability,
           Team:this.hbchar.team,
           Image:imageurl
          }

        //if character is not in charData, add it
        if(!this.charData.some(item => item.ID === newchar.ID)){
          this.charData.push(newchar);
        }
       }
     }


    //-----------------------------
    //get list of characters from json
    this.characters = this.jsonSplit.slice(1).join( )

    //replace anything inside []
    this.characters = this.characters.replace(/\s*\[[\s\S]*?\]/g,'"xxx"')
    
    //replace ending ] with , for formatting
    this.characters = this.characters.replaceAll("]",",")
    
    //replace quotes
    this.characters = this.characters.replace(/"/g, ""); 
    
    //replace id: with , for hb characters
    this.characters = this.characters.replaceAll("id:",",");
    
    //remove spaces
    this.characters = this.characters.replaceAll(" ","")

    //split json list of characters
    this.characterSplit = this.characters.split(",");

    //-------------------------------------------
    //get list of townsfolk
     this.townsfolk = this.setcharacters(this.townsfolk,"townsfolk")

    //get list of outsiders
    this.outsiders = this.setcharacters(this.outsiders,"outsider")

    //get list of minions
    this.minions = this.setcharacters(this.minions,"minion")

    //get list of demons
    this.demons = this.setcharacters(this.demons,"demon")

    //get list of trav
    this.trav = this.setcharacters(this.trav,"traveller")

    //get list of npcs, not including djinn
    this.npcs = this.charData.filter(item =>
      this.characterSplit.includes(item.ID) && (item.Team == "fabled" || item.Team == "loric") && item.ID != 'djinn'
    ).sort(
      (a, b) =>
      this.characterSplit.indexOf(a.ID) - this.characterSplit.indexOf(b.ID)
    );

    //---------------------------------------------
    //Jinxes

    //convert from name to id formatting (lowercase, remove spaces and dashes)
    const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');

    //get array of jinxes
    this.filteredJinxes = 
      this.jinxData.filter(jinx => 
        this.characterSplit.includes(normalize(jinx.char1)) &&
        this.characterSplit.includes(normalize(jinx.char2)));



    //----------------------------------------------------
    //Night Order

    //add meta info to first night
    const firstNightInput =this.characterSplit
    firstNightInput.push("dawn","dusk","minioninfo","demoninfo")

    //filter night order
    const firstFiltered = this.nightOrderData
    .filter(item => firstNightInput.includes(item.firstNight))

    //sort night order
    firstFiltered.sort((a, b) => a.order - b.order);

    //set first order
    this.firstOrder = firstFiltered.map(item => item.firstNight);



    //add meta info to other night
    const otherNightInput =this.characterSplit
    firstNightInput.push("dawn","dusk")

    //filter night order
    const otherFiltered = this.nightOrderData
    .filter(item => otherNightInput.includes(item.otherNights))

    //sort night order
    otherFiltered.sort((a, b) => a.order - b.order);

    //set first order
    this.otherOrder = otherFiltered.map(item => item.otherNights);


  }














  // Get image from charData by name
  getImageForName(name: string): string | null {
    const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');

    const match = this.charData.find(item => normalize(item.Name) === normalize(name));
    return match ? match.Image : null;
  }

  //[{"id":"_meta","author":"Yume","name":"Hime Nightmare"},"knight","chef","pixie","balloonist","general","fortuneteller","towncrier","monk","gossip","alsaahir","princess","cannibal","amnesiac","drunk","sweetheart","klutz","hatter","mutant","poisoner","xaan","wraith","scarletwoman","organgrinder","nodashii","kazali","cacklejack","matron","apprentice","voudon","gardener","djinn"]

//[{"id":"_meta","author":"Thomas04","name":"Madness of the Anti-Popes","bootlegger":["Amnesiac guesses always give correct info about their ability. Information from their ability may be false.","bootlegg2"]},"steward","shugenja","empath","balloonist","snakecharmer","savant","seamstress","philosopher","fisherman","juggler","amnesiac","farmer","sweetheart","plaguedoctor","hatter","mutant","harpy","cerenovus","pithag","eviltwin","nodashii","vigormortis","vortox","fanggu","pope","bootlegger",gnome,butcher,gunslinger]

  //[ { "id": "_meta", "author": "Thomas", "name": "Rotten to the Core", "firstNight": [ "dusk", "minioninfo", "demoninfo", "cobbler_hblreleased","chef","butler","seamstress", "steward", "spy", "dawn" ], "otherNight": [ "dusk", "seamstress", "butler", "spy", "dawn" ], "bootlegger": [ "This script features homebrew characters by Luis S (✦) " ] },"steward","chef", { "id": "cobbler_hblreleased", "name": "Cobbler ✦", "image": [ "https://i.imgur.com/CqZgOjo.png", "https://i.imgur.com/0eeMtVq.png" ], "team": "townsfolk", "ability": "You start knowing 1 good & 1 evil character: they are either both in-play or not at all.", "flavor": "That’s odd. I could’ve sworn that I left this pair here.", "firstNight": 49.1, "otherNight": 0, "firstNightReminder": "Show the Cobbler 1 in-play good character token &amp; 1 in-play evil character token, or 1 not-in-play good character token &amp; 1 not-in-play evil character token." ,"jinxes":[{"id":"banshee","reason":"If the Matsuraid is in play and the Banshee is ‘About to Die’, all players learn this and the Banshee gains their ability."}]}, "seamstress", "butler", "drunk", "spy", "bootlegger" ]

setcharacters(set:any, setname:string){
  set = this.charData.filter(item =>
      this.characterSplit.includes(item.ID) && item.Team == setname
    ).sort(
      (a, b) =>
      this.characterSplit.indexOf(a.ID) - this.characterSplit.indexOf(b.ID)
    );
  return set;
}




  charData:{
    ID:string,
    Name:string,
    Ability:string,
    Team:string,
    Image:string
    }[] = [
  {
    ID: "acrobat",
    Name: "Acrobat",
    Ability: "Each night*, choose a player: if they are or become drunk or poisoned tonight, you die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b5/Icon_acrobat.png"
  },
  {
    ID: "alchemist",
    Name: "Alchemist",
    Ability: "You have a Minion ability. When using this, the Storyteller may prompt you to choose differently.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/5/54/Icon_alchemist.png"
  },
  {
    ID: "alsaahir",
    Name: "Alsaahir",
    Ability: "Each day, if you publicly guess which players are Minion(s) and which are Demon(s), good wins.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8e/Icon_alsaahir.png"
  },
  {
    ID: "amnesiac",
    Name: "Amnesiac",
    Ability: "You do not know what your ability is. Each day, privately guess what it is: you learn how accurate you are.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/2/26/Icon_amnesiac.png"
  },
  {
    ID: "artist",
    Name: "Artist",
    Ability: "Once per game, during the day, privately ask the Storyteller any yes/no question.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/1/1a/Icon_artist.png"
  },
  {
    ID: "atheist",
    Name: "Atheist",
    Ability: "The Storyteller can break the game rules & if executed, good wins, even if you are dead. [No evil characters]",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/4/43/Icon_atheist.png"
  },
  {
    ID: "balloonist",
    Name: "Balloonist",
    Ability: "Each night, you learn a player of a different character type than last night. [+0 or +1 Outsider]",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/c/cb/Icon_balloonist.png"
  },
  {
    ID: "banshee",
    Name: "Banshee",
    Ability: "If the Demon kills you, all players learn this. From now on, you may nominate twice per day and vote twice per nomination.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/6/63/Icon_banshee.png"
  },
  {
    ID: "bountyhunter",
    Name: "Bounty Hunter",
    Ability: "You start knowing 1 evil player. If the player you know dies, you learn another evil player tonight. [1 Townsfolk is evil]",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/5/5b/Icon_bountyhunter.png"
  },
  {
    ID: "cannibal",
    Name: "Cannibal",
    Ability: "You have the ability of the recently killed executee. If they are evil, you are poisoned until a good player dies by execution.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8e/Icon_cannibal.png"
  },
  {
    ID: "chambermaid",
    Name: "Chambermaid",
    Ability: "Each night, choose 2 alive players (not yourself): you learn how many woke tonight due to their ability.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/8/87/Icon_chambermaid.png"
  },
  {
    ID: "chef",
    Name: "Chef",
    Ability: "You start knowing how many pairs of evil players there are.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d5/Icon_chef.png"
  },
  {
    ID: "choirboy",
    Name: "Choirboy",
    Ability: "If the Demon kills the King, you learn which player is the Demon. [+the King]",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d9/Icon_choirboy.png"
  },
  {
    ID: "clockmaker",
    Name: "Clockmaker",
    Ability: "You start knowing how many steps from the Demon to its nearest Minion.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/3/3d/Icon_clockmaker.png"
  },
  {
    ID: "courtier",
    Name: "Courtier",
    Ability: "Once per game, at night, choose a character: they are drunk for 3 nights & 3 days.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e0/Icon_courtier.png"
  },
  {
    ID: "cultleader",
    Name: "Cult Leader",
    Ability: "Each night, you become the alignment of an alive neighbor. If all good players choose to join your cult, your team wins.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/6/6c/Icon_cultleader.png"
  },
  {
    ID: "dreamer",
    Name: "Dreamer",
    Ability: "Each night, choose a player (not yourself or Travellers): you learn 1 good and 1 evil character, 1 of which is correct.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/f/f2/Icon_dreamer.png"
  },
  {
    ID: "empath",
    Name: "Empath",
    Ability: "Each night, you learn how many of your 2 alive neighbors are evil.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/1/13/Icon_empath.png"
  },
  {
    ID: "engineer",
    Name: "Engineer",
    Ability: "Once per game, at night, choose which Minions or which Demon is in play.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b9/Icon_engineer.png"
  },
  {
    ID: "exorcist",
    Name: "Exorcist",
    Ability: "Each night*, choose a player (different to last night): the Demon, if chosen, learns who you are then doesn't wake tonight.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/c/c2/Icon_exorcist.png"
  },
  {
    ID: "farmer",
    Name: "Farmer",
    Ability: "When you die at night, an alive good player becomes a Farmer.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/f/fe/Icon_farmer.png"
  },
  {
    ID: "fisherman",
    Name: "Fisherman",
    Ability: "Once per game, during the day, visit the Storyteller for some advice to help your team win.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/1/19/Icon_fisherman.png"
  },
  {
    ID: "flowergirl",
    Name: "Flowergirl",
    Ability: "Each night*, you learn if a Demon voted today.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/a/ac/Icon_flowergirl.png"
  },
  {
    ID: "fool",
    Name: "Fool",
    Ability: "The first time you die, you don't.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d9/Icon_fool.png"
  },
  {
    ID: "fortuneteller",
    Name: "Fortune Teller",
    Ability: "Each night, choose 2 players: you learn if either is a Demon. There is a good player that registers as a Demon to you.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/9/97/Icon_fortuneteller.png"
  },
  {
    ID: "gambler",
    Name: "Gambler",
    Ability: "Each night*, choose a player & guess their character: if you guess wrong, you die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/f/fd/Icon_gambler.png"
  },
  {
    ID: "general",
    Name: "General",
    Ability: "Each night, you learn which alignment the Storyteller believes is winning: good, evil, or neither.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/9/99/Icon_general.png"
  },
  {
    ID: "gossip",
    Name: "Gossip",
    Ability: "Each day, you may make a public statement. Tonight, if it was true, a player dies.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/c/c7/Icon_gossip.png"
  },
  {
    ID: "grandmother",
    Name: "Grandmother",
    Ability: "You start knowing a good player & their character. If the Demon kills them, you die too.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/2/26/Icon_grandmother.png"
  },
  {
    ID: "highpriestess",
    Name: "High Priestess",
    Ability: "Each night, learn which player the Storyteller believes you should talk to most.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/6/63/Icon_highpriestess.png"
  },
  {
    ID: "huntsman",
    Name: "Huntsman",
    Ability: "Once per game, at night, choose a living player: the Damsel, if chosen, becomes a not-in-play Townsfolk. [+the Damsel]",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a1/Icon_huntsman.png"
  },
  {
    ID: "innkeeper",
    Name: "Innkeeper",
    Ability: "Each night*, choose 2 players: they can't die tonight, but 1 is drunk until dusk.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/0/0c/Icon_innkeeper.png"
  },
  {
    ID: "investigator",
    Name: "Investigator",
    Ability: "You start knowing that 1 of 2 players is a particular Minion.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/a/ad/Icon_investigator.png"
  },
  {
    ID: "juggler",
    Name: "Juggler",
    Ability: "On your 1st day, publicly guess up to 5 players' characters. That night, you learn how many you got correct.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/4/42/Icon_juggler.png"
  },
  {
    ID: "king",
    Name: "King",
    Ability: "Each night, if the dead equal or outnumber the living, you learn 1 alive character. The Demon knows you are the King.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/dc/Icon_king.png"
  },
  {
    ID: "knight",
    Name: "Knight",
    Ability: "You start knowing 2 players that are not the Demon.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8e/Icon_knight.png"
  },
  {
    ID: "librarian",
    Name: "Librarian",
    Ability: "You start knowing that 1 of 2 players is a particular Outsider. (Or that zero are in play.)",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e0/Icon_librarian.png"
  },
  {
    ID: "lycanthrope",
    Name: "Lycanthrope",
    Ability: "Each night*, choose an alive player. If good, they die & the Demon doesn’t kill tonight. One good player registers as evil.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/9/92/Icon_lycanthrope.png"
  },
  {
    ID: "magician",
    Name: "Magician",
    Ability: "The Demon thinks you are a Minion. Minions think you are a Demon.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/9/93/Icon_magician.png"
  },
  {
    ID: "mathematician",
    Name: "Mathematician",
    Ability: "Each night, you learn how many players’ abilities worked abnormally (since dawn) due to another character's ability.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/f/f1/Icon_mathematician.png"
  },
  {
    ID: "mayor",
    Name: "Mayor",
    Ability: "If only 3 players live & no execution occurs, your team wins. If you die at night, another player might die instead.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a1/Icon_mayor.png"
  },
  {
    ID: "minstrel",
    Name: "Minstrel",
    Ability: "When a Minion dies by execution, all other players (except Travellers) are drunk until dusk tomorrow.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/2/24/Icon_minstrel.png"
  },
  {
    ID: "monk",
    Name: "Monk",
    Ability: "Each night*, choose a player (not yourself): they are safe from the Demon tonight.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/7/7c/Icon_monk.png"
  },
  {
    ID: "nightwatchman",
    Name: "Nightwatchman",
    Ability: "Once per game, at night, choose a player: they learn you are the Nightwatchman.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/f/f0/Icon_nightwatchman.png"
  },
  {
    ID: "noble",
    Name: "Noble",
    Ability: "You start knowing 3 players, 1 and only 1 of which is evil.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/c/cc/Icon_noble.png"
  },
  {
    ID: "oracle",
    Name: "Oracle",
    Ability: "Each night*, you learn how many dead players are evil.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/b/bb/Icon_oracle.png"
  },
  {
    ID: "pacifist",
    Name: "Pacifist",
    Ability: "Executed good players might not die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/5/5d/Icon_pacifist.png"
  },
  {
    ID: "philosopher",
    Name: "Philosopher",
    Ability: "Once per game, at night, choose a good character: gain that ability. If this character is in play, they are drunk.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/5/5d/Icon_philosopher.png"
  },
  {
    ID: "pixie",
    Name: "Pixie",
    Ability: "You start knowing 1 in-play Townsfolk. If you were mad that you were this character, you gain their ability when they die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d5/Icon_pixie.png"
  },
  {
    ID: "poppygrower",
    Name: "Poppy Grower",
    Ability: "Minions & Demons do not know each other. If you die, they learn who each other are that night.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/9/91/Icon_poppygrower.png"
  },
  {
    ID: "preacher",
    Name: "Preacher",
    Ability: "Each night, choose a player: a Minion, if chosen, learns this. All chosen Minions have no ability.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/8/82/Icon_preacher.png"
  },
  {
    ID: "princess",
    Name: "Princess",
    Ability: "On your 1st day, if you nominated & executed a player, the Demon doesn’t kill tonight.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/3/36/Icon_princess.png"
  },
  {
    ID: "professor",
    Name: "Professor",
    Ability: "Once per game, at night*, choose a dead player: if they are a Townsfolk, they are resurrected.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/6/65/Icon_professor.png"
  },
  {
    ID: "ravenkeeper",
    Name: "Ravenkeeper",
    Ability: "If you die at night, you are woken to choose a player: you learn their character.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/e/ef/Icon_ravenkeeper.png"
  },
  {
    ID: "sage",
    Name: "Sage",
    Ability: "If the Demon kills you, you learn that it is 1 of 2 players.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a0/Icon_sage.png"
  },
  {
    ID: "sailor",
    Name: "Sailor",
    Ability: "Each night, choose an alive player: either you or they are drunk until dusk. You can't die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/1/16/Icon_sailor.png"
  },
  {
    ID: "savant",
    Name: "Savant",
    Ability: "Each day, you may visit the Storyteller to learn 2 things in private: 1 is true & 1 is false.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d5/Icon_savant.png"
  },
  {
    ID: "seamstress",
    Name: "Seamstress",
    Ability: "Once per game, at night, choose 2 players (not yourself): you learn if they are the same alignment.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/5/53/Icon_seamstress.png"
  },
  {
    ID: "shugenja",
    Name: "Shugenja",
    Ability: "You start knowing if your closest evil player is clockwise or anti-clockwise. If equidistant, this info is arbitrary.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/1/11/Icon_shugenja.png"
  },
  {
    ID: "slayer",
    Name: "Slayer",
    Ability: "Once per game, during the day, publicly choose a player: if they are the Demon, they die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d3/Icon_slayer.png"
  },
  {
    ID: "snakecharmer",
    Name: "Snake Charmer",
    Ability: "Each night, choose an alive player: a chosen Demon swaps characters & alignments with you & is then poisoned.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/0/08/Icon_snakecharmer.png"
  },
  {
    ID: "soldier",
    Name: "Soldier",
    Ability: "You are safe from the Demon.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/c/c3/Icon_soldier.png"
  },
  {
    ID: "steward",
    Name: "Steward",
    Ability: "You start knowing 1 good player.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/f/fe/Icon_steward.png"
  },
  {
    ID: "tealady",
    Name: "Tea Lady",
    Ability: "If both your alive neighbors are good, they can't die.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/1/16/Icon_tealady.png"
  },
  {
    ID: "towncrier",
    Name: "Town Crier",
    Ability: "Each night*, you learn if a Minion nominated today.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/e/ef/Icon_towncrier.png"
  },
  {
    ID: "undertaker",
    Name: "Undertaker",
    Ability: "Each night*, you learn which character died by execution today.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/0/05/Icon_undertaker.png"
  },
  {
    ID: "villageidiot",
    Name: "Village Idiot",
    Ability: "Each night, choose a player: you learn their alignment. [+0 to +2 Village Idiots. 1 of the extras is drunk]",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/da/Icon_villageidiot.png"
  },
  {
    ID: "virgin",
    Name: "Virgin",
    Ability: "The 1st time you are nominated, if the nominator is a Townsfolk, they are executed immediately.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d3/Icon_virgin.png"
  },
  {
    ID: "washerwoman",
    Name: "Washerwoman",
    Ability: "You start knowing that 1 of 2 players is a particular Townsfolk.",
    Team: "townsfolk",
    Image: "https://wiki.bloodontheclocktower.com/images/8/85/Icon_washerwoman.png"
  },
  {
    ID: "barber",
    Name: "Barber",
    Ability: "If you died today or tonight, the Demon may choose 2 players (not another Demon) to swap characters.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/1/16/Icon_barber.png"
  },
  {
    ID: "butler",
    Name: "Butler",
    Ability: "Each night, choose a player (not yourself): tomorrow, you may only vote if they are voting too.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/1/19/Icon_butler.png"
  },
  {
    ID: "damsel",
    Name: "Damsel",
    Ability: "All Minions know a Damsel is in play. If a Minion publicly guesses you (once), your team loses.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/d/dc/Icon_damsel.png"
  },
  {
    ID: "drunk",
    Name: "Drunk",
    Ability: "You do not know you are the Drunk. You think you are a Townsfolk character, but you are not.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/4/4a/Icon_drunk.png"
  },
  {
    ID: "golem",
    Name: "Golem",
    Ability: "You may only nominate once per game. When you do, if the nominee is not the Demon, they die.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/2/2b/Icon_golem.png"
  },
  {
    ID: "goon",
    Name: "Goon",
    Ability: "Each night, the 1st player to choose you with their ability is drunk until dusk. You become their alignment.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/archive/6/6f/20240719153317%21Icon_goon.png"
  },
  {
    ID: "hatter",
    Name: "Hatter",
    Ability: "If you died today or tonight, the Minion & Demon players may choose new Minion & Demon characters to be.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/4/44/Icon_hatter.png"
  },
  {
    ID: "heretic",
    Name: "Heretic",
    Ability: "Whoever wins, loses & whoever loses, wins, even if you are dead.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/4/4a/Icon_heretic.png"
  },
  {
    ID: "hermit",
    Name: "Hermit",
    Ability: "You have all Outsider abilities. [-0 or -1 Outsiders]",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b4/Icon_hermit.png"
  },
  {
    ID: "klutz",
    Name: "Klutz",
    Ability: "When you learn that you died, publicly choose 1 alive player: if they are evil, your team loses.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/b/bc/Icon_klutz.png"
  },
  {
    ID: "lunatic",
    Name: "Lunatic",
    Ability: "You think you are a Demon, but you are not. The Demon knows who you are & who you choose at night.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/6/64/Icon_lunatic.png"
  },
  {
    ID: "moonchild",
    Name: "Moonchild",
    Ability: "When you learn that you died, publicly choose 1 alive player. Tonight, if it was a good player, they die.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/d/dc/Icon_moonchild.png"
  },
  {
    ID: "mutant",
    Name: "Mutant",
    Ability: "If you are ''mad'' about being an Outsider, you might be executed.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/2/2e/Icon_mutant.png"
  },
  {
    ID: "ogre",
    Name: "Ogre",
    Ability: "On your 1st night, choose a player (not yourself): you become their alignment (you don't know which) even if drunk or poisoned.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/2/25/Icon_ogre.png"
  },
  {
    ID: "plaguedoctor",
    Name: "Plague Doctor",
    Ability: "When you die, the Storyteller gains a Minion ability.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e2/Icon_plaguedoctor.png"
  },
  {
    ID: "politician",
    Name: "Politician",
    Ability: "If you were the player most responsible for your team losing, you change alignment & win, even if dead.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a3/Icon_politician.png"
  },
  {
    ID: "puzzlemaster",
    Name: "Puzzlemaster",
    Ability: "1 player is drunk, even if you die. If you guess (once) who it is, learn the Demon player, but guess wrong & get false info.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/7/7a/Icon_puzzlemaster.png"
  },
  {
    ID: "recluse",
    Name: "Recluse",
    Ability: "You might register as evil & as a Minion or Demon, even if dead.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/6/60/Icon_recluse.png"
  },
  {
    ID: "saint",
    Name: "Saint",
    Ability: "If you die by execution, your team loses.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/c/c9/Icon_saint.png"
  },
  {
    ID: "snitch",
    Name: "Snitch",
    Ability: "Each Minion gets 3 bluffs.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/c/c1/Icon_snitch.png"
  },
  {
    ID: "sweetheart",
    Name: "Sweetheart",
    Ability: "When you die, 1 player is drunk from now on.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/6/6a/Icon_sweetheart.png"
  },
  {
    ID: "tinker",
    Name: "Tinker",
    Ability: "You might die at any time.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/9/98/Icon_tinker.png"
  },
  {
    ID: "zealot",
    Name: "Zealot",
    Ability: "If there are 5 or more players alive, you must vote for every nomination.",
    Team: "outsider",
    Image: "https://wiki.bloodontheclocktower.com/images/1/16/Icon_zealot.png"
  },
  {
    ID: "assassin",
    Name: "Assassin",
    Ability: "Once per game, at night*, choose a player: they die, even if for some reason they could not.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/4/49/Icon_assassin.png"
  },
  {
    ID: "boffin",
    Name: "Boffin",
    Ability: "The Demon (even if drunk or poisoned) has a not-in-play good character’s ability. You both know which.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e0/Icon_boffin.png"
  },
  {
    ID: "baron",
    Name: "Baron",
    Ability: "There are extra Outsiders in play. [+2 Outsiders]",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/6/6d/Icon_baron.png"
  },
  {
    ID: "boomdandy",
    Name: "Boomdandy",
    Ability: "If you are executed, all but 3 players die. After a 10 to 1 countdown, the player with the most players pointing at them, dies.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/2/20/Icon_boomdandy.png"
  },
  {
    ID: "cerenovus",
    Name: "Cerenovus",
    Ability: "Each night, choose a player & a good character: they are ''mad'' they are this character tomorrow, or might be executed.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/4/45/Icon_cerenovus.png"
  },
  {
    ID: "devilsadvocate",
    Name: "Devil's Advocate",
    Ability: "Each night, choose a living player (different to last night): if executed tomorrow, they don't die.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/0/09/Icon_devilsadvocate.png"
  },
  {
    ID: "eviltwin",
    Name: "Evil Twin",
    Ability: "You & an opposing player know each other. If the good player is executed, evil wins. Good can't win if you both live.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/f/f4/Icon_eviltwin.png"
  },
  {
    ID: "fearmonger",
    Name: "Fearmonger",
    Ability: "Each night, choose a player. If you nominate & execute them, their team loses. All players know if you choose a new player.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/1/11/Icon_fearmonger.png"
  },
  {
    ID: "goblin",
    Name: "Goblin",
    Ability: "If you publicly claim to be the Goblin when nominated & are executed that day, your team wins.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e2/Icon_goblin.png"
  },
  {
    ID: "godfather",
    Name: "Godfather",
    Ability: "You start knowing which Outsiders are in play. If 1 died today, choose a player tonight: they die. [-1 or +1 Outsider]",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d0/Icon_godfather.png"
  },
  {
    ID: "harpy",
    Name: "Harpy",
    Ability: "Each night, choose 2 players: tomorrow, the 1st player is mad that the 2nd is evil, or one or both might die.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d3/Icon_harpy.png"
  },
  {
    ID: "marionette",
    Name: "Marionette",
    Ability: "You think you are a good character, but you are not. The Demon knows who you are. [You neighbor the Demon]",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/c/cf/Icon_marionette.png"
  },
  {
    ID: "mastermind",
    Name: "Mastermind",
    Ability: "If the Demon dies by execution (ending the game), play for 1 more day. If a player is then executed, their team loses.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d5/Icon_mastermind.png"
  },
  {
    ID: "mezepheles",
    Name: "Mezepheles",
    Ability: "You start knowing a secret word. The 1st good player to say this word becomes evil that night.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/f/f2/Icon_mezepheles.png"
  },
  {
    ID: "organgrinder",
    Name: "Organ Grinder",
    Ability: "All players keep their eyes closed when voting and the vote tally is secret. Each night, choose if you are drunk until dusk.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/6/61/Icon_organgrinder.png"
  },
  {
    ID: "pithag",
    Name: "Pit-Hag",
    Ability: "Each night*, choose a player & a character they become (if not-in-play). If a Demon is made, deaths tonight are arbitrary.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/6/6b/Icon_pithag.png"
  },
  {
    ID: "poisoner",
    Name: "Poisoner",
    Ability: "Each night, choose a player: they are poisoned tonight and tomorrow day.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b1/Icon_poisoner.png"
  },
  {
    ID: "psychopath",
    Name: "Psychopath",
    Ability: "Each day, before nominations, you may publicly choose a player: they die. If executed, you only die if you lose roshambo.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a3/Icon_psychopath.png"
  },
  {
    ID: "scarletwoman",
    Name: "Scarlet Woman",
    Ability: "If there are 5 or more players alive & the Demon dies, you become the Demon. (Travellers don't count.)",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/1/13/Icon_scarletwoman.png"
  },
  {
    ID: "spy",
    Name: "Spy",
    Ability: "Each night, you see the Grimoire. You might register as good & as a Townsfolk or Outsider, even if dead.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/5/54/Icon_spy.png"
  },
  {
    ID: "summoner",
    Name: "Summoner",
    Ability: "You get 3 bluffs. On the 3rd night, choose a player: they become an evil Demon of your choice. [No Demon]",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/1/1a/Icon_summoner.png"
  },
  {
    ID: "vizier",
    Name: "Vizier",
    Ability: "All players know you are the Vizier. You cannot die during the day. If good voted, you may choose to execute immediately.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a4/Icon_vizier.png"
  },
  {
    ID: "widow",
    Name: "Widow",
    Ability: "On your 1st night, look at the Grimoire and choose a player: they are poisoned. 1 good player knows a Widow is in play.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/9/99/Icon_widow.png"
  },
  {
    ID: "witch",
    Name: "Witch",
    Ability: "Each night, choose a player: if they nominate tomorrow, they die. If just 3 players live, you lose this ability.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/7/7b/Icon_witch.png"
  },
  {
    ID: "wizard",
    Name: "Wizard",
    Ability: "Once per game, choose to make a wish. If granted, it might have a price & leave a clue as to its nature.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b5/Icon_wizard.png"
  },
  {
    ID: "wraith",
    Name: "Wraith",
    Ability: "You may choose to open your eyes at night. You wake when other evil players do.",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8f/Icon_wraith.png"
  },
  {
    ID: "xaan",
    Name: "Xaan",
    Ability: "On night X, all Townsfolk are poisoned until dusk. [X Outsiders]",
    Team: "minion",
    Image: "https://wiki.bloodontheclocktower.com/images/0/0c/Icon_xaan.png"
  },
  {
    ID: "alhadikhia",
    Name: "Al-Hadikhia",
    Ability: "Each night*, you may choose 3 players (all players learn who): each silently chooses to live or die, but if all live, all die.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/1/18/Icon_alhadikhia.png"
  },
  {
    ID: "fanggu",
    Name: "Fang Gu",
    Ability: "Each night*, choose a player: they die. The 1st Outsider this kills becomes an evil Fang Gu & you die instead. [+1 Outsider]",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/0/0e/Icon_fanggu.png"
  },
  {
    ID: "imp",
    Name: "Imp",
    Ability: "Each night*, choose a player: they die. If you kill yourself this way, a Minion becomes the Imp.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/5/5c/Icon_imp.png"
  },
  {
    ID: "kazali",
    Name: "Kazali",
    Ability: "Each night*, choose a player: they die. [You choose which players are which Minions. -? to +? Outsiders]",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/3/3c/Icon_kazali.png"
  },
  {
    ID: "legion",
    Name: "Legion",
    Ability: "Each night*, a player might die. Executions fail if only evil voted. You register as a Minion too. [Most players are Legion]",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/c/cb/Icon_legion.png"
  },
  {
    ID: "leviathan",
    Name: "Leviathan",
    Ability: "If more than 1 good player is executed, evil wins. All players know you are in play. After day 5, evil wins.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a7/Icon_leviathan.png"
  },
  {
    ID: "lilmonsta",
    Name: "Lil Monsta",
    Ability: "Each night, Minions choose who babysits Lil' Monsta & \"is the Demon\". Each night*, a player might die. [+1 Minion]",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/c/c3/Icon_lilmonsta.png"
  },
  {
    ID: "lleech",
    Name: "Lleech",
    Ability: "Each night*, choose a player: they die. You start by choosing a player: they are poisoned. You die if & only if they are dead.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/7/70/Icon_lleech.png"
  },
  {
    ID: "lordoftyphon",
    Name: "Lord of Typhon",
    Ability: "Each night*, choose a player: they die. [Evil characters are in a line. You are in the middle. +1 Minion. -? to +? Outsiders]",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/c/cf/Icon_lordoftyphon.png"
  },
  {
    ID: "nodashii",
    Name: "No Dashii",
    Ability: "Each night*, choose a player: they die. Your 2 Townsfolk neighbors are poisoned.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/e/eb/Icon_nodashii.png"
  },
  {
    ID: "ojo",
    Name: "Ojo",
    Ability: "Each night*, choose a character: they die. If they are not in play, the Storyteller chooses who dies.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/6/6f/Icon_ojo.png"
  },
  {
    ID: "po",
    Name: "Po",
    Ability: "Each night*, you may choose a player: they die. If your last choice was no-one, choose 3 players tonight.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b2/Icon_po.png"
  },
  {
    ID: "pukka",
    Name: "Pukka",
    Ability: "Each night, choose a player: they are poisoned. The previously poisoned player dies then becomes healthy.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/f/f4/Icon_pukka.png"
  },
  {
    ID: "riot",
    Name: "Riot",
    Ability: "On day 3, Minions become Riot & nominees die but nominate an alive player immediately. This must happen.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/2/2d/Icon_riot.png"
  },
  {
    ID: "shabaloth",
    Name: "Shabaloth",
    Ability: "Each night*, choose 2 players: they die. A dead player you chose last night might be regurgitated.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/1/1f/Icon_shabaloth.png"
  },
  {
    ID: "vigormortis",
    Name: "Vigormortis",
    Ability: "Each night*, choose a player: they die. Minions you kill keep their ability & poison 1 Townsfolk neighbor. [-1 Outsider]",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/1/1a/Icon_vigormortis.png"
  },
  {
    ID: "vortox",
    Name: "Vortox",
    Ability: "Each night*, choose a player: they die. Townsfolk abilities yield false info. Each day, if no-one is executed, evil wins.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/8/89/Icon_vortox.png"
  },
  {
    ID: "yaggababble",
    Name: "Yaggababble",
    Ability: "You start knowing a secret phrase. For each time you said it publicly today, a player might die.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/0/08/Icon_yaggababble.png"
  },
  {
    ID: "zombuul",
    Name: "Zombuul",
    Ability: "Each night*, if no-one died today, choose a player: they die. The 1st time you die, you live but register as dead.",
    Team: "demon",
    Image: "https://wiki.bloodontheclocktower.com/images/1/15/Icon_zombuul.png"
  },
  {
    ID: "apprentice",
    Name: "Apprentice",
    Ability: "On your 1st night, you gain a Townsfolk ability (if good) or a Minion ability (if evil).",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/0/03/Icon_apprentice.png"
  },
  {
    ID: "barista",
    Name: "Barista",
    Ability: "Each night, until dusk, 1) a player becomes sober, healthy & gets true info, or 2) their ability works twice. They learn which.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/2/24/Icon_barista.png"
  },
  {
    ID: "beggar",
    Name: "Beggar",
    Ability: "You must use a vote token to vote. If a dead player gives you theirs, you learn their alignment. You are sober and healthy.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e3/Icon_beggar.png"
  },
  {
    ID: "bishop",
    Name: "Bishop",
    Ability: "Only the Storyteller can nominate. At least 1 opposing player must be nominated each day.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/7/71/Icon_bishop.png"
  },
  {
    ID: "bonecollector",
    Name: "Bone Collector",
    Ability: "Once per game, at night*, choose a dead player: they regain their ability until dusk.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/9/9e/Icon_bonecollector.png"
  },
  {
    ID: "bureaucrat",
    Name: "Bureaucrat",
    Ability: "Each night, choose a player (not yourself): their vote counts as 3 votes tomorrow.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/b/b1/Icon_bureaucrat.png"
  },
  {
    ID: "butcher",
    Name: "Butcher",
    Ability: "Each day, after the 1st execution, you may nominate again.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e3/Icon_butcher.png"
  },
  {
    ID: "cacklejack",
    Name: "Cacklejack",
    Ability: "Each day, choose a player: a different player changes character tonight.",
    Team: "traveller",
    Image: "https://i.imgur.com/NDqe0uC.png"
  },
  {
    ID: "deviant",
    Name: "Deviant",
    Ability: "If you were funny today, you cannot die by exile.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a5/Icon_deviant.png"
  },
  {
    ID: "gangster",
    Name: "Gangster",
    Ability: "Once per day, you may choose to kill an alive neighbor, if your other alive neighbor agrees.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/a/a5/Icon_gangster.png"
  },
  {
    ID: "gnome",
    Name: "Gnome",
    Ability: "All players start knowing a player of your alignment. You may choose to kill anyone who nominates them.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e0/Icon_gnome.png"
  },
  {
    ID: "gunslinger",
    Name: "Gunslinger",
    Ability: "Each day, after the 1st vote has been tallied, you may choose a player that voted: they die.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/1/1c/Icon_gunslinger.png"
  },
  {
    ID: "harlot",
    Name: "Harlot",
    Ability: "Each night*, choose a living player: if they agree, you learn their character, but you both might die.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/6/60/Icon_harlot.png"
  },
  {
    ID: "judge",
    Name: "Judge",
    Ability: "Once per game, if another player nominated, you may choose to force the current execution to pass or fail.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/5/59/Icon_judge.png"
  },
  {
    ID: "matron",
    Name: "Matron",
    Ability: "Each day, you may choose up to 3 sets of 2 players to swap seats. Players may not leave their seats to talk in private.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/2/21/Icon_matron.png"
  },
  {
    ID: "scapegoat",
    Name: "Scapegoat",
    Ability: "If a player of your alignment is executed, you might be executed instead.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/3/3a/Icon_scapegoat.png"
  },
  {
    ID: "thief",
    Name: "Thief",
    Ability: "Each night, choose a player (not yourself): their vote counts negatively tomorrow.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/7/77/Icon_thief.png"
  },
  {
    ID: "voudon",
    Name: "Voudon",
    Ability: "Only you & the dead can vote. They don't need a vote token to do so. A 50% majority isn't required.",
    Team: "traveller",
    Image: "https://wiki.bloodontheclocktower.com/images/6/6d/Icon_voudon.png"
  },
  {
    ID: "angel",
    Name: "Angel",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/c/ca/Icon_angel.png"
  },
  {
    ID: "buddhist",
    Name: "Buddhist",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/2/25/Icon_buddhist.png"
  },
  {
    ID: "djinn",
    Name: "Djinn",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/8/86/Icon_djinn.png"
  },
  {
    ID: "doomsayer",
    Name: "Doomsayer",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8f/Icon_doomsayer.png"
  },
  {
    ID: "duchess",
    Name: "Duchess",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/8/87/Icon_duchess.png"
  },
  {
    ID: "deusexfiasco",
    Name: "Deus ex Fiasco",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/7/71/Icon_deusexfiasco.png"
  },
  {
    ID: "ferryman",
    Name: "Ferryman",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8f/Icon_ferryman.png"
  },
  {
    ID: "fibbin",
    Name: "Fibbin",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/2/2e/Icon_fibbin.png"
  },
  {
    ID: "fiddler",
    Name: "Fiddler",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/e/e5/Icon_fiddler.png"
  },
  {
    ID: "hellslibrarian",
    Name: "Hell's Librarian",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/6/65/Icon_hellslibrarian.png"
  },
  {
    ID: "revolutionary",
    Name: "Revolutionary",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/9/94/Icon_revolutionary.png"
  },
  {
    ID: "sentinel",
    Name: "Sentinel",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/d/d4/Icon_sentinel.png"
  },
  {
    ID: "spiritofivory",
    Name: "Spirit of Ivory",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/9/96/Icon_spiritofivory.png"
  },
  {
    ID: "toymaker",
    Name: "Toymaker",
    Ability: "",
    Team: "fabled",
    Image: "https://wiki.bloodontheclocktower.com/images/2/27/Icon_toymaker.png"
  },
  {
    ID: "bigwig",
    Name: "Big Wig",
    Ability: "",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/8/8f/Icon_big_wig.png"
  },
  {
    ID: "bootlegger",
    Name: "Bootlegger",
    Ability: "There are homebrew rules or characters in play.",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/0/08/Icon_bootlegger.png"
  },
  {
    ID: "gardener",
    Name: "Gardener",
    Ability: "",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/5/5c/Icon_gardener.png"
  },
  {
    ID: "stormcatcher",
    Name: "Storm Catcher",
    Ability: "",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/0/08/Icon_stormcatcher.png"
  },
    {
    ID: "pope",
    Name: "Pope",
    Ability: "There are duplicate good characters in play. They may also be bluffs.",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/1/14/Icon_pope.png"
  },
      {
    ID: "hindu",
    Name: "Hindu",
    Ability: "",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/6/69/Icon_hindu.png"
  },
    {
    ID: "ventriloquist",
    Name: "Ventriloquist",
    Ability: "",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/0/09/Icon_ventriloquist.png"
  },
  {
    ID: "tor",
    Name: "Tor",
    Ability: "Fix your data!",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/6/61/Icon_tor.png"
  },
  {
    ID: "zenomancer",
    Name: "Zenomancer",
    Ability: "",
    Team: "loric",
    Image: "https://wiki.bloodontheclocktower.com/images/4/44/Icon_zenomancer.png"
  },
  {
    ID: "dusk",
    Name: "dusk",
    Ability: "",
    Team: "",
    Image: "https://imgur.com/XvmmtgI.png"
  },
  {
    ID: "minioninfo",
    Name: "minioninfo",
    Ability: "",
    Team: "",
    Image: "https://imgur.com/XpifQjj.png"
  },
  {
    ID: "demoninfo",
    Name: "demoninfo",
    Ability: "",
    Team: "",
    Image: "https://imgur.com/D6iWNsY.png"
  },
  {
    ID: "dawn",
    Name: "dawn",
    Ability: "",
    Team: "",
    Image: "https://imgur.com/I3FicHd.png"
  }
  ]

  jinxData:{
    char1:string,
    char2:string,
    reason:string,
    }[]=[
  {
    "char1": "Alchemist",
    "char2": "Boffin",
    "reason": "If the Alchemist has the Organ Grinder ability, the Organ Grinder is in play. If both are sober, both are drunk."
  },
  {
    "char1": "Alchemist",
    "char2": "Marionette",
    "reason": "An Alchemist-Marionette has no Marionette ability & the Marionette is in play."
  },
  {
    "char1": "Alchemist",
    "char2": "Mastermind",
    "reason": "An Alchemist-Mastermind has no Mastermind ability & the Mastermind is not-in-play."
  },
  {
    "char1": "Alchemist",
    "char2": "Organ Grinder",
    "reason": "If the Alchemist has the Organ Grinder ability, the Organ Grinder is in play & if both the Alchemist and Organ Grinder are sober, both are drunk."
  },
  {
    "char1": "Alchemist",
    "char2": "Spy",
    "reason": "An Alchemist-Spy has no Spy ability & a Spy is in play. After each execution, a living Alchemist-Spy may publicly guess a living player as the Spy. If correct, the Demon must choose the Spy tonight."
  },
  {
    "char1": "Alchemist",
    "char2": "Summoner",
    "reason": "The Alchemist-Summoner does not get bluffs, and chooses which Demon but not which player. If they die before this happens, evil wins. [No Demon]"
  },
  {
    "char1": "Alchemist",
    "char2": "Wraith",
    "reason": "An Alchemist-Wraith has no Wraith ability & a Wraith is in play. After each execution, a living Alchemist-Wraith may publicly guess a living player as the Wraith. If correct, the Demon must choose the Wraith tonight."
  },
  {
    "char1": "Alchemist",
    "char2": "Widow",
    "reason": "An Alchemist-Widow has no Widow ability & a Widow is in play. After each execution, a living Alchemist-Widow may publicly guess a living player as the Widow. If correct, the Demon must choose the Widow tonight."
  },
  {
    "char1": "Bounty Hunter",
    "char2": "Kazali",
    "reason": "If the Kazali turns the Bounty Hunter into a Minion, an evil Townsfolk is not created."
  },
  {
    "char1": "Bounty Hunter",
    "char2": "Philosopher",
    "reason": "If the Philosopher gains the Bounty Hunter ability, a Townsfolk might turn evil."
  },
  {
    "char1": "Cannibal",
    "char2": "Butler",
    "reason": "If the Cannibal gains the Butler ability, the Cannibal learns this."
  },
  {
    "char1": "Cannibal",
    "char2": "Juggler",
    "reason": "If the Juggler guesses on their first day and dies by execution, tonight the living Cannibal learns how many guesses the Juggler got correct."
  },
  {
    "char1": "Cannibal",
    "char2": "Poppy Grower",
    "reason": "If the Cannibal eats the Poppy Grower, then dies or loses the Poppy Grower ability, the Demon and Minions learn each other that night."
  },
  {
    "char1": "Cannibal",
    "char2": "Princess",
    "reason": "If the Cannibal nominated, executed, & killed the Princess today, the Demon doesn’t kill tonight."
  },
  {
    "char1": "Cannibal",
    "char2": "Zealot",
    "reason": "If the Cannibal gains the Zealot ability, the Cannibal learns this."
  },
  {
    "char1": "Mathematician",
    "char2": "Chambermaid",
    "reason": "The Chambermaid can detect if the Mathematician will wake tonight."
  },
  {
    "char1": "Mathematician",
    "char2": "Lunatic",
    "reason": "The Mathematician learns if the Lunatic attacks a different player(s) than the real Demon attacked."
  },
  {
    "char1": "Magician",
    "char2": "Legion",
    "reason": "The Magician wakes with Legion and might register as evil. Legion knows if a Magician is in play, but not which player it is."
  },
  {
    "char1": "Magician",
    "char2": "Marionette",
    "reason": "If the Magician is alive, the Demon doesn't know which neighbor is the Marionette."
  },
  {
    "char1": "Magician",
    "char2": "Spy",
    "reason": "When the Spy sees the Grimoire, the Demon and Magician's character tokens are removed."
  },
  {
    "char1": "Magician",
    "char2": "Vizier",
    "reason": "If the Vizier is in play, the Magician has no ability but is immune to the Vizier's ability."
  },
  {
    "char1": "Magician",
    "char2": "Widow",
    "reason": "When the Widow sees the Grimoire, the Demon and Magician's character tokens are removed."
  },
  {
    "char1": "Magician",
    "char2": "Wraith",
    "reason": "After each execution, the living Magician may publicly guess a living player as the Wraith. If correct, the Demon must choose the Wraith tonight."
  },
  {
    "char1": "Butler",
    "char2": "Organ Grinder",
    "reason": "If the Organ Grinder is causing eyes closed voting, the Butler may raise their hand to vote but their vote is only counted if their master voted too."
  },
  {
    "char1": "Heretic",
    "char2": "Baron",
    "reason": "Only 1 jinxed character can be in play."
  },
  {
    "char1": "Heretic",
    "char2": "Godfather",
    "reason": "Only 1 jinxed character can be in play."
  },
  {
    "char1": "Heretic",
    "char2": "Lleech",
    "reason": "Only 1 jinxed character can be in play."
  },
  {
    "char1": "Heretic",
    "char2": "Pit-Hag",
    "reason": "Only 1 jinxed character can be in play."
  },
  {
    "char1": "Heretic",
    "char2": "Spy",
    "reason": "Only 1 jinxed character can be in play."
  },
  {
    "char1": "Heretic",
    "char2": "Widow",
    "reason": "Only 1 jinxed character can be in play."
  },
  {
    "char1": "Ogre",
    "char2": "Recluse",
    "reason": "If the Recluse registers as evil to the Ogre, the Ogre learns that they are evil."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Baron",
    "reason": "If the Storyteller gains the Baron ability, up to two players become not-in-play Outsiders."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Boomdandy",
    "reason": "If the Plague Doctor is executed and the Storyteller would gain the Boomdandy ability, the Boomdandy ability triggers immediately."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Evil Twin",
    "reason": "If the Storyteller would gain the Evil Twin ability, a player becomes the Evil Twin."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Fearmonger",
    "reason": "If the Plague Doctor dies, a living Minion gains the Fearmonger ability in addition to their own ability, and learns this."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Goblin",
    "reason": "If the Plague Doctor dies, a living Minion gains the Goblin ability in addition to their own ability, and learns this."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Marionette",
    "reason": "If the Demon has a neighbor who is alive and a Townsfolk or Outsider when the Plague Doctor dies, that player becomes an evil Marionette. If there is already an extra evil player, this does not happen."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Scarlet Woman",
    "reason": "If the Plague Doctor dies, a living Minion gains the Scarlet Woman ability in addition to their own ability, and learns this."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Spy",
    "reason": "If the Plague Doctor dies, a living Minion gains the Spy ability in addition to their own ability, and learns this."
  },
  {
    "char1": "Plague Doctor",
    "char2": "Wraith",
    "reason": "If the Plague Doctor dies, a living Minion gains the Wraith ability in addition to their own ability, and learns this."
  },
  {
    "char1": "Boffin",
    "char2": "Cult Leader",
    "reason": "If the Demon has the Cult Leader ability, they can’t turn good due to this ability."
  },
  {
    "char1": "Boffin",
    "char2": "Drunk",
    "reason": "The Demon cannot have the Drunk ability."
  },
  {
    "char1": "Boffin",
    "char2": "Goon",
    "reason": "If the Demon has the Goon ability, they can’t turn good due to this ability."
  },
  {
    "char1": "boffin",
    "char2": "heretic",
    "reason": "The Demon cannot have the Heretic ability."
  },
  {
    "char1": "Boffin",
    "char2": "Ogre",
    "reason": "The Demon cannot have the Ogre ability."
  },
  {
    "char1": "Boffin",
    "char2": "Politician",
    "reason": "The Demon cannot have the Politician ability."
  },
  {
    "char1": "Boffin",
    "char2": "Village Idiot",
    "reason": "If there is a spare token, the Boffin can give the Demon the Village Idiot ability."
  },
  {
    "char1": "Cerenovus",
    "char2": "Goblin",
    "reason": "The Cerenovus may choose to make a player mad that they are the Goblin."
  },
  {
    "char1": "Marionette",
    "char2": "Balloonist",
    "reason": "If the Marionette thinks that they are the Balloonist, an Outsider might have been added during setup."
  },
  {
    "char1": "Marionette",
    "char2": "Huntsman",
    "reason": "If the Marionette thinks that they are the Huntsman, the Damsel was added during setup."
  },
  {
    "char1": "Marionette",
    "char2": "Kazali",
    "reason": "If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor."
  },
  {
    "char1": "Marionette",
    "char2": "Lil Monsta",
    "reason": "If there would be a Marionette in play, they enter play after the Demon & must start as their neighbor."
  },
  {
    "char1": "Mastermind",
    "char2": "Vigormortis",
    "reason": "A Mastermind that has their ability keeps it if the Vigormortis dies."
  },
  {
    "char1": "Pit-Hag",
    "char2": "Cult Leader",
    "reason": "If the Pit-Hag turns an evil player into the Cult Leader, they can't turn good due to their own ability."
  },
  {
    "char1": "Pit-Hag",
    "char2": "Damsel",
    "reason": "If a Pit-Hag creates a Damsel, the Storyteller chooses which player it is."
  },
  {
    "char1": "Pit-Hag",
    "char2": "Goon",
    "reason": "If the Pit-Hag turns an evil player into the Goon, they can't turn good due to their own ability."
  },
  {
    "char1": "Pit-Hag",
    "char2": "Ogre",
    "reason": "If the Pit-Hag turns an evil player into the Ogre, they can't turn good due to their own ability."
  },
  {
    "char1": "Pit-Hag",
    "char2": "Politician",
    "reason": "If the Pit-Hag turns an evil player into the Politician, they can't turn good due to their own ability."
  },
  {
    "char1": "Pit-Hag",
    "char2": "Village Idiot",
    "reason": "If there is a spare token, the Pit-Hag can create an extra Village Idiot. If so, the drunk Village Idiot might change."
  },
  {
    "char1": "Scarlet Woman",
    "char2": "Al-Hadikhia",
    "reason": "If there are two living Al-Hadikhias, the Scarlet Woman Al-Hadikhia becomes the Scarlet Woman again."
  },
  {
    "char1": "Scarlet Woman",
    "char2": "Fang Gu",
    "reason": "If the Fang Gu chooses an Outsider and dies, the Scarlet Woman does not become the Fang Gu."
  },
  {
    "char1": "Spy",
    "char2": "Damsel",
    "reason": "If the Spy is (or has been) in play, the Damsel is poisoned."
  },
  {
    "char1": "Spy",
    "char2": "Ogre",
    "reason": "The Spy registers as evil to the Ogre."
  },
  {
    "char1": "Spy",
    "char2": "Poppy Grower",
    "reason": "If the Poppy Grower is in play, the Spy does not see the Grimoire until the Poppy Grower dies."
  },
  {
    "char1": "Summoner",
    "char2": "Clockmaker",
    "reason": "If the Summoner is in play, the Clockmaker does not receive their information until a Demon is created."
  },
  {
    "char1": "Summoner",
    "char2": "Courtier",
    "reason": "If the Summoner is drunk on the 3rd night, the Summoner chooses which Demon, but the Storyteller chooses which player."
  },
  {
    "char1": "Summoner",
    "char2": "Engineer",
    "reason": "If the Engineer removes a Summoner from play before that Summoner uses their ability, the Summoner uses their ability immediately."
  },
  {
    "char1": "Summoner",
    "char2": "Hatter",
    "reason": "The Summoner cannot create an in-play Demon. If the Summoner creates a not-in-play Demon, deaths tonight are arbitrary."
  },
  {
    "char1": "Summoner",
    "char2": "Kazali",
    "reason": "The Summoner cannot create an in-play Demon. If the Summoner creates a not-in-play Demon, deaths tonight are arbitrary."
  },
  {
    "char1": "Summoner",
    "char2": "Legion",
    "reason": "If the Summoner creates Legion, most players (including all evil players) become evil Legion."
  },
  {
    "char1": "Summoner",
    "char2": "Lord of Typhon",
    "reason": "If the Summoner creates a Lord of Typhon, the Lord of Typhon must neighbor a Minion. The other neighbor becomes a not-in-play evil Minion."
  },
  {
    "char1": "Summoner",
    "char2": "Marionette",
    "reason": "The Marionette neighbors the Summoner. The Summoner knows who the Marionette is."
  },
  {
    "char1": "Summoner",
    "char2": "Pit-Hag",
    "reason": "The Summoner cannot create an in-play Demon. If the Summoner creates a not-in-play Demon, deaths tonight are arbitrary."
  },
  {
    "char1": "Summoner",
    "char2": "Poppy Grower",
    "reason": "If the Poppy Grower is alive when the Summoner acts, the Summoner chooses which Demon, but the Storyteller chooses which player."
  },
  {
    "char1": "Summoner",
    "char2": "Preacher",
    "reason": "If the Preacher chose the Summoner on or before the 3rd night, the Summoner chooses which Demon, but the Storyteller chooses which player."
  },
  {
    "char1": "Summoner",
    "char2": "Pukka",
    "reason": "The Summoner may choose a player to become the Pukka on the 2nd night."
  },
  {
    "char1": "Summoner",
    "char2": "Zombuul",
    "reason": "If the Summoner turns a dead player into the Zombuul, the Storyteller treats that player as a Zombuul that has died once."
  },
  {
    "char1": "Vizier",
    "char2": "Alsaahir",
    "reason": "If the Vizier is in play, the Alsaahir must also guess which Demon(s) are in play."
  },
  {
    "char1": "Vizier",
    "char2": "Courtier",
    "reason": "If the Vizier loses their ability, they learn this. If the Vizier is executed while they have their ability, their team wins."
  },
  {
    "char1": "Vizier",
    "char2": "Fearmonger",
    "reason": "The Vizier wakes with the Fearmonger, learns who they choose and cannot choose to immediately execute that player."
  },
  {
    "char1": "Vizier",
    "char2": "Investigator",
    "reason": "If the Investigator learns that the Vizier is in play, the existence of the Vizier is not announced by the Storyteller."
  },
  {
    "char1": "Vizier",
    "char2": "Politician",
    "reason": "The Politician might register as evil to the Vizier."
  },
  {
    "char1": "Vizier",
    "char2": "Preacher",
    "reason": "If the Vizier loses their ability, they learn this. If the Vizier is executed while they have their ability, their team wins."
  },
  {
    "char1": "Vizier",
    "char2": "Zealot",
    "reason": "The Zealot might register as evil to the Vizier."
  },
  {
    "char1": "Widow",
    "char2": "Damsel",
    "reason": "If the Widow is (or has been) in play, the Damsel is poisoned."
  },
  {
    "char1": "Widow",
    "char2": "Poppy Grower",
    "reason": "If the Poppy Grower is in play, the Widow does not see the Grimoire until the Poppy Grower dies."
  },
  {
    "char1": "Al-Hadikhia",
    "char2": "Princess",
    "reason": "If the Princess nominated & executed a player on their 1st day, no one dies to the Al-Hadikhia tonight."
  },
  {
    "char1": "Al-Hadikhia",
    "char2": "Mastermind",
    "reason": "If the Al-Hadikhia dies by execution, and the Mastermind is alive, the Al-Hadikhia chooses 3 good players tonight: if all 3 choose to live, evil wins. Otherwise, good wins."
  },
  {
    "char1": "Legion",
    "char2": "Engineer",
    "reason": "If Legion is created, all evil players become Legion. If Legion is in play, the Engineer starts knowing this but has no ability."
  },
  {
    "char1": "Legion",
    "char2": "Hatter",
    "reason": "If Legion is created, all evil players become Legion. If Legion is in play, the Hatter has no ability."
  },
  {
    "char1": "Legion",
    "char2": "Minstrel",
    "reason": "If Legion died by execution today, Legion keeps their ability, but the Minstrel might learn they are Legion."
  },
  {
    "char1": "Legion",
    "char2": "Politician",
    "reason": "The Politician might register as evil to Legion."
  },
  {
    "char1": "Legion",
    "char2": "Preacher",
    "reason": "If the Preacher chooses Legion, Legion keeps their ability, but the Preacher might learn they are Legion."
  },
  {
    "char1": "Legion",
    "char2": "Zealot",
    "reason": "The Zealot might register as evil to Legion."
  },
  {
    "char1": "Leviathan",
    "char2": "Banshee",
    "reason": "Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Banshee dies & gains their ability."
  },
  {
    "char1": "Leviathan",
    "char2": "Exorcist",
    "reason": "If the Leviathan nominates and executes the Exorcist-chosen player, good wins."
  },
  {
    "char1": "Leviathan",
    "char2": "Farmer",
    "reason": "Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Farmer uses their ability but does not die."
  },
  {
    "char1": "Leviathan",
    "char2": "Grandmother",
    "reason": "If the Leviathan is in play and the Grandchild dies by execution, evil wins."
  },
  {
    "char1": "Leviathan",
    "char2": "Hatter",
    "reason": "The Leviathan cannot enter play after day 5."
  },
  {
    "char1": "Leviathan",
    "char2": "Innkeeper",
    "reason": "If the Leviathan nominates and executes an Innkeeper-protected player, good wins."
  },
  {
    "char1": "Leviathan",
    "char2": "King",
    "reason": "If the Leviathan is in play, and at least 1 player is dead, the King learns an alive character each night."
  },
  {
    "char1": "Leviathan",
    "char2": "Mayor",
    "reason": "If the Leviathan and the Mayor are alive on day 5 & no execution occurs, good wins."
  },
  {
    "char1": "Leviathan",
    "char2": "Monk",
    "reason": "If the Leviathan nominates and executes the Monk-protected player, good wins."
  },
  {
    "char1": "Leviathan",
    "char2": "Pit-Hag",
    "reason": "The Leviathan cannot enter play after day 5."
  },
  {
    "char1": "Leviathan",
    "char2": "Ravenkeeper",
    "reason": "Each night*, the Leviathan chooses an alive player (different to previous nights): a chosen Ravenkeeper uses their ability but does not die."
  },
  {
    "char1": "Leviathan",
    "char2": "Sage",
    "reason": "Each night*, the Leviathan chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die."
  },
  {
    "char1": "Leviathan",
    "char2": "Soldier",
    "reason": "If the Leviathan nominates and executes the Soldier, good wins."
  },
  {
    "char1": "Lil Monsta",
    "char2": "Hatter",
    "reason": "If the Hatter dies & the Demon chooses Lil Monsta, they also choose a Minion to become."
  },
  {
    "char1": "Lil Monsta",
    "char2": "Poppy Grower",
    "reason": "If Lil Monsta & the Poppy Grower are alive, Minions wake one by one, until one of them chooses to take the Lil Monsta token."
  },
  {
    "char1": "Lil Monsta",
    "char2": "Psychopath",
    "reason": "If the Psychopath is babysitting Lil Monsta, they die when executed."
  },
  {
    "char1": "Lil Monsta",
    "char2": "Magician",
    "reason": "If the Magician is alive, the Storyteller chooses which Minion babysits Lil Monsta."
  },
  {
    "char1": "Lil Monsta",
    "char2": "Scarlet Woman",
    "reason": "If Lil Monsta dies with 5 or more players alive, the Scarlet Woman babysits Lil Monsta for the rest of the game."
  },
  {
    "char1": "Lil Monsta",
    "char2": "Vizier",
    "reason": "If the Vizier is babysitting Lil Monsta, they die when executed."
  },
  {
    "char1": "Lleech",
    "char2": "Mastermind",
    "reason": "If the Mastermind is alive and the Lleech host dies by execution, the Lleech lives but loses their ability."
  },
  {
    "char1": "Lleech",
    "char2": "Slayer",
    "reason": "If the Slayer slays the Lleech host, the host dies."
  },
  {
    "char1": "Riot",
    "char2": "Banshee",
    "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Banshee dies & gains their ability."
  },
  {
    "char1": "Riot",
    "char2": "Exorcist",
    "reason": "If the Exorcist chooses Riot on the 3rd night, Minions do not become Riot."
  },
  {
    "char1": "Riot",
    "char2": "Farmer",
    "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Farmer uses their ability but does not die."
  },
  {
    "char1": "Riot",
    "char2": "Grandmother",
    "reason": "If Riot is in play and the Grandchild dies during the day, the Grandmother dies too."
  },
  {
    "char1": "Riot",
    "char2": "Innkeeper",
    "reason": "If Riot is in play, the Innkeeper-protected player is safe from all evil abilities."
  },
  {
    "char1": "Riot",
    "char2": "King",
    "reason": "If Riot is in play, and at least 1 player is dead, the King learns an alive character each night."
  },
  {
    "char1": "Riot",
    "char2": "Mayor",
    "reason": "The Mayor may choose to stop nominations. If they do so when only 1 Riot is alive, good wins. Otherwise, evil wins."
  },
  {
    "char1": "Riot",
    "char2": "Monk",
    "reason": "If Riot is in play, the Monk-protected player is safe from all evil abilities."
  },
  {
    "char1": "Riot",
    "char2": "Ravenkeeper",
    "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Ravenkeeper uses their ability but does not die."
  },
  {
    "char1": "Riot",
    "char2": "Sage",
    "reason": "Each night*, Riot chooses an alive good player (different to previous nights): a chosen Sage uses their ability but does not die."
  },
  {
    "char1": "Riot",
    "char2": "Soldier",
    "reason": "If Riot is in play, the Soldier is safe from all evil abilities."
  },
  {
    "char1": "Vortox",
    "char2": "Banshee",
    "reason": "If the Vortox is in play and the Demon kills the Banshee, the players still learn that the Banshee has died."
  },
  {
    "char1": "Yaggababble",
    "char2": "Exorcist",
    "reason": "If the Exorcist chooses the Yaggababble, the Yaggababble ability does not kill tonight."
  }
  ]

  nightOrderData:{
    order:number,
    firstNight: string,
    otherNights: string
    }[]=[
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

