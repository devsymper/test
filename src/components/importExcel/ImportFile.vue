<template>
<div style="width:500px">
    <v-list-item style="min-height:25px; margin-top:-5px" class="pb-1">
        <v-list-item-content class="py-0">
            <v-list-item-title>
                <i class="mdi mdi-file-upload-outline fs-16 mr-6"></i>
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
            <span class="font "><b class="color-grey fw-500 fs-13">
                Import dữ liệu cho: {{nameDocument}}</b>
            </span>
        </v-row>
        <v-row class="ml-0 mt-1" style="height:32px">
            <v-col class="col-md-4" style="margin-left:-5px; margin-top:-5px">
           <span class="font ml-3 fs-13 "> Chọn kiểu import:</span>
            </v-col>
             <v-col class="col-md-4 ml-9" style="margin-top:-25px">
                  <v-select 
                    class="select-type ml-3 pr-3 w-100" 
                    v-model="selectType"
                    :menu-props="{'nudge-top':-40,'fixed':false}" 
                    :items="selectTypeImport" 
                    item-color="white" 
                    label="--- Chọn ---" 
                    background-color="#F7F7F7">
             </v-select>
            </v-col>
            </v-row>
            <v-row class="ml-2 mt-1">
                <UploadFile 
                    @dataExcel="getDataExcel" 
                    :objId="objId"
                    :objType="objType"
                    :selectType="selectType" 
                    @clearFiles="clearFiles" 
                    @keyUpload="setKey"/>
        </v-row>
        <v-row class="ml-5 mt-1">
            <span style="color:red" class="fs-12">{{errorType}}</span>
        </v-row>
        <v-row class="ml-5">
            <span><b class="color-grey fs-13 fw-500">Lưu ý về việc khớp dữ liệu: </b></span>
        </v-row>
        <v-row class="ml-5 mt-1 mr-5 color-grey fs-12">
            - Các trường dữ liệu tại cột đích có ký hiệu * là các trường bắt buộc phải import
        </v-row>
        <v-row v-if="objType=='user'" class="ml-5 mt-1 mr-7 color-grey fs-12">
           - Mật khẩu gồm tối thiểu 8 ký tự, không quá 24 kí tự, bao gồm ít nhất 1 chữ cái thường, 1 chữ cái hoa và số
        </v-row>
    </v-list>
    <!-- Thông tin chung -->
    <v-list class="fs-13 ml-4 mr-0">
        <div class="col-flex" style= "margin-bottom:-26px" v-for="(table, tableIdx) in tables" :key="tableIdx">
            <v-row  class=" mr-1">
                <v-col class="ellipsis col-md-5 ml-1 pl-2 " style="margin-top: -13px">
                    <v-icon v-if="tables[tableIdx]==tables[0]" size="18">mdi-file-outline</v-icon>
                    <v-icon v-else size="18" class='ml-3'>mdi-table</v-icon>
                    <span class="color-grey fs-13 pl-1">
                        <b class="fw-500">{{table.title}}
                        <span v-if="tables[tableIdx]==tables[0]" style="color:red">*</span>
                               <span v-if="objType!='user'"> ({{sumCount(table.controls.filter(p => p.dataColumn!=null).length, table.keyColumn?(table.keyColumn.enable?1:0):0)}}/{{table.controls.filter(p => p.dataType!='table').length+1}})
                            </span>
                            <span v-else>
                                 ({{sumCount(table.controls.filter(p => p.dataColumn!=null).length, table.keyColumn?(table.keyColumn.enable?1:0):0)}}/{{table.controls.filter(p => p.dataType!='table').length}})
                            </span>   
                        </b>
                        </span>
                </v-col>
                <v-col class="col-md-6 py-0" style="margin-top: -13px">
                    <v-autocomplete :value="table.sheetMap" 
                    @input="value => onChangeSheet(tableIdx, value)" 
                    class="auto-complete color-normal mt-4 mb-3 fs-13 " 
                        :items="nameSheets" 
                        item-text="name" 
                        return-object 
                        style="width: 217px;padding-left:2px" 
                        clearable 
                        :menu-props="{'nudge-top':-10, 'max-width': 300}">
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
            <v-row v-if="objType!='user'" class=" mr-1 mb-3" style="margin-top: -27px">
                <v-col  class="col-md-5 ml-1 pl-4 pb-5 d-flex justify-content">
                    <v-icon style=" margin-top:-19px; font-size:13px " class="pr-3" size="18">mdi mdi-key</v-icon>
                    <div class="color-normal" style="float:left; margin-top:-13px">Khoá<span v-if="tables[tableIdx]==tables[0]" style="color:red"> *</span></div>
                </v-col>
                <v-col class="col-md-6 py-0" style="margin-left:2px">
                    <v-autocomplete class=" color-normal auto-complete" 
                    style="width: 215px"
                     :items="nameColumnDetail[table.sheetMap.name] ? nameColumnDetail[table.sheetMap.name] : []" item-text="name" 
                     return-object 
                     v-model="table.keyColumn" clearable :menu-props="{'nudge-top':-10, 'max-width': 300}">
                        <template v-slot:item="{ item, on, attrs }">
                            <v-list-item v-on="on" v-bind="attrs">
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
            <v-row class="mr-3" v-for="(control, controlIdx) in table.controls" v-if="control.dataType!='table'&&control.title" :key="controlIdx">
                <v-col  class="col-md-5 ml-2 pl-3 ellipsis" style=" margin-top:-40px">
                    <v-icon class='fs-14 mr-2 color-normal'>{{getIcon(control.dataType)}}</v-icon>
                    <v-tooltip right>
                        <template v-slot:activator="{ on}">
                            <span v-on="on" class="color-normal"> {{control.title ? control.title : control.name}}</span>
                        </template>
                        {{control.title ? control.title : control.name}}
                    </v-tooltip>
                </v-col>
                <v-col class="col-md-6 " style="margin-top:-39px;margin-left:2px">
                    <v-autocomplete style="width: 215px;" class="auto-complete color-normal"
                    :items="nameColumnDetail[table.sheetMap.name] ? nameColumnDetail[table.sheetMap.name] : []" 
                    item-text="name" 
                    return-object :value="control.dataColumn" 
                    @input="value => onChangeDetailInfo(tableIdx, controlIdx, value)" 
                    clearable 
                    :menu-props="{'nudge-top':-10, 'max-width': 300}">
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
                <v-btn class="ml-1" small @click="importFile()" 
                depressed color="info" style="height:27px; width: 60px; border-radius:2px!important">
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
    props: ['deleteFileName', 'objId','objType',"nameDocument","tables"],
    data() {
        return {
            newLastKeyTables:[],
            lastKeyTables:[],
            lastKeyGeneral:{},
            selectType:'',
            isSelecting: false,
            nameSheets: [],
            lastTable:[],
            nameColumnDetail: {},
            data: {},
            lastNameSheet:[],
            fileName: '',
            import:false,
            errorType:'',
            dataExel: {},
            showCancelBtn: true,
            errorMessage: '',
            key:'',
            countKey:0,
            selectTypeImport:['Excel','CSV']
        };
    },
    computed: {
      newImport() {
        return this.$store.state.importExcel.newImport;
      },
    },
    created(){
       
          
    },
    methods: {
        sumCount(a,b){
            return a + b;
        },
        //Chọn key cho bảng
        selectKeyControl(control, allControls) {
            for (let ctrl of allControls) {
                ctrl.isKeyControl = false;
            }
            control.isKeyControl = true;
        },
        setKey(val){
            this.key=val;

        },
        cancel() {
            this.$emit('cancel');
            this.$emit('stopSetInterval');
            this.$store.commit('importExcel/setNewImport', true);  
        },
        // xoá dữ liệu trở về mặc định
        clearFiles(){
            //
            this.errorType="";
            this.errorMessage ="";
            this.data=[];
            this.nameSheets=[];
            this.showCancelBtn = true;
            this.nameColumnDetail={};
             this.$emit('stopSetInterval');
            this.$emit('closeValidate');
            for (let i = 0; i < this.tables.length; i++){
                this.tables[i].keyColumn= {enable:false, index:-1, name:''};
                this.tables[i].sheetMap='';
                for (let j = 0; j < this.tables[i].controls.length; j++) {
                        this.tables[i].controls[j].dataColumn=null
                }
            }
            this.getLastData();       
        },
        // Lấy dữ liệu từ API
        getDataExcel(data) {
            if(data.data){
                this.data = data.data;
                    if(Array.isArray(this.data)){
                    }else{
                        this.getSheetAndColumnName();
                    }
            }else{
                if(data.status=='403')
                {
                    this.errorType = "* Bạn không có quyền upload";
                }else{
                this.errorType="* Kiểu file không hợp lệ";
                }
            }
        },
        // Sự kiện được gọi khi ấn import
        importFile() {
            let cleanedTables = this.tables.map((t, idx) => ({
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
                fileName: this.data.fileName,
                documentName: this.nameDocument,
                key: this.key,
                documentId: this.objId,
                typeImport: this.selectType,
                objType: this.objType,
                mode: 'full',
                mapping: {
                    general: general[0],
                    tables: general[1] ? general.slice(1, general.length) : [],
                },
            };

            importApi.pushDataExcel(dataImport)
                .then(res => {
                    if (res.status === 200) {
                         console.log(dataImport);                    }
                })
                .catch(err => {
                });
                    
                let a= this.objType;
                // kiểm tra key rỗng của table chung
                   let check = true;
                    if (this.tables[0].keyColumn==undefined||this.tables[0].keyColumn.index==-1) {
                        if(this.objType=='document'){
                            
                            this.errorMessage = '* Bạn chưa chọn khóa cho thông tin chung';
                        check = false;
                        }
                        
                    };
                    if (this.tables[0].sheetMap == '') {
                        this.errorMessage = '* Điền thiếu trường thông tin chung';
                        check = false;
                    };
                   // kiểm tra bảng con
                     if(this.objType=='document'){
                    for (let i = 0; i < this.tables.length; i++) {
                        
                        if(this.tables[i].sheetMap!='')
                        {
                            if(this.tables[i].keyColumn==undefined||this.tables[i].keyColumn.index==-1){
                            this.errorMessage = '* Bạn chưa chọn khóa cho bảng '+ this.tables[i].title;
                            check = false;
                            }
                        }
                    };
                     }
                    if(check)
                     {
                        this.errorMessage = '';
                        this.$emit('import', {fileName:this.data.fileName});
                        this.showCancelBtn = false;
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
       
        // Khởi tạo giá trị của các bảng
       
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
                    if(this.data.sheets[i].columns[j].name!=''){
                         columnDetail[currentSheet].push({
                        ...this.data.sheets[i].columns[j],
                        enable: true});
                    }
                }
            }
            this.nameColumnDetail = columnDetail;
            this.getMappingTable();
              
        },
        //Sự kiện xảy ra khi thay đổi tên Sheet
        onChangeSheet(tableIdx, value) {
            // 1. Khi select sheet 
            if (value) {
                // chuyển giá trị được chọn thành false
                value.enable = false;
                // đẩy giá trị cũ thành true
                if (this.tables[tableIdx].sheetMap) {
                    this.tables[tableIdx].sheetMap.enable = true;
                }
                // kiểm tra những sheet đã tồn tại khi lấy giá trị từ mapping 
                 for(let i = 0; i<this.nameSheets.length; i++)
                {
                    if(this.nameSheets[i].name ==  this.tables[tableIdx].sheetMap.name){
                        this.nameSheets[i].enable= true;
                    }
                }
                this.tables[tableIdx].sheetMap = value;
              // 2. Khi xóa sheet
            } else {
                let name = this.tables[tableIdx].sheetMap.name;
                this.tables[tableIdx].sheetMap.enable = true;
                this.tables[tableIdx].sheetMap = '';
                for(let i = 0; i<this.nameSheets.length; i++)
                {
                    if(this.nameSheets[i].name == name){
                        this.nameSheets[i].enable= true;
                    }
                }
            }
            this.tables[tableIdx].controls.forEach(c => {
                if (c.dataColumn) c.dataColumn.enable = true;
            });
            this.tables[tableIdx].controls = this.tables[tableIdx].controls.map(c => ({
                ...c,
                dataColumn: null
            }));
        },
        // Sự kiện xảy ra khi thay đổi từng cột thông in trong sheet
        onChangeDetailInfo(tableIdx, controlIdx, value) {
            // trường hợp đổi trực tiếp
            if (value) {
                value.enable = false;
                if (this.tables[tableIdx].controls[controlIdx].dataColumn) {
                    this.tables[tableIdx].controls[controlIdx].dataColumn.enable = true;
                }
                for(let i = 0; i<this.nameSheets.length; i++){
                    let arr = this.nameColumnDetail[this.nameSheets[i].name];
                    for(let j = 0; j<arr.length; j++){
                        if(this.tables[tableIdx].controls[controlIdx].dataColumn!=null){
                            if( this.tables[tableIdx].controls[controlIdx].dataColumn.name==arr[j].name){
                                this.nameColumnDetail[this.nameSheets[i].name][j].enable=true;
                          }
                        }
                    }
                }
                 this.tables[tableIdx].controls[controlIdx].dataColumn = value;
                // trường hợp khi ấn dấu xóa
            } else {
                this.tables[tableIdx].controls[controlIdx].dataColumn.enable = true;
                for(let i = 0; i<this.nameSheets.length; i++){
                    let arr = this.nameColumnDetail[this.nameSheets[i].name];
                    for(let j = 0; j<arr.length; j++){
                        if(this.tables[tableIdx].controls[controlIdx].dataColumn!=null){
                            if( this.tables[tableIdx].controls[controlIdx].dataColumn.name==arr[j].name){
                                this.nameColumnDetail[this.nameSheets[i].name][j].enable=true;
                          }
                        }
                    }
                }
                this.tables[tableIdx].controls[controlIdx].dataColumn = null;
            }
        },

        getLastData(){
            const self = this;
            importApi.getMapping(this.objId)
            .then(res => {
                if (res.status === 200) {
                    let mapping = JSON.parse(res.data[0].mapping);    
                    mapping = mapping.mapping;
                    // tạo 1 mảng lưu những row được lấy
                    let row = [];
                    let lastNameSheet = [];
                    lastNameSheet.push(mapping.general.sheetMap)
                    this.lastKeyGeneral = {enable:true,index:-1,name:''};
                    this.lastKeyTables = [];
                    if(mapping.general.keyColumn){
                        this.lastKeyGeneral.enable = mapping.general.keyColumn.enable;
                        this.lastKeyGeneral.index = mapping.general.keyColumn.index;
                        this.lastKeyGeneral.name = mapping.general.keyColumn.name;
                    }
                    for (let i = 0; i < mapping.general.controls.length; i++) {
                        row.push({
                            controlName:mapping.general.controls[i].name,
                            nameSheet: mapping.general.sheetMap,
                            dataColumn:mapping.general.controls[i].dataColumn.name});
                    };
                    if(mapping.tables){
                        for (let i = 0; i < mapping.tables.length; i++) {
                            lastNameSheet.push(mapping.tables[i].sheetMap);
                            if(mapping.tables[i].keyColumn){
                                let nameLastKeyTables = mapping.tables[i].keyColumn.name
                                this.lastKeyTables.push({name:nameLastKeyTables, index:-1,enable:false});
                            }
                            for(let j = 0; j< mapping.tables[i].controls.length;j++)
                                row.push({
                                    nameSheet: mapping.tables[i].sheetMap,
                                    controlName:mapping.tables[i].controls[j].name,
                                    dataColumn:mapping.tables[i].controls[j].dataColumn.name
                                });
                            }
                        }
                    self.lastTable = row;
                    self.lastNameSheet = lastNameSheet;
                //hàm tìm sheet theo row
                }; 
            })
            .catch(err => {
                console.log(err)
            })
        },
        // phần mapping --- hàm đẩy giá trị mapping vào tables
        pushMappingInTables(name, column){
            this.setLastKeyGeneral();
            for(let i = 0; i<this.tables.length; i++){
               for(let j= 0; j<this.tables[i].controls.length; j++){
                   if(this.tables[i].controls[j].name==name){
                       this.tables[i].controls[j].dataColumn = {name: '',index: 0, enable:false};
                       this.tables[i].controls[j].dataColumn.name= column;
                       this.tables[i].sheetMap={name:'',enable:false};
                       this.tables[i].sheetMap.name = this.getNameSheetMapping(column);
                       this.tables[i].controls[j].dataColumn.index = this.getIndexColumnMapping(column);
                   }
               }
            }
        },
        //phần mapping --- hàm tìm index mới cho cột
         getIndexColumnMapping(value){
            let index = -1;
            for(let i = 0; i<this.nameSheets.length; i++){
                 let arr = this.nameColumnDetail[this.nameSheets[i].name];
                for(let j = 0; j<arr.length; j++){
                    if(arr[j].name==value){
                        // 
                        this.nameColumnDetail[this.nameSheets[i].name][j].enable=false;
                         return index = arr[j].index;
                    }
                }
            }
        },
        //phần mapping--- hàm tìm key cho cột
          setLastKeyGeneral(){
              // xử lý key bảng chung
            for(let i = 0; i<this.nameSheets.length; i++){
                 let arr = this.nameColumnDetail[this.nameSheets[i].name];
                for(let j = 0; j<arr.length; j++){
                    if(arr[j].name==this.lastKeyGeneral.name&&this.tables[0].keyColumn){
                    this.tables[0].keyColumn.name=this.lastKeyGeneral.name;
                    this.tables[0].keyColumn.enable= true;
                    this.tables[0].keyColumn.index= this.getIndexColumnMapping(arr[j].name);
                    }
                }
            }
        },
        // hàm xử lý key từng bảng con, so sánh với dòng trong excel nếu trùng thì set sheetMap
        setLastKeyTables(){
            // kiểm tra để lấy key
            let newLastKeyTables = [];
            for(let i = 0; i<this.lastKeyTables.length; i++){
                 for(let j = 0; j<this.nameSheets.length; j++){
                    let arr = this.nameColumnDetail[this.nameSheets[j].name];
                    for(let k = 0; k<arr.length; k++){
                        if(arr[k].name==this.lastKeyTables[i].name){
                            newLastKeyTables.push({
                                name:this.lastKeyTables[i].name,
                                sheet: this.nameSheets[j].name,
                                index: arr[k].index,
                                enable: true});
                            }
                     }
                }
            }
            this.newLastKeyTables = newLastKeyTables;
            //đẩy key
            const self = this;
            for(let i = 1; i<this.tables.length; i++){
                   for(let j = 0; j<this.newLastKeyTables.length; j++){
                        if(this.tables[i].sheetMap&&this.tables[i].sheetMap.name==this.newLastKeyTables[j].sheet){
                            this.tables[i].keyColumn.name = this.newLastKeyTables[j].name;   
                            this.tables[i].keyColumn.enable = true;
                            this.tables[i].keyColumn.index = this.newLastKeyTables[j].index;
                        }
                    }
                }
        },
        //phần mapping --- hàm tìm sheet lưu cho cột 
        getNameSheetMapping(value){
            let nameSheetMapping = '';
            for(let i = 0; i<this.nameSheets.length; i++){
                 let arr = this.nameColumnDetail[this.nameSheets[i].name];
                for(let j = 0; j<arr.length; j++){
                    if(arr[j].name==value){
                        this.nameSheets[i].enable=false;
                         return nameSheetMapping = this.nameSheets[i].name;
                    }
                }
            }
        },
        //phần mapping---hàm so sánh tên cột trong danh sách file excel và tên cột trong mapping
        getMappingTable(){
            let column = this.nameColumnDetail;
            column =  JSON.stringify(column);
            let columnAr = this.nameColumnDetail;
            columnAr = Object.values(columnAr);
            if(column.length>2){
                //
                for(let m = 0; m<this.lastNameSheet.length;m++){
                    for(let k = 0; k<this.nameSheets.length;k++){
                        if(this.lastNameSheet[m]==this.nameSheets[k].name){
                            for (let i = 0; i < this.lastTable.length; i++) {
                                // nếu file đã được upload, có giá trị lưu tên cột trong file excel
                                for(let j = 0; j < columnAr.length; j++){
                                    for(let k = 0; k < columnAr[j].length; k++){
                                        //nếu tên cột trong file excel trùng giá trị lần mapping cũ 
                                        if(this.lastTable[i].dataColumn==columnAr[j][k].name){
                                            // đẩy giá trị mapping vào
                                            this.pushMappingInTables(this.lastTable[i].controlName,this.lastTable[i].dataColumn)
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            this.setLastKeyTables();
            }else{
                console.log('Không có file Mapping')
            }
        }
    },
    watch: {
        data(){
            this.errorType = "";
        },
        //lay API lần mapping trước
        selectType(){
           this.getLastData();

        },
        newImport(val) {
            if (val) {
                this.nameSheets = [];
                this.nameColumnDetail = {};
                this.fileName = '';
                this.showCancelBtn = true;
                this.selectType='';
            }
        },
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

.select-type ::v-deep .v-label {
    font-size: 13px!important;
    padding-left: 10px;
    margin-bottom: 5px!important;
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

.select-type {
    height: 15px !important;
    font-size: 13px !important;
    border-radius: 1px;
     font-family: Roboto !important;
}

.select-type ::v-deep .v-input__control .v-input__slot {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.select-type ::v-deep .v-input__control .v-select__selection {
    margin-left: 5px;
     font-size: 13px !important;
    font-family: Roboto !important;
}

.select-type ::v-deep .v-label--active {
    display: none;
    font-family: Roboto !important;
}

.select-type ::v-deep .v-list-item__title {
    font-size: 13px !important;
    font-family: Roboto !important;
}

.select-type ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.select-type ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}

.select-type-item {
    color: rgba(0, 0, 0, 0.87) !important;
    caret-color: rgba(0, 0, 0, 0.87) !important;
}
.select-type ::v-deep .v-select__slot{
    height:28px!important
}
.ellipsis{
    overflow: hidden;
    white-space: nowrap; 
    text-overflow: ellipsis
}
</style>
