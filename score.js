const readline = require('readline-sync');

function updateScoresheet(scoreSheet, scoreType, newScore) {
    //console.log(scoreType);
    if (scoreSheet[scoreType]) {
        scoreSheet[scoreType].score += newScore;
        scoreSheet[scoreType].isScored = true;
      }
      else {
        console.log("Invalid score type.");
    }
    return scoreSheet;
}

function checkDice(dice){
    const counts = {};
    for(const num of dice){
        counts[num] = (counts[num] || 0) + 1;
    }
    const values = Object.values(counts);
    return values;
}

function scoreXofAKind(dice, kind){
    let sum = 0;
    const counts = {};
    for(const num of dice){
        counts[num] = (counts[num] || 0) + 1;
    }
    for(const num in counts){
        if(counts[num] >= kind)
        {
            sum += parseInt(num) * kind;
        }
    }
    return sum;
}

function sumRemaining(dice, excludedValue) {
    return dice.filter(die => die !== excludedValue).reduce((acc, curr) => acc + curr, 0);
}

/*function shouldScoreCategory(dice, scoreType) {
    const counts = checkDice(dice);
    //console.log(counts);
    switch(scoreType) {
        case 'four_of_a_kind':
            return counts.includes(4);
        case 'full_house':
            return counts.includes(3) && counts.includes(2);
        case 'small_straight':
            return counts.includes(1) && counts.includes(2) && counts.includes(3) && counts.includes(4) && counts.includes(5);
        case 'large_straight':
            return counts.includes(2) && counts.includes(3) && counts.includes(4) && counts.includes(5) && counts.includes(6);
        case 'yacht':
            return counts.every(count => count === 5);
        default:
            return true;
    }
}*/

function sumOf(dice, scoreType){
    let counts = checkDice(dice);
    let score = 0;
    switch(scoreType){
        case 'aces':
            score = dice.filter(element => element === 1).reduce((acc, curr) => acc + curr, 0); 
            break;            
        case 'twos':
            score = dice.filter(element => element === 2).reduce((acc, curr) => acc + curr, 0);
            break;  
        case 'threes':
            score = dice.filter(element => element === 3).reduce((acc, curr) => acc + curr, 0); 
        case 'fours':
            score = dice.filter(element => element === 4).reduce((acc, curr) => acc + curr, 0);
            break;  
        case 'fives':
            score = dice.filter(element => element === 5).reduce((acc, curr) => acc + curr, 0);
            break;  
        case 'sixes':
            score = dice.filter(element => element === 6).reduce((acc, curr) => acc + curr, 0);
            break;  
        case 'three_of_a_kind':
            score =  (scoreXofAKind(dice, 4) > 0) ? (scoreXofAKind(dice, 3) + sumRemaining(dice, 3)): 0;
            break;  
        case 'four_of_a_kind':
            score =  (scoreXofAKind(dice, 4) > 0) ? (scoreXofAKind(dice, 4) + sumRemaining(dice, 4)): 0;
            break;  
        case 'full_house':
            score = (scoreXofAKind(dice, 3) > 0 && scoreXofAKind(dice, 2) > 0) ? (scoreXofAKind(dice, 3) + scoreXofAKind(dice, 2)) : 0;
            break;  
        case 'small_straight':
            score =  (counts[1] && counts[2] && counts[3] && counts[4] && counts[5] && counts[6] < 2) ? 30 : 0;
            break;  
        case 'large_straight':
            score =  (counts[1] < 2 && counts[2] && counts[3] && counts[4] && counts[5] && counts[6] < 2) ? 40 : 0;
            break;  
        case 'yahtzee':
            //yahtzeeCount++;
            score = (counts.every(count => count === 5)) ? 50 : 0;
            break;
        case 'chance':
            score = dice.reduce((acc, curr) => acc + curr, 0);
            break;  
        /*case 'bonus_yahtzee':
            score = (yahtzeeCount > 1) ? 100 * (yahtzeeCount - 1) : 0;
            break;*/
    }
    console.log(score);
    return score;
}

function calcBonusScore(scoreSheet){
    const upperSectionScores = [
        scoreSheet.aces.score,
        scoreSheet.twos.score,
        scoreSheet.threes.score,
        scoreSheet.fours.score,
        scoreSheet.fives.score,
        scoreSheet.sixes.score
      ];
      
      let upperSectionTotal = 0;
      upperSectionScores.forEach((score) => {
        upperSectionTotal += score;
      });
      
      const bonusScore = upperSectionTotal >= 63 ? 35 : 0;
      scoreSheet.bonus = {isScored: true, score: bonusScore};
}

function calcTotalScore(scoreSheet){
    let totalScore = 0;
    calcBonusScore(scoreSheet);
    for (let category in scoreSheet) {
        totalScore += scoreSheet[category].score;
    }
    return totalScore;
}

function filterUnscoredCategories(scoreSheet){
    const unscoredCategories = new Set(Object.keys(scoreSheet));
    for (const category of Object.keys(scoreSheet)) {
      if (scoreSheet[category].isScored) {
        unscoredCategories.delete(category);
      }
    }
    return unscoredCategories;
}

