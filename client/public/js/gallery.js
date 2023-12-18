const gallery = document.getElementById('gallery')

function addImages() {
    fetch('/snaps').then(res => {
        res.json().then(json => {
            for(let i=0; i<json.files.length; i++) {
                let img = json.files[i];
                let dateName = img.split('$')
                let date = dateName[0]
                let name =''
                try {
                    name = dateName[1].split('.')[0].replace(/_/g, ' ')
                } catch(ignorable) {}
                

                let galleryCard = document.createElement('div');
                galleryCard.setAttribute('class', 'card mb-3');
                let cardInnerHTML = `
                    <img src="snaps/${img}" class="card-img-top" alt="${img}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text"><small class="text-body-secondary">Uploaded: ${date}</small></p>
                    </div>
                `;
                galleryCard.innerHTML = cardInnerHTML;
                gallery.appendChild(galleryCard);
            }
        })
    })
}
addImages();