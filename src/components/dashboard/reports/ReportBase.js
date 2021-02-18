import { getStyleItems } from "@/components/dashboard/configPool/reportStyleItems.js";
import { getColumnConfigItems } from "@/components/dashboard/configPool/reportColumnSettingItems.js";
import { getUsedDatasetsFromSetting } from "@/components/dashboard/configPool/reportConfig.js";
import treeConditionConverter from "@/components/dashboard/configPool/treeConditionToJSString.js";

var commonStyleAttrItems = {
    general: {
        title: 'General',
        items: ['fontFamily', 'bgColor', 'borderWidth', 'borderColor', 'colorPalette']
    },
    title: {
        title: 'Title',
        items: ['show', 'titleText', 'fontColor', 'textSize', 'alignment', 'bgColor']
    }
}

/**
 * Class chứa các thuộc tính và các phương thức chung của toàn bộ các report 
 */
export default class ReportBase {
    // Các thuộc tính bắt buộc phải có ở các class kế thừa class này
    mustOverrideMembers = {
        /**
         * columnSettingKeys chứa cấu hình về các trường cần config cho column của từng report, theo định dạng:
         * {
         *      headerFormat: {
         *          title: 'Header Style',
         *          items: ['show','titleText', ...]
         *      },...
         * }
         */
        columnSettingKeys: {},

        /**
         * Chứa cấu hình về các trường cần config cho style của report, có dạng:
         * {
         *      headerFormat: {
         *          title: 'Header Style',
         *          items: ['show','titleText', ...]
         *      },...
         * }
         */
        styleKeys : {},
    }

    rawConfigs = { // config thô do BA setting
        condition: [], // cấu hình điều kiện cho report này
        setting: {}, // cấu hình cho các cột
        style: {} // cấu hình cho việc hiển thị của report
    };
    sharedConfigs = { // các cấu hình chung của report
        cellId: "", // id đánh tự động của report
        data: [], // dữ liệu thô được lấy từ server
        type: "", // loại report
        yAxisCount: 1, // số lượng yAxis được sử dụng,
        filter: {},
        crossFilterCond: ''
    };
 
    viewConfigs = { // cấu hình phục vụ cho việc hiển thị
        commentCount: 0, // số lượng comment
        displayOptions: { // cấu hình được translate từ các rawConfig thành cấu hình tương ứng của thư viện
            symperTitle: {},
            general: {},
            data: [],
            contentSize: {
                h: 0,
                w: 0
            }
        }, 
        filter: {}, // filter áp dụng cho report này
        isSelecting: false, // có đang click để lựa chọn hay không
        loadingData: false, // có đang tải dữ liệu không 
        needSaveExtraOptions: {}, // các cấu hình phụ cần lưu trong quá trình tương tác với report, vd: chiều rộng của các column trong table sau resize
        selectedDataset: {}, // chứa các cột trong các dataset  được lựa chọn cho report này 
        showIcon: true // có hiển thị icon ko
    };

    constructor(type, symperId = '', columnSettingKeys, styleKeys){
        if(!symperId){
            symperId = 'cell-' + Date.now();
        }
        this.sharedConfigs.cellId = symperId;
        this.sharedConfigs.type = type;
        this.checkRequiredVariables(columnSettingKeys, styleKeys);
        this.setColumnSettingTemplate(columnSettingKeys);
        this.setStyleConfigTemplate(styleKeys);
    }

    setColumnSettingTemplate(columnSettingKeys){
        if(columnSettingKeys){
            this.rawConfigs.setting = getColumnConfigItems(columnSettingKeys);
        }
    }

    setStyleConfigTemplate(styleKeys){
        if(styleKeys){
            let allStyleItems = Object.assign({}, commonStyleAttrItems);
            allStyleItems = Object.assign(allStyleItems, styleKeys);

            let style = {};
            let item = {};
            for(let key in allStyleItems){
                item = allStyleItems[key];
                let group = {
                    children: {},
                    label: item.title,
                    name: key,
                    show: true
                };
                group.children = getStyleItems(item.items);
                style[key] = group;
            }
            this.rawConfigs.style = style;
        }
    }

