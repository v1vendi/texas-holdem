import Deck from './deck.js'
import { Hand } from './poker.js'


export class Table {
    static blind = 10
    static startStack = 1000

    constructor(players, startStack = Table.startStack, blind = Table.blind){
        this.players = players
        this.blind = blind
        for(let player of this.players) {
            player.stack = startStack
        }

        this.setNextDealer()
    }

    startGame() {
        this.game = new Game(this)
        return this.game
    }

    onGameEnded() {
        this.setNextDealer()
    }

    setNextDealer() {
        let index = this.players.indexOf(this.dealer)
        index++
        if(index == this.players.length) index = 0

        this.dealer = this.players[index]
        console.log('dealer is ' + this.dealer.name)
    }
}

export class Game {
    bank = 0
    bet = 0
    cards = []
    deck = new Deck()

    constructor(table) {
        this.table = table
        this.players = this.table.players
        for(let player of this.players) {
            player.game = this
            player.cards = []
            player.bet = 0
            player.folded = false
        }

        console.log('game started')
        this.preflop()
    }

    moveButton() {    
        this.dealer = this.table.dealer    
        this.smallBlind = this.nextPlayer(this.dealer)
        this.bigBlind = this.nextPlayer(this.smallBlind)
        this.currentPlayer = this.nextPlayer(this.bigBlind)
    }

    nextPlayer(player) {
        let currentIndex = this.players.indexOf(player)
        for(let index = currentIndex + 1; index !== currentIndex; index++){
            if(index == this.players.length) index = 0
            if(!this.players[index].folded) return this.players[index]
        }
    }

    waitForBets() {
        console.log('waiting for ' + this.currentPlayer.name)
        let resolveBet
        this.playerDidBet = new Promise(res => {resolveBet = res})
        console.log('w4b', this.playerDidBet)
        return this.currentPlayer.doBet().then(() => {
            resolveBet()
            console.log('waitForBets resolved for' + this.currentPlayer.name)
            this.currentPlayer = this.nextPlayer(this.currentPlayer)

            if(this.everyoneElseFolded()){
                this.collectBets()
                console.log('everyone else folded')
                this.winner = this.currentPlayer
                console.log('winner is ' + this.winner.name)
                this.currentPlayer.stack += this.bank
                return Promise.reject()
            }

            
            if(!this.betsDone()){
                return this.waitForBets()
            } else {
                console.log('all bets done')
                return Promise.resolve()
            }
        })
    }

    everyoneElseFolded() {
        return this.players.filter(p => !p.folded).length === 1
    }

    preflop() {
        console.log('preflop')
        this.moveButton()
        for(let player of this.players) {
            player.cards = this.deck.deal(2)
        }
        this.smallBlind.makeBet(this.table.blind),
        this.bigBlind.makeBet(this.table.blind * 2)
        this.bigBlind.didBet = false

        this.waitForBets().then(this.flop, this.endGame)
    }
    
    flop = () => {
        console.log('flop')
        this.collectBets()
        this.cards = this.deck.deal(3)
        this.currentPlayer = this.nextPlayer(this.dealer)
        
        this.waitForBets().then(this.turn, this.endGame)
    }
    
    turn = () => {
        console.log('turn')
        this.collectBets()
        this.cards = this.cards.concat(this.deck.deal(1))
        this.currentPlayer = this.nextPlayer(this.dealer)
        
        this.waitForBets().then(this.river, this.endGame)
    }
    
    river = () => {
        console.log('river')
        this.collectBets()
        this.cards = this.cards.concat(this.deck.deal(1))
        this.currentPlayer = this.nextPlayer(this.dealer)
        
        this.waitForBets().then(() => this.showdown(), this.endGame)
    }

    showdown = () => {
        console.log('showdown')
        this.collectBets()
        let players = this.players.filter(p => !p.folded)

        players.forEach(p => {
            p.hand = Hand.solve([...p.cards, ...this.cards])
        })
        players.sort((p1, p2) => Hand.sort(p1.hand, p2.hand))
        players.reverse()

        let winners = players.filter(p => p.hand.equalsTo(players[0].hand))
        this.winner = winners[0]
        console.log('winner is ' + winners[0].name)
        console.log(winners[0].hand.toString())
        winners.forEach(p => p.stack += this.bank/winners.length)
        this.bank = 0

        this.endGame()
    }
    
    collectBets() {
        for(let player of this.players) {
            this.bank += player.bet
            player.bet = 0
            player.didBet = false
        }
        this.bet = 0
    }

    betsDone() {
        return this.players.every(p => {
            return p.folded || ( p.didBet && p.bet === this.bet)
        })
    }

    endGame = () => {
        this.finished = true
        this.currentPlayer = null
        console.log('game ended')

        this.table.onGameEnded()
    }
}

