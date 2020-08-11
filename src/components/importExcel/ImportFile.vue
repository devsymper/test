<template>
<div style="width:505px">
    <v-list-item style="min-height:25px; margin-top:-5px" class="pb-1">
        <v-list-item-content class="py-0">
            <v-list-item-title>
                <i class="mdi mdi-file-upload-outline fs-16 mr-2"></i>
                <span class="font-normal">Import data</span>
                <button v-if="showCancelBtn" @click="cancel()" class="ml-10 mr-6" style="float:right">
                    <i class="mdi mdi-close fs-16 mr-2"></i>
                </button>
            </v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    <v-divider width="440" class="ml-4"></v-divider>
    
    <v-list dense>
        <v-row class="ml-5 mt-1 mr-6">
            <span class="font "><b class="color-grey fw-500">
                    Import dữ liệu cho chứng từ: {{nameDocument}}</b></span>
        </v-row>
        <v-row>
        </v-row>
        <v-row class="ml-2 mt-1">
            <v-col class="col-md-3 font-normal">
                Chọn file
            </v-col>
            <v-col style="margin-top:-5px">
                <UploadFile @dataExcel="getDataExcel" />
            </v-col>
        </v-row>
        <v-row class="ml-5">
            <span><b class="color-grey fs-13 fw-500">Khớp dữ liệu chứng từ và tệp</b></span>
        </v-row>
        <v-row class="ml-5 mt-1 mr-5 color-grey fs-12">
            Các trường dữ liệu tại cột đích có ký hiệu * là các trường bắt buộc phải import
        </v-row>
    </v-list>
    <!-- Thông tin chung -->
    <v-list class="fs-13 ml-4 mr-0">
        <div class="col-flex" style= "margin-bottom:-42px" v-for="(table, tableIdx) in tables" :key="tableIdx">
            <v-row class=" mr-1 mb-4">
                <v-col class="col-md-5 ml-1 pl-2" style="margin-top: -13px">
                    <v-icon v-if="tables[tableIdx]==tables[0]" size="18">mdi-file-outline</v-icon>
                    <v-icon v-else size="18" class='ml-3'>mdi-table</v-icon>
                    <span class="color-grey fs-13 pl-1">
                        <b class="fw-500">{{table.name}}
                            <span v-if="tables[tableIdx]==tables[0]" style="color:red">*
                            </span>
                            ({{table.controls.filter(p => p.dataColumn!=null).length}}/{{table.controls.filter(p => p.dataType!='table').length+1}})</b></span>
                </v-col>
                <v-col class="col-md-6 py-0">
                    <v-autocomplete :value="table.sheetMap" @input="value => onChangeSheet(tableIdx, value)" class="auto-complete color-normal mt-4 mb-3 fs-13 " :items="nameSheets" item-text="name" return-object style="width: 217px;padding-left:2px" clearable :menu-props="{'nudge-top':-10, 'max-width': 300}">
                        <template v-slot:item="{ item, on, attrs }">
                            <v-list-item v-show="item.enable" v-on="on" v-bind="attrs">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{item.name}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>
                <!-- khoá ngoai -->
            </v-row>
            <v-row class=" mr-1 mb-7" style="margin-top: -27px">
                <v-col class="col-md-5 ml-1 pl-4 pb-3 d-flex justify-content">
                    <v-icon style=" margin-top:-45px; font-size:13px " class="pr-3" size="18">mdi mdi-key</v-icon>
                    <div class="color-normal" style="float:left; margin-top:-30px">Khoá</div>
                </v-col>
                <v-col class="col-md-6 py-0" style="margin-left:2px">
                    <v-autocomplete class=" color-normal auto-complete" style="width: 215px" :items="nameColumnDetail[table.sheetMap.name] ? nameColumnDetail[table.sheetMap.name] : []" item-text="name" return-object v-model="table.keyColumn" clearable :menu-props="{'nudge-top':-10, 'max-width': 300}">
                        <template v-slot:item="{ item, on, attrs }">
                            <v-list-item v-show="item.enable" v-on="on" v-bind="attrs">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{item.name}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>
            <v-row class="mr-3 mb-4" v-for="(control, controlIdx) in table.controls" :key="controlIdx" v-if="control.dataType!='table'">
                <v-col class="col-md-5 ml-2 pl-3" style=" margin-top:-57px">
                    <v-icon class='fs-14 mr-2 color-normal'>{{getIcon(control.dataType)}}</v-icon>

                    <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <span v-on="on" class="color-normal"> {{formatName(control.title ? control.title : control.name)}}</span>
                        </template>
                        {{control.title ? control.title : control.name}}
                    </v-tooltip>
                </v-col>
                <v-col class="col-md-6 " style="margin-top:-39px;margin-left:2px">
                    <v-autocomplete style="width: 215px;" class="auto-complete color-normal" :items="nameColumnDetail[table.sheetMap.name] ? nameColumnDetail[table.sheetMap.name] : []" item-text="name" return-object :value="control.dataColumn" @input="value => onChangeDetailInfo(tableIdx, controlIdx, value)" clearable :menu-props="{'nudge-top':-10, 'max-width': 300}">
                        <template v-slot:item="{ item, on, attrs }">
                            <v-list-item v-show="item.enable" v-on="on" v-bind="attrs">
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{item.name}}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                </v-col>
            </v-row>

        </div>
        <v-row class="ml-3"> <span style="color:red; float:right">{{errorMessage}}</span></v-row>
        <v-row class="mr-3 ">
            <v-col class="col-md-9 "></v-col>
            <v-col>
                <v-btn class="ml-1" small @click="importButton()" depressed color="info" style="height:27px; width: 60px; border-radius:2px!important">
                    <span class='fs-13 fw-400'>Import</span>
                </v-btn>
                <!-- <button @click="test()">Null</button> -->
            </v-col>
        </v-row>
    </v-list>
    
