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

    // let titre = document.querySelector(classe + "h2")
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


async function get_all_categories() {
    //Fonction qui récupère et retourne la liste de toutes les catégories de films

    let liste_genres = []
    await fetch("http://localhost:8000/api/v1/genres")
        .then(response => response.json())
        .then(data => {
            let url = "http://localhost:8000/api/v1/genres/?page_size="
            let nb_genre = data.count
            fetch(url + nb_genre)
                .then(response => response.json())
                .then(data => {
                    for(i=0; i<nb_genre; i++) {
                        let genre = data.results[i].name
                        console.log("---" + data.results[i] + "---" + data.results[i].name)
                        liste_genres.push(genre)
                    }
                })
        })
    console.log(liste_genres)
    console.log(liste_genres.length)
    console.log(liste_genres[5])
    console.log("---")

    return liste_genres
}

async function create_dropdown_menu() {
    let categories = await get_all_categories()
    console.log(categories)
    console.log(categories.length)
    console.log(categories[5])
    console.log("---")
    let truc = ["a","b","c"]
    for(i=0; i<50; i++) {
        truc.push(`${i}`)
    }
    console.log(truc)
    console.log(truc.length)
    console.log(truc[2])
    console.log("---")
    let selection = document.getElementById("categories")
    console.log(selection.innerHTML)
    for(i=0; i<categories.length; i++) {
        let options = `<option value="">${categories[i]}</option>`
        selection.innerHTML += options
        console.log(categories[i])
    }
    console.log("---")
    console.log(selection.innerHTML)
}

function get_user_choice(){
    //Fonction qui récupère le choix de l'utilisateur dans le menu déroulant

    let select = document.getElementById("categories")
    let choice = select.selectedIndex  // Récupération de l'index du <option> choisi
    let user_choice = select.options[choice].text
    return user_choice
}

function chosen_category() {
    // Fonction qui affiche les 6 meilleurs films de la catégorie de films
    // choisie par l'utilisateur via le menu déroulant
    let button = document.querySelector(".dropdownmenu .btn");
    button.addEventListener("click", () => {
        let select = document.getElementById("categories")
        let choice = select.selectedIndex  // Récupération de l'index du <option> choisi
        let user_choice = select.options[choice].text    
        fetch(sortedByGenre_url + user_choice)
            .then(response => response.json())
            .then(data => {
                for (let i=0; i<6; i++) {
                    var img = document.createElement("img")
                    img.src = data.results[i].image_url
                    img.alt = "image"
                    document.querySelector(".categorie_choisie").appendChild(img)
                }
            })
    })
}


function main() {
    //Fonction de lancement générale
    
    best_movie()
    defined_category("Sci-Fi", ".categorie_1")
    defined_category("Fantasy", ".categorie_2")
    defined_category("Music", ".categorie_3")
    create_dropdown_menu()
    // chosen_category()
}

main()
