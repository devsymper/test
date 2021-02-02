import NodeBase from './NodeBase'
import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import NodeIO from "@/components/dataflow/configPool/NodeIO.js";
import CreateableNewColumnNode from "@/components/dataflow/nodes/CreateableNewColumnNode.js";
const defaultConfig = {
    tableConfig: []
};


function getConfigsCache(tableConfig) {
    let cache = {};
    for(let i =0; i < tableConfig.length; i++){
        let row = tableConfig[i];
        for(let key in row){
            if(typeof row[key] == 'object'){
                let col = row[key];
                if(!cache[col.idDataset]){
                    cache[col.idDataset] = {};
                }
                cache[col.idDataset][col.columnName] = i; 
            }
        }
    }
    return cache;
}

function setCacheItem(configCache, columnMatcheRows, curr, next) {

    curr = columnMatcheRows[curr];
    next = columnMatcheRows[next];

    if (!configCache[curr]) {
        configCache[curr] = {};
    }
    configCache[curr][next] = true;

    if (!configCache[next]) {
        configCache[next] = {};
    }
    configCache[next][curr] = true;
    return configCache;
}


function swapTwoCell(currConfig, colId, pos1, pos2) {
    if (pos1 == pos2) {
        return;
    }
    let datasetId = colId.replace('col', 'dataset');
    let tmp = currConfig[pos1][colId];
    currConfig[pos1][colId] = currConfig[pos2][colId];
    currConfig[pos2][colId] = tmp;

    tmp = currConfig[pos1][datasetId];
    currConfig[pos1][datasetId] = currConfig[pos2][datasetId];
    currConfig[pos2][datasetId] = tmp;
}

function reorderEmptyRows(rows) {
    function swapTwoRows(idx1, idx2) {
        let tmp = rows[idx1];
        rows[idx1] = rows[idx2];
        rows[idx2] = tmp;
    }

    function isEmptyRow(row) {
        for(let key in row){
            let value = row[key];
            if(typeof value == 'string' && value != ''){
                return false;
            }
        }
        return true;
    }

    function findNearestNotEmptyRow(startIndex) {
        for(let i = startIndex; i < rows.length; i++){
            if(!isEmptyRow(rows[i])){
                return i;
            }
        }
        return -1;
    }

    for(let i = 0; i < rows.length -1; i++){
        if(isEmptyRow(rows[i])){
            let nearestNotEmptyRowIdx = findNearestNotEmptyRow(i + 1);
            if(nearestNotEmptyRowIdx > -1){
                swapTwoRows(i, nearestNotEmptyRowIdx);
            }
        }
    }
    return rows;
}

function mergeLastToCurrConfig(currConfig, lastConfigCache, mapInputIndex) {
    function findColumnIndex(colName, colIdx) {
        let key = 'col' + colIdx;
        for(let i = 0; i < currConfig.length ; i++){
            let row = currConfig[i];
            if(row[key].columnName == colName){
                return i;
            }
        }
        return -1;
    }
    for(let datasetId in mapInputIndex){
        if(lastConfigCache[datasetId]){
            let inputIndex = mapInputIndex[datasetId];
            for(let colName in lastConfigCache[datasetId]){
                let prevColIndex = lastConfigCache[datasetId][colName];
                let currColIndex = findColumnIndex(colName, inputIndex);
                if(currColIndex >= 0 && prevColIndex != currColIndex){
                    swapTwoCell(currConfig, 'col' + inputIndex, prevColIndex, currColIndex);
                }
            }
        }
    }
    return currConfig;
}

export default class UnionData extends CreateableNewColumnNode {
    stackInput = true;
    constructor(symperId){
        super(symperId, 'Union', _cloneDeep(defaultConfig));
    }
    