    checkRequiredVariables(columnSettingKeys, styleKeys){
        let className = this.__proto__.constructor.name;
        if(!columnSettingKeys){
            console.error(`Missing parameter "columnSettingKeys" when construct object in class "${className}"`);
        }

        if(!styleKeys){
            console.error(`Missing parameter "styleKeys" when construct object in class "${className}"`);
        }
    }

    getType(){
        return this.sharedConfigs.type;
    }

    /**
     * Hàm chuyển đổi từ cấu hình của Symper sang cấu hình của thư viện được sử dụng 
     */
    // async translate(){

    // }
    

    /**
     * Hàm lấy config để lưu xuống DB
     */
    getConfigToSave(){
        
    }

    restoreSetting(cell){
        let setting = typeof cell.settings == 'string' ? JSON.parse(cell.settings) : cell.settings;
        for (let name in setting) {
            if (this.rawConfigs.setting.hasOwnProperty(name)) {
                this.rawConfigs.setting[name].selectedColums = setting[name];
            }
        }
    }

    restoreStyle(cell){
        let style = typeof cell.style == 'string' ? JSON.parse(cell.style) : cell.style;
        let item = null;
        for (let key in this.rawConfigs.style) {
            item = this.rawConfigs.style[key];
            if (style.hasOwnProperty(item.name)) {
                for (let propName in style[item.name]) {
                    if (item.children.hasOwnProperty(propName)) {
                        item.children[propName].value = style[item.name][propName].value;
                    }
                }
            }
        }
    }

    restoreByDefault(cell){
        this.rawConfigs.condition = typeof cell.condition == 'string' ? JSON.parse(cell.condition) : cell.condition;
        this.restoreSetting(cell);
        this.restoreStyle(cell);
        this.rawConfigs.extra = cell.extra ? JSON.parse(cell.extra) : {};
        this.sharedConfigs.usedDatasets = getUsedDatasetsFromSetting(this.rawConfigs.setting);
    }

    /**
     * Hàm khôi phục config từ dữ liệu đã lưu thành cấu hình có thể hiển thị
     */
    restoreConfigFromSavedData(cell){
        this.restoreByDefault(cell);
    }

