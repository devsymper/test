import NodeBase from './NodeBase'
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";
export default class LoadDataset extends NodeBase {
    autoRemoveNullValue = true;
    selectedCols = {};
    constructor(symperId){
        let defaultConfig = {
            allColumns: [],
            idDataset: 0,
            symperDocId: '',
            name: '',
            title: '',
            autoReplaceNullValue: true
        };
        super(symperId, 'Load', defaultConfig);
    }

    getFullConfigsFromSavedData(configs, datasetsMap){
        let fullConfigs = this.restoreSharedProp(configs);
        let idDts = configs.idDataset ? configs.idDataset : 0;
        if(!datasetsMap[idDts]){
            return fullConfigs;
        }
        let map = datasetsMap;
        let originDatasetInfo = datasetsMap[idDts].info;
        fullConfigs.idDataset = idDts;

        if (originDatasetInfo) {
            fullConfigs.symperDocId = originDatasetInfo.symper_id;
            fullConfigs.name = originDatasetInfo.name;
            fullConfigs.title = originDatasetInfo.alias_name;
        }

        if(map[idDts]){
            fullConfigs.subDatasets = map[idDts].subDatasets ? map[idDts].subDatasets : [];
        }else{
            fullConfigs.subDatasets = [];
        }

        fullConfigs.columns = idDts ? map[idDts].columns : [];
        fullConfigs.newIdDataset = configs.newIdDataset;

        let selectedCols = 'allTrue';
        if (configs.selectedCols !== undefined) {
            selectedCols = configs.selectedCols;
        }
        this.selectedCols = selectedCols;
        return fullConfigs;
    }

    process(source, meta){
        if (!meta.type || meta.type == 'change-dataset' ) {
            this.convertInputToConfigs(meta.data);
            this.selectedCols = {};
        } else {}
        this.configsForFirstLoad = false;
        let rsl = [];
        this.configs.allColumns.forEach((ele) => {
            if (ele.selected) {
                rsl.push(ele);
                this.selectedCols[ele.uid] = true;
            }
        });
        return rsl;
    }

    convertInputToConfigs(data){
        let rsl = [];
        let mapSubDts = {};
        if(this.configs.subDatasets){
            this.configs.subDatasets.forEach(item => {
                mapSubDts[item.id] = item;
            });
        }
        let columnGroup = {};
        if(data){
            columnGroup = data.columns ? data.columns : this.configs.columns;
        }else{
            columnGroup = this.configs.columns;
        }

        let newTBName = this.configs.newIdDataset = this.getNewDatasetId();
        rsl = this.getAllFlatColumns(newTBName, columnGroup, this.selectedCols);
        this.configs.allColumns = rsl;
    }

    getAllFlatColumns(newTBName, columnsGroup, selectedCols = {}){
        let rsl = [];
        for (let idDts in columnsGroup) {
            if (!columnsGroup[idDts]) {
                continue;
            }
            columnsGroup[idDts].forEach(item => {
                item.uid = newTBName + '_' + item.name;
                let newCol = new NodeIO(newTBName,
                    item.name,
                    item.type,
                    newTBName,
                    item.title,
                    item.uid,
                    this.id);
                newCol.selected = selectedCols == 'allTrue' ? true : (selectedCols[item.uid] ? true : false);
                rsl.push(newCol);
            });
        }
        return rsl;
    }

    getConfigsToSave(){
        let rsl = this.getCommonProp();
        rsl.idDataset = this.configs.idDataset;
        rsl.selectedCols = {};
        this.configs.allColumns.forEach(ele => {
            if (ele.selected) {
                rsl.selectedCols[ele.uid] = true;
            }
        });
        return rsl;
    }   
}