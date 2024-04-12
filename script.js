const main_url = "http://localhost:8000/api/v1/titles/"
const sortedByGenre_url = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score&genre="
const genre_url = "http://localhost:8000/api/v1/genres/"

window.addEventListener('load', () => {
    bestMovie()
    getAllCategories()
    definedCategory("Sci-Fi", "categorie-1")
    definedCategory("Fantasy", "categorie-2")
    definedCategory("Music", "categorie-3")
    })

function bestMovie() {
    // Fonction qui affiche le film le mieux noté, toutes catégories confondues

    let img = document.getElementById("best-movie-image")
    let bestTitle = document.getElementById("best-title")
    let bestDescription = document.getElementById("best-description")
    let button = document.getElementById("best-movie-button")

    fetch(main_url + "?sort_by=-imdb_score")
        .then(response => response.json())
        .then(data => {
            img.onerror = function() {
                // En cas d'erreur de chargement de l'image, définir l'image par défaut
                this.src = "Pictures/no_image.jpg"
            }    
            img.src = data.results[0].image_url
            bestTitle.innerHTML = data.results[0].title
            fetch(data.results[0].url)
                    .then(response => response.json())
                    .then(data => {
                        bestDescription.innerHTML = data.long_description
                    })
            let best_film_id = data.results[0].id
            button.addEventListener("click", () => {
                modalWindow(best_film_id)
            })
        })
}


function seeMoreButton(domElement) {
    const seeMoreBtn = document.querySelectorAll(".see-more-btn")
    for (let i=0 ; i<seeMoreBtn.length; i++) {
        seeMoreBtn[i].addEventListener("click", () => {
            domElement.classList.toggle("active")
        })
    }
}

function createImageZone(domElement, datas) {
    for (let i=0; i<6; i++) {
        let img = document.createElement("img")
        img.onerror = function() {
            // En cas d'erreur de chargement de l'image, définir l'image par défaut
            this.src = "Pictures/no_image.jpg"
        }
        img.src = datas.results[i].image_url
        img.alt = "image"
        img.id = datas.results[i].id
        img.addEventListener("click", () => {
            modalWindow(img.id)
        })
        domElement.appendChild(img)
    }
    seeMoreButton(domElement)
}


function getAllCategories() {
    //Fonction qui récupère la liste de toutes les catégories de films

    let liste_genres = []
    fetch("http://localhost:8000/api/v1/genres")
        .then(response => response.json())
        .then(data => {
            let url = "http://localhost:8000/api/v1/genres/?page_size="
            let nb_genre = data.count
            fetch(url + nb_genre)
                .then(response => response.json())
                .then(data => {
                    for(i=0; i<nb_genre; i++) {
                        let genre = data.results[i].name
                        liste_genres.push(genre)
                    }
                    createDropdownMenu(liste_genres)
                })
        })
}


function definedCategory(category_name, id_category) {
    //Fonction qui affiche les 6 meilleurs films d'une catégroie donnée
    fetch(sortedByGenre_url + category_name)
        .then(response => response.json())
        .then(data => {
            const filmsCategory = document.getElementById(id_category)
            createImageZone(filmsCategory, data)
        })
}

function createDropdownMenu(liste_genres) {
    // Fonction qui créé un menu déroulant avec la liste des catégories
    let selection = document.getElementById("categories")
    for(i=0; i<liste_genres.length; i++) {
        let options = `<option value="${liste_genres[i]}">${liste_genres[i]}</option>`
        selection.innerHTML += options
    }
    chosenCategory()
}


function chosenCategory() {
    let formulaire = document.querySelector("select")
    let categoryTitle = document.getElementById("user-choice")
    formulaire.addEventListener("change", event => {
        event.preventDefault()
        let choice = event.target.value
        fetch(sortedByGenre_url + choice)
        .then(response => response.json())
        .then(data => {
            const chosenCategory = document.getElementById("chosen-category")
            chosenCategory.innerHTML = ""
            categoryTitle.innerHTML = choice
            createImageZone(chosenCategory, data)
        })
    })
}


function modalWindow(id_film) {
    fetch(main_url + id_film)
        .then(response => response.json())
        .then(data => {

            document.getElementById("modal-image").onerror = function() {
                // En cas d'erreur de chargement de l'image, définir l'image par défaut
                this.src = "Pictures/no_image.jpg"
            }
            document.getElementById("modal-image").src = data.image_url
            document.getElementById("modal-title").innerHTML = data.title
            document.getElementById("modal-genre").innerHTML = data.genres
            document.getElementById("modal-release").innerHTML = data.date_published
            document.getElementById("modal-rating").innerHTML = data.rated
            document.getElementById("modal-imdb").innerHTML = data.imdb_score + " / 10"
            document.getElementById("modal-director").innerHTML = data.directors
            document.getElementById("modal-casting").innerHTML = data.actors
            document.getElementById("modal-duration").innerHTML = data.duration + " min"
            document.getElementById("modal-country").innerHTML = data.countries
            let modalBoxOffice = document.getElementById("modal-box-office")
            // Affiche "N/A" si l'élément est vide
            if (data.worldwide_gross_income == null) {
                modalBoxOffice.innerHTML = "N/A"
            } else  {
                modalBoxOffice.innerHTML = data.worldwide_gross_income.toLocaleString() + " " + data.budget_currency
            }
            document.getElementById("modal-synopsis").innerHTML = data.long_description
        })
        // Rend la modale visible
        let modal = document.getElementById("modal")
        modal.classList.add("show")

        // Rend la modale invisible au clic sur le X
        const modalClose = modal.querySelector("[data-dismiss=dialog]")
        modalClose.addEventListener("click", () => {
            modal.classList.remove("show")
        })    
}