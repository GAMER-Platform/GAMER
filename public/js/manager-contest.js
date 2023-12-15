// 2023 CHUNG-HAO 版權所有

document.querySelector('#datacontest').innerHTML = '';

fetch('/getContests')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#datacontest');
        data.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.link}</td>
                <td>
                    <button class="delete-button1" data-id="${item.id}">刪除</button>
                    <button class="allow-button1" data-id="${item.id}" data-name="${item.name}" data-description="${item.description}" data-link="${item.link}">允許</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.delete-button1').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');

                // 發送請求到伺服器以刪除該記錄
                fetch(`/deleteGame/${id}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        event.target.parentElement.parentElement.remove();
                    } else {
                        console.error('刪除失敗');
                    }
                });
            });
        });


        document.querySelectorAll('.allow-button1').forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.getAttribute('data-id');
                const name = event.target.getAttribute('data-name');
                const description = event.target.getAttribute('data-description');
                const link = event.target.getAttribute('data-link');
        
                fetch('/AllowContests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, name, description, link }),
                })
                .then(response => response.json())
                .then(data => console.log(data))
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
        });
    });