    assignComputedAttrsValue(attr){
        for(let key in attr){
            this[key] = attr[key];
        }
    }

    
    getStyleItemsInConfig(st, sizeUnit = '', ratio) {
        let rsl = {
            textOutline: '0px',
            display: st.show === undefined ? '' : (st.show.value ? '' : 'none'),
            backgroundColor: st.bgColor ? st.bgColor.value : '',
            color: st.fontColor ? st.fontColor.value : '',
            fontFamily: st.fontFamily ? st.fontFamily.value : 'roboto',
            fontSize: ((st.textSize ? st.textSize.value : 13) * ratio) + sizeUnit,
            textAlign: st.alignment ? st.alignment.value : '',
            borderBottomWidth: st.borderBottomWidth ? (st.borderBottomWidth.value + sizeUnit) : '',
            borderWidth: st.borderWidth ? (st.borderWidth.value + sizeUnit) : '',
            borderStyle: st.borderStyle ? st.borderStyle.value : 'none',
        }

        if (st.borderBottomColor && st.borderBottomColor.value) {
            rsl.borderBottomColor = st.borderBottomColor.value;
        }

        if (st.borderColor && st.borderColor.value) {
            rsl.borderColor = st.borderColor.value;
        }

        return rsl;
    }

    
    /**
     * Dịch các thông tin chung của tất cả các cell thành dạng css
     * @param {Object} commonAttr Object chứa thông tin về các thuộc tính chung của cell, 
     * trùng với các thông tin ở hàm  getCommonAttr() trong file getAtyleAttesFuncs
     */
    getCommonCellStyleAttr(commonAttr, ratio) {
        return {
            general: this.getStyleItemsInConfig(commonAttr.general.children, 'px', ratio),
            symperTitle: {
                text: commonAttr.title.children.titleText.value,
                style: this.getStyleItemsInConfig(commonAttr.title.children, 'px', ratio)
            }
        };
    }

    
    getZeroValueDisplay(style) {
        let zeroValueDisplay = style.cellFormat.children.zeroValueDisplay.value;
        if (zeroValueDisplay == 'blank') {
            zeroValueDisplay = '';
        } else if (zeroValueDisplay == 'original') {
            zeroValueDisplay = 0;
        }
        return zeroValueDisplay;
    }

    
    makeDisplayColOptions(cellStyle, list, keyAs = 'name', keyName = 'name', prevDisplayOptions) {
        let rsl = [];
        let extraDisplay = cellStyle.extraData ? cellStyle.extraData : {};
        let colsWidth = extraDisplay.columnsWidth ? extraDisplay.columnsWidth : [];
        let pinnedColIdx = extraDisplay.pinnedColIdx ? extraDisplay.pinnedColIdx : {};
        let run = 0;
        let mapNameToColumn = {};
        list.forEach(element => {
            mapNameToColumn[element.columnName] = element;
            let newCol = {
                headerName: element[keyAs],
                field: element[keyName],
                headerTooltip: element[keyAs],
                symperType: element.type,
                symperColumnName: element.columnName ? element.columnName : element.name,
                editable: false,
                symperCellConfig: {
                    decimal: cellStyle.symperCellConfig.decimalTootip
                },
                lastLineAgg: element.lastLineAgg ? element.lastLineAgg : 'sum',
                headerClass: 'symper-table-dashboard-header',
                cellClass: element.type == 'number' ? 'text-align-right' : '',
            };

            if (element.type == 'number') {
                newCol.cellRenderer = 'numberRenderer';
                newCol.symperCellConfig.zeroValueDisplay = cellStyle.symperCellConfig.zeroValueDisplay;
            }

            if (cellStyle.symperCellConfig.headerWrapText) {
                newCol.headerClass += ' symper-table-dashboard-header-wraptext';
            }

            if (colsWidth[run]) {
                newCol.width = colsWidth[run];
            }

            if (pinnedColIdx[run]) {
                newCol.pinned = pinnedColIdx[run];
            }
            run += 1;
            newCol.symperCellConfig.decimalNumber = cellStyle.symperCellConfig.decimalTootip;
            rsl.push(newCol);
        });
        rsl = treeConditionConverter.addConditionFormatToColDef(rsl, cellStyle.originStyle, mapNameToColumn);
        return rsl;
    }

    /**
     * Hàm check xem một cấu hình đã đủ điều kiện để gọi về server để lấy dữ liệu hay chưa
     * Có thể override ở các class con tùy thuộc vào đặc thù của từng loại chart
     */
    canGetDataFromServer(){
        let columnSetting = this.rawConfigs.setting;
        let canRun = false;
        for(let key in columnSetting){
            if(columnSetting[key].selectedColums && columnSetting[key].selectedColums.length > 0){
                canRun = true;
                break;
            }
        }
        return canRun;
    }


    /**
     * Hàm chỉnh sửa data sau khi đã đi qua hàm translate của class, 
     * có thêm hàm này do: hàm translate được chạy ở worker, 
     * khi muốn set callback cho hành động nào đó mà cần ở trong option của thư viện thì cần phải set ở main process
     * 
     * ******** Lưu ý: ko lạm dụng hàm này để tính toán data, mà chỉ để set những thuộc tính mà worker ko thể truyền cho main process được ********
     * @param {Object} translatedData data đã được translate ở hàm translate 
     */
    static editTranslatedData(translatedData){
        return translatedData;
    }
}