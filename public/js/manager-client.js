/* CHUNG HAO 2023 dev */

document.querySelector('#dataclient').innerHTML = '';

fetch('/api/users')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#dataclient');
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.password}</td>
                <td>${item.profession}</td>
                <td>
                    <button class="delete-button1" data-id="${item.id}">刪除</button>
                    <button class="allow-button1" data-id="${item.id}" data-name="${item.name}" data-description="${item.description}" data-link="${item.link}">允許</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });