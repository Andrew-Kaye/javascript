const readline  = require('readline-sync');
const fs = require('fs');
const { createPlayers }  = require('./player.js'); 
const { createCompPlayers }  = require('./computer_player.js'); 
const { compScore } = require('./score.js');
const { score } =  require('./score.js'); 
const { calcBonusScore } =  require('./score.js'); 
const { calcTotalScore } = require('./score.js');
const { rerollDice } = require('./computer_player.js'); 


function rules(){
    fs.readFile('rules.txt', (err, data) => {
        if(err) throw err;
        console.log(data.toString());
    });
}

function startGame(){
    console.log(`Welcome to Yahtzee!`);
    //rules();
    console.log(`------------------`);

    
    let numPlayers = readline.question('How many players are there? \n');
    while(isNaN(numPlayers)){
        console.log(`Sorry, you must enter a number.`);
        numPlayers = readline.question('How many players are there? \n');
    }
    let numCompPlayers = readline.question('How many computer players would you like to play against? \n');
    while(isNaN(numCompPlayers)){
        console.log(`Sorry, you must enter a number.`);
        numCompPlayers = readline.question('How many computer players would you like to play against? \n');
    }

    numPlayers = parseInt(numPlayers);
    numCompPlayers = parseInt(numCompPlayers);
    
    /*while(numPlayers + numCompPlayers > 5){
        console.log(`Sorry, you can't have more than 5 players.`);
        numPlayers = parseInt(readline.question('How many players are there? \n'));
        numCompPlayers = parseInt(readline.question('How many computer players would you like to play against?\n'));
    }*/
    let players = createPlayers(numPlayers);
    let compPlayers = createCompPlayers(numCompPlayers);
    let allPlayers = players.concat(compPlayers);
    for(let i = 0; i <= 12; i++){
        let hasWon = turn(allPlayers);
        console.log(hasWon);
        if(hasWon === true){
            gameEnd(allPlayers);
            break;
        }
    }
    //} while(winCondition === false && allPlayers.length !== 0);
}

startGame();

function turn(players) {
    for (let i = 0; i < players.length; i++) {
        // Set the current player index
        let currentPlayerIndex = i;
      
        // Get the current player
        let currentPlayer = players[currentPlayerIndex];
    console.log(`\n\n ${currentPlayer.getName()}'s turn`);
    console.log(`---------------`);
    let dice = rollDice();
    console.log(dice);
    if(currentPlayer.getHuman() === false){
        let reroll = false;
        while (currentPlayer.getRerolls() > 0) {
            reroll = true;
            console.log(`Rerolling...`);
            dice = rerollDice(dice, currentPlayer);
            console.log(dice);
          currentPlayer.setRerolls(currentPlayer.getRerolls() - 1);
        }
        compScore(dice, currentPlayer);
        currentPlayer.setRerolls(3);
    }
    else{
        let answer = readline.question('Would you like to reroll? (yes/no) ');
        while(answer === `yes` && currentPlayer.getRerolls() !== 0){
            const input = readline.question('Enter indices of dice to reroll (comma-separated) from 0 to 4: ');
            const indices = input.split(',').map(index => parseInt(index.trim()));
            if (!Array.isArray(indices)) {
              indices = [indices];
            }
            for(let i = 0; i < indices.length; i++){
              const index = indices[i];
              dice[index] = Math.floor(Math.random() * (6 - 1 + 1) + 1);
            }

            currentPlayer.setRerolls(currentPlayer.getRerolls() - 1);
            console.log(dice);
            console.log(`You have ${currentPlayer.getRerolls()} rerolls left`);
            if(currentPlayer.getRerolls() > 0){ // check if rerolls > 0 before asking
                answer = readline.question('Would you like to reroll? (yes/no) ');
            } else {
                console.log(dice);
                break; // exit the loop if rerolls == 0
            }
        }
        score(currentPlayer, dice);
        currentPlayer.setRerolls(3);
    }
    let result = isScoresheetFull(currentPlayer.getScoresheet());
    //console.log(result);
    return result;
    }
}


function isScoresheetFull(scoresheet) {
    // Check if all areas on the scoresheet have been scored
    for (let category in scoresheet) {
      if (!scoresheet[category].isScored) {
        return false;
      }
    }
    return true;
}

function findWinner(players){
    let highestScore = 0;
    let winner = null;
    for (let i = 0; i < players.length; i++) {
        let scoreSheet = players[i].getScoresheet();
        
        let totalScore = calcTotalScore(scoreSheet);

        scoreSheet.total = {isScored: true, score: totalScore};
        console.log(`\n\n${players[i].getName()}'s scoresheet: ${JSON.stringify(players[i].getScoresheet(), null, 2)}\n\n`);

        if (totalScore > highestScore) {
            highestScore = totalScore;
            winner = players[i];
        }
    }

    if (winner) {
        console.log(`\n\nThe winner is ${winner.getName()} with a score of ${highestScore}!\n\n`);
    } else {
        console.log(`No winners yet`);
    }

    return winner;
}

function gameEnd(players){
    let winCondition = false;
    if (players) {
        const winner = findWinner(players);
        winCondition = (winner !== null);
    }
    return winCondition;
}

function rollDice(){
    return Array.from({length: 5}, () => Math.floor(Math.random() * (6 - 1 + 1) + 1));
}
