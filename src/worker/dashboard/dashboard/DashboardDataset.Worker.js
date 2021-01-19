import { biApi } from "@/api/bi.js";
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
    async getColumnDataset(data){
        let listDataset = data.listDataset;
        let listColumnInDataset = data.listColumnInDataset;
        let arrIds = [];
        let str = "";
        if (listDataset.length > 0) {
            for (let i = 0; i < listDataset.length; i++) {
                let datasetId = listDataset[i].id;
                if (!listColumnInDataset.columns[datasetId]) {
                    arrIds.push(datasetId);
                    str += datasetId+",";
                }  
            }
        }

        if (str.length > 0) { // call api get list column in dataset
            str = str.substring(0, str.length-1);
            let res = await biApi.getColumnWithDatasetIds(str)
            if(res['status'] == 200 && res['data']){
                if (res['data'].columns) {
                    listColumnInDataset.columns = Object.assign(listColumnInDataset.columns, res['data'].columns);
                    listColumnInDataset.subDatasets = Object.assign(listColumnInDataset.subDatasets, res['data'].subDatasets);
                }
            }
        }
        let datasetAndColumn = this.mapDataToDatasetAndColumn(listDataset,listColumnInDataset);
        self.postMessage({action:'postGetColumnDatasetAfter', data :{datasetAndColumn: datasetAndColumn,listColumnInDataset: listColumnInDataset}});
   
    },
    mapDataToDatasetAndColumn(datasets,listColumnInDataset){
        let datasetAndColumn = {};

        for(let dts of datasets){
            dts.title = dts.alias_name?dts.alias_name:dts.name;
            dts.show = true;
            dts.subDatasetIds = [];
            dts.isSelected = false;
            dts.columns = listColumnInDataset.columns[dts.id];
            for(let cl of dts.columns){
                cl.show = true;
                cl.isSelected = false;
            }
            if (listColumnInDataset.subDatasets.length > 0) {
                let subDatasets = listColumnInDataset.subDatasets.filter(item=>{
                    return item.id_parent == dts.id;
                });
                if (subDatasets.length > 0) {
                    for (let i = 0; i < subDatasets.length; i++) {
                        subDatasets[i].show = true;
                        subDatasets[i].isSubDataset = true;
                        subDatasets[i].title = subDatasets[i].alias_name?subDatasets[i].alias_name:subDatasets[i].name;
                        subDatasets[i].isSelected = false;

                        dts.subDatasetIds.push(subDatasets[i].id);
                        datasetAndColumn[subDatasets[i].id] = subDatasets[i];
                        datasetAndColumn[subDatasets[i].id].columns = listColumnInDataset.columns[subDatasets[i].id];
                        for(let clSub of datasetAndColumn[subDatasets[i].id].columns){
                            clSub.show = true;
                            clSub.isSelected = false;
                        }
                    }
                }
            }
            datasetAndColumn[dts.id] = dts;
             
        }
     
        return datasetAndColumn;
    },
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