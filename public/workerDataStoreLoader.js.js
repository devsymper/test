import IndexedDB from "@/plugins/utilModules/indexedDB.js";
self.dataStore = {};
if(!self.document){// Nếu nằm dưới worker
    function getAndSetLoginInfoForWorker() {
        let indexedDB = new IndexedDB('SYMPER-LOGIN-INFOR');
        indexedDB.open('loginInfo', false, false, async()=>{
            loginedInfo = await indexedDB.read('loginInfo');
            if(typeof loginedInfo == 'string'){
                self.dataStore.loginedInfo = JSON.parse(loginedInfo);
            }
        });
    }
    getAndSetLoginInfoForWorker();
}