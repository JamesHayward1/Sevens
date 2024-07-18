// setup
"use strict";	
p5.disableFriendlyErrors = true;

// global variables
let width;
let height;
let cardFont;
let cardSelect = false;
let nextMove = null;

let gameCards = [];
let tempCards = [];
let playerCards = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60)
  height = 0.95 * windowHeight
  width = 0.95 * windowWidth
  strokeWeight(height * 0.01)

  // create game cards
  populateCardGrid()
}

function preload() {
  cardFont = loadFont("Fonts/cardFont.TTF")
}

function windowResized() {
  // adjusts the canvas to fill the window
  createCanvas(windowWidth, windowHeight);
  height = 0.95 * windowHeight
  width = 0.95 * windowWidth
  strokeWeight(height * 0.01)

  // repositions game cards
  for (let j = 0; j < 2; j++) {
    let identifier;
    for (let i = 0; i < 52; i++) {
      if (j == 0) {
        identifier = gameCards[i]
      } else if (j == 1) {
        identifier = tempCards[i]
      }
      let xNum = (windowWidth / 2) - (3/2) * ((height * 0.06) + (height * 0.04))
      let yNum;
      let adjustedI = i;
      if (i >= 13 && i < 26) {
        adjustedI-= 13
        xNum = (windowWidth / 2) - (1/2) * ((height * 0.06) + (height * 0.04))
      } else if (i >= 26 && i < 39) {
        adjustedI-= 26
        xNum = (windowWidth / 2) + (1/2) * ((height * 0.06) + (height * 0.04))
      } else if (i >= 39) {
        adjustedI-= 39
        xNum = (windowWidth / 2) + (3/2) * ((height * 0.06) + (height * 0.04))
      }
      let temp = 11/2
      temp = temp - adjustedI
      yNum = (windowHeight / 2) - (temp * ((height * 0.04) + (height * 0.02))) + (height * 0.05)
      identifier.x = xNum
      identifier.y = yNum
    }
  }
}

function draw() {
  // drawing table
  strokeWeight(height * 0.01)
  textFont(cardFont)
  background(102, 53, 41);
  rectMode(CENTER)
  if (cardSelect) {
    fill(40, 69, 129)
  } else {
    fill(83, 128, 42)
  }
  rect(windowWidth / 2, windowHeight / 2, width, height, 50)
  fill(0, 0, 0)

  drawGameCards()
  drawButtons()
  calculateNextMove()
}

function populateCardGrid() {
  // creates the objects for the game cards
  for (let i = 0; i < 4; i++) {
    let suit;
    let xNum;
    let yNum;
    if (i == 0) {
      suit  = "DIAMONDS"
      xNum = (windowWidth / 2) - (3/2) * ((height * 0.06) + (height * 0.04))
    } else if (i == 1) {
      suit = "SPADES"
      xNum = (windowWidth / 2) - (1/2) * ((height * 0.06) + (height * 0.04))
    } else if (i == 2) {
      suit = "HEARTS"
      xNum = (windowWidth / 2) + (1/2) * ((height * 0.06) + (height * 0.04))
    } else if (i == 3) {
      suit = "CLUBS"
      xNum = (windowWidth / 2) + (3/2) * ((height * 0.06) + (height * 0.04))
    }
    let temp = 11/2
    for (let j = 0; j < 13; j++) {
      yNum = (windowHeight / 2) - (temp * ((height * 0.04) + (height * 0.02))) + (height * 0.05)
      temp--
      let cardID;
      if (j == 0) {
        cardID = "A"
      } else if (j == 1) {
        cardID = "K"
      } else if (j == 2) {
        cardID = "Q"
      } else if (j == 3) {
        cardID = "J"
      } else {
        cardID = 14 - j
      }
      let index = (i * 13) + j
      gameCards.push(new card(xNum, yNum, suit, cardID, index))
      tempCards.push(new card(xNum, yNum, suit, cardID, index))
    }
  }
}

