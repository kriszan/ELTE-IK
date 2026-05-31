window.addEventListener('load', async function () {
    let html = '';
    const container = document.getElementById('apple-container');

    try {
        const response = await fetch('./database.json');
        if (!response.ok) throw new Error("Nem sikerült betölteni a database.json-t");

        const data = await response.json();

        data.database.forEach(element => {
            html += createCard(element.id, element.name, element.thumbnail, element.alt, element.title);
        });

        if (container) {
            container.innerHTML = html;
        }
    } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        if (container) container.innerHTML = "<p>Hiba történt az adatok betöltésekor.</p>";
    }

    const feedbackForm = document.getElementById('form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                likes_apple: document.getElementById('igen').checked ? 'igen' : 'nem',
                types: [
                    document.getElementById('green').checked ? 'Zöld' : null,
                    document.getElementById('red').checked ? 'Piros' : null
                ].filter(Boolean),
                weekly: document.getElementById('weekly').value,
                unit: document.getElementById('unit').value,
                notes: document.getElementById('notes').value
            };

            feedbackForm.reset();
            feedbackForm.style.display = 'none';

            const resultElement = document.getElementById('result');
            if (resultElement) {
                resultElement.hidden = false;
                resultElement.innerHTML = `
                    <h3>Köszönjük a visszajelzést!</h3>
                    <p><strong>Szereti az almát:</strong> ${formData.likes_apple}</p>
                    <p><strong>Kedvelt típusok:</strong> ${formData.types.join(', ') || 'Nincs megadva'}</p>
                    <p><strong>Mennyiség:</strong> ${formData.weekly} ${formData.unit}</p>
                    <p><strong>Megjegyzés:</strong> ${formData.notes || '-'}</p>
                `;
            }
        });
    }

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

    let pageData = {};
    const raw = sessionStorage.getItem("generatedPage");

    if (raw) {
        try {
            pageData = JSON.parse(raw);
        } catch (e) {
            console.error("Hibás JSON a tárolóban");
            pageData = {};
        }
    }

    const isEnabled = pageData.accessibilityMode === true || pageData.accessibilityMode === "true";

    if (a_switch) {
        a_switch.checked = isEnabled;
        applyAccessibility(isEnabled);


        a_switch.addEventListener('change', function () {
            const checked = this.checked;
            applyAccessibility(checked);


            pageData.accessibilityMode = checked;
            sessionStorage.setItem("generatedPage", JSON.stringify(pageData));
        });
    }
});

function createCard(id, name, thumbnail, alt, title) {
    return `
        <div id="apple-${id}" class="col d-flex apple-card justify-content-center">
            <div class="card w-100 text-center" style="cursor: pointer;" onclick="openGeneratedPage('${id}')">
                <figure class="card-img-top object-fit-contain m-0 p-3">
                    <img src="${thumbnail}" 
                         alt="${alt}" 
                         title="${title}" 
                         class="myimage img-fluid" 
                         onerror="this.onerror=null; this.src='./public/images/no_image.jpg';">
                    <figcaption class="visually-hidden">${title}</figcaption>
                </figure>
                <div class="card-body">
                    <h4 class="card-title">${name}</h4>
                </div>
            </div>
        </div>`;
}

function openGeneratedPage(id) {
    let pageData = {};
    const raw = sessionStorage.getItem("generatedPage");
    if (raw) pageData = JSON.parse(raw);

    pageData.id = id;
    sessionStorage.setItem("generatedPage", JSON.stringify(pageData));
    window.location.href = './src/pages/template.html';
}

// local file safe version
/*async function openGeneratedPage(stylesource, jssource, id, name, thumbnail, alt, title) {
    try {
        const jsContent = await (await fetch(jssource)).text();
        const styleContent = await (await fetch(stylesource)).text();

        const pageData = {
            style: styleContent,
            js: jsContent,
            image: "",
            thumbnail: thumbnail,
            id: id,
            name: name,
            alt: alt,
            title: title,
            description: "",
            noimage: './public/images/no_image.jpg'
        };
        sessionStorage.setItem("generatedPage", JSON.stringify(pageData));
        window.open("/src/pages/template.html", "_blank");

    } catch (error) {
        console.error("Error opening generated page:", error);
    }
}*/
/*
async function openGeneratedPage(id) {
    try {
        const pageData = {
            id: id,
            accessibilityMode: document.getElementsByTagName('body')[0].classList.contains('accessibility-mode') ? 'true' : 'false'
        };
        sessionStorage.setItem("generatedPage", JSON.stringify(pageData));
        window.open("./src/pages/template.html", "_blank");

    } catch (error) {
        console.error("Error opening generated page:", error);
    }
}*/