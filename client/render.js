function render(game){
    const cards = game.cards.map(c=>c.toString()).join('')
    document.getElementById('table').innerHTML = cards

    document.getElementById('bank').value = game.bank

    const players = game.players.map(player => {
        let button = ''
        if(player == game.dealer) button = 'D'
        if(player == game.smallBlind) button = 'sB'
        if(player == game.bigBlind) button = 'bB'

        let isCurrentPlayer
        if(player && game && player.name == game.currentPlayer.name) {
            isCurrentPlayer = true
        }

        let isWinner
        if(game && game.winner && player && game.winner.name == player.name){
            isWinner = true
        }
        return `
            <tr ${isWinner ? 'class=winner' : ''}>
                <td>${isCurrentPlayer ? '>' : ''}</td>
                <td>${button}</td>
                <td>${player.name}</td>
                <td>${player.stack}</td>
                <td>${player.bet}</td>
                <td>${player.folded ? 'fold' : ''}</td>
                <td>${player.cards.map(c=>c.toString()).join('')}</td>
            </tr>
        `
    })
    document.getElementById('players').innerHTML = players.join('')
}
