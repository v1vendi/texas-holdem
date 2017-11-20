import Card from './card'
import Deck from './deck'

describe('deck', () => {
    const deck = new Deck()

    expect(deck.cards.length).toEqual(52)

    test('deals', () => {
        const cards = deck.deal(3)

        expect(deck.cards.length).toEqual(49)
        expect(cards.length).toEqual(3)
        expect(cards[0] instanceof Card).toBeTruthy()    
    })

    test('shuffles', () => {
        const deck1 = new Deck()
        const deck2 = new Deck()

        deck1.shuffle()

        let equals = true
        for(let i in deck1.cards) {
            if(deck1.cards[i].toString() != deck2.cards[i].toString()){
                equals = false
            }
        }

        expect(equals).toBeFalsy()
    })
})