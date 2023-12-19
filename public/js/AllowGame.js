/* CHUNG HAO 2023 dev */

fetch('/getAllowedGames')
.then(response => response.json())
.then(games => {
    const container = document.querySelector('#gamesContainer');
    games.forEach(game => {
        const item = document.createElement('div');
        item.className = 'col-lg-4 col-sm-6';
        item.innerHTML = `
            <div class="item">
                <span class="icon feature_box_col_two"><i class="fa fa-magic"></i></span>
                <h6><a href="${game.description}">${game.name}</a></h6>
                <p>${game.image}</p>
            </div>
        `;
        container.appendChild(item);
    });
});