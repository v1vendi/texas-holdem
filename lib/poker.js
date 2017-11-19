import Card from './card.js'

export class Hand {
    constructor(cards) {
        
        this.cards = [];
        this.suits = {};
        this.values = [];

        this.cards = cards.sort(Card.sort)

        this.cards.forEach(card => {
            if (!this.suits[card.suit]) {
                this.suits[card.suit] = []
            }
            
            const valueIndex = Card.values.indexOf(card.value)
            if (!this.values[valueIndex]) {
                this.values[valueIndex] = []
            }

            this.suits[card.suit].push(card);
            this.values[valueIndex].push(card);
        })
    }

    static sort(a, b) {
        if (a.rank !== b.rank) {
            return a.rank - b.rank;
        }

        for (var i=0; i<=4; i++) {
            const result = Card.sort(a.cards[i], b.cards[i]);
            if (result !== 0) {
                return result;
            } 
        }
        
        return 0;
    }

    losesTo(otherHand) {
        return Hand.sort(this, otherHand) < 0
    }

    equalsTo(otherHand) {
        return Hand.sort(this, otherHand) === 0
    }

    toString() {
        return this.cards.map(card => card.toString()).join(' ');
    }

    /**
     * Build and return the best hand.
     * @param  {Array} cards Array of cards (Type: Card)
     * @return {Hand}        Best hand
     */
    static solve(cards) {
        for( let handConstructor of Hand.hands ) {
            const hand = new handConstructor(cards);
            const result = hand.solve();
            if(result){                
                hand.rank = Hand.hands.length - Hand.hands.indexOf(handConstructor) - 1
                return hand
            }           
        }
    }
}

export class StraightFlush extends Hand {
    name = 'Straight Flush'

    toString = () => this.name + ' from ' + this.combination[0].value
    
    solve() {
        let straight
        this.values.forEach((cardsOfValue, valueIndex) => {
            let straightValueIndexes
            if (valueIndex === Card.values.indexOf('A')){ 
                straightValueIndexes = [
                    Card.values.indexOf('A'),
                    0, 1, 2, 3,
                ]
            } else if (valueIndex > Card.values.indexOf('T')) {
                return 
            } else {
                straightValueIndexes = [
                    valueIndex,
                    valueIndex + 1,
                    valueIndex + 2,
                    valueIndex + 3,
                    valueIndex + 4
                ]
            }

            let possibleSF = []
            for(let card of cardsOfValue) {
                if (this.suits[card.suit].length < 5) return
                for(let i of straightValueIndexes) {
                    if(!this.values[i]) return
                    
                    let cardOfSuit = this.values[i].find(_ => _.suit === card.suit)
                    if(!cardOfSuit) return
                    possibleSF.push[cardOfSuit]

                }
                straight = straightValueIndexes.map(index => this.values[index][0])
            }            
        });

        if (straight && straight.length) {
            this.combination = straight
        }

        return straight !== undefined
    }
}

export class RoyalFlush extends StraightFlush {
    name = 'Royal Flush'

    toString = () => this.name

    solve() {
        let result = super.solve();
        if (result) {
            if(this.combination[0].value != 'T') {
                return false
            }
        } else {
            return false
        }
        
        return true;
    }
}

export class FourOfAKind extends Hand {
    name = 'Four of a Kind'

    toString = () => this.name
    
    solve() {
        this.values.forEach(cardsOfValue => {
            if (cardsOfValue.length === 4) {
                this.combination = cardsOfValue;
            }
        });
        
        return this.combination !== undefined;
    }
}

export class FullHouse extends Hand {
    name = 'Full House'
    
    toString = () => this.name + ' of ' + this.combination[0].value + ' and ' + this.combination[this.combination.length - 1].value
    
    solve() {
        const threes = this.values.filter(cardsOfValue => cardsOfValue.length === 3);
        const pairs = this.values.filter(cardsOfValue => cardsOfValue.length === 2);

        if (threes.length === 0 || pairs.length === 0) return false;

        const three = threes[1] ? threes[1] : threes[0];
        const pair = three == threes[1] ? threes[0].slice(0, 2) : pairs[pairs.length-1];

        this.combination = [...three, ...pair];
        return threes !== undefined;
    }
}

export class Flush extends Hand {
    name = 'Flush'

    toString = () => this.name + ' of ' + this.combination[this.combination.length-1] + ' High';

    solve() {
        let flush;
        Object.values(this.suits).forEach(cardsOfSuit => {
            if (cardsOfSuit.length >= 5) {
                flush = cardsOfSuit;
            }
        });

        if (flush) this.combination = flush.slice(-5);

        return this.combination !== undefined;
    }
}

export class Straight extends Hand {
    name = 'Straight'

    toString = () => 'Straight from ' + this.combination[0].value
    
    solve() {
        let straight
        this.values.forEach((cardsOfValue, valueIndex) => {
            let straightValueIndexes
            if (valueIndex === Card.values.indexOf('A')){ 
                straightValueIndexes = [
                    Card.values.indexOf('A'),
                    0, 1, 2, 3,
                ]
            } else if (valueIndex > Card.values.indexOf('T')) {
                return 
            } else {
                straightValueIndexes = [
                    valueIndex,
                    valueIndex + 1,
                    valueIndex + 2,
                    valueIndex + 3,
                    valueIndex + 4
                ]
            }
            for(let i of straightValueIndexes) {
                if(!this.values[i]) return              
            }
            straight = straightValueIndexes.map(index => this.values[index][0])
        });

        if (straight && straight.length) {
            this.combination = straight
        }

        return this.combination !== undefined
    }
}

export class ThreeOfAKind extends Hand {
    name = 'Three of a kind'

    toString = () => 'Three of ' + this.combination[0].value
    
    solve() {
        let three;
        this.values.forEach(cardsOfValue => {
            if (cardsOfValue.length === 3) {
                three = cardsOfValue;
            }
        })

        this.combination = three;

        return this.combination !== undefined;
    }
}

export class TwoPair extends Hand {
    name = 'Two Pair'

    toString = () => this.name + ' of ' + this.combination[0].value + ' and ' + this.combination[3].value
    
    solve() {
        let lowPair, highPair, kicker;
        this.values.forEach(cardsOfValue => {
            if (cardsOfValue.length === 2) {
                if (!lowPair) {
                    lowPair = cardsOfValue;
                } else {
                    if (highPair) {
                        lowPair = highPair;
                        highPair = cardsOfValue;
                    } else {
                        highPair = cardsOfValue;
                    }
                }

            }
        })

        if (highPair) {
            this.combination = [...lowPair, ...highPair]
        }

        return highPair !== undefined;
    }
}

export class Pair extends Hand {
    name = 'Pair'

    toString = () => this.name + ' of ' + this.combination[0].value
    
    solve() {
        this.values.forEach(cardsOfValue => {
        
            if (cardsOfValue.length === 2) {
                this.combination = cardsOfValue;
            }
        })
        return this.combination !== undefined;
    }
}

export class HighCard extends Hand {
    name = 'High Card'

    toString = () => this.name + this.cards.slice(-1).toString()

    solve() {
        this.combination = this.cards.slice(-1);

        return true;
    }
}

Hand.hands = [
    RoyalFlush,
    StraightFlush, 
    FourOfAKind, 
    FullHouse, 
    Flush, 
    Straight, 
    ThreeOfAKind, 
    TwoPair, 
    Pair, 
    HighCard
]
