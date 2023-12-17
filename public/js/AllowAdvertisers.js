fetch('/advertisers')
.then(response => response.json())
.then(advertisers => {
    const advertiserContainer = document.querySelector('#advertiser .container .row');
    advertisers.forEach(advertiser => {
        const item = document.createElement('div');
        item.className = 'col-lg-4 col-sm-6 order-lg-1';
        const imageBase64 = `data:image/png;base64,${advertiser.image}`;
        item.innerHTML = `
            <div class="item">
                <span class="icon feature_box_col_four"><i class="#"></i></span>
                <img src="${imageBase64}" alt="Logo" style="width: 100px; height: 100px;">
                <p>${advertiser.slogan}</p>
            </div>
        `;
        advertiserContainer.appendChild(item);
    });
})
.catch((error) => {
    console.error('Error:', error);
});