function drawGameCards() {
  for (let i = 0; i < gameCards.length; i++) {
    if (!cardSelect) {
      let identifier = gameCards[i]
      identifier.show()
    } else if (cardSelect) {
      let identifier = tempCards[i]
      identifier.show()
    }
  }

  for (let i = 0; i < 4; i++) {
    let yNum = (windowHeight / 2) - (13/2 * ((height * 0.04) + (height * 0.02))) + (height * 0.05)
    let xNum;
    let suitText;
    if (i == 0) {
      suitText = "♦"
      xNum = (windowWidth / 2) - (3/2) * ((height * 0.06) + (height * 0.04))
    } else if (i == 1) {
      suitText = "♠"
      xNum = (windowWidth / 2) - (1/2) * ((height * 0.06) + (height * 0.04))
    } else if (i == 2) {
      suitText = "♥"
      xNum = (windowWidth / 2) + (1/2) * ((height * 0.06) + (height * 0.04))
    } else if (i == 3) {
      suitText = "♣"
      xNum = (windowWidth / 2) + (3/2) * ((height * 0.06) + (height * 0.04))
    }
    textSize(height * 0.04)
    text(suitText, xNum, yNum)
  }
}

function touchStarted() {
  // changing in and out of card select mode
  if (!cardSelect) {
    if (mouseX > (windowWidth / 2) - (height * 0.1) - (height * 0.08) && mouseX < (windowWidth / 2) - (height * 0.1) + (height * 0.08) && mouseY > (height * 0.11) - (height * 0.03) && mouseY < (height * 0.11) + (height * 0.03)) {
      cardSelect = true
    }
  } else if (cardSelect) {
    if (mouseX > (windowWidth / 2) - (height * 0.08) && mouseX < (windowWidth / 2) + (height * 0.08) && mouseY > (height * 0.11) - (height * 0.03) && mouseY < (height * 0.11) + (height * 0.03)) {
      cardSelect = false
    }
  }

  if (!cardSelect) {
    // selecting game cards
    let cardHeight = height * 0.06
    let cardWidth = height * 0.04
    let diamondsPlayed = false;
    let spadesPlayed = false;
    let heartsPlayed = false;
    let clubsPlayed = false;
    let cardsPlayed = false;
    let diamondsSeven = false;
    let spadesSeven = false;
    let heartsSeven = false;
    let clubsSeven = false;
    if (gameCards[7].selected == true && gameCards[6].selected == false && gameCards[8].selected == false) {
      diamondsSeven = true
    }
    if (gameCards[20].selected == true && gameCards[19].selected == false && gameCards[21].selected == false) {
      spadesSeven = true
    }
    if (gameCards[33].selected == true && gameCards[32].selected == false && gameCards[34].selected == false) {
      heartsSeven = true
    }
    if (gameCards[46].selected == true && gameCards[45].selected == false && gameCards[47].selected == false) {
      clubsSeven = true 
    }
    for (let a = 0; a < 13; a++) {
      if (gameCards[a].selected == true) {
        diamondsPlayed = true
      }
    }
    for (let b = 13; b < 26; b++) {
      if (gameCards[b].selected == true) {
        spadesPlayed = true
      }
    }
    for (let c = 26; c < 39; c++) {
      if (gameCards[c].selected == true) {
        heartsPlayed = true
      }
    }
    for (let d = 39; d < 52; d++) {
      if (gameCards[d].selected == true) {
        clubsPlayed = true
      }
    }
    if (diamondsPlayed == true || spadesPlayed == true || heartsPlayed == true || clubsPlayed == true) {
      cardsPlayed = true
    }
    for (let i = 0; i < 52; i++) {
      let identifier = gameCards[i]
      if (mouseX > identifier.x - (cardWidth / 2) && mouseX < identifier.x + (cardWidth / 2) && mouseY > identifier.y - (cardHeight / 2) && mouseY < identifier.y + (cardHeight / 2)) {
        if (identifier.selected == true) {
          // deselecting
          if (identifier.suit == "DIAMONDS") {
            if (i == 7) {
              if (diamondsSeven && !heartsPlayed && !spadesPlayed && !clubsPlayed) {
                identifier.selected = false
              } 
            } else if (i < 7) {
              if (gameCards[i - 1].selected == false) {
                identifier.selected = false
              }
            } else {
              if (gameCards[i + 1].selected == false) {
                identifier.selected = false
              }
            }
          } else if (identifier.suit == "SPADES") {
            if (i == 20) {
              if (spadesSeven) {
                identifier.selected = false
              } 
            } else if (i < 20) {
              if (gameCards[i - 1].selected == false) {
                identifier.selected = false
              }
            } else {
              if (gameCards[i + 1].selected == false) {
                identifier.selected = false
              }
            }
          } else if (identifier.suit == "HEARTS") {
            if (i == 33) {
              if (heartsSeven) {
                identifier.selected = false
              } 
            } else if (i < 33) {
              if (gameCards[i - 1].selected == false) {
                identifier.selected = false
              }
            } else {
              if (gameCards[i + 1].selected == false) {
                identifier.selected = false
              }
            }
          } else if (identifier.suit == "CLUBS") {
            if (i == 46) {
              if (clubsSeven) {
                identifier.selected = false
              } 
            } else if (i < 46) {
              if (gameCards[i - 1].selected == false) {
                identifier.selected = false
              }
            } else {
              if (gameCards[i + 1].selected == false) {
                identifier.selected = false
              }
            }
          }
        } else if (identifier.selected == false) {
          // selecting
          let cardSelected = false;
          if (cardsPlayed == false) {
            // seven of diamonds
            if (i == 7) {
              identifier.selected = true
              cardSelected = true
            }
          } else {
            // sevens
            if (spadesPlayed == false) {
              if (i == 20) {
                identifier.selected = true
                cardSelected = true
              }
            } 
            if (heartsPlayed == false) {
              if (i == 33) {
                identifier.selected = true
                cardSelected = true
              }
            } 
            if (clubsPlayed == false) {
              if (i == 46) {
                identifier.selected = true
                cardSelected = true
              }
            }
            // cards other than sevens
            if (identifier.suit == "DIAMONDS") {
              if (i < 7) {
                if (gameCards[i + 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              } else {
                if (gameCards[i - 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              }
            } else if (identifier.suit == "SPADES") {
              if (i < 20) {
                if (gameCards[i + 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              } else {
                if (gameCards[i - 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              }
            } else if (identifier.suit == "HEARTS") {
              if (i < 33) {
                if (gameCards[i + 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              } else {
                if (gameCards[i - 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              }
            } else if (identifier.suit == "CLUBS") {
              if (i < 46) {
                if (gameCards[i + 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              } else {
                if (gameCards[i - 1].selected == true) {
                  identifier.selected = true
                  cardSelected = true
                }
              }
            }
          }
          if (cardSelected) {
            // removing played card from players hand
            let cardSuit = identifier.suit
            let cardIdentifier = identifier.cardID
            let playerCardID;
            for (let j = 0; j < playerCards.length ; j++) {
              playerCardID = playerCards[j]
              if (playerCardID.suit == cardSuit && playerCardID.cardID == cardIdentifier) {
                // remove item from array
                playerCardID.selected = false
                playerCards.splice(j, 1)
              }
            }
          }
        }
      }
    }
  } else if (cardSelect) {
    // select player cards
    let cardHeight = height * 0.06
    let cardWidth = height * 0.04
    for (let i = 0; i < 52; i++) {
      let identifier = tempCards[i]
      if (mouseX > identifier.x - (cardWidth / 2) && mouseX < identifier.x + (cardWidth / 2) && mouseY > identifier.y - (cardHeight / 2) && mouseY < identifier.y + (cardHeight / 2)) {
        if (identifier.selected == false) {
          // make sure the card hasnt already been played
          let selectable = true
          let cardSuit = identifier.suit
          let cardIdentifier = identifier.cardID
          let gameCardID;
          for (let j = 0; j < gameCards.length ; j++) {
            gameCardID = gameCards[j]
            if (gameCardID.suit ==  cardSuit && gameCardID.cardID == cardIdentifier) {
              if (gameCardID.selected) {
                selectable = false
              }
            }
          }
          if (selectable) {
            identifier.selected = true
            // push the card to the player card array
            playerCards.push(tempCards[i])
          }
        } else {
          identifier.selected = false
          // remove the card from the player cards array 
          let cardSuit = identifier.suit
          let cardIdentifier = identifier.cardID
          let playerCardID;
          for (let j = 0; j < playerCards.length ; j++) {
            playerCardID = playerCards[j]
            if (playerCardID.suit == cardSuit && playerCardID.cardID == cardIdentifier) {
              // remove item from array
              playerCards.splice(j, 1)
            }
          }
        }
      }
    }
  }
}

function drawButtons() {
  strokeWeight(height * 0.0075)
  textSize(height * 0.025)
  textSize(BOLD)
  if (!cardSelect) {
    // button to open cards menu
    fill(40, 69, 129)
    rect((windowWidth / 2) - (height * 0.1), height * 0.11, height * 0.16, height * 0.06, height * 0.015)
    fill(0, 0, 0)
    text("MY CARDS", (windowWidth / 2) - (height * 0.1), height * 0.11)
    // displays suggested next move
    fill(256, 256, 256)
    rect((windowWidth / 2) + (height * 0.1), height * 0.11, height * 0.16, height * 0.06, height * 0.015)
    fill(0, 0, 0)
    if (nextMove == "PASS") {
      // displays knock if no player card can be played
      text(nextMove, (windowWidth / 2) + (height * 0.1), height * 0.11)
    } else if (nextMove != null) {
      // text for next move
      let moveSuit = nextMove.suit;
      let moveID = nextMove.cardID;
      if (moveSuit == "DIAMONDS") {
        moveSuit = "♦"
      } else if (moveSuit == "SPADES") {
        moveSuit = "♠"
      } else if (moveSuit == "HEARTS") {
        moveSuit = "♥"
      } else if (moveSuit == "CLUBS") {
        moveSuit = "♣"
      }
      text(moveID + moveSuit, (windowWidth / 2) + (height * 0.1), height * 0.11)
    }
  } else if (cardSelect) {
    // button to exit card select menu
    fill(83, 128, 42)
    rect((windowWidth / 2), height * 0.11, height * 0.16, height * 0.06, height * 0.015)
    fill(0, 0, 0)
    text("DONE", windowWidth / 2, height * 0.11)
  }
}

function calculateNextMove() {
  if (playerCards.length == 0) {
    // makes blank if player has no selected cards 
    nextMove = null
  } else if (tempCards[7].selected) {
    // seven of diamonds takes priority
    nextMove = tempCards[7]
  } else {
    // compile list of player cards which are playable
    let playablePlayerCards = [];
    // check for sevens
    if (tempCards[20].selected) {
      playablePlayerCards.push(tempCards[20])
    }
    if (tempCards[33].selected) {
      playablePlayerCards.push(tempCards[33])
    }
    if (tempCards[46].selected) {
      playablePlayerCards.push(tempCards[46])
    }
    // check for cards other than sevens
    for (let i = 0; i < 52; i++) {
      let identifier = tempCards[i]
      if (identifier.selected) {
        if (identifier.suit == "DIAMONDS") {
          if (i < 7) {
            if (gameCards[i + 1].selected) {
              playablePlayerCards.push(identifier)
            }
          } else {
            if (gameCards[i - 1].selected) {
              playablePlayerCards.push(identifier)
            }
          }
        } else if (identifier.suit == "SPADES") {
          if (i < 20) {
            if (gameCards[i + 1].selected) {
              playablePlayerCards.push(identifier)
            }
          } else {
            if (gameCards[i - 1].selected) {
              playablePlayerCards.push(identifier)
            }
          }
        } else if (identifier.suit == "HEARTS") {
          if (i < 33) {
            if (gameCards[i + 1].selected) {
              playablePlayerCards.push(identifier)
            }
          } else {
            if (gameCards[i - 1].selected) {
              playablePlayerCards.push(identifier)
            }
          }
        } else if (identifier.suit == "CLUBS") {
          if (i < 46) {
            if (gameCards[i + 1].selected) {
              playablePlayerCards.push(identifier)
            }
          } else {
            if (gameCards[i - 1].selected) {
              playablePlayerCards.push(identifier)
            }
          }
        }
      }
    }
    if (playablePlayerCards.length == 0) {
      // displays knock if no player card can be played
      nextMove = "PASS"
    } else {
      let largestNum = 0;
      for (let a = 0; a < playablePlayerCards.length; a++) {
        let temp = 0
        // check for every suit
        if (playablePlayerCards[a].suit == "DIAMONDS") {
          let temp1 = 0;
          let temp2 = 0;
          if (playablePlayerCards[a].position <= 7) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "DIAMONDS" && playerCards[b].position < playablePlayerCards[a].position) {
                if ((playablePlayerCards[a].position - playerCards[b].position) > temp1) {
                  temp1 = playablePlayerCards[a].position - playerCards[b].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position >= 7) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "DIAMONDS" && playerCards[b].position > playablePlayerCards[a].position) {
                if ((playerCards[b].position - playablePlayerCards[a].position) > temp2) {
                  temp2 = playerCards[b].position - playablePlayerCards[a].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position == 7) {
            temp = temp1 + temp2
          } else {
            if (temp1 > temp2) {
              temp = temp1
            } else {
              temp = temp2
            }
          }
        } else if (playablePlayerCards[a].suit == "SPADES") {
          let temp1 = 0;
          let temp2 = 0;
          if (playablePlayerCards[a].position <= 20) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "SPADES" && playerCards[b].position < playablePlayerCards[a].position) {
                if ((playablePlayerCards[a].position - playerCards[b].position) > temp1) {
                  temp1 = playablePlayerCards[a].position - playerCards[b].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position >= 20) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "SPADES" && playerCards[b].position > playablePlayerCards[a].position) {
                if ((playerCards[b].position - playablePlayerCards[a].position) > temp2) {
                  temp2 = playerCards[b].position - playablePlayerCards[a].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position == 20) {
            temp = temp1 + temp2
          } else {
            if (temp1 > temp2) {
              temp = temp1
            } else {
              temp = temp2
            }
          }
        } else if (playablePlayerCards[a].suit == "HEARTS") {
          let temp1 = 0;
          let temp2 = 0;
          if (playablePlayerCards[a].position <= 33) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "HEARTS" && playerCards[b].position < playablePlayerCards[a].position) {
                if ((playablePlayerCards[a].position - playerCards[b].position) > temp1) {
                  temp1 = playablePlayerCards[a].position - playerCards[b].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position >= 33) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "HEARTS" && playerCards[b].position > playablePlayerCards[a].position) {
                if ((playerCards[b].position - playablePlayerCards[a].position) > temp2) {
                  temp2 = playerCards[b].position - playablePlayerCards[a].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position == 33) {
            temp = temp1 + temp2
          } else {
            if (temp1 > temp2) {
              temp = temp1
            } else {
              temp = temp2
            }
          }
        } else if (playablePlayerCards[a].suit == "CLUBS") {
          let temp1 = 0;
          let temp2 = 0;
          if (playablePlayerCards[a].position <= 46) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "CLUBS" && playerCards[b].position < playablePlayerCards[a].position) {
                if ((playablePlayerCards[a].position - playerCards[b].position) > temp1) {
                  temp1 = playablePlayerCards[a].position - playerCards[b].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position >= 46) {
            for (let b = 0; b < playerCards.length; b++) {
              if (playerCards[b].suit == "CLUBS" && playerCards[b].position > playablePlayerCards[a].position) {
                if ((playerCards[b].position - playablePlayerCards[a].position) > temp2) {
                  temp2 = playerCards[b].position - playablePlayerCards[a].position
                }
              }
            }
          } 
          if (playablePlayerCards[a].position == 46) {
            temp = temp1 + temp2
          } else {
            if (temp1 > temp2) {
              temp = temp1
            } else {
              temp = temp2
            }
          }
        }
        if (temp > largestNum) {
          largestNum = temp
          nextMove = playablePlayerCards[a]
        }
      }
      if (largestNum == 0) {
        let temp = 0
        let lowestNum = 999
        nextMove = playablePlayerCards[0]
        for (let a = 0; a < playablePlayerCards.length; a++) {
          let identifier = playablePlayerCards[a]
          if (identifier.suit == "DIAMONDS") {
            let temp1 = 0;
            let temp2 = 0;
            if (identifier.position <= 7) {
              temp1 = identifier.position
            }
            if (identifier.position >= 7) {
              temp2 = 12 - identifier.position
            }
            temp = temp1 + temp2
          } else if (identifier.suit == "SPADES") {
            let temp1 = 0;
            let temp2 = 0;
            if (identifier.position <= 20) {
              temp1 = identifier.position - 13
            }
            if (identifier.position >= 20) {
              temp2 = 25 - identifier.position
            }
            temp = temp1 + temp2
          } else if (identifier.suit == "HEARTS") {
            let temp1 = 0;
            let temp2 = 0;
            if (identifier.position <= 33) {
              temp1 = identifier.position - 26
            }
            if (identifier.position >= 33) {
              temp2 = 38 - identifier.position
            }
            temp = temp1 + temp2
          } else if (identifier.suit == "CLUBS") {
            let temp1 = 0;
            let temp2 = 0;
            if (identifier.position <= 46) {
              temp1 = identifier.position - 39
            }
            if (identifier.position >= 46) {
              temp2 = 51 - identifier.position
            }
            temp = temp1 + temp2
          }
          if (temp < lowestNum) {
            lowestNum = temp
            nextMove = playablePlayerCards[a]
          }
        }
      }
    }
  }
}
