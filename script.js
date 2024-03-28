const main_url = "http://localhost:8000/api/v1/titles/"
const sortedByGenre_url = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score&genre="
const genre_url = "http://localhost:8000/api/v1/genres/"



function best_movie() {
    // Fonction qui affiche le film le mieux noté, toutes catégories confondues

    let img = document.getElementById("best_movie-image")
    let bestTitle = document.getElementById("best_title")
    let best_description = document.getElementById("best_description")


    fetch(main_url + "?sort_by=-imdb_score")
        .then(response => response.json())
        .then(data => {
            img.src = data.results[0].image_url
            bestTitle.innerHTML = data.results[0].title
            best_description.innerHTML = data.description
            fetch(data.results[0].url)
                    .then(response => response.json())
                    .then(data => {
                        best_description.innerHTML = data.description;
                    });
        })
}



function defined_category(category_name, classe) {
    //Fonction qui affiche les 6 meilleurs films d'une catégroie donnée

    // let titre = document.querySelector("h2")
    fetch(sortedByGenre_url + category_name)
        .then(response => response.json())
        .then(data => {
            for (let i=0; i<6; i++) {
                var img = document.createElement("img")
                img.src = data.results[i].image_url
                img.alt = "image"
                document.querySelector(classe).appendChild(img)
            }
        })
}


function get_all_categories() {
    //Fonction qui récupère et retourne la liste de toutes les catégories de films

    liste_genres = []
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
                })
        })
    return liste_genres
}

function get_user_choice(){
    //Fonction qui récupère le choix de l'utilisateur dans le menu déroulant

    let selectElement = document.getElementById("categories");
    let valeurselectionnee = selectElement.options[selectElement.selectedIndex].value;
    // let textselectionne = selectElement.options[selectElement.selectedIndex].text;
    console.log(valeurselectionnee)
    return valeurselectionnee
}

 function chosen_category() {
    // Fonction qui affiche les 6 meilleurs films de la catégorie de films
    // choisie par l'utilisateur via le menu déroulant

    let category = get_user_choice()
    fetch(sortedByGenre_url + category)
        .then(response => response.json())
        .then(data => {
            for (let i=0; i<6; i++) {
                var img = document.createElement("img")
                img.src = data.results[i].image_url
                img.alt = "image"
                document.querySelector(".categorie_choisie").appendChild(img)
            }
        })
}


function main() {
    //Fonction de lancement générale

    best_movie()
    defined_category("Sci-Fi", ".categorie_1")
    defined_category("Fantasy", ".categorie_2")
    defined_category("Music", ".categorie_3")
    get_all_categories()
    get_user_choice()
    chosen_category()
}

main()
