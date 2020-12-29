
// importScripts('./../workerDataStoreLoader.js.js');
import IndexedDB from "@/plugins/utilModules/indexedDB.js";
self.dataStore = {};
if(!self.document){// Nếu nằm dưới worker
    function getAndSetLoginInfoForWorker() {
        let indexedDB = new IndexedDB('SYMPER-LOGIN-INFOR');
        indexedDB.open('loginInfo', false, false, async()=>{
           let loginedInfo = await indexedDB.read('loginInfo');
            if(typeof loginedInfo == 'string'){
                loginedInfo = JSON.parse(loginedInfo);
			}
			self.dataStore.loginedInfo = loginedInfo;
			console.log(Date.now(), 'getAndSetLoginInfoForWorkergetAndSetLoginInfoForWorkergetAndSetLoginInfoForWorker');
        });
    }
    getAndSetLoginInfoForWorker();
}

import { getDataFromConfig, getDefaultFilterConfig } from "@/components/common/customTable/defaultFilterConfig";
import {uiConfigApi} from "@/api/uiConfig";
import { reject } from "lodash";

self.onmessage = async function (event) {
	var workerDataReceive = event.data;
    let action = workerDataReceive.action;
    let data = workerDataReceive.data;
	switch (action) {
        case 'getData':
			let getDataRes = await getData(data);
            postMessage({action:'getData', dataAfter : getDataRes})
            break;
        case 'getItemForValueFilter':
			let getItemForValueFilterRes = await getItemForValueFilter(data.dataConfig);
            postMessage({action:'getItemForValueFilter', dataAfter : getItemForValueFilterRes})
            break;
        case 'setSelectItemForFilter':
			let setSelectItemForFilterRes = await setSelectItemForFilter(data);
            postMessage({action:'setSelectItemForFilter', dataAfter : setSelectItemForFilterRes})
            break;
        case 'restoreTableDisplayConfig':
			let restoreTableDisplayConfigRes = await restoreTableDisplayConfig(data);
            postMessage({action:'restoreTableDisplayConfig', dataAfter : restoreTableDisplayConfigRes})
            break;
        case 'saveTableDisplayConfig':
			let saveTableDisplayConfigRes = await saveTableDisplayConfig(data);
            postMessage({action:'saveTableDisplayConfig', dataAfter : saveTableDisplayConfigRes})
            break;
        default:
            break;
    }
}

export const getData = function(dataConfig){
	return new Promise((resolve, reject) => {
		let obj = {
		}
		let handler = function(data){
			if(dataConfig.customAPIResult){
				let customData 
				eval("customData = " + dataConfig.customAPIResult)
				data = customData(data)
			}else{
				data = data.data;
			}
			obj.totalObject = data.total ? parseInt(data.total) : 0;
			obj.columnDefs = getTableColumns(
				data.columns, false , dataConfig.savedTableDisplayConfig
			);
			let resData = data.listObject ? data.listObject : []
			if(dataConfig.lazyLoad){
				resData.forEach(function(e){
					obj.rowData.push(e)
				})
			}else{
				obj.rowData = resData;
			}
			obj.columnDefs.forEach(function(e){
				if(e.cellRenderer){
					e.cellRenderer = e.cellRenderer.toString()
				}
			})
			resolve(obj);
		}
		prepareFilterAndCallApi(dataConfig.configs.columns , dataConfig.configs.cache , dataConfig.configs.applyFilter, handler , {} , dataConfig);
	})
}

