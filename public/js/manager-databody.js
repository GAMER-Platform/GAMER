document.querySelector('#dataBody').innerHTML = '';
    
        fetch('/getGames')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('#dataBody');
                data.forEach((item, index) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td>${item.name}</td>
                        <td>${item.image}</td>
                        <td>${item.description}</td>
                        <td>
                            <button class="delete-button" data-id="${item.id}">刪除</button>
                            <button class="allow-button" data-id="${item.id}" data-name="${item.name}" data-image="${item.image}" data-description="${item.description}">允許</button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
    
                /*----------刪除資料庫中其中一項元素----------*/
    
                document.querySelectorAll('.delete-button').forEach(button => {
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
    
                /*----------允許資料庫中其中一項元素----------*/
    
                document.querySelectorAll('.allow-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const id = event.target.getAttribute('data-id');
                        const name = event.target.getAttribute('data-name');
                        const image = event.target.getAttribute('data-image');
                        const description = event.target.getAttribute('data-description');
    
                        fetch('/allowGame', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id, name, image, description }),
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    });
                });
            });