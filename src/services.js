


const table = document.getElementById("films-table");
const tableHead = document.getElementById("films-table").outerHTML;



// 1️⃣ CREATE: Método POST

// Función para mostrar el formulario de creación
function createFilm() {
    document.getElementById("film-form-container").style.display = "block";
}

// Manejar formulario para agregar una película
document.getElementById("film-form").addEventListener("submit", async function (event) {
   
    event.preventDefault(); // Evita la recarga de la página
    

    // Captura los valores del formulario
    const title = document.getElementById("title").value;
    const year = document.getElementById("year").value;
    const director = document.getElementById("director").value;

    // Crea un objeto con los datos
    const newFilm = {
        title: title,
        year: parseInt(year),
        director: director
    };

    try {
        let response = await fetch("http://localhost:3000/films", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFilm)
        });

        if (response.ok) {
            alert("Película agregada con éxito!");
            document.getElementById("film-form").reset(); // Limpia formulario
            document.getElementById("film-form-container").style.display = "none"; // Oculta formulario
            printAllFilms(); // Actualiza la tabla
        } else {
            throw new Error("Error al agregar la película");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});




// 2️⃣ READ: Método GET
async function getAllFilms(){
    try {
        let response = await fetch("http://localhost:3000/films");
        let films = await response.json();
        return films;
    } catch(error) {
        console.log("Error:", error);
    }
}

async function getOneFilm(){
    try{
        let response = await fetch ("http://localhost:3000/films");
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        let films = await response.json();
        console.log(films)
    } catch(error){
        console.error("Error al obtener pelicula:", error.message);
    }
} 





// 3️⃣ UPDATE: metodo PUT

function updateFilms(){

}


// 4️⃣ DELETE: Método DELETE

async function eliminarPelicula(id) {
    const confirmar = confirm(`¿Seguro que quieres eliminar la película con ID: ${id}?`);
    if (confirmar) {
        try {
            await fetch(`http://localhost:3000/films/${id}`, { method: "DELETE" });
            printAllFilms(); // Llama a printAllFilms en lugar de mostrarDatos
        } catch (error) {
            console.error("Error al eliminar la película:", error);
        }
    }
}



// 🖨️ PRINT
async function printAllFilms(){
    const films = await getAllFilms();
    table.innerHTML = tableHead; // Resetea tabla pero mantiene los encabezados
    films.forEach((film) => {
        
        // esto seria otra funcion aparte pero ahora que hemos empezado está ok así
        table.insertAdjacentHTML(
            "beforeend",
            `<tr>
                <td>${film.id}</td>
                <td>${film.title}</td>
                <td>${film.year}</td>
                <td>${film.director}</td>
                <td>
                    <button onclick="eliminarPelicula('${film.id}')">Eliminar</button> 
                </td>
            </tr>`
        );
        // 
    });
}