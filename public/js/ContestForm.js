// 2023 CHUNG-HAO 版權所有

document.querySelector('#addContestModal form').addEventListener('submit', (event) => {
  event.preventDefault();

  const name1 = document.querySelector('#contest-name').value;
  const description1 = document.querySelector('#contest-description').value;
  const link1 = document.querySelector('#contest-link').value;

  const formData = new FormData();
  formData.append('name1', name1);
  formData.append('description1', description1);
  formData.append('link1', link1);

  // 隱藏模態視窗
  $('#addContestModal').modal('hide'); 

  fetch('/addContest', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name1, description1, link1 }),
})
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
});