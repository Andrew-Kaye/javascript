const readline = require('readline-sync');

class Player {
    constructor() {
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
        this.human = true;
    }
    
    setRerolls(rerolls){
        this.rerolls = rerolls;
    }
    setName(name) {
        this.name = name;
    }
    setScoresheet(scoreSheet){
        this.scoreSheet = scoreSheet;
    }
    setTotalScore(total){
        this.total = total;
    }
    getName(){
        return this.name;
    }
    getScoresheet() {
        return this.scoreSheet;
    }
    getRerolls(){
        return this.rerolls;
    }
    getTotalScore(){
        return this.total;
    }
    getHuman(){
        return this.human;
    }
}

function createPlayers(numPlayers){
    let players = [];
    for (let i = 0; i < numPlayers; i++) {
        let player = new Player();
        player.setName(readline.question('Please enter your name. \n'));
        player.rerolls = player.setRerolls(3);
        player.scoreSheet = player.getScoresheet();
        players.push(player);
    }
    return players;
}

module.exports = {
    Player,
    createPlayers
};