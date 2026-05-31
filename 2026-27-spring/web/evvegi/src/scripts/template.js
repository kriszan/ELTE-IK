window.addEventListener('load', async function () {
    const raw = sessionStorage.getItem("generatedPage");
    if (!raw) {
        console.error("No page data found.");
        return;
    }

    const pageData = JSON.parse(raw);
    const inputid = pageData.id
    const initialAccessibilityMode = pageData.accessibilityMode === "true" || pageData.accessibilityMode === true;

    var element = null;
    try {
        const response = await fetch('./../../database.json');
        const data = await response.json();
        element = data.database.find(e => e.id == inputid);
    } catch (error) {
        console.error("Fetch error:", error);
    }

    if (!element) return;
    document.getElementById("apple-name").textContent = element.title;
    const description = document.getElementById("apple-description");
    element.description.forEach(item => {
        const p = document.createElement("p");
        p.innerHTML = item;
        description.appendChild(p);
    });

    const img = document.getElementById("apple-img");
    img.src = "./../." + (element.thumbnail || element.noimage);
    img.alt = element.alt;

    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const imgSrc = "./../." + (element.image || element.thumbnail || "./../../public/images/no_image.jpg");

    modalImg.src = imgSrc;
    modalImg.alt = element.alt || element.name;
    modalTitle.textContent = element.name;
    document.title = element.name;

    const a_switch = document.getElementById('switchAccessibility');
    const body = document.body;
    const nav = document.querySelector('nav');
    function applyAccessibility(isEnabled) {
        if (isEnabled) {
            body.classList.add('accessibility-mode');
            if (nav) {
                nav.classList.remove('bg-light', 'navbar-light');
            }
        } else {
            body.classList.remove('accessibility-mode');
            if (nav) {
                nav.classList.add('bg-light', 'navbar-light');
            }
        }
    }
    a_switch.checked = initialAccessibilityMode;
    applyAccessibility(initialAccessibilityMode);
    a_switch.addEventListener('change', function () {
        applyAccessibility(this.checked);

        pageData.accessibilityMode = this.checked;
        sessionStorage.setItem("generatedPage", JSON.stringify(pageData));
    });
});

// local open safe
/*
document.addEventListener("DOMContentLoaded", async () => {
    const raw = sessionStorage.getItem("generatedPage");
    if (!raw) {
        console.error("No page data found.");
        return;
    }

    const data = JSON.parse(raw);


    await fetch('./../../database.json').then(response => response.json()).then(data => {
        //document.getElementById("apple-container").classList.add("row row-cols-1 row-cols-md-3 g-4");
        data.database.forEach(element => {
            if (element.id === data.id) {
                data.description = element.description;
            }
            console.log(element);
        });
    }).catch(error => {
        console.error(error);
    });

    console.log(data);

    if (data.style) {
        const style = document.createElement("style");
        style.textContent = data.style;
        document.head.appendChild(style);
    }

    if (data.js) {
        const script = document.createElement("script");
        script.textContent = data.js;
        document.body.appendChild(script);
    }

    document.getElementById("apple-name").textContent = data.name;

    const description = document.getElementById("apple-description");
    data.description.forEach(item => {
        const p = document.createElement("p");
        p.textContent = item;
        description.appendChild(p);
    });

    const img = document.getElementById("apple-img");
    img.src = data.thumbnail || data.noimage;
    img.alt = data.alt;

    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");

    const imgSrc = data.image || data.thumbnail || "/public/images/no_image.jpg";

    modalImg.src = imgSrc;
    modalImg.alt = data.alt || data.name;

    console.log("Modal image src:", imgSrc);

    modalTitle.textContent = data.name;
});
*/