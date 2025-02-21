// Busca en el HTML el elemento con el id "films-table" y lo guarda en una variable table
const table = document.getElementById("films-table");
// Guarda una copia del HTML completo de la tabla, incluyendo los encabezados, para poder resetearla más tarde. 
const tableHead = document.getElementById("films-table").outerHTML;

// busca en el html el elemento con el id "film-form-container" y lo guarda en la variable filmFormContainer
const filmFormContainer = document.getElementById("film-form-container");
// busca en el html el formulario con el id "film-form" y lo guarda en la variable filmForm
const filmForm = document.getElementById("film-form");

// guarda el id de la película que se está editanto para saber si se está editando
let editingFilmId = null; // Guardará el ID de la película que se edita




// 1️⃣ CREATE: Método POST
function createFilm() {
    editingFilmId = null; // Si estamos creando, no hay ID asociado
    filmForm.reset(); // Limpia formulario
    filmFormContainer.style.display = "block"; // Muestra formulario
}

// Manejar formulario de creación/edición
filmForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita la recarga de la página

    // Captura los valores del formulario
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const director = document.getElementById("director").value;

    // Crea un objeto con los datos
    const filmData = {
        title: title,
        year: parseInt(year),
        director: director
    };

    try {
        let response;
        if (editingFilmId) {
            // Si hay un ID, actualizamos la película (PUT)
            response = await fetch(`http://localhost:3000/films/${editingFilmId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filmData)
            });
        } else {
            // Si no hay ID, creamos una nueva película (POST)
            response = await fetch("http://localhost:3000/films", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filmData)
            });
        }

        if (response.ok) {
            alert(editingFilmId ? "Película editada con éxito!" : "Película agregada con éxito!");
            filmForm.reset(); // Limpia formulario
            filmFormContainer.style.display = "none"; // Oculta formulario
            printAllFilms(); // Actualiza la tabla
            editingFilmId = null; // Reiniciamos el estado de edición
        } else {
            throw new Error("Error al guardar la película");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});

// 2️⃣ READ: Método GET
async function getAllFilms() {
    try {
        let response = await fetch("http://localhost:3000/films");
        let films = await response.json();
        return films;
    } catch (error) {
        console.log("Error:", error);
    }
}

async function getOneFilm(id){
    try{
        let response = await fetch(`http://localhost:3000/films/${id}`);
        if(!response.ok) throw new Error (`Error HTTP: ${response.status}`); 
        let data = await response.json();         
        console.log(data);
     } catch(error){
        console.log("Error al obtener pelicula:", error.message);
    }
}

// 3️⃣ UPDATE: método PUT
async function updateFilm(id) {
    try {
        let response = await fetch(`http://localhost:3000/films/${id}`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        let film = await response.json();

        // Llena el formulario con los datos actuales
        document.getElementById("title").value = film.title;
        document.getElementById("year").value = film.year;
        document.getElementById("director").value = film.director;

        // Guarda el ID de la película que se esté editando
        editingFilmId = id;

        // Muestra el formulario
        filmFormContainer.style.display = "block";
    } catch (error) {
        console.error("Error al obtener película para editar:", error.message);
    }
}

// // 4️⃣ DELETE: Método DELETE
async function eliminarPelicula(id) {
    const confirmar = confirm(`¿Seguro que quieres eliminar la película con ID: ${id}?`);
    if (confirmar) {
        try {
            await fetch(`http://localhost:3000/films/${id}`,
            { 
                method: "DELETE" 
            }
        );
            printAllFilms(); // Recargar la tabla
        } catch (error) {
            console.error("Error al eliminar la película:", error);
        }
    }
}

// 🖨️ PRINT: Mostrar todas las películas en la tabla
async function printAllFilms() {
    const films = await getAllFilms();
    table.innerHTML = tableHead; 

    films.forEach((film) => {
        table.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <td>${film.id}</td>
                <td>${film.title}</td>
                <td>${film.year}</td>
                <td>${film.director}</td>
                <td>
                    <button onclick="eliminarPelicula('${film.id}')">Eliminar</button> 
                    <button onclick="updateFilm('${film.id}')">Editar</button> 
                </td>
            </tr>`
        );
    }); 
}
