import {setWorkerDataStore} from '@/worker/common/workerUtil'
self.onmessage = async function (event) {
    setWorkerDataStore(event);
	var workerDataReceive = event.data;
    let action = workerDataReceive.data.action;
    let data = workerDataReceive.data.data;
    debugger
	switch (action) {
        // case 'getLastData':
		// 	let lastData = await getLastData(data);
		// 	await postMessage({action:'getLastData', dataAfter : lastData})
        //     break;
        case 'import':
            let dataImport = await cleanedTable(data);
            debugger
            postMessage({action:'import', dataAfter:dataImport})
            break;
        default:
            break;
    }
};
export const cleanedTable = async function(data){
    debugger
    let cleanedTables = data.data.tables.map((t, idx) => ({
        ...idx !== 0 && {
            name: t.name
        },
       
        keyColumn: t.keyColumn ? t.keyColumn : {enable:false, index:-1, name:''},
        sheetMap: t.sheetMap.name,
        controls: t.controls.map(c => ({
            ...c,
            dataColumn: c.dataColumn ? {
                name: c.dataColumn.name,
                index: c.dataColumn.index
            } : null
        }))
    }));
    let general = [];
    for (let i = 0; i < cleanedTables.length; i++) {
        if (!cleanedTables[i].sheetMap) {
            continue;
        }
        let tb = Object.assign({}, cleanedTables[i]);
        tb.controls = [];
        for (let j = 0; j < cleanedTables[i].controls.length; j++) {
            if (cleanedTables[i].controls[j].dataColumn != null && cleanedTables[i].controls[j].dataType != 'table') {
                tb.controls.push(cleanedTables[i].controls[j]);
            }
        }
        general.push(tb);
    }
    let dataImport = {
        fileName: data.data.fileName,
        subObjType: data.data.subObjType,
        documentName: data.data.documentName,
        key: data.data.key,
        nameImport: data.data.nameImport,
        description:data.data.description,
        objId: data.data.objId,
        typeImport: data.data.typeImport,
        objType: data.data.objType,
        mode: 'full',
        mapping: {
            general: general[0],
            tables: general[1] ? general.slice(1, general.length) : [],
        },

    };
    return dataImport
}