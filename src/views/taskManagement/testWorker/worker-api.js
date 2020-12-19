import Worker from "worker-loader!./worker.js";


const worker = new Worker();
worker.addEventListener('message',(e)=>{
    console.log("data comback",e);
}); 

export function sendMessage(msg){
    debugger
    worker.postMessage(msg);
}