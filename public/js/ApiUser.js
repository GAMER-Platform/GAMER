/* CHUNG HAO 2023 dev */

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
        const userName = data.name;
        const navbarText = document.querySelector('.navbar-text');
        if (userName) {
            navbarText.innerHTML = `<a href="#">Hi! ${userName}</a> <a href="User.html">登出</a>`;
        } else {
            navbarText.innerHTML = '<a href="sign.html">sign in</a>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});