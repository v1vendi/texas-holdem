const suits = ['&spades;', '&diams;', '&hearts;', '&clubs;']
const [spades, diams, hearts, clubs] = suits

export default class Card {
    static suits = suits
    static values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    static SUITS = {
        spades,
        diams,
        hearts,
        clubs,
    }
    constructor (value, suit) {
        this.value = value;
        this.suit = suit;
        this.rank = Card.values.indexOf(this.value);
    }

    toString() {
        return this.value + this.suit;
    }

    static sort(a, b) {
        return a.rank - b.rank;
    }

    static from(strings) {
        return strings.map(string => {
            const [value, suit] = string.split(' ')

            return new Card(value, Card.SUITS[suit])
        })
    }
}