export const getItemForValueFilter = function(dataConfig){
	return new Promise((resolve, reject)=>{
		let success = (data) => {
			let obj = {}
			if(data.status == 200){
				let items = data.data.listObject.reduce((arr, el) => {
					arr.push(el[dataConfig.columns[0]]);
					return arr;
				}, []);
				obj.selectItems = createSelectableItems(items , dataConfig.colFilter);
			}
			resolve(obj);
		}
		prepareFilterAndCallApi(dataConfig.columns , false, true, success, dataConfig.options, dataConfig);
	})
	
}
export const createSelectableItems = function(items , colFilter){
	let selectableItems = [];
	if(colFilter.clickedSelectAll){ // chọn tất cả
		selectableItems = items.reduce((arr, el) => {
			arr.push({
				value: el,
				checked: true
			});
			return arr;
		}, []);
	}else if(colFilter.selectAll){ // not in
		selectableItems = items.reduce((arr, el) => {
			arr.push({
				value: el,
				checked: colFilter.valuesNotIn[el] ? false : true
			});
			return arr;
		}, []);
	}else{ // in
		selectableItems = items.reduce((arr, el) => {
			arr.push({
				value: el,
				checked: colFilter.valuesIn[el] ? true : false
			});
			return arr;
		}, []);
	}  
	return selectableItems;
}
export const setSelectItemForFilter = function(data){
	let obj = {}
	obj.selectItems = createSelectableItems(data.textItems, data.colFilter)
	return obj
}
export const restoreTableDisplayConfig = async function(data){
	let obj = {}
	let res = await uiConfigApi.getUiConfig(data.widgetIdentifier)
	if(res.status == 200){
		obj.savedConfigs = JSON.parse(res.data.detail);
		if(data.columnDefs.length > 0){
			obj.columnDefs = getTableColumns(data.columnDefs, true)
		}
	}
	return obj
}
export const saveTableDisplayConfig = async function(data){
	let res = await uiConfigApi.saveUiConfig(data.dataToSave)
	return res
}

export const prepareFilterAndCallApi = function(columns = false, cache = false, applyFilter = false, success, configs = {} , dataConfig){
	if (dataConfig.url != "") {
		let emptyOption = false;
		let header = {};
		if(dataConfig.routeName == "deployHistory" || dataConfig.routeName == "listProcessInstances" || dataConfig.useWorkFlowHeader){
			header = {
				Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
				"Content-Type": "application/json",
			};
			emptyOption = true;
		}

		configs.searchKey = dataConfig.searchKey;
		configs.page = configs.page ? configs.page :  dataConfig.page ;
		configs.pageSize = configs.pageSize ? configs.pageSize : dataConfig.pageSize;
		configs.formulaCondition = dataConfig.conditionByFormula;
		let tableFilter = dataConfig.tableFilter;
		tableFilter.allColumnInTable = dataConfig.columnDefs;
		configs.emptyOption = emptyOption;

		if(dataConfig.customDataForApi){
			configs.customDataForApi = dataConfig.customDataForApi;
		}
		getDataFromConfig(dataConfig.url, configs, columns, tableFilter, success, dataConfig.method, header);
	}
}

export const getTableColumns = function(columns, forcedReOrder = false , savedOrderCols){
	let colMap = {};
	if (forcedReOrder) {
		for (let item of columns) {
			colMap[item.field] = item;
		}
	} else {
		for (let item of columns) {
			colMap[item.name] = {
				headerName: item.name,
				field: item.name,
				type: item.type, // lưu ý khi loại dữ liệu của cột là number (cần format) và dạng html
				editor: false,
				symperFixed: false,
				symperHide: false,
				columnTitle: item.title,
				cellRenderer: item.cellRenderer ? item.cellRenderer : null,
				cellRendererParams: item.cellRendererParams ? item.cellRendererParams : null,
				noFilter: item.noFilter ? item.noFilter : false
			};
		}	
		
	}
	if (savedOrderCols.length > 0) {
		let orderedCols = [];
		let noneOrderedCols = [];
		for (let col of savedOrderCols) {
			if(colMap[col.data]){
				colMap[col.data].checkedOrder = true;
				if (colMap[col.data]) {
					colMap[col.data].symperFixed = col.symperFixed;
					colMap[col.data].symperHide = col.symperHide;
					colMap[col.data].hide = col.symperHide;
					colMap[col.data].pinned = col.symperFixed ? 'left': null;
					orderedCols.push(colMap[col.data]);
				} else {
					noneOrderedCols.push(colMap[col.data]);
				}
			}
		}

		for(let colName in colMap){
			if(!colMap[colName].checkedOrder){
				noneOrderedCols.push(colMap[colName]);
			}
		}
		return orderedCols.concat(noneOrderedCols);
	} else {
		return Object.values(colMap);
	}
}