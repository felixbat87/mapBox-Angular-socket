import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
// import { Usuario } from '../classes/usuario';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
   
  public socketStatus=false;
  // public usuario:Usuario | any;
  constructor(private socket: Socket,
              private router: Router) { 

  this.cargarStorage();
  this.checkStatus();

  }

  checkStatus(){

    this.socket.on('connect', () =>{
      console.log("Conectado al Servidor");
      this.socketStatus=true;
      this.cargarStorage();  
    });


    this.socket.on('disconnect', () =>{
      console.log("Desconectado del Servidor");
      this.socketStatus=false;
    });
    

  }


  emit (evento:string,payload?:any,callback?:Function){
  //
   console.log('Emitiendo',evento)
  this.socket.emit(evento,payload,callback);

  }

  listen(evento:string){
   
    return this.socket.fromEvent(evento);

  }

  loginWS(nombre:string){
 
  return new Promise<void>((resolve,reject) =>{
    this.emit('configurar-usuario',{nombre:nombre},(resp:any)=>{

      // this.usuario= new Usuario(nombre);
      this.guardarStorage();

      resolve();
   
     });
  });

  // this.socket.emit('configurar-usuario',{nombre:nombre},(resp:any)=>{
  //   console.log(resp);
  // });

 


  }

  logoutWS(){
  
  // this.usuario=null;
  localStorage.removeItem('usuario');
  const payload={
    nombre:'sin-nombre'
  };
  this.emit('configurar-usuario',payload,()=>{});
  this.router.navigateByUrl('');

  }

  getUsuario(){

    // return this.usuario;

  }

  guardarStorage(){

  //  localStorage.setItem('usuario',JSON.stringify(this.usuario));

  }

  cargarStorage(){

    if(localStorage.getItem('usuario')){

     
      // this.usuario=JSON.stringify(localStorage.getItem('usuario'));
      // this.loginWS(this.usuario.nombre);

    }else{
      
    }

  }

  


}