</div>
</template>

<script>
import UploadFile from "./UploadFile";
import {
    documentApi
} from "./../../api/Document";
import importApi from "./../../api/ImportExcel";

export default {
    components: {
        UploadFile
    },
    props: ['deleteFileName', 'documentId', 'close'],
    data() {
        return {
            drawer: null,
            isSelecting: false,
            //   documentID:1143,
            //documentId: 1143,//1785
            propertyDocument: [],
            nameDocument: '',
            nameSheets: [],
            nameColumnDetail: {},
            data: {},
            fileName: '',
            dataExel: {},
            tables: [],
            showCancelBtn: true,
            // showImportBtn: true,
            errorMessage: '',
        };
    },
    computed: {
      newImport() {
        return this.$store.state.importExcel.newImport;
      }
    },
    methods: {
        //Chọn key cho bảng
        selectKeyControl(control, allControls) {
            for (let ctrl of allControls) {
                ctrl.isKeyControl = false;
            }
            control.isKeyControl = true;
        },
        cancel() {
            this.$emit('cancel');
            this.$store.commit('importExcel/setNewImport', true);
            this.$emit('reload');
            //window.location.reload();
        },
        // Lấy dữ liệu từ API
        getDataExcel(data) {
            this.data = data.data;
            this.getSheetAndColumnName();
            // this.showImportBtn = true;
        },
        //không để tên quá dài
        formatName(name) {
            if (name.length > 22) {
                return name.slice(0, 22) + "...";
            } else {
                return name
            }
        },
        // Sự kiện được gọi khi ấn import
        importButton() {
            let cleanedTables = this.tables.map((t, idx) => ({
                ...idx !== 0 && {
                    name: t.name
                },
                keyColumn: t.keyColumn ? t.keyColumn : null,
                sheetMap: t.sheetMap.name,
                controls: t.controls.map(c => ({
                    ...c,
                    dataColumn: c.dataColumn ? {
                        name: c.dataColumn.name,
                        index: c.dataColumn.index
                    } : null
                }))
            }));
            // console.log(cleanedTables);
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
                fileName: this.data.fileName,
                documentName: this.nameDocument,
                documentId: this.documentId,
                mode: 'full',
                mapping: {
                    general: general[0],
                    tables: general[1] ? general.slice(1, general.length) : [],
                },

            };
            // console.log(dataImport);
            importApi.pushDataExcel(dataImport)
                .then(res => {
                    if (res.status === 200) {
                        //console.log(res.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                });
            for (let i = 0; i < this.tables.length; i++) {
                if (this.tables[i].sheetMap == '') {
                    this.errorMessage = '* Điền thiếu trường thông tin';
                } else {
                    this.errorMessage = '';
                    this.$emit('showValidate');
                    this.$emit('fileName', this.data.fileName);
                    this.showCancelBtn = false;
                    this.$emit('setInterval');
                    break;
                }
            }
        },
        //Lấy icon theo kiểu dữ liệu
        getIcon(controlType) {
            let typeMap = {
                number: 'mdi-numeric',
                month: 'mdi-numeric',
                percent: 'mdi-numeric',
                date: 'mdi-calendar-month',
                time: 'mdi-clock-outline',
                datetime: 'mdi-calendar-clock'
            }
            if (typeMap[controlType]) {
                return typeMap[controlType];
            } else {
                return 'mdi-alphabetical-variant';
            }
        },
        //Chuyển kiểu dữ liệu trong document thành 4 dạng chính
        getDataType(controlType) {
            let typeMap = {
                number: 'number',
                month: 'number',
                percent: 'number',
                date: 'date',
                time: 'time',
                datetime: 'datetime',
                table: 'table'
            }
            if (typeMap[controlType]) {
                return typeMap[controlType];
            } else {
                return 'text';
            }
        },
        // Lấy tên cột trong db theo từng bảng
        findControlsForTable(nameTable) {
            let controls = [];
            let property = this.propertyDocument.filter(p => p.listFields && p.properties.name == nameTable);
            for (let i = 0; i < property.length; i++) {
                let list = Object.values(property[i].listFields);
                for (let j = 0; j < list.length; j++) {
                    controls.push({
                        name: list[j].properties.name,
                        title: list[j].properties.title,
                        isKeyControl: false,
                        dataColumn: null,
                        dataType: this.getDataType(list[i].type)
                    });
                }
            }
            return controls;
        },

        // Khởi tạo giá trị của các bảng
        createTable(tableNames) {
            // general
            let controls = [];
            for (let i = 0; i < this.propertyDocument.length; i++) {
                controls.push({
                    name: this.propertyDocument[i].properties.name,
                    title: this.propertyDocument[i].properties.title,
                    isKeyControl: false,
                    dataColumn: null,
                    dataType: this.getDataType(this.propertyDocument[i].type)
                });
            };
            let tables = [{
                sheetMap: '',
                name: 'Thông tin chung',
                controls,
            }]

            // tables
            for (let i = 0; i < tableNames.length; i++) {
                tables.push({
                    sheetMap: '',
                    keyColumn: {
                        index: -1,
                        name: ''
                    },
                    name: tableNames[i],
                    controls: this.findControlsForTable(tableNames[i]),
                })
            }
            this.tables = tables;
        },

        //Lấy ra tên các sheet trong excel
        getSheetAndColumnName() {
            let sheets = [];
            for (let i = 0; i < this.data.sheets.length; i++) {
                sheets.push({
                    name: this.data.sheets[i].name,
                    enable: true
                });
            }
            this.nameSheets = sheets;
            let columnDetail = {};
            for (let i = 0; i < this.data.sheets.length; i++) {
                let currentSheet = this.data.sheets[i].name;
                columnDetail[currentSheet] = [];
                for (let j = 0; j < this.data.sheets[i].columns.length; j++) {
                    columnDetail[currentSheet].push({
                        ...this.data.sheets[i].columns[j],
                        enable: true
                    });
                }
            }
            this.nameColumnDetail = columnDetail;
        },
        //Loại những sheet được chọn
        onChangeSheet(tableIdx, value) {
            if (value) {
                value.enable = false;
                if (this.tables[tableIdx].sheetMap) {
                    this.tables[tableIdx].sheetMap.enable = true;
                }
                this.tables[tableIdx].sheetMap = value;
            } else {
                this.tables[tableIdx].sheetMap.enable = true;
                this.tables[tableIdx].sheetMap = '';
            }
            this.tables[tableIdx].controls.forEach(c => {
                if (c.dataColumn) c.dataColumn.enable = true;
            });
            this.tables[tableIdx].controls = this.tables[tableIdx].controls.map(c => ({
                ...c,
                dataColumn: null
            }));
        },
        // loại những cột được chọn. Được chọn chuyển thành false, nếu xoá chuyển thành true
        onChangeDetailInfo(tableIdx, controlIdx, value) {
            if (value) {
                value.enable = false;
                if (this.tables[tableIdx].controls[controlIdx].dataColumn) {
                    this.tables[tableIdx].controls[controlIdx].dataColumn.enable = true;
                }
                this.tables[tableIdx].controls[controlIdx].dataColumn = value;
            } else {
                this.tables[tableIdx].controls[controlIdx].dataColumn.enable = true;
                this.tables[tableIdx].controls[controlIdx].dataColumn = null;
            }
        }
    },
    watch: {
        newImport(val) {
            if (val) {
                this.nameSheets = [];
                this.nameColumnDetail = {};
                this.fileName = '';
                this.showCancelBtn = true;
            }
        },
        close() {
            if (this.close == false) {
                // this.cancel();
                this.showCancelBtn = true;
            }
        },
        documentId(val) {
            if (val) {
                documentApi.detailDocument(this.documentId)
                    .then(res => {
                        if (res.status === 200) {
                            this.nameDocument = res.data.document.title;
                            this.propertyDocument = Object.values(res.data.fields);
                            //console.log( Object.values(this.document));
                            // lưu tên của các property từ API document vào mảng  
                            let tableNames = [];
                            for (let i = 0; i < this.propertyDocument.length; i++) {
                                if (this.propertyDocument[i].type === 'table') {
                                    tableNames.push(this.propertyDocument[i].properties.name);
                                };
                            };
                            // khởi tạo mảng lưu các giá trị của table document
                            this.createTable(tableNames);
                            // console.log( this.createTable(tableNames));
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

        }
    },
    // Lấy API document
    created() {

    },
};
</script>

<style lang="scss" scoped>
.color-grey {
    color: grey;
}

.btn-upload {
    height: 25px !important;
    border-radius: 0px !important
}

.auto-complete ::v-deep .v-input__slot {
    background-color: #F7F7F7;
    margin-top: -19px;
}

.auto-complete ::v-deep .v-label {
    font-size: 13px;
    padding-left: 10px;
}

.auto-complete ::v-deep .v-input__slot:after {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-input__slot:before {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-label--active {
    display: none;
}

.auto-complete ::v-deep .v-list {
    width: 385px !important;
}

.auto-complete ::v-deep .v-select__slot {
    height: 25px
}

.auto-complete ::v-deep .v-input__icon {
    padding-bottom: 6px !important
}

.auto-complete ::v-deep .v-select__slot>input {
    padding-top: 15px;
}

.auto-complete ::v-deep .v-input__icon>button {
    font-size: 14px !important
}

.color-yellow {
    color: #daa520;
    opacity: 0;
}

.color-yellow:hover {
    color: #daa520;
    opacity: 1;
}

.key {
    color: #daa520;
    opacity: 1;
}
</style>
