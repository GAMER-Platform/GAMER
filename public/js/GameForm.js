/* CHUNG HAO 2023 dev */

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#game-name').value;
    const description = document.querySelector('#game-description').value;
    const link = document.querySelector('#game-link').value;
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('link', link);
  
    fetch('/addGame', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        $('#addGameModal').modal('hide'); 
      })
      .catch(error => console.error('Error:', error));
    })