function score(currentPlayer, dice){
    const scoreCategories = {
        aces: {desc: 'Total of Aces only'},
        twos: {desc: 'Total of twos only'},
        threes: {desc: 'Total of threes only'},
        fours: {desc: 'Total of fours only'},
        fives: {desc: 'Total of fives only'},
        sixes: { desc: 'Total of sixes only' },
        three_of_a_kind: { desc: 'Total of the three dice that have the same value' },
        four_of_a_kind: { desc: 'Total of Aces only' },
        full_house: { desc: 'three of a kind plus a pair' },
        small_straight: { desc: 'four of the dice have consecutive values' },
        large_straight: { desc: 'all five dice have consecutive values' },
        yahtzee: { desc: 'all five dice have the same value' },
        chance: { desc: 'Total of all dice' },
    };
    
    //console.log(`Scored Categories: ${scoredCategories} \n\n\n`);
    let availableCategories = filterUnscoredCategories(currentPlayer.getScoresheet());
    let allCategories = new Set(Object.keys(scoreCategories));
    let newScore = 0;
    // Display available categories
    console.log('Available Categories:\n');
    for (const category of availableCategories){
        if (allCategories.has(category)) {
            console.log(`${category}`);
        }
    }
    do {
        scoreType = readline.question('\nWhat would you like to score? \n');
        if (!availableCategories.has(scoreType)) {
            console.log(`${scoreType} is not a valid category. Please try again.`);
        }
        else{
            console.log(`You have chosen to score ${scoreType}`);
        }
    } while (!availableCategories.has(scoreType));
        availableCategories.delete(scoreType);
        newScore = parseInt(sumOf(dice, scoreType));
        console.log(`\nYour score for ${scoreType} is ${newScore}`);
        //console.log(players[currentPlayerIndex]);
        let scoreSheet = currentPlayer.getScoresheet();
        //console.log(scoreSheet);
        let newScoresheet = updateScoresheet(scoreSheet, scoreType, newScore);
        currentPlayer.setScoresheet(newScoresheet);
        //console.log(`${currentPlayer.getName()}'s scoresheet: ${JSON.stringify(currentPlayer.getScoresheet(), null, 2)} \n\n\n`);
}

function compScore(dice, currentPlayer){
    // Initialize variables to keep track of the best score type and value
 let bestScoreType = '';
 let bestScoreValue = 0;
 const scoreCategories = {
   aces: {desc: 'Total of Aces only'},
   twos: {desc: 'Total of twos only'},
   threes: {desc: 'Total of threes only'},
   fours: {desc: 'Total of fours only'},
   fives: {desc: 'Total of fives only'},
   sixes: { desc: 'Total of sixes only' },
   three_of_a_kind: { desc: 'Total of the three dice that have the same value' },
   four_of_a_kind: { desc: 'Total of the four dice that have the same value' },
   full_house: { desc: 'three of a kind plus a pair' },
   small_straight: { desc: 'four of the dice have consecutive values' },
   large_straight: { desc: 'all five dice have consecutive values' },
   yahtzee: { desc: 'all five dice have the same value' },
   chance: { desc: 'Total of all dice' }
};
   let availableCategories = filterUnscoredCategories(currentPlayer.getScoresheet());
   let allCategories = new Set(Object.keys(scoreCategories));
        // Initialize an array to keep track of the score types with a score of 0
        let zeroScoreTypes = [];
        // Iterate through all possible score types
        for (let scoreType of availableCategories) {
            if (availableCategories.has(scoreType) && allCategories.has(scoreType)) {
                // Calculate the score for the current score type
                //console.log(`${scoreType}`);
                let scoreValue = parseInt(sumOf(dice, scoreType));
                //console.log(scoreValue);
        
            // If the score value is higher than the current best score value, update the best score type and value
                if (scoreValue > bestScoreValue) {
                    bestScoreType = scoreType;
                    bestScoreValue = scoreValue;
                    //console.log(bestScoreType);
                    //console.log(bestScoreValue);
                }
                // If the score value is 0, add the score type to zeroScoreTypes
                else if(scoreValue === 0) {
                  zeroScoreTypes.push(scoreType);
                }
             }
        }
        if (zeroScoreTypes.length > 1) {
            bestScoreType = zeroScoreTypes[Math.floor(Math.random() * zeroScoreTypes.length)];
          }

        //console.log(bestScoreType);
        console.log(`${currentPlayer.getName()} chose to score ${bestScoreType}`);
        let newScoresheet = updateScoresheet(currentPlayer.getScoresheet(), bestScoreType, bestScoreValue);
        currentPlayer.setScoresheet(newScoresheet);
        console.log(`${currentPlayer.getName()}'s score for ${bestScoreType} is ${bestScoreValue}`);
        console.log(`${currentPlayer.getName()}'s scoresheet: ${JSON.stringify(currentPlayer.getScoresheet(), null, 2)}`);
        availableCategories.delete(bestScoreType);
}

module.exports = {
    sumOf: sumOf,
    score: score,
    compScore: compScore,
    calcTotalScore: calcTotalScore,
    calcBonusScore: calcBonusScore,
    updateScoresheet: updateScoresheet,
    filterUnscoredCategories: filterUnscoredCategories
};