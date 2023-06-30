import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { Lugar } from 'src/app/interfaces/interfaces';
import { WebsocketsService } from 'src/app/services/websockets.service';

interface RespMarcadores{

 [key: string]:Lugar


}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  mapa:mapboxgl.Map | any;
  
  lugares:RespMarcadores ={}
  markersMapbox:{[id:string]:mapboxgl.Marker}={};

  constructor(private http:HttpClient,private wService:WebsocketsService ) {}

  ngOnInit() {

    this.http.get<RespMarcadores>('http://localhost:2000/mapa').subscribe(

     (lugares)=>{
      console.log(lugares);
      this.lugares=lugares;
      this.crearMapa();
     }


    )

    this.escucharSockets();
   

  }


  escucharSockets(){

   // marcador - nuevo

    this.wService.listen('marcador-nuevo').subscribe(
      (marcador:Lugar|any)=>this.agregarMarcador(marcador));
   //marcador - mover
   this.wService.listen('marcador-mover').subscribe(
      (marcador:Lugar| any)=>{
       this.markersMapbox[marcador.id].setLngLat([marcador.lng,marcador.lat]);
      }
   );
  
   //maracador - borrar 
   this.wService.listen('marcador-borrar').subscribe(
    (id:string |any)=>{

      this.markersMapbox[id].remove();
      delete this.markersMapbox[id];

    });
  }

  crearMapa() {

    this.mapa = new mapboxgl.Map({
      accessToken:'pk.eyJ1IjoiZmVsaXhtdXNlbyIsImEiOiJjbGplbTF5ZWQyaGN0M2RwMnRpdnljeG1vIn0.NK1sxY7Ra1y9-Xtkk5-wdg',
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center:[-75.75900589557777,45.349977429009954],
      zoom:15.8
    });

    for (const [id,marcador] of Object.entries(this.lugares)){
     // console.log(id,marcador)
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
    const nuevoMarcador={
     id:marcador.id,
     lng:lngLat.lng,
     lat:lngLat.lat
    }
    this.wService.emit('marcador-mover', nuevoMarcador);

    });

    btnBorrar.addEventListener('click',()=>{

      marker.remove();
      //todo: eliminar marcadorpor socket
      this.wService.emit('marcador-borrar',marcador.id)

     })


     this.markersMapbox[marcador.id]=marker;
     
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
       
   //emitir marcador-nuevo
    
   this.wService.emit("marcador-nuevo",customMarker);

  }

}
