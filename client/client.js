const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const API_URL =  window.location.hostname === 'localhost' ? 'http://localhost:5000/octos' : 'https://octochat-api.vercel.app/octos'
const octosElement = document.querySelector('.octos');

loadingElement.style.display = '';

listAllOctos();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    const octo = {
        name, content
    };
    form.style.display = 'none';
    loadingElement.style.display = '';
    
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(octo),
        headers: {
            'content-type': 'application/json'
        },
    }).then(response => response.json())
    .then(createdOcto => {
        form.reset();
        setTimeout(() => {
            form.style.display = '';
        }, 15000);
        loadingElement.style.display = 'none';
        listAllOctos();
    });
});

function listAllOctos() {
    octosElement.innerHTML = '';
    fetch(API_URL)
        .then(response => response.json())
        .then(octos => {
            octos.reverse();
            octos.forEach(octo => {
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = octo.name;

                const contents = document.createElement('p');
                contents.textContent = octo.content;

                const date = document.createElement('small');
                date.textContent = new Date(octo.created);

                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                octosElement.appendChild(div);
            });
        loadingElement.style.display = 'none';
    });
}