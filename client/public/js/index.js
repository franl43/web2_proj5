const aboutBtn = document.getElementById('about-btn');
const aboutText = document.getElementById('about-text');

navigator.serviceWorker
    .register("./sw.js", { type: "module" })
    .then((reg) => console.log("SW registered!", reg))
    .catch((err) =>
        console.error("Error registering service worker", err)
    );

aboutBtn.addEventListener('click', () => {
    let hiddenAttr = aboutText.hidden;
    aboutText.hidden = !hiddenAttr;
    if (hiddenAttr) {
        aboutBtn.textContent = "See less";
    } else {
        aboutBtn.textContent = "About Rodeo ...";
    }
});