    convertInputToConfigs(){
        let rsl = this.configs;
        rsl.tableConfig = [];
        let countDataset = 1;

        let inputMapNodeIdx = {};
        let mapInputIndex = {};

        for (let nodeId in this.inputMapNode) {
            inputMapNodeIdx[nodeId] = countDataset;
            if(this.inputMapNode[nodeId][0]){
                mapInputIndex[this.inputMapNode[nodeId][0].idDataset] = countDataset;
            }
            countDataset += 1;
        }


        let mapDatasetNum = {};
        let mapColumnTitle = {};

        let sampleColumnConfig = {};
        for (let i = 1; i <= this.inputDatasetCount; i++) {
            sampleColumnConfig['dataset' + i] = '';
            sampleColumnConfig['col' + i] = {};
        }

        this.input.forEach((column, idx) => {
            let idDts = column.idDataset;
            let title = column.title ? column.title : column.columnName;
            title = title ? title : '';
            title = title.trim();

            let columnInsert = _cloneDeep(sampleColumnConfig);

            if (!mapDatasetNum[idDts]) {
                mapDatasetNum[idDts] = inputMapNodeIdx[column.from];
            }

            let lowerTitle = title.toLowerCase();

            if (mapColumnTitle[lowerTitle] === undefined) {
                mapColumnTitle[lowerTitle] = idx;
                columnInsert['dataset' + mapDatasetNum[idDts]] = title;
                columnInsert['col' + mapDatasetNum[idDts]] = column;
            } else {
                rsl.tableConfig[mapColumnTitle[lowerTitle]]['dataset' + mapDatasetNum[idDts]] = title;
                rsl.tableConfig[mapColumnTitle[lowerTitle]]['col' + mapDatasetNum[idDts]] = column;
            }
            columnInsert['index'] = idx;
            rsl.tableConfig.push(columnInsert);
        });
        let notEmptyRows = [];
        let emptyRows = [];
        let mapUidColumnInfo = {};
        let notEmptyRowIdx = 0;
        rsl.tableConfig.forEach((row) => {
            let isEmpty = true;
            let needAdd = true;
            for (let key in row) {
                if (key.includes('col') && !_isEmpty(row[key])) {
                    isEmpty = false;
                    mapUidColumnInfo[row[key].uid] = {
                        idx: notEmptyRowIdx,
                        colInfo: row[key],
                        colId: key
                    };
                    if (needAdd) {
                        notEmptyRowIdx += 1;
                        needAdd = false;
                    }
                }
            }

            if (isEmpty) {
                emptyRows.push(row);
            } else {
                notEmptyRows.push(row);
            }
        });
        rsl.tableConfig = notEmptyRows.concat(emptyRows);
        rsl.tableConfig = mergeLastToCurrConfig(rsl.tableConfig, this.lastConfigCache, mapInputIndex);
        rsl.tableConfig = reorderEmptyRows(rsl.tableConfig);
        this.configs = rsl;
    }

    
    process(source){
        this.resetNewColumnNames();
        let configCache = {}; // xử lý theo kiểu dạng 
        if (source == 'impact') {
            this.convertInputToConfigs();
        }
        let rsl = [];
        let symperTmpDatasetId = this.getNewDatasetId();
        let type = '';
        let name = '';

        this.configs.tableConfig.forEach((row, idx) => {
            let title = '';
            let columnMatcheRows = [];
            for (let key in row) {
                let uid = row[key] ? row[key].uid : false;
                if (key.includes('dataset')) {
                    if (row[key] != '' && row[key] != null) {
                        if (title == '') {
                            title = row[key];
                        }
                        type = row['col' + key.replace('dataset', '')].type;
                    }
                } else if (uid) {
                    columnMatcheRows.push(uid);
                }
            }

            if (title != '') {
                name = this.getNewColumnName(title);
                rsl.push(
                    new NodeIO(
                        symperTmpDatasetId,
                        name,
                        type,
                        symperTmpDatasetId,
                        title,
                        symperTmpDatasetId + '_' + name,
                        this.id
                    )
                );
            }
        });
        configCache = getConfigsCache(this.configs.tableConfig);
        if (source == 'change-config') {
            this.lastConfigCache = Object.assign(this.lastConfigCache, configCache);
        }
        return rsl;
    }



    getConfigsToSave(){
        let configs = this.configs;
        let rsl = this.getCommonProp();

        rsl.tableConfig = [];

        configs.tableConfig.forEach(row => {
            let item = {};
            for (let name in row) {
                if (name.includes('col')) {
                    if (Object.keys(row[name]).length == 0) {
                        item[name] = {};
                    } else {
                        item[name] = {
                            uid: row[name].uid,
                            type: row[name].type,
                            title: row[name].title,
                            idDataset: row[name].idDataset,
                            columnName: row[name].columnName
                        };
                    }
                } else {
                    item[name] = row[name];
                }
            }
            rsl.tableConfig.push(item);
        });
        return rsl;
    }



    getFullConfigsFromSavedData(configs){
        let rsl = this.restoreSharedProp(configs);
        let mapColumnAndUid = {};
        for (let preveId of configs.prevNodes) {
            let prevNode = this.prevNodes[preveId];
            let tmpMap = prevNode.getOutput().reduce((map, el) => {
                map[el.uid] = el;
                return map;
            }, {});
            mapColumnAndUid = Object.assign(mapColumnAndUid, tmpMap);
        }

        let tmpCol = {};

        let idx = 0;
        let configCache = {};
        for (let row of configs.tableConfig) {
            let columnMatcheRows = [];
            for (let col in row) {
                if (col.includes('col') && Object.keys(row[col]).length > 0) {
                    if (mapColumnAndUid[row[col].uid]) {
                        tmpCol = _cloneDeep(mapColumnAndUid[row[col].uid]);
                        tmpCol = Object.assign(tmpCol, row[col]);
                        columnMatcheRows.push(row[col].uid);
                    }
                }
            }
            idx += 1;
        }
        configCache = getConfigsCache(configs.tableConfig);
        this.lastConfigCache = configCache;
        return rsl;
    }

    // showWarning(){
    //     if (currentNode.jointNode && currentNode.jointNode.id == this.id) {
    //         SDataflowEditor.$emit('show-validate-warning', this.waningValidateInfo);
    //     }
    // }

    // removeWarning(){
    //     if (currentNode.jointNode && currentNode.jointNode.id == this.id) {
    //         SDataflowEditor.$emit('show-validate-warning', {});
    //     }
    // }


    validateConfigs(){
        let invalidRowIds = [];
        for (let idx in this.configs.tableConfig) {
            let item = this.configs.tableConfig[idx];
            let firstCol = false;
            for (let key in item) {
                if (key.includes('col') && item[key] && !_isEmpty(item[key]) && item[key] !== null) {
                    firstCol = item[key];
                    break;
                }
            }

            if (firstCol !== false) {
                let firstColType = firstCol.type;
                for (let key in item) {
                    if (key.includes('col') && item[key] && !_isEmpty(item[key]) && item[key] !== null) {
                        if (firstColType != item[key].type) {
                            invalidRowIds.push(idx);
                            break;
                        }
                    }
                }
            }
        }
        this.waningValidateInfo = {
            invalidRowIds: invalidRowIds
        };
        if (invalidRowIds.length > 0) {
            return false;
        }
        return true
    }
    
    // afterNodeSelected(){
    //     setTimeout((this) => {
    //         this.checkAndShowValidate(true);
    //     }, 500, this);
    // }
}