import { Player } from '../lib/player'
import { Table } from '../lib/game'

const players = []
let table, game

export class SocketHandler {
    constructor(socket) {
        this.socket = socket
        this.socket.on('close', (code, reason) => {})
    }

    onmessage(message) {
        switch (message.type){
            case 'join':
                let player = players.find(p => p.name === message.name)
                if (player){
                    this.sendmessage(player.name + ' reconnected to the game')
                    return
                }
                player = new Player(message.name)
                players.push(player)
                console.log('new player connected', player.name)
                this.sendmessage(player.name + ' connected to the game')
                break
            case 'create_table':
                table = new Table(players)
                game = table.startGame()

                setTimeout(() => this.updateGame())
                break
            case 'player_move/fold':
                game.currentPlayer.fold()
                game.playerDidBet.then(() => this.updateGame())
                break
            case 'player_move/check':
                game.currentPlayer.check()
                game.playerDidBet.then(() => this.updateGame())
                break
            case 'player_move/call':
                game.currentPlayer.call()
                game.playerDidBet.then(() => this.updateGame())
                break
            case 'player_move/raise':
                game.currentPlayer.raise(message.value)
                game.playerDidBet.then(() => this.updateGame())
                break
        }
    }

    sendmessage(message) {
        this.socket.send(JSON.stringify(message))
    }

    updateGame() {
        this.sendmessage({
            type: 'game_updated',
            game: serializeGame(game),
        })
    }
}

function serializePlayer(p){
    if(!p) return p
    return {
        ...p,
        game: undefined,
        resolveBet: undefined,
        didBet: undefined,
    }
}

function serializeGame(g){
    return {
        ...g,
        deck: undefined,
        table: undefined,
        players: g.players.map(serializePlayer),
        dealer: serializePlayer(g.dealer),
        smallBlind: serializePlayer(g.smallBlind),
        bigBlind: serializePlayer(g.bigBlind),
        currentPlayer: serializePlayer(g.currentPlayer),
        winner: serializePlayer(g.winner),
    }
}