const input = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const nominationsDiv = document.getElementById('nominations');
const omdbApiKey = 'fff637f0';

const showResults = () => {
    nominationsDiv.classList.add('fadeout');
    setTimeout(() => {
        resultsDiv.classList.replace('hide', 'fadein');
        nominationsDiv.classList.replace('fadeout', 'fadein');
    }, 500);
    setTimeout(() => {
        input.removeEventListener('input', showResults);
    }, 510);
}

input.addEventListener('input', showResults);

input.addEventListener('input', (e) => {
    document.querySelector('b').textContent = e.target.value;
    if(e.target.value === '') {
        const p = document.createElement('p');
        p.textContent = String.fromCodePoint(0x1F644);
        if(resultsDiv.childElementCount > 1) resultsDiv.replaceChild(p, resultsDiv.childNodes.item(1));
        else resultsDiv.appendChild(p);
    } else {
        if(resultsDiv.childElementCount > 1) resultsDiv.removeChild(resultsDiv.childNodes.item(1));
    }
});

input.addEventListener('change', (e) => {
    const query = e.target.value;

    if(query !== '') {
        const container = document.createElement('div');
        container.id = 'loader';
        resultsDiv.appendChild(container);

        const loaderAnimation = bodymovin.loadAnimation({
            container: container,
            path: 'https://maxst.icons8.com/vue-static/landings/animated-icons/icons/circles-menu-1/circles-menu-1.json',
            renderer: 'svg',
            loop: true,
            autoplay: true
        });

        loaderAnimation.play();

        (async function() {
            const response = await fetch(`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query}&type=movie&r=json`);
            return response.json();
        })()
        .then((value) => {
            if(value.Response === 'True') {
                const list = document.createElement('ul');
                value.Search.forEach(element => {
                    const item = document.createElement('li');
                    const content = `${element.Title} (${element.Year})`;
                    const button = document.createElement('button');
                    button.textContent = 'Nominate';
                    item.textContent = content;
                    if(nominationsDiv.lastChild.firstChild.hasChildNodes()) {
                        const items = nominationsDiv.lastChild.childNodes;
                        items.forEach((elemnt) => {
                            if(elemnt.textContent.replace('Remove','') === content) {
                                button.disabled = true;
                            }
                        });
                    }
                    item.appendChild(button);
                    list.appendChild(item);
                });
                if(resultsDiv.childElementCount > 1) resultsDiv.replaceChild(list, resultsDiv.childNodes.item(1));
                else resultsDiv.appendChild(list);

                const buttons = document.querySelectorAll('#results button');
                buttons.forEach((val) => {
                    val.addEventListener('click', () => {
                        const item = document.createElement('li');
                        const button = document.createElement('button');
                        button.textContent = 'Remove';
                        item.textContent = val.parentElement.textContent.replace('Nominate', '');
                        item.appendChild(button);

                        if(nominationsDiv.lastChild.firstChild.hasChildNodes()) {
                            if(nominationsDiv.lastChild.childNodes.length < 5) {
                                nominationsDiv.lastChild.appendChild(item);
                                val.disabled = true;
                                if(nominationsDiv.lastChild.childNodes.length === 5) {
                                    const banner = document.getElementById('banner');
                                    banner.classList.replace('hide','slidedown');
                                    setTimeout(() => {
                                        banner.classList.replace('slidedown','slideup');
                                    }, 2000);
                                    setTimeout(() => {
                                        banner.classList.replace('slideup','hide');
                                    }, 2500);
                                }
                            } else {
                                const banner = document.getElementById('banner');
                                banner.classList.replace('hide','slidedown');
                                setTimeout(() => {
                                    banner.classList.replace('slidedown','slideup');
                                }, 2000);
                                setTimeout(() => {
                                    banner.classList.replace('slideup','hide');
                                }, 2500);
                            }
                        } else {
                            const ul = document.createElement('ul');
                            ul.appendChild(item);
                            nominationsDiv.replaceChild(ul, nominationsDiv.childNodes.item(1));
                            val.disabled = true;
                        }
                    });
                });
            } else {
                const p = document.createElement('p');
                if(value.Error === 'Too many results.') {
                    p.textContent = `${value.Error} Please try to be more specific.`;
                } else if(value.Error === 'Movie not found!') {
                    p.textContent = `Movie not found. Please type in an accurate movie title.`;
                }
                if(resultsDiv.childElementCount > 1) resultsDiv.replaceChild(p, resultsDiv.childNodes.item(1));
                else resultsDiv.appendChild(p);
            }
        })
        .catch((value) => {
            console.log(value);
            const p = document.createElement('p');
            p.textContent = 'Please check your Internet connection.';
            if(resultsDiv.childElementCount > 1) resultsDiv.replaceChild(p, resultsDiv.childNodes.item(1));
            else resultsDiv.appendChild(p);
        });
    }
});

nominationsDiv.addEventListener('click', (e) => {
    if(e.target.textContent === 'Remove') {
        const content = e.target.parentElement.textContent.replace('Remove','');
        if(resultsDiv.lastChild.firstChild.hasChildNodes()) {
            const items = resultsDiv.lastChild.childNodes;
            items.forEach((element) => {
                if(element.textContent.replace('Nominate','') === content) {
                    element.lastChild.disabled = false;
                }
            });
        }
        if(e.target.parentElement.parentElement.childElementCount === 1) {
            const p = document.createElement('p');
            p.textContent = "You've not nominated any movie? You definitely haven't seen The Internship."
            e.target.parentElement.parentElement.parentElement.appendChild(p);
            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
        }
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
    }
}, true);