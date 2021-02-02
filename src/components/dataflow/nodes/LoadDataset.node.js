import NodeBase from './NodeBase'
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";
export default class LoadDataset extends NodeBase {
    autoRemoveNullValue = true;
    selectedCols = {};
    constructor(symperId){
        let defaultConfig = {
            allColumns: [],
            autoReplaceNullValue: true
        };
        super(symperId, 'Load', defaultConfig);
    }

    getFullConfigsFromSavedData(configs, datasetsMap){
        let fullConfigs = this.restoreSharedProp(configs);
        let idDts = configs.idDataset ? configs.idDataset : 0;
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

    process(source){
        if (source != 'change-selected-columns') {
            this.convertInputToConfigs();
            this.selectedCols = {};
        } else {}
        this.configsForFirstLoad = false;
        let rsl = [];
        this.configs.allColumns.forEach((ele) => {
            if (ele.selected) {
                rsl.push(ele);
            }
        });
        return rsl;
    }

    convertInputToConfigs(){
        let rsl = [];
        let mapSubDts = {};
        this.configs.subDatasets.forEach(item => {
            mapSubDts[item.id] = item;
        });
        let newTBName = this.configs.newIdDataset = this.getNewDatasetId();
        rsl = this.getAllFlatColumns(newTBName, this.configs.columns, this.selectedCols);
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
}