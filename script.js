
//CARD VARIABLES
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
let values = ['Ace', 'King', 'Queen', 'Jack', 'Ten', 'Nine', 'Eight', 'Seven', 'Six', 'Five', 'Four', 'Three', 
'Two' ];

//DOM VARIABLES
let textArea = document.getElementById('text-area');
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');

//GAME VARIABLES
let gameStarted = false;
let gameOver = false;
let playerWon = false;
let dealerCards = [];
let playerCards = [];
let dealerScore = 0;
let playerScore = 0;
let deck = [];

hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();


newGameButton.addEventListener('click', function(){
    gameStarted = true;
    gameOver = false;
    playerWon = false; 

    deck = createDeck();//CREATES THE DEC
    shuffleDeck(deck);
    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    showStatus();
});


hitButton.addEventListener('click', function(){
    playerCards.push(getNextCard());
    checkForEndOfGame(); //checks if player went over the point limit
    showStatus();
});

stayButton.addEventListener('click', function(){
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});



function createDeck(){
    let deck = [] //initializes the array
    for (let suitIdx=0; suitIdx<suits.length; suitIdx++){
        for (let valueIdx = 0; valueIdx<values.length;valueIdx++){
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push(card);
        }
    }
    return deck
}

//function to shuffle the dec
function shuffleDeck(deck){
    for (let i = 0; i<deck.length; i++){ //loops thru every card in deck
        let swapIdx = Math.trunc(Math.random() * deck.length); //takes first card in deck and swaps it
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
    }
}



function getCardString(card){
    return card.value + ' of ' + card.suit;
}


function getNextCard(){
    return deck.shift();
}


function getCardNumericValue(card){
    switch(card.value){
        case 'Ace':
        return 1;
        case 'Two':
        return 2;
        case 'Three':
        return 3;
        case 'Four':
        return 4;
        case 'Five':
        return 5;
        case 'Six':
        return 6;
        case 'Seven':
        return 7;
        case 'Eight':
        return 8;
        case 'Nine':
        return 9;
        default:
        return 10;
    }
}







function getScore(cardArray){ //array of cards is passed
    let score = 0;
    let hasAce = false;
    for (let i = 0; i<cardArray.length; i++){ //loops thru all the cards....
        let card = cardArray[i]; 
        score += getCardNumericValue(card);
        if(card.value == 'Ace'){
            hasAce = true;
        }
    }
    if(hasAce && score + 10 <= 21){ //if this is true then 10 is added to the score
        return score + 10;
    }
    return score;
}


function updateScores(){
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}


function showStatus(){
    if(!gameStarted){
        textArea.innerText = 'Welcome to Crazy Blackjack!';
        return;
    }

    for (var i = 0; i<deck.length; i++){
        textArea.innerText += '\n' + getCardString(deck[i]);
    }


    let dealerCardString = '';
    for(let i = 0; i< dealerCards.length; i++){ //loop thru dealers cards, 
        dealerCardString += getCardString(dealerCards[i]) + '\n'; //for each card we append the string version of the character
    }

    let playerCardString = '';
    for(let i = 0; i< playerCards.length; i++){ //same
        playerCardString += getCardString(playerCards[i]) + '\n'; //same
    }

    updateScores();

    textArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    '(score: ' +dealerScore + ')\n\n' +

    'Player has:\n' +
    playerCardString +
    '(score: ' +playerScore + ')\n\n' ;

    if(gameOver){
        if(playerWon){
            textArea.innerText += "YOU HAVE WON";
        }
        else{
            textArea.innerText += "DEALER HAS WON";
        }
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}   



function checkForEndOfGame(){
    updateScores();

    if(gameOver){
        //allows dealer to keep feeding cards as long as conditions are met
        while(dealerScore < playerScore
        && playerScore <=21
        && dealerScore <=21){
            dealerCards.push(getNextCard());
            updateScores();
        }
    }

if (playerScore>21){ //player loses
    playerWon = false;
    gameOver = true;
}
else if (dealerScore>21){
    playerWon = true;//
    gameOver = true;
}
else if (gameOver){
    if(playerScore > dealerScore){
        playerWon = true;  //player wins
    }
    else{
        playerWon = false;
        }   
    }
}