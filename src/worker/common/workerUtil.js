self.dataStore = {};
export const setWorkerDataStore = function(evt){
    if(evt.data.commonData){
        self.dataStore = evt.data.commonData;
    }
}