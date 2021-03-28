import {getDataClimaByCiudad} from "./servicios.js"

const formBusqueda = document.getElementById("formBusqueda");
const inputBusqueda = document.getElementById("inputBusqueda");
const carousel = document.querySelector(".main-carousel");
const h1 = document.querySelector("h1");
const mapa = document.getElementById("miMapa")

var miMapa = L.map('miMapa').setView([0, 0], 0);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(miMapa);

let marker = L.marker([0, 0]).addTo(miMapa);

const iniciarFlickity = () => {
    const elem = document.querySelector(".main-carousel");
    var flkty = new Flickity( elem, {
        cellAlign: 'left',
        contain: true
    });
    console.log(flkty);
}

formBusqueda.onsubmit = e => {
    e.preventDefault();
    let ciudad = inputBusqueda.value.trim();
    ciudad !== "" && buscarClimaByCiudad(ciudad);

}

const buscarClimaByCiudad = (ciudad) => {
    getDataClimaByCiudad(ciudad).then((dataClimas) => {
        h1.innerHTML = `Resultados para: <span>${dataClimas.city.name}<span/>`;
        dibujarClimas(dataClimas.list);
        dibujarMapa(dataClimas.city.coord);
    })
}

const diaString = (dia) => {
    const dias = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
    return dias[dia];
}

const dibujarClimas = (listasClimas) => {
    carousel.innerHTML = ""; 
    listasClimas.forEach((objClima) => {
        let fecha = new Date(objClima.dt_txt);
        const fechaString = `${diaString(fecha.getDay())} ${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}
        ${fecha.getHours() <=9 ? `0${fecha.getHours()}`: `${fecha.getHours()}`}:00:00`
        
        const cell = document.createElement("div");
        cell.classList.add("carousel-cell");
        cell.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
        <div class="col-6 d-flex align-items-center">
        <img src="http://openweathermap.org/img/wn/${objClima.weather[0].icon}@4x.png" id="climaIcono" alt="">
        </div>
        <div class="col-6">
        <div class="card-body">
        <h2 class="display-5 text-center"><span>${objClima.main.temp}</span> &#8451;</h2>
        <ul>
        <li><strong>Temp. min.: </strong><span>${objClima.main.temp_min} </span>&#8451;</li>
        <li><strong>Temp. max.: </strong><span>${objClima.main.temp_max} </span>&#8451;</li>
        <li><strong>Sensacion termica: </strong><span>${objClima.main.feels_like} </span>&#8451;</li>
        <li><strong>Humedad: </strong><span>${objClima.main.humidity}%</span></li>
        <li><strong>${fechaString}</strong></li>
        </ul>
        
        </div>
        </div>
        </div>
        </div>
        ` ;
        carousel.appendChild(cell);
    })
    iniciarFlickity();
}

const dibujarMapa = ({lat, lon}) => {
    mapa.style.height = "500px";
    miMapa.flyTo([lat, lon], 13);
    marker.setLatLng([lat, lon]);
}