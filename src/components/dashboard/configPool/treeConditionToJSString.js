var logicalOperand = {
    AND: ' && ',
    OR: ' || '
};

function objStyleToCSSStyle(obj) {
    let styleObj = {
        fontSize: `${obj.fontSize}px`,
        color: obj.fontColor,
        backgroundColor: obj.background,
    };
    
    if(obj.bold){
        styleObj['fontWeight'] = 'bold';
    }

    if(obj.italic){
        styleObj['fontStyle'] = 'italic';
    }

    if(obj.underline){
        styleObj['textDecoration'] = 'underline';
    }

    if(obj.strike){
        if(styleObj.textDecoration){
            styleObj.textDecoration += ' line-through';
        }else{
            styleObj.textDecoration = ' line-through';
        }
    }
    return styleObj;
}
export default {
    mo : {
        isall: (cellValue, userValue) => {
            return true;
        },
        is: (cellValue, userValue) => {
            return cellValue == userValue;
        },
        isnot: (cellValue, userValue) => {
            return cellValue != userValue;
        },
        equal: (cellValue, userValue) => {
            return cellValue == userValue;
        },
        lessthan: (cellValue, userValue) => {
            return cellValue < userValue;
        },
        lessthanorequal: (cellValue, userValue) => {
            return cellValue <= userValue;
        },
    
        greaterthan: (cellValue, userValue) => {
            return cellValue > userValue;
        },
        greaterthanorequal: (cellValue, userValue) => {
            return cellValue <= userValue;
        },
    
        isblank: (cellValue) => {
            return cellValue === '' || cellValue === null || cellValue === undefined; 
        },
        notblank: (cellValue) => {
            return cellValue !== '' && cellValue !== null && cellValue !== undefined; 
        },
        startwith: (cellValue, userValue) => {
            return cellValue.startsWith(userValue);
        },
        notstartwith: (cellValue, userValue) => {
            return !cellValue.startsWith(userValue);
        },
        endwith: (cellValue, userValue) => {
            return cellValue.endsWith(userValue);
        },
        notendwith: (cellValue, userValue) => {
            return !cellValue.endsWith(userValue);
        },
        contains: (cellValue, userValue) => {
            return cellValue.includes(userValue);
        },
        notcontains: (cellValue, userValue) => {
            return !cellValue.includes(userValue);
        },
        in: (cellValue, userValue) => {
            let arr = userValue.split(',');
            return arr.includes(cellValue);
        },
        notIn: (cellValue, userValue) => {
            let arr = userValue.split(',');
            return !arr.includes(cellValue);
        }
    },
    treeItemToJSCondition(node){
        if(node.nodeType == 'item'){
            // let varName = node.column;
            let varName = `row['${node.columnTitle}']`;
            let columnDataType = node.columnDataType;
            let value = node.value;
            if(columnDataType != 'number'){
                value = `'${value}'`;
            }
            let functionName = node.operand;
            return ` mo.${functionName}(${varName}, ${value}) `;
        }else if(node.nodeType == 'group'){
            let arrCond = [];
            for(let childNode of node.children){
                let itemCond = this.treeItemToJSCondition(childNode);
                arrCond.push(itemCond);
            }
            let opr = logicalOperand[node.label];
            let cond = arrCond.join(opr);
            return ` (${cond}) `;
        }
    },
    addConditionFormatToColDef(coldDefs, style, mapNameToColumn){
        let columnNeedFormat = style.conditionalFormat.children.conditionalFormatCondition.value;
        let mapFormatCol = {};
        for(let col of columnNeedFormat){
            let uid = col.applyColumnUid;
            if(!mapFormatCol[uid]){
                mapFormatCol[uid] = [];
            }
            
            for(let cond of col.singleColorConfig){
                mapFormatCol[uid].push({
                    condition: this.treeItemToJSCondition(cond.condition[0]),
                    style: objStyleToCSSStyle(cond.style)
                });
            }
        }
        for(let colDef of coldDefs){
            if(mapFormatCol[colDef.symperColumnName]){
                // colDef.cellStyle = function(params){
                //     var row = params.node.data;
                //     let formatConds = mapFormatCol[colDef.symperColumnName];
                //     for(let item of formatConds){
                //         let checkCondition = eval(item.condition);
                //         if(checkCondition){
                //             return item.style;
                //         }
                //     }
                //     return null;
                // }
                colDef.conditionalFormatInfo = mapFormatCol[colDef.symperColumnName];
            }
        }
        
        if(mapFormatCol['Format entire row']){
            coldDefs.unshift({
                symperColumnName: "Format entire row",
                formatConds: mapFormatCol['Format entire row']
            });
        }
        return coldDefs;
    }
}