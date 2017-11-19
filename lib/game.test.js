import { Table } from './game.js'
import { Player } from './player.js'

global.render = () => {}

describe('positive workflow', () => {
    let yura = new Player('Yura')
    let ales = new Player('Ales')

    let table = new Table([
        yura,
        ales,
    ])

    let game = table.startGame()

    test('preflop', () => {
        game.preflop()
        expect(game.dealer).toEqual(yura)
        expect(game.smallBlind).toEqual(ales)
        expect(game.bigBlind).toEqual(yura)

        expect(game.betsDone()).toBeFalsy()

        ales.call()
        yura.check()

        expect(ales.bet).toEqual(20)
        expect(yura.bet).toEqual(20)        
        expect(game.bet).toEqual(20)

        expect(game.betsDone()).toBeTruthy()
    })

    test('flop', () => {     
        game.flop()   
        
        expect(game.cards.length).toEqual(3)
        expect(game.bank).toEqual(40)
        expect(game.currentPlayer).toEqual(ales)
        expect(game.betsDone()).toBeFalsy()

        ales.check()
        yura.makeBet(50)

        expect(game.betsDone()).toBeFalsy()
        ales.call()
        
        expect(game.betsDone()).toBeTruthy()
    })
    
    test('turn', () => {        
        game.turn()

        expect(game.cards.length).toEqual(4)
        expect(game.bank).toEqual(140)
        
        expect(game.currentPlayer).toEqual(ales)
        expect(game.betsDone()).toBeFalsy()

        ales.check()
        yura.check()

        expect(game.betsDone()).toBeTruthy()
    })
    
    test('river', () => {        
        game.river()

        expect(game.cards.length).toEqual(5)
        expect(game.bank).toEqual(140)
        
        expect(game.currentPlayer).toEqual(ales)
        expect(game.betsDone()).toBeFalsy()

        ales.check()
        yura.makeBet( 50)
        ales.call()

        expect(game.betsDone()).toBeTruthy()
    })

    test('showdown', () => {
        game.showdown()
        console.log(game.players)
    })
})

describe('folds', () => {
    let yura = new Player('Yura')
    let ales = new Player('Ales')

    let table = new Table([
        yura,
        ales,
    ])

    let game = table.startGame()

    test('preflop', () => {
        game.preflop()

        ales.fold()
        expect(game.betsDone()).toBeTruthy()
    })
})