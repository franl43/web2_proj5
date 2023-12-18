const player = document.getElementById('player');
const canvas = document.getElementById('canvas');
const beforeSnap = document.getElementById('before');
const afterSnap = document.getElementById('after');
const snapTitle = document.getElementById('title');
const imageInput = document.getElementById('image');
const takeSnapBtn = document.getElementById('take-snap-btn');
const uploadBtn = document.getElementById('upload-btn');

let startCapture = function () {
    beforeSnap.classList.remove('d-none');
    beforeSnap.classList.add('d-flex', 'flex-column', 'align-items-center');
    afterSnap.classList.remove('d-flex', 'flex-column', 'align-items-center');
    afterSnap.classList.add('d-none');
    if (!('mediaDevices' in navigator)) {
        player.hidden = true;
        takeSnapBtn.hidden = true;
    } else {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                player.srcObject = stream;
            })
            .catch((err) => {
                alert('Media stream not working');
                console.log(err);
            });
    }
};
startCapture();

let stopCapture = function () {
    afterSnap.classList.remove('d-none');
    afterSnap.classList.add('d-flex', 'flex-column', 'align-items-center');
    beforeSnap.classList.remove('d-flex', 'flex-column', 'align-items-center');
    beforeSnap.classList.add('d-none');
    if(player.srcObject) {
        player.srcObject.getVideoTracks().forEach(function (track) {
            track.stop();
        });
    }
};

takeSnapBtn.addEventListener('click', function (event) {
    canvas.width = player.getBoundingClientRect().width;
    canvas.height = player.getBoundingClientRect().height;
    canvas
        .getContext('2d')
        .drawImage(player, 0, 0, canvas.width, canvas.height);
    stopCapture();
});

imageInput.addEventListener('change', (event) => {
    if (event.target.files) {
        let image = event.target.files[0];
        let r = new FileReader();
        r.readAsDataURL(image)
        r.onloadend = (e) => {
            let img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                canvas
                .getContext('2d')
                .drawImage(img, 0, 0, canvas.width, canvas.height);
            }
        }
        stopCapture();
    }
});

uploadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let imgData = canvas.toDataURL();
    fetch(imgData)
        .then(res => res.blob())
        .then(blob => {
            let date = new Date().toISOString().slice(0,10);
            let imgName = date+"$"+snapTitle.value.replace(/\s/g, '_');
            let formData = new FormData()
            formData.append('name', imgName);
            formData.append('image', blob, imgName+".png");
            fetch('/saveSnap', {
                method: 'POST',
                body: formData,
            }).then(res => {
                if(res.ok) {
                    console.log("Snap saved successfully.")
                }
            }).catch(err => {
                console.log("Error while saving snap.")
            })

        })
});

