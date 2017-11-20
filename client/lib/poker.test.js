import Card  from './card'
import {
    Hand,
    HighCard,
    Pair,
    TwoPair,
    ThreeOfAKind,
    Straight,
    Flush,
    FullHouse,
    FourOfAKind,
    StraightFlush,
    RoyalFlush,
} from './poker'


describe('Card', () => {
    const card = new Card('A', Card.SUITS.diams)
    const card2 = new Card('K', Card.SUITS.diams)

    test('Calculates rank', () => {
        expect(card.rank).toEqual(12)
    })

    test('sorts', () => {
        expect(Card.sort(card, card2)).toBeGreaterThan(0)
    })
})

describe('Hand', () => {
    const cards = [
        new Card('2', Card.SUITS.clubs),
        new Card('T', Card.SUITS.diams)
    ]

    const hand = new Hand(cards)

    test('counts suits and values', () => {
        expect(Object.keys(hand.suits).length).toEqual(2)
        expect(hand.values[0][0] instanceof Card)
    })

    test('sorts by rank', () => {
        const sortResult = Hand.sort({rank: 2}, {rank: 1})
        expect(sortResult).toEqual(1)
    })
})

describe('HighCard', () => {
    const cards = Card.from([
        '2 clubs',
        'T diams',
        'K hearts',
    ])
    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof HighCard).toBeTruthy()
    })

    test('checks kicker', () => {
        const hand1 = Hand.solve(Card.from([
            'A clubs',
            'K spades'
        ]))
        const hand2 = Hand.solve(Card.from([
            'A clubs',
            'Q spades'
        ]))

        expect(Hand.sort(hand1, hand2)).toBeGreaterThan(0)
        expect(hand2.losesTo(hand1)).toBeTruthy()
    })
})

describe('Pair', () => {
    const cards = Card.from([
        '2 clubs',
        '2 diams',
        'K hearts',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof Pair).toBeTruthy()
    })
})

describe('Two Pairs', () => {
    const cards = Card.from([
        '2 clubs',
        '2 diams',
        'K hearts',
        'K diams',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof TwoPair).toBeTruthy()
    })
})

describe('Three of a kind', () => {
    const cards = Card.from([
        '2 clubs',
        '2 diams',
        '2 hearts',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof ThreeOfAKind).toBeTruthy()
    })
})

describe('Straight', () => {
    const cards = Card.from([
        '2 clubs',
        '3 diams',
        '4 hearts',
        '5 hearts',
        '6 hearts',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof Straight).toBeTruthy()
    })
})

describe('Flush', () => {
    const cards = Card.from([
        '2 clubs',
        '5 clubs',
        '7 clubs',
        'T clubs',
        'Q clubs',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof Flush).toBeTruthy()
    })
})

describe('FullHouse', () => {
    const cards = Card.from([
        '2 clubs',
        '2 diams',
        '2 hearts',
        '3 clubs',
        '3 spades',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof FullHouse).toBeTruthy()
    })
})

describe('FourOfAKind', () => {
    const cards = Card.from([
        '2 clubs',
        '2 diams',
        '2 hearts',
        '2 spades',
        '3 spades',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof FourOfAKind).toBeTruthy()
    })
})

describe('StraightFlush', () => {
    const cards = Card.from([
        '2 clubs',
        '3 clubs',
        '4 clubs',
        '5 clubs',
        '6 clubs',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof StraightFlush).toBeTruthy()
    })
})

describe('RoyalFlush', () => {
    const cards = Card.from([
        'T clubs',
        'J clubs',
        'Q clubs',
        'K clubs',
        'A clubs',
    ])

    test('evaluates', () => {
        const hand = Hand.solve(cards)
        expect(hand instanceof RoyalFlush).toBeTruthy()
    })
})