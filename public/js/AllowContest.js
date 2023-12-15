fetch('/getContests')
.then(response => response.json())
.then(contests => {
    const contestContainer = document.querySelector('#Contest');
    contests.forEach(contest => {
        const item = document.createElement('div');
        item.className = 'col-lg-4 col-sm-6 order-lg-1';
        item.innerHTML = `
            <div class="item">
                <span class="icon feature_box_col_four"><i class="fa fa-upload"></i></span>
                <h6><a href="${contest.link}">${contest.name}</a></h6>
                <p>${contest.description}<br><br><br></p>
            </div>
        `;
        contestContainer.appendChild(item);
    });
})
.catch((error) => {
    console.error('Error:', error);
});