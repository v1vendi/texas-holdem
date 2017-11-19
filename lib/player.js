export class Player {
    stack = 0
    bet = 0

    constructor(name) {
        this.name = name
    }

    makeBet(bet) {
        this.stack -= bet
        this.bet += bet
        this.game.bet = Math.max(this.bet, this.game.bet)
        this.didBet = true        

        if(this.resolveBet) {
            this.resolveBet()
            delete this.resolveBet
        }
    }
    
    raise(bet) {
        this.makeBet(bet)
        console.log(this.name + ' bets ' + this.bet)
    }

    call() {
        this.makeBet(this.game.bet - this.bet)
        console.log(this.name + ' calls ' + this.bet)        
    }

    check() {
        this.makeBet(0)
        console.log(this.name + ' checks')  
    }

    fold() {
        this.folded = true
        this.makeBet(0)
        console.log(this.name + ' folds')        
    }

    doBet(){
        return new Promise(resolve => {
            this.resolveBet = resolve
        })
    }
}


