class card {
    
    constructor(x, y, suit, cardID, position) {
        this.x = x;
        this.y = y;
        this.suit = suit;
        this.cardID = cardID;
        this.selected = false;
        this.position = position;
    }

    show() {
        strokeWeight(height * 0.005)
        if (this.selected == false) {
            if (!cardSelect) {
                fill(83, 128, 42)
            } else if (cardSelect) {
                fill(40, 69, 129)
            }
        } else {
            if (this.suit == "HEARTS" || this.suit == "DIAMONDS") {
                fill(203, 41, 26)
            } else {
                fill(256, 256, 256)
            }
        }

        rect(this.x, this.y, height * 0.06, height * 0.04, height * 0.0075)
        strokeWeight(height * 0.01)

        textAlign(CENTER, CENTER)
        textSize(height * 0.025)
        textStyle(BOLD)
        fill(0, 0, 0)
        text(this.cardID, this.x, this.y)
    }
}
