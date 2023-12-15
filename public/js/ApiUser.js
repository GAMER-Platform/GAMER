// 2023 CHUNG-HAO 版權所有

document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
        const userName = data.name;
        const navbarText = document.querySelector('.navbar-text');
        if (userName) {
            navbarText.innerHTML = `<a href="#">Hi! ${userName}</a> <a href="sign.html">登出</a>`;
        } else {
            navbarText.innerHTML = '<a href="sign.html">sign in</a>';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});