import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Lugar } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  mapa:mapboxgl.Map | any;
  
  lugares: Lugar[] = [{
    id: '1',
    nombre: 'Fernando',
    lng: -75.75512993582937,
    lat: 45.349977429009954,
    color: '#dd8fee'
  },
  {
    id: '2',
    nombre: 'Amy',
    lng: -75.75195645527508, 
    lat: 45.351584045823756,
    color: '#790af0'
  },
  {
    id: '3',
    nombre: 'Orlando',
    lng: -75.75900589557777, 
    lat: 45.34794635758547,
    color: '#19884b'
  }];

  constructor() {}

  ngOnInit() {

    this.crearMapa();
  }


  escucharSockets(){

   // marcador - nuevo


   //marcador - mover


   //maracador - borrar 

  }

  crearMapa() {

    this.mapa = new mapboxgl.Map({
      accessToken:'pk.eyJ1IjoiZmVsaXhtdXNlbyIsImEiOiJjbGplbTF5ZWQyaGN0M2RwMnRpdnljeG1vIn0.NK1sxY7Ra1y9-Xtkk5-wdg',
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center:[-75.75900589557777,45.349977429009954],
      zoom:15.8
    });

    for (const marcador of this.lugares){
      this.agregarMarcador(marcador);
    }

  }

  agregarMarcador(marcador:Lugar){

    // const html=`<h2>${marcador.nombre}</h2><br><button>Borrar</button>`;
    // const customPopup= new mapboxgl.Popup({offset:25,
    //   closeOnClick:false}).setHTML(html);
     const h2 =document.createElement('h2');
     h2.innerText=marcador.nombre;
     const btnBorrar=document.createElement('button');
     btnBorrar.innerText='Borrar';

     const div = document.createElement('div');
     div.append(h2,btnBorrar);

    const customPopup= new mapboxgl.Popup({offset:25,
    closeOnClick:false}).setDOMContent(div);

    const marker = new mapboxgl.Marker({
      draggable:true,
      color:marcador.color
    })
    .setLngLat([marcador.lng,marcador.lat])
    .setPopup(customPopup)
    .addTo(this.mapa);

    marker.on('drag',()=>{
      const lngLat=marker.getLngLat();
      console.log(lngLat);
    //TODO CREAR EVENTO PARA EMITIR COORDENADAS
     // marker.remove();
    
     

    });

    btnBorrar.addEventListener('click',()=>{

      marker.remove();
     // todo: eliminar marcadorpor socket

     })

  }

  crearMarcador(){

    const customMarker:Lugar={
      id: new Date().toISOString(),
      nombre: 'Sin Nombre',
      lng: -75.75900589557777,
      lat: 45.349977429009954,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) 
    }

   this.agregarMarcador(customMarker);
       

  }

}
