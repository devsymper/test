import { dashboardApi } from "@/api/dashboard.js";

onmessage = function (event) {
    let data = event.data;
    let action = data.action;
    if(handler[action]){
        handler[action](data.data);
    } else {
        console.error(` action ${action} not found `);
    }
};

var handler = {
    postSelectedDatasetBefor(data){
        let selectedDataset = data.selectedDataset;
        let datasetAndColumn = data.datasetAndColumn;
        for(let dtsId in selectedDataset){
            let dtsInfo = datasetAndColumn[dtsId];
            if(!dtsInfo){
                continue;
            }
            dtsInfo.isSelected = true;
            datasetAndColumn[dtsId].isSelected = true;
            for(let name in selectedDataset[dtsId]){
                let column = datasetAndColumn[dtsId].columns.find(ele => ele.name == name);
                if (column) {
                    column.isSelected = true;
                }
            }
            if(dtsInfo.id_parent && datasetAndColumn[dtsInfo.id_parent]){
                datasetAndColumn[dtsInfo.id_parent].isSelected = true;
            }
        }
        
        self.postMessage({action:'postSelectedDatasetAfter', data :{datasetAndColumn: datasetAndColumn}});
    },
    clearSelectedItemDisplay(data){
        let datasetAndColumn = data.datasetAndColumn;
        for(let key in datasetAndColumn){
            datasetAndColumn[key].isSelected = false;
            if (datasetAndColumn[key].columns && datasetAndColumn[key].columns.length > 0) {
                let columns = datasetAndColumn[key].columns;
                for (let i = 0; i < columns.length; i++) {
                    columns[i].isSelected = false;
                }
            }
        }
        self.postMessage({action:'clearSelectedItemDisplayAfter', data :{datasetAndColumn: datasetAndColumn}});
    },
    setOpenPanel(data){
        let datasetAndColumn = data.datasetAndColumn;
        let countParent = 0;
        let maxChildren = 0;
        for(let key in datasetAndColumn){
            if (!datasetAndColumn[key].id_parent) {
                countParent ++;
            }
            if (datasetAndColumn[key].subDatasetIds && datasetAndColumn[key].subDatasetIds.length > maxChildren) {
                maxChildren = datasetAndColumn[key].subDatasetIds.length;
            }
        }
        let dataPos = {};
        dataPos.openedPanelParent = [];
        dataPos.openedPanelChild = [];
        for (let i = 0; i < countParent; i++) {
            dataPos.openedPanelParent.push(i);
        }
        for (let i = 0; i < maxChildren; i++) {
            dataPos.openedPanelChild.push(i);
        }

        self.postMessage({action:'setOpenPanelAfter', data :dataPos});
    },
    searchDatasetColumn(data){
        let datasetAndColumn = data.datasetAndColumn;
        let vl = data.vl.toLowerCase();
        if (vl == "") { // trường hợp này sẽ lặp qua vòng lặp và gán show = true
            for(let key in datasetAndColumn){
                datasetAndColumn[key].show = true; 
                if (datasetAndColumn[key].columns && datasetAndColumn[key].columns.length > 0) {
                    let columns = datasetAndColumn[key].columns;
                    for (let i = 0; i < columns.length; i++) {
                        columns[i].show = true; 
                    }
                } 
            }
        }else{
            for(let key in datasetAndColumn){
                datasetAndColumn[key].show = false; // ban đầu set show = false, check nếu column chưa text thì set lại bằng true
                if (datasetAndColumn[key].columns && datasetAndColumn[key].columns.length > 0) {
                    let columns = datasetAndColumn[key].columns;
                    for (let i = 0; i < columns.length; i++) {
                        columns[i].show = false; 
                        let name = columns[i].name.toLowerCase();
                        let title = columns[i].title.toLowerCase();
                        if (name.includes(vl) || title.includes(vl)) {
                            columns[i].show = true;
                            datasetAndColumn[key].show = true; 
                        }                
                    }
                } 
            }
    
            //check trường hợp table con có show = true thì set table cha show = true
            for(let key in datasetAndColumn){
                if (datasetAndColumn[key].show && datasetAndColumn[key].id_parent != null) {
                    let keyParent = datasetAndColumn[key].id_parent;
                    datasetAndColumn[keyParent].show = true;
                }
            }
    
        }
       
        self.postMessage({action:'searchDatasetColumnAfter', data :{datasetAndColumn:datasetAndColumn}});
    }


}