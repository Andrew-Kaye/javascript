const { sumOf } = require('./score.js');

class Computerplayer {
    constructor()
    {
            this.name = "";
            this.rerolls = 3;
            this.scoreSheet = {
                aces:   {isScored: false, score: 0},
                twos:   {isScored: false, score: 0},
                threes: {isScored: false, score: 0},
                fours:  {isScored: false, score: 0},
                fives:  {isScored: false, score: 0},
                sixes:  {isScored: false, score: 0},
                three_of_a_kind: {isScored: false, score: 0},
                four_of_a_kind:  {isScored: false, score: 0},
                full_house:      {isScored: false, score: 0},
                small_straight: {isScored: false, score: 0},
                large_straight: {isScored: false, score: 0},
                yahtzee: {isScored: false, score: 0},
                chance: {isScored: false, score: 0}
            };
            this.human = false;
            //this.level = 0;
        }
       // setLevel(level){
        //    this.level = level;
        //}
        
        setRerolls(rerolls){
            this.rerolls = rerolls;
        }
        setName(name) {
            this.name = name;
        }
        setScoresheet(scoreSheet){
            this.scoreSheet = scoreSheet;
        }
        getName(){
            return this.name;
        }
        getTotalScore(){
            return this.total;
        }
        getScoresheet() {
            return this.scoreSheet;
        }
        getRerolls(){
            return this.rerolls;
        }
        //getLevel(){
           // return this.level;
      //  }
        getHuman(){
            return this.human;
        }
    }

function createCompPlayers(numCompPlayers){
    let comps = [];
    const names = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'];
    for (let i = 0; i < numCompPlayers; i++) {   
        let comp = new Computerplayer();
        console.log(comp.getScoresheet());
        let randomIndex = Math.floor(Math.random() * names.length);
        let randomName = names[randomIndex];
        comp.setName(randomName);
        names.splice(randomIndex, 1);
        comp.rerolls = comp.setRerolls(3);
        comp.scoreSheet = comp.getScoresheet();
        comp.human = comp.getHuman();
        let randomLevel = Math.floor(Math.random() * 3);
        //comp.level = comp.setLevel(randomLevel);
        comps.push(comp);
    }
    return comps;
}

function rerollDice(dice, currentPlayer){
    let originalDice = dice;
    let rerollDice = [];

    // Determine which dice to reroll based on the currentPlayer's strategy
    // Reroll the dice with the lowest values
    let sortedDice = dice.slice().sort((a, b) => a - b);
    let rerollCount = Math.min(currentPlayer.getRerolls(), sortedDice.length);
    rerollDice = sortedDice.slice(0, rerollCount);

    // Calculate the expected value of rerolling
    let expectedValue = 0;
    for (let i = 0; i < rerollDice.length; i++) {
        let reroll = Math.floor(Math.random() * 6) + 1;
        expectedValue += reroll;
     }
    expectedValue /= rerollDice.length;

  // Reroll the selected dice if the expected value is positive
  if (expectedValue > sumOf(dice, 'choice')) {
    for (let i = 0; i < rerollDice.length; i++) {
      rerollDice[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
      
        // Reroll the selected dice
        for (let i = 0; i < rerollDice.length; i++) {
          rerollDice[i] = Math.floor(Math.random() * 6) + 1;
        }
    
        // Replace the indices of the original dice array with the rerolled dice
        for (let i = 0; i < rerollDice.length; i++) {
            let index = originalDice.indexOf(sortedDice[i]);
            originalDice[index] = rerollDice[i];
        }

        // Return the updated originalDice array
        return originalDice;
}

module.exports = {
    createCompPlayers,
    rerollDice
}; 
