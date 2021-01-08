self.addEventListener('message',e =>  {
    console.log("worker got:",e);
    self.postMessage(e.data);
});

// self.onmessage  = function(e){
//     console.log("worker got:",e);
// }

