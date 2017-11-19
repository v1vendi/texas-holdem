export function render(game){
    const cards = game.cards.map(c=>c.toString()).join('')
    document.getElementById('table').innerHTML = cards

    document.getElementById('bank').value = game.bank

    const players = game.players.map(player => {
        let button = ''
        if(player == game.dealer) button = 'D'
        if(player == game.smallBlind) button = 'sB'
        if(player == game.bigBlind) button = 'bB'

        return `
            <tr ${game.winner === player ? 'class=winner' : ''}>
                <td>${player == game.currentPlayer ? '>' : ''}</td>
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

    refreshButtons(game)
}

function refreshButtons(game){
    document.getElementById('render').onclick = () => {render(game)}
    document.getElementById('fold').onclick = () => {game.currentPlayer.fold(); render(game)}
    document.getElementById('check').onclick = () => {game.currentPlayer.check(); render(game)}
    document.getElementById('call').onclick = () => {game.currentPlayer.call(); render(game)}
    document.getElementById('raise').onclick = () => {
        const value = document.getElementById('bet_input').value
        game.currentPlayer.raise(+value); 
        document.getElementById('bet_input').value = ''
        render(game)
    }
}