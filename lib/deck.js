import Card from './card.js'

export default class Deck {
    constructor() {
        this.cards = []
        Card.suits.forEach(suit => {
            Card.values.forEach(value => {
                this.cards.push(new Card(value, suit))
            })
        })

        this.shuffle()
    }

    shuffle() {
        this.cards.forEach((card, i) => {
            const j = Math.floor(Math.random() * (i + 1));
            const otherCard = this.cards[j]
            this.cards[i] = otherCard
            this.cards[j] = card
        })
    }

    deal(number) {
        const cards = this.cards.splice(0, number)
        return cards
    }
}