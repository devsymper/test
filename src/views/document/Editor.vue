<template>
    <v-flex class="d-flex sym-document" style="height:calc(100%);">
        <div class="sym-document__side-bar-left">
            <sidebar-left/>
        </div>
            <vue-resizable 
            :active="['r']" 
            width="calc(100% - 480px)" 
            @resize:move="resizeEditor" 
            @resize:start="resizeEditorStart"
            @resize:end="resizeEditorEnd"
            height="calc(100% - 20px)" class="sym-document-editor">

            <div class="sym-document-body">
                <div class="sym-document-action">
                    <editor-action @document-action-save-document="openPanelSaveDocument"/>
                </div>
                    <editor id="editor" api-key="APIKEY"
                    ref="editor"
                    :key="documentId"
                    @onKeyUp="keyHandler"
                    @onClick="detectClickEvent"
                    @onBlur="detectBlurEditorEvent"
                    @onInit="initEditor"
                    :init="{
                        forced_root_block:'div',
                        toolbar_items_size : 'small',
                        menubar: false,
                        plugins: [
                        'advlist autolink lists link image charmap table print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount emoticons'
                        ],
                        contextmenu: 'inserttable table | settingtable',
                        toolbar:
                        'undo redo | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat emoticons | table |  preview allControl margin',
                        fontsize_formats: '8px 10px 11px 12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 32px 34px 36px',
                        font_formats: 'Roboto = Roboto,sans-serif; Andale Mono=andale mono,times;'+ 'Arial=arial,helvetica,sans-serif;'+ 'Arial Black=arial black,avant garde;'+ 'Book Antiqua=book antiqua,palatino;'+ 'Comic Sans MS=comic sans ms,sans-serif;'+ 'Courier New=courier new,courier;'+ 'Georgia=georgia,palatino;'+ 'Helvetica=helvetica;'+ 'Impact=impact,chicago;'+ 'Symbol=symbol;'+ 'Tahoma=tahoma,arial,helvetica,sans-serif;'+ 'Terminal=terminal,monaco;'+ 'Times New Roman=times new roman,times;'+ 'Trebuchet MS=trebuchet ms,geneva;'+ 'Verdana=verdana,geneva;'+ 'Webdings=webdings;'+ 'Wingdings=wingdings,zapf dingbats',
                        valid_elements: '*[*]',
                        content_css:['https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'],
                        setup: function(ed){
                            ed.ui.registry.addMenuItem('settingtable', {
                                text: 'Setting table',
                                disabled : false,
                                onAction: function(e) {
                                    showSettingControlTable(e);
                                }
                            });
                            ed.ui.registry.addButton('allControl', {
                            icon:'preferences',
                            tooltip:'Bảng tổng hợp control',
                                onAction: function (_) {
                                    setShowAllControlOption();
                                }
                            }); 
                            ed.ui.registry.addButton('margin', {
                            icon:'indent',
                            tooltip:'Margin',
                                onAction: function (_) {
                                    showPaddingPageConfig(ed);
                                }
                            }); 
                            
                        }
                    }"
                    ></editor>
            </div>
            </vue-resizable>

        <div  class="sym-document__side-bar-right">
           
                <sidebar-right />
            
        </div>
       
        <s-table-setting  ref="tableSetting" @add-columns-table="addColumnTable"/>
        <auto-complete-control ref="autocompleteControl" @add-control="insertControl"/>
        <save-doc-panel :documentProps="documentProps" ref="saveDocPanel" @save-doc-action="validateControl"/>
        <err-message :listErr="listMessageErr" ref="errMessage"/>
        <all-control-option ref="allControlOption"/>
    </v-flex>
</template>
<script>
import Editor from '@tinymce/tinymce-vue'
import EditorAction from './items/Action.vue'
import SideBarLeft from './sideleft/SideBarLeft.vue'
import SideBarRight from './sideright/SideBarRight.vue'
import TableSetting from './items/TableSetting.vue'
import AutoCompleteControl from './items/AutoCompleteControl.vue'
import controlCss from  "./../../assets/css/document/control/control.css";
import SaveDocPanel from "./../../views/document/items/SaveDocPanel.vue";
import ErrMessagePanel from "./../../views/document/items/ErrMessagePanel.vue";
import AllControlInDoc from "./../../views/document/items/AllControlInDoc.vue";
import { GetControlProps,mappingOldVersionControlProps,mappingOldVersionControlFormulas,getAPropsControl } from "./../../components/document/controlPropsFactory.js";
import { documentApi } from "./../../api/Document.js";
import { util } from "./../../plugins/util.js";
import VueResizable from 'vue-resizable'
let isShowAutocompleteControl = false;
// biến lưu chiều rộng editor trước khi resize 
let editorWidth = 0;
export default { 
    computed: {
        editorStore(){ 
            return this.$store.state.document.editor;
        }
    },
    components: {
        'editor': Editor,
        'sidebar-left' : SideBarLeft,
        'sidebar-right' : SideBarRight,
        'editor-action' : EditorAction,
        's-table-setting' : TableSetting,
        'auto-complete-control' : AutoCompleteControl,
        'save-doc-panel': SaveDocPanel,
        'err-message': ErrMessagePanel,
        "vue-resizable":VueResizable,
        "all-control-option":AllControlInDoc,
    },
    created() {
        this.documentId = this.$route.params.id;
        let thisCpn = this;
        this.$evtBus.$on("document-editor-click-treeview-list-control", locale => {
            let elControl = $("#editor_ifr").contents().find('body #'+locale.id);
            $("#editor_ifr").contents().find('.on-selected').removeClass('on-selected');
            elControl.addClass('on-selected');
            let type = elControl.attr('s-control-type');
            let controlId = elControl.attr('id');
            let table = elControl.closest('.s-control-table');
            if(table.length > 0 && controlId != table.attr('id')){
                let tableId = table.attr('id');
                let control = thisCpn.editorStore.allControl[tableId]['listFields'][controlId];
                thisCpn.selectControl(control.properties, control.formulas,tableId);
            }
            else{
                let control = thisCpn.editorStore.allControl[controlId];
                thisCpn.selectControl(control.properties, control.formulas,controlId);
            }
            
        });
    },
    data(){
        return{
            isAutocompleteControl:false,
            listMessageErr:[],
            documentId:0,
            currentFormulasInput:'',
            currentSelectedInputProps:'',
            documentProps:{},
            delta : 500,
            lastKeypressTime : 0
        }
    },
    watch:{
        // kiểm tra xem route thay đổi khi vào editor là edit doc hay create doc
        '$route' (to) {
            this.$store.commit("document/restoreState");
            this.documentId = Date.now();
            if(to.name =='editDocument'){
                this.documentId = to.params.id;
            }
            if(to.name == 'createDocument'){
                this.documentId = 0;
            }            
        }
    },
    methods:{
        px2cm(px) {
            return (Math.round((px / 37.7952) * 100) / 100).toFixed(1);
        },
        // ham tạo dialog của tinymce để cấu hình padding doc
        showPaddingPageConfig(ed){
                var left = $("#editor_ifr").contents().find('body').css('padding-left').slice(0, -2);
                var right = $("#editor_ifr").contents().find('body').css('padding-right').slice(0, -2);
                var top = $("#editor_ifr").contents().find('body').css('padding-top').slice(0, -2);
                var bottom = $("#editor_ifr").contents().find('body').css('padding-bottom').slice(0, -2);
                left = this.px2cm(left);
                right = this.px2cm(right);
                top = this.px2cm(top);
                bottom = this.px2cm(bottom);
                ed.windowManager.open({
                    title: 'Căn lề trang',
                    body: {
                        type: 'panel',
                        items: [
                        {
                            type: 'input',
                            name: 'top',
                            placeholder:'cm',
                            label: 'Lề trên'
                        },
                        {
                            type: 'input',
                            name: 'right',
                            placeholder:'cm',
                            label: 'Lề phải'
                        },
                        {
                            type: 'input',
                            name: 'bottom',
                            placeholder:'cm',
                            label: 'Lề dưới'
                        },
                        {
                            type: 'input',
                            name: 'left',
                            placeholder:'cm',
                            label: 'Lề trái'
                        },
                        ]
                    },
                    buttons: [
                        {
                        type: 'submit',
                        name: 'submitButton',
                        text: 'Đặt',
                        primary: true
                        }
                    ],
                    
                    onSubmit: function (e) {
                        let data = e.getData();
                        var left = data.left;
                        var right = data.right;
                        var top = data.top;
                        var bottom = data.bottom;
                        $("#editor_ifr").contents().find('body').css({
                            'padding-left': left + 'cm',
                            'padding-right': right + 'cm',
                            'padding-top': top + 'cm',
                            'padding-bottom': bottom + 'cm',
                            'margin':'0',
                        });
                    }
                }
                );
        },
        setShowAllControlOption(){
            this.$refs.allControlOption.showDialog();
        },
        // mở modal lưu , edit doc
        openPanelSaveDocument(){
            this.$refs.saveDocPanel.showDialog()
        },
        // hoangnd: hàm gửi request lưu doc
        saveDocument(){
            let thisCpn = this;
            let htmlContent = this.$refs.editor.editor.getContent()
            let allControl = JSON.stringify(this.editorStore.allControl);
            if(this.documentId != 0 && this.documentId != undefined && typeof this.documentId != 'undefined'){   //update doc
                documentApi.editDocument({documentProperty:JSON.stringify(thisCpn.documentProps),fields:allControl,content:htmlContent,id:this.documentId}).then(res => {
                    if (res.status == 200) {
                        thisCpn.$router.push('/documents');
                    }
                })
                .catch(err => {
                    console.log("error from edit document api!!!", err);
                })
                .always(() => {
                });
            }
            else{
                documentApi.saveDocument({documentProperty:JSON.stringify(thisCpn.documentProps),fields:allControl,content:htmlContent}).then(res => {
                    if (res.status == 200) {
                        thisCpn.$router.push('/documents');
                    }
                })
                .catch(err => {
                    console.log("error from add document api!!!", err);
                })
                .always(() => {
                });
            }
        },
        //hoangnd: hàm xác thưc các control trước khi lưu
        // xac thực tên control và các formulas liên quan
        validateControl(){
            let thisCpn = this;
            let allControl = util.cloneDeep(this.editorStore.allControl);
            let listControlName = [];
            this.listMessageErr = [];
            $('#editor_ifr').contents().find('.s-control-error').removeClass('s-control-error');
            //check trung ten control
            for(let controlId in allControl){
                let control = allControl[controlId];
                console.log(control);
                if(control['listFields'] != undefined){
                    // Object.assign
                }
                this.checkNameControl(controlId,control,listControlName);
                this.validateFormulasInControl(control)
            }
            if(this.listMessageErr.length == 0 && $('#editor_ifr').contents().find('.s-control-error').length == 0){
                this.saveDocument();
            }
            else{
                this.$refs.saveDocPanel.hideDialog();
                setTimeout(function(){
                    thisCpn.$refs.errMessage.showDialog();
                },300)
            }
        },
        // hàm kiểm tra xác thực tên control 
        checkNameControl(controlId,control,listControlName){
            if(control.properties.name.value == ''){
                let controlEl = $('#editor_ifr').contents().find('#'+controlId);
                controlEl.addClass('s-control-error');
                let message = 'Không được bỏ trống tên control'
                if(this.listMessageErr.indexOf(message) === -1){
                    this.listMessageErr.push(message);
                }
            }
            else{
                this.checkDupliucateNameControl(listControlName,control);
            }
        },
      
        // hàm kiểm tra xem co control nào trùng tên hay ko
        checkDupliucateNameControl(listControlName,control){
            if(listControlName.indexOf(control.properties.name.value) === -1){
                listControlName.push(control.properties.name.value);
            }
            else{
                let controlEl = $('#editor_ifr').contents().find('#'+controlId);
                controlEl.addClass('s-control-error');
                if(this.listMessageErr.indexOf('Trùng tên control '+control.properties.name.value) === -1){
                    this.listMessageErr.push('Trùng tên control '+control.properties.name.value);
                }
            }
        },
        // hàm kiểm tra xem trong công thức có trỏ đến control ko tồn tại hay ko
        validateFormulasInControl(control){
            // check control Name trong cong thức
            for(let f in control.formulas){
                if(control.formulas[f].value != ""){
                    let formula = control.formulas[f].value;
                    let controlName = formula.match(/(?<=f.)(\w+)/g);
                    if(controlName != null)
                        for(let i = 0; i< controlName.length; i++){
                            if(listControlName.indexOf(controlName[i]) === -1){
                                let message = "Không tồn tại control "+controlName[i]+" trong công thức "+f+" của control "+control.properties.name.value;
                                if(this.listMessageErr.indexOf(message) === -1){
                                    this.listMessageErr.push(message);
                                }
                            }
                        }
                }
                
            }
        },
        // hàm xử lí thêm các cột vào trong control table khi lưu ở tablesetting
        addColumnTable(listRowData){
            let elements = $('#editor_ifr').contents().find('[data-mce-selected="1"]');
            let table = elements.find('thead').closest('.s-control-table');
            let tableId = table.attr('id');
            let thead = '';
            let tbody = '';
            for(let i = 0; i < listRowData.length; i++ ){
                let row = listRowData[i];
                console.log(row);
                
                let type = row.type;
                let control = GetControlProps(type);
                console.log(control.properties.name);
                
                control.properties.name.value = row.name;
                control.properties.title.value = row.title;
                let controlEl = $(control.html);
                
                controlEl.attr('id', row.key);
                thead += `<th>`+row.columnName+`</th>`
                tbody += `<td>`+controlEl[0].outerHTML+`</td>`
                this.addToAllControlInTable(row.key,{properties: control.properties, formulas : control.formulas,type:type},tableId)
            }
            elements.find('thead tr').html(thead);
            elements.find('tbody tr').html(tbody);
        },

        //hoangnd: hàm mở modal tablesetting của control table
        showSettingControlTable(e) {
            let elements = $('#editor_ifr').contents().find('[data-mce-selected="1"]');
            if(elements.hasClass('s-control-table') || elements.parent().hasClass('s-control-table')){
                let thead = elements.find('thead tr th');
                let tbody = elements.find('tbody tr td');
                let table = (elements.hasClass('s-control-table')) ? element : elements.parent();
                let tableId = table.attr('id');
                let listData = [];
                if($(tbody[1].innerHTML).length > 0){
                    for(let i = 0; i< thead.length; i++){
                        let idControl = $(tbody[i].innerHTML).first().attr('id');
                        let typeControl = $(tbody[i].innerHTML).first().attr('s-control-type');
                        let name = this.editorStore.allControl[tableId]['listFields'][idControl].properties.name.value;
                        let title = this.editorStore.allControl[tableId]['listFields'][idControl].properties.title.value;
                        let row = {columnName: $(thead[i]).text(),name: name,title:title, type: typeControl,key:idControl}
                        listData.push(row)
                    }
                }
                this.$refs.tableSetting.showDialog();
                this.$refs.tableSetting.setListRow(listData);
            }
        },

        // hàm add các thuộc tính và formulas của control vào danh sách các control trong doc được lưu trong state
        addToAllControlInDoc(controlId,control){
            this.$store.commit(
                "document/addControl",{id:controlId,props:control}
            );  
        },
        // hàm add các thuộc tính và formulas của control vào danh sách các control trong table được lưu trong state
        addToAllControlInTable(controlId,control,tableId){
            this.$store.commit(
                "document/addControlToTable",{id:controlId,props:control,tableId:tableId}
            );  
        },
        // set config cho phần sidebar phải các thuộc tính control đang được click
        selectControl(properties,formulas,id){
            this.$store.commit(
                "document/addCurrentControl",
                {properties:properties,
                formulas:formulas,id:id}
            );
        },
        hideAutocompletaControl(){
            $('.list-control-autocomplete').css({
                'display': 'none',
            })
        },
        //hoangnd : hàm được gọi từ AutoCompleteControl component để insert 1 control
        insertControl(type){
            this.hideAutocompletaControl();
            let contentNode = $(this.$refs.editor.editor.selection.getNode())[0].innerHTML
            let control =  GetControlProps(type);
            var checkDiv = $(control.html);
            var inputid = 's-control-id-' + Date.now();
            checkDiv.attr('id', inputid);
            if (checkDiv.attr('s-control-type') != 'table') {
                checkDiv.attr('contenteditable', false);
            }

            let newContent = contentNode.replace(/\/{2}/, checkDiv[0].outerHTML);
            $(this.$refs.editor.editor.selection.getNode()).html(newContent+"&nbsp;")
            let table = $(this.$refs.editor.editor.selection.getNode()).closest('.s-control-table');
            this.selectControl(control.properties, control.formulas,inputid);
            if(table.length > 0 && inputid != table.attr('id')){
                let tableId = table.attr('id');
                this.addToAllControlInTable(inputid,{properties: control.properties, formulas : control.formulas,type:type},tableId);
            }
            else{
                this.addToAllControlInDoc(inputid,{properties: control.properties, formulas : control.formulas,type:type});
            }


            
            
            
            
        },
        // hoangnd: hàm nhận sự kiện keyup của editor 
        // 191: / để thêm control
        
        keyHandler(event)
        {
            let thisCpn = this;
            if ( event.keyCode == 191 )
            {
                var thisKeypressTime = new Date();
                if ( thisKeypressTime - this.lastKeypressTime <= this.delta )
                {
                    var scroll_top = $("#editor_ifr").contents().scrollTop();
                    var nodePosition = $(thisCpn.$refs.editor.editor.selection.getNode()).position();
                    var off = $(thisCpn.$refs.editor.editor.selection.getNode()).offset();
                    var top = nodePosition.top;
                    var left = nodePosition.left;
                    var width_toolbox = $('.sym-document__side-bar-left').width();
                    let marginDoc = $('.tox-sidebar-wrap').css('marginLeft').replace('px', '');
                    $('.list-control-autocomplete')
                    .css({
                        'top': top + 120 - scroll_top,
                        'left': left + width_toolbox + parseInt(marginDoc),
                    })
                    setTimeout(function(){
                        $('.list-control-autocomplete')
                        .css({
                            'display': 'block',
                        })
                    },10)
                    $('.list-control-autocomplete .tf-search-control').focus();
                    thisKeypressTime = 0;
                }
                this.lastKeypressTime = thisKeypressTime;
            }
        },
        
        //su kiện click vào editor
        detectClickEvent(event){
        // kiểm tra nếu click ngoài khung autocomplete control thì đóng lại
            if (event.target.id != 'list-control-autocomplete' && $(event.target).parents('#list-control-autocomplete').length == 0) {
                this.hideAutocompletaControl();
            }
        },
        // hàm click ra ngoài editor thì cập nhật lại dữ liệu của store
        detectBlurEditorEvent(event){
            let allControlEl = $('#editor_ifr').contents().find('.s-control');
            let listId = []
            $.each(allControlEl,function(k,v){
                let id = $(v).attr('id');
                listId.push(id);
            })
            
            this.$store.commit(
                "document/minimizeControl",{allId:listId}
            );
        },
      
        
        // resize been phair editor thi set lại chiều rộng cho size bar right
        resizeEditor(e){
            let documentW = $(document).width();
            $('.sym-document__side-bar-right').css({width:documentW - $('.v-navigation-drawer').width() - $('.sym-document__side-bar-left').width() - $('.sym-document-editor').width() +'px'})
        },
        resizeEditorStart(e){
            var $div = $('<div />').appendTo('.sym-document-body');
            $div.attr('id','bg-over-editor')
            $div.css({'background':'transparent','z-index':'1000000','position': 'absolute','height':'100%','width':'100%','top':'0'})
        },
        resizeEditorEnd(e){
            $('#bg-over-editor').remove();
        },
        setContentForDocumentV1(dataDocument){
            let thisCpn = this;
            $("#editor_ifr").contents().find('.bkerp-input').addClass('s-control').removeClass('bkerp-input');
            $("#editor_ifr").contents().find('head link').remove()
            $("#editor_ifr").contents().find('body link').remove()
            $("#editor_ifr").contents().find('body meta').remove()
            $("#editor_ifr").contents().find('body style').remove()
            let allControl = $("#editor_ifr").contents().find('.s-control:not(.bkerp-input-table .s-control)');
            $.each(allControl,function(item,value){
                let controlProps = $(value).attr('data-property');
                let type = $(value).attr('bkerp-type');
                let style = $(value).attr('style');
                if(type == 'text') type = 'textInput'
                if(type == 'persent') type = 'percent'
                let controlV2 = GetControlProps(type);
                let controlEl = $(controlV2.html); 
                var inputid = 's-control-id-' + Date.now();
                controlEl.attr('id', inputid).attr('style',style);
                controlEl.replaceAll($(value))
                try {
                    
                    controlProps = JSON.parse(controlProps);
                    let controlProp = {};
                    let controlFormulas = {};
                    $.each(controlProps,function(k,v){
                        if(mappingOldVersionControlProps[k] != undefined && controlV2.properties[mappingOldVersionControlProps[k]] != undefined){
                            controlV2.properties[mappingOldVersionControlProps[k]].value = v;
                        }
                        if(mappingOldVersionControlFormulas[k] != undefined && controlV2.formulas[mappingOldVersionControlProps[k]] != undefined){
                            controlV2.formulas[mappingOldVersionControlProps[k]].value = v;
                        }
                        
                        
                    });
                    thisCpn.addToAllControlInDoc(inputid,{properties: controlV2.properties, formulas : controlV2.formulas,type:type});
                } catch (error) {   
                    console.log(error);
                }
                
                if(type == 'table'){
                    let tableId = inputid;
                    let tableEl = controlEl;
                    let bodyTable = $(value).find('table');
                    tableEl.find('table').remove();
                    tableEl.append(bodyTable);
                    tableEl.find('table thead').attr('contenteditable',true);
                    let allControlInTable = tableEl.find('.s-control');
                    $.each(allControlInTable,function(item,value){
                        let childControlProps = $(value).attr('data-property');
                        let type = $(value).attr('bkerp-type');
                        let style = $(value).attr('style');
                        if(type == 'text') type = 'textInput'
                        if(type == 'persent') type = 'percent'
                        let childControlV2 = GetControlProps(type);
                        let controlEl = $(childControlV2.html); 
                        var inputid = 's-control-id-' + Date.now();
                        controlEl.attr('id', inputid).attr('style',style);
                        controlEl.replaceAll($(value))
                        try {
                            
                            childControlProps = JSON.parse(childControlProps);
                            let controlProp = {};
                            let controlFormulas = {};
                            $.each(childControlProps,function(k,v){
                                if(mappingOldVersionControlProps[k] != undefined && childControlV2.properties[mappingOldVersionControlProps[k]] != undefined){
                                    childControlV2.properties[mappingOldVersionControlProps[k]].value = v;
                                }
                                if(mappingOldVersionControlFormulas[k] != undefined && childControlV2.formulas[mappingOldVersionControlProps[k]] != undefined){
                                    childControlV2.formulas[mappingOldVersionControlProps[k]].value = v;
                                }
                                
                            });
                            thisCpn.addToAllControlInTable(inputid,{properties: childControlV2.properties, formulas : childControlV2.formulas,type:type},tableId);
                        } catch (error) {   
                            console.log(error);
                        }
                        
                        
                    })
                    
                }
                
                
            })
        },
        // hàm gọi request lấy thông tin của document khi vào edit doc
        getContentDocument(){
            let thisCpn = this;
            if(this.documentId != 0){
                documentApi.detailDocument(this.documentId).then(res => {
                    if (res.status == 200) {
                        thisCpn.setDocumentProperties(res.data.document);
                        let content = res.data.document.content;
                        thisCpn.$refs.editor.editor.setContent(content);
                        if(res.data.document.version == 1){
                            thisCpn.setContentForDocumentV1(res.data.document);
                        }
                        else{
                            let fields = res.data.fields;
                            thisCpn.setDataForPropsControl(fields);
                        }
                        
                        
                    }
                })
                .catch(err => {
                    console.log("error from detail document api!!!", err);
                })
                .always(() => {
                });
            }
        },

        setDocumentProperties(documentProp){
            this.documentProps = {
                name : { 
                    title: "Tên document",
                    type: "text",
                    value: documentProp.name,
                },
                title : {
                    title: "Tiêu đề document",
                    type: "text",
                    value: documentProp.title,
                },
                recentName : {
                    title: "Tên trường hiển thị thông tin trong mục gần đây",
                    type: "text",
                    value: documentProp.title_for_rencent,
                },
                editObjectValidate : {
                    title: "Điều kiện Edit Object",
                    type: "textarea",
                    value: documentProp.edit_condition,
                },
                public : {
                    title: "Public",
                    type: "checkbox",
                    value: (documentProp.allow_public == '0') ? false : true,
                },
                mobile : {
                    title: "Mobile",
                    type: "checkbox",
                    value: (documentProp.mobile == '0') ? false : true,
                },
                editAfterSubmit : {
                    title: "Sửa dữ liệu sau submit",
                    type: "checkbox",
                    value: (documentProp.edit_able == '0') ? false : true,
                },
                submitOutsideWorkflow : {
                    title: "Submit ngoài workflow",
                    type: "checkbox",
                    value: (documentProp.add_outside_wf == '0') ? false : true,
                },
                note : {
                    title: "Ghi chú",
                    type: "textarea",
                    value: documentProp.note,
                }
            } 
        },
        //hoangnd: hàm set các giá trị của thuộc tính và formulas vào từng contrl trong doc lúc load dữ liệu và đưa vào state
        setDataForPropsControl(fields){
            for(let controlId in fields){
                let control = GetControlProps(fields[controlId].type)
                let properties = control.properties
                let formulas = control.formulas
                let type = fields[controlId].type
                $.each(properties,function(k,v){
                    if(properties[k].type == 'checkbox'){
                        properties[k].value = (fields[controlId][k] == 0 || fields[controlId][k] == '0' || fields[controlId][k] == '') ? false : true
                    }
                    else{
                        properties[k].value = fields[controlId][k]
                    }
                })
                if(fields[controlId].type != "table"){
                    this.addToAllControlInDoc(controlId,{properties: properties, formulas : formulas,type:fields[controlId].type});
                }
                else{
                    let listField = fields[controlId].listFields
                    let listChildField = {};
                    for(let childFieldId in listField){
                        let childControl = GetControlProps(listField[childFieldId].type)
                        let childProperties = childControl.properties
                        let childFormulas = childControl.formulas
                        let childType = listField[childFieldId].type
                        $.each(childProperties,function(k,v){
                            if(childProperties[k].type == 'checkbox'){
                                childProperties[k].value = (listField[childFieldId][k] == 0 || listField[childFieldId][k] == '0' || listField[childFieldId][k] == '') ? false : true
                            }
                            else{
                                childProperties[k].value = listField[childFieldId][k]
                            }
                        })
                        listChildField[childFieldId] = {properties: childProperties, formulas : childFormulas,type:childType}
                        }
                    this.addToAllControlInDoc(controlId,{properties: properties, formulas : formulas,type:fields[controlId].type,listFields:listChildField});
                }
                
            }
        },

        // sự kiện xảy ra khi khởi tạo xong editor , sự kiện do tinymce cung cấp
        initEditor(){
            let thisCpn = this;
            thisCpn.setDocumentProperties({})
            if(this.documentId != 0)    // trường họp edit doc thì gọi api lấy dữ liệu
            thisCpn.getContentDocument();
            var currentElement, currentElementChangeFlag, elementRectangle, countdown, dragoverqueue_processtimer;
            // object xử lí các vấn đề với kéo thả control vào document
            var DragDropFunctions = {
                dragoverqueue: [],
                GetMouseBearingsPercentage: function($element, elementRect, mousePos) {
                    if (!elementRect)
                        elementRect = $element.get(0).getBoundingClientRect();
                    var mousePosPercent_X = ((mousePos.x - elementRect.left) / (elementRect.right - elementRect.left)) * 100;
                    var mousePosPercent_Y = ((mousePos.y - elementRect.top) / (elementRect.bottom - elementRect.top)) * 100;

                    return { x: mousePosPercent_X, y: mousePosPercent_Y };
                },
                OrchestrateDragDrop: function($element, elementRect, mousePos) {
                    //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
                    if (!$element || $element.length == 0 || !elementRect || !mousePos)
                        return false;

                    if ($element.is('html'))
                        $element = $element.find('body');
                    //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
                    var breakPointNumber = { x: 5, y: 5 };

                    var mousePercents = this.GetMouseBearingsPercentage($element, elementRect, mousePos);
                    if ((mousePercents.x > breakPointNumber.x && mousePercents.x < 100 - breakPointNumber.x) && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100 - breakPointNumber.y)) {
                        //Case 1 -
                        let $tempelement = $element.clone();
                        $tempelement.find(".drop-marker").remove();
                        if ($tempelement.html() == "" && !this.checkVoidElement($tempelement)) {
                            if (mousePercents.y < 90)
                                return this.PlaceInside($element);
                        } else if ($tempelement.children().length == 0) {
                            //text element detected
                            //console.log("Text Element");
                            this.DecideBeforeAfter($element, mousePercents);
                        } else if ($tempelement.children().length == 1) {
                            //only 1 child element detected
                            //console.log("1 Child Element");
                            this.DecideBeforeAfter($element.children(":not(.drop-marker,[data-dragcontext-marker])").first(), mousePercents);
                        } else {
                            var positionAndElement = this.findNearestElement($element, mousePos.x, mousePos.y);
                            this.DecideBeforeAfter(positionAndElement.el, mousePercents, mousePos);
                            //more than 1 child element present
                            //console.log("More than 1 child detected");
                        }
                    } else if ((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y)) {
                        var validElement = null
                        if (mousePercents.y <= mousePercents.x)
                            validElement = this.FindValidParent($element, 'top');
                        else
                            validElement = this.FindValidParent($element, 'left');

                        if (validElement.is("body,html"))
                            validElement = $("#editor_ifr").contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").first();
                        this.DecideBeforeAfter(validElement, mousePercents, mousePos);
                    } else if ((mousePercents.x >= 100 - breakPointNumber.x) || (mousePercents.y >= 100 - breakPointNumber.y)) {
                        var validElement = null
                        if (mousePercents.y >= mousePercents.x)
                            validElement = this.FindValidParent($element, 'bottom');
                        else
                            validElement = this.FindValidParent($element, 'right');

                        if (validElement.is("body,html"))
                            validElement = $("#editor_ifr").contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").last();
                        this.DecideBeforeAfter(validElement, mousePercents, mousePos);
                    }
                },
                DecideBeforeAfter: function($targetElement, mousePercents, mousePos) {
                    if (mousePos) {
                        mousePercents = this.GetMouseBearingsPercentage($targetElement, null, mousePos);
                    }

                    /*if(!mousePercents)
                    {
                    mousePercents = this.GetMouseBearingsPercentage($targetElement, $targetElement.get(0).getBoundingClientRect(), mousePos);
                    } */

                    let $orientation = ($targetElement.css('display') == "inline" || $targetElement.css('display') == "inline-block");
                    if ($targetElement.is("br"))
                        $orientation = false;

                    if ($orientation) {
                        if (mousePercents.x < 50) {
                            return this.PlaceBefore($targetElement);
                        } else {
                            return this.PlaceAfter($targetElement);
                        }
                    } else {
                        if (mousePercents.y < 50) {
                            return this.PlaceBefore($targetElement);
                        } else {
                            return this.PlaceAfter($targetElement);
                        }
                    }
                },
                checkVoidElement: function($element) {
                    var voidelements = ['i', 'area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'video', 'iframe', 'source', 'track', 'wbr'];
                    var selector = voidelements.join(",")
                    if ($element.is(selector))
                        return true;
                    else
                        return false;
                },
                calculateDistance: function(elementData, mouseX, mouseY) {
                    return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
                },
                FindValidParent: function($element, direction) {
                    switch (direction) {
                        case "left":
                            while (true) {
                                var elementRect = $element.get(0).getBoundingClientRect();
                                var $tempElement = $element.parent();
                                var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                                if ($element.is("body"))
                                    return $element;
                                if (Math.abs(tempelementRect.left - elementRect.left) == 0)
                                    $element = $element.parent();
                                else
                                    return $element;
                            }
                            break;
                        case "right":
                            while (true) {
                                var elementRect = $element.get(0).getBoundingClientRect();
                                var $tempElement = $element.parent();
                                var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                                if ($element.is("body"))
                                    return $element;
                                if (Math.abs(tempelementRect.right - elementRect.right) == 0)
                                    $element = $element.parent();
                                else
                                    return $element;
                            }
                            break;
                        case "top":
                            while (true) {
                                var elementRect = $element.get(0).getBoundingClientRect();
                                var $tempElement = $element.parent();
                                var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                                if ($element.is("body"))
                                    return $element;
                                if (Math.abs(tempelementRect.top - elementRect.top) == 0)
                                    $element = $element.parent();
                                else
                                    return $element;
                            }
                            break;
                        case "bottom":
                            while (true) {
                                var elementRect = $element.get(0).getBoundingClientRect();
                                var $tempElement = $element.parent();
                                var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                                if ($element.is("body"))
                                    return $element;
                                if (Math.abs(tempelementRect.bottom - elementRect.bottom) == 0)
                                    $element = $element.parent();
                                else
                                    return $element;
                            }
                            break;
                    }
                },
                addPlaceHolder: function($element, position, placeholder) {
                    if (!placeholder)
                        placeholder = this.getPlaceHolder();
                    this.removePlaceholder();
                    switch (position) {
                        case "before":
                            placeholder.find(".message").html($element.parent().data('sh-dnd-error'));
                            $element.before(placeholder);
                            // console.log($element);
                            // console.log("BEFORE");
                            this.AddContainerContext($element, 'sibling');
                            break;
                        case "after":
                            placeholder.find(".message").html($element.parent().data('sh-dnd-error'));
                            $element.after(placeholder);
                            // console.log($element);
                            // console.log("AFTER");
                            this.AddContainerContext($element, 'sibling');
                            break
                        case "inside-prepend":
                            placeholder.find(".message").html($element.data('sh-dnd-error'));
                            $element.prepend(placeholder);
                            this.AddContainerContext($element, 'inside');
                            // console.log($element);
                            // console.log("PREPEND");
                            break;
                        case "inside-append":
                            placeholder.find(".message").html($element.data('sh-dnd-error'));
                            $element.append(placeholder);
                            this.AddContainerContext($element, 'inside');
                            // console.log($element);
                            // console.log("APPEND");
                            break;
                    }
                },
                removePlaceholder: function() {
                    $("#editor_ifr").contents().find(".drop-marker").remove();
                },
                getPlaceHolder: function() {
                    return $("<li class='drop-marker'></li>");
                },
                PlaceInside: function($element) {
                    var placeholder = this.getPlaceHolder();
                    placeholder.addClass('horizontal').css('width', $element.width() + "px");
                    this.addPlaceHolder($element, "inside-append", placeholder);
                },
                PlaceBefore: function($element) {
                    var placeholder = this.getPlaceHolder();
                    var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block");
                    if ($element.is("br")) {
                        inlinePlaceholder = false;
                    } else if ($element.is("td,th")) {
                        placeholder.addClass('horizontal').css('width', $element.width() + "px");
                        return this.addPlaceHolder($element, "inside-prepend", placeholder);
                    }
                    if (inlinePlaceholder)
                        placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
                    else
                        placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
                    this.addPlaceHolder($element, "before", placeholder);
                },

                PlaceAfter: function($element) {
                    var placeholder = this.getPlaceHolder();
                    var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block");
                    if ($element.is("br")) {
                        inlinePlaceholder = false;
                    } else if ($element.is("td,th")) {
                        placeholder.addClass('horizontal').css('width', $element.width() + "px");
                        return this.addPlaceHolder($element, "inside-append", placeholder);
                    }
                    if (inlinePlaceholder)
                        placeholder.addClass("vertical").css('height', $element.innerHeight() + "px");
                    else
                        placeholder.addClass("horizontal").css('width', $element.parent().width() + "px");
                    this.addPlaceHolder($element, "after", placeholder);
                },
                findNearestElement: function($container, clientX, clientY) {
                    var _this = this;
                    var previousElData = null;
                    var childElement = $container.children(":not(.drop-marker,[data-dragcontext-marker])");
                    if (childElement.length > 0) {
                        childElement.each(function() {
                            if ($(this).is(".drop-marker"))
                                return;

                            var offset = $(this).get(0).getBoundingClientRect();
                            var distance = 0;
                            var distance1, distance2 = null;
                            var position = '';
                            var xPosition1 = offset.left;
                            var xPosition2 = offset.right;
                            var yPosition1 = offset.top;
                            var yPosition2 = offset.bottom;
                            var corner1 = null;
                            var corner2 = null;

                            //Parellel to Yaxis and intersecting with x axis
                            if (clientY > yPosition1 && clientY < yPosition2) {
                                if (clientX < xPosition1 && clientY < xPosition2) {
                                    corner1 = { x: xPosition1, y: clientY, 'position': 'before' };
                                } else {
                                    corner1 = { x: xPosition2, y: clientY, 'position': 'after' };
                                }

                            }
                            //Parellel to xAxis and intersecting with Y axis
                            else if (clientX > xPosition1 && clientX < xPosition2) {
                                if (clientY < yPosition1 && clientY < yPosition2) {
                                    corner1 = { x: clientX, y: yPosition1, 'position': 'before' };
                                } else {
                                    corner1 = { x: clientX, y: yPosition2, 'position': 'after' };
                                }

                            } else {
                                //runs if no element found!
                                if (clientX < xPosition1 && clientX < xPosition2) {
                                    corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' }; //left top
                                    corner2 = { x: xPosition1, y: yPosition2, 'position': 'after' }; //left bottom
                                } else if (clientX > xPosition1 && clientX > xPosition2) {
                                    //console.log('I m on the right of the element');
                                    corner1 = { x: xPosition2, y: yPosition1, 'position': 'before' }; //Right top
                                    corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' }; //Right Bottom
                                } else if (clientY < yPosition1 && clientY < yPosition2) {
                                    // console.log('I m on the top of the element');
                                    corner1 = { x: xPosition1, y: yPosition1, 'position': 'before' }; //Top Left
                                    corner2 = { x: xPosition2, y: yPosition1, 'position': 'after' }; //Top Right
                                } else if (clientY > yPosition1 && clientY > yPosition2) {
                                    // console.log('I m on the bottom of the element');
                                    corner1 = { x: xPosition1, y: yPosition2, 'position': 'before' }; //Left bottom
                                    corner2 = { x: xPosition2, y: yPosition2, 'position': 'after' } //Right Bottom
                                }
                            }

                            distance1 = _this.calculateDistance(corner1, clientX, clientY);

                            if (corner2 !== null)
                                distance2 = _this.calculateDistance(corner2, clientX, clientY);

                            if (distance1 < distance2 || distance2 === null) {
                                distance = distance1;
                                position = corner1.position;
                            } else {
                                distance = distance2;
                                position = corner2.position;
                            }

                            if (previousElData !== null) {
                                if (previousElData.distance < distance) {
                                    return true; //continue statement
                                }
                            }
                            previousElData = { 'el': this, 'distance': distance, 'xPosition1': xPosition1, 'xPosition2': xPosition2, 'yPosition1': yPosition1, 'yPosition2': yPosition2, 'position': position }
                        });
                        if (previousElData !== null) {
                            var position = previousElData.position;
                            return { 'el': $(previousElData.el), 'position': position };
                        } else {
                            return false;
                        }
                    }
                },
                AddEntryToDragOverQueue: function($element, elementRect, mousePos) {
                    var newEvent = [$element, elementRect, mousePos];
                    this.dragoverqueue.push(newEvent);
                },
                ProcessDragOverQueue: function($element, elementRect, mousePos) {
                    var processing = this.dragoverqueue.pop();
                    this.dragoverqueue = [];
                    if (processing && processing.length == 3) {
                        var $el = processing[0];
                        var $elRect = processing[1];
                        var mousePos = processing[2];
                        this.OrchestrateDragDrop($el, $elRect, mousePos);
                    }

                },
                GetContextMarker: function() {
                    let $contextMarker = $("<div data-dragcontext-marker><span data-dragcontext-marker-text></span></div>");
                    return $contextMarker;
                },
                AddContainerContext: function($element, position) {

                    let $contextMarker = this.GetContextMarker();
                    this.ClearContainerContext();
                    if ($element.is('html,body')) {
                        position = 'inside';
                        $element = $("#editor_ifr").contents().find("body");
                    }
                    switch (position) {
                        case "inside":
                            this.PositionContextMarker($contextMarker, $element);
                            if ($element.hasClass('stackhive-nodrop-zone'))
                                $contextMarker.addClass('invalid');
                            var name = this.getElementName($element);
                            $contextMarker.find('[data-dragcontext-marker-text]').html(name);
                            if ($("#editor_ifr").contents().find("body [data-sh-parent-marker]").length != 0)
                                $("#editor_ifr").contents().find("body [data-sh-parent-marker]").first().before($contextMarker);
                            else
                                $("#editor_ifr").contents().find("body").append($contextMarker);
                            break;
                        case "sibling":
                            this.PositionContextMarker($contextMarker, $element.parent());
                            if ($element.parent().hasClass('stackhive-nodrop-zone'))
                                $contextMarker.addClass('invalid');
                            var name = this.getElementName($element.parent());
                            $contextMarker.find('[data-dragcontext-marker-text]').html(name);
                            $contextMarker.attr("data-dragcontext-marker", name.toLowerCase());
                            if ($("#editor_ifr").contents().find("body [data-sh-parent-marker]").length != 0)
                                $("#editor_ifr").contents().find("body [data-sh-parent-marker]").first().before($contextMarker);
                            else
                                $("#editor_ifr").contents().find("body").append($contextMarker);
                            break;
                    }
                },
                PositionContextMarker: function($contextMarker, $element) {
                    var rect = $element.get(0).getBoundingClientRect();
                    $contextMarker.css({
                        height: (rect.height + 4) + "px",
                        width: (rect.width + 4) + "px",
                        top: (rect.top + $($("#editor_ifr").get(0).contentWindow).scrollTop() - 2) + "px",
                        left: (rect.left + $($("#editor_ifr").get(0).contentWindow).scrollLeft() - 2) + "px"
                    });
                    if (rect.top + $("#editor_ifr").contents().find("body").scrollTop() < 24)
                        $contextMarker.find("[data-dragcontext-marker-text]").css('top', '0px');
                },
                ClearContainerContext: function() {
                    $("#editor_ifr").contents().find('[data-dragcontext-marker]').remove();
                },
                getElementName: function($element) {
                    return $element.prop('tagName');
                }
            };
            $(".sym-document-tab-control .sym-control").attr('draggable', 'true');
            
            $(".sym-control").on('dragstart', function(event) {
                dragoverqueue_processtimer = setInterval(function() {
                    DragDropFunctions.ProcessDragOverQueue();
                }, 100);
                var controlType = $(this).attr('control-type');
                console.log(controlType);
                
                let control = GetControlProps(controlType);
                event.originalEvent.dataTransfer.setData("control", JSON.stringify(control));
            });

            $(".sym-control").on('dragend', function() {
                clearInterval(dragoverqueue_processtimer);
                DragDropFunctions.removePlaceholder();
                DragDropFunctions.ClearContainerContext();
            });
            var style = $("<style data-reserved-styletag></style>").html(GetInsertionCSS());
            var clientFrameWindow = $('#editor_ifr').get(0).contentWindow;
            $(clientFrameWindow.document.head).append(style);

            var htmlBody = $(clientFrameWindow.document).find('body,html');
            htmlBody.css({height:"calc(100% - 10px)"})


            htmlBody.find('*').on('dragenter', function(event) {
                event.stopPropagation();
                currentElement = $(event.target);
                if (currentElement.attr('s-control-type') !== 'image') {
                    currentElementChangeFlag = true;
                    elementRectangle = event.target.getBoundingClientRect();
                    countdown = 1;
                }
            }).on('dragover', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (currentElement.attr('s-control-type') !== 'image') {
                    if (countdown % 15 != 0 && currentElementChangeFlag == false) {
                        countdown = countdown + 1;
                        return;
                    }
                    event = event || window.event;

                    var x = event.originalEvent.clientX;
                    var y = event.originalEvent.clientY;
                    countdown = countdown + 1;
                    currentElementChangeFlag = false;
                    var mousePosition = { x: x, y: y };
                    DragDropFunctions.AddEntryToDragOverQueue(currentElement, elementRectangle, mousePosition);
                }
            })
            //click vào 1 control trong doc thì lấy từ store để set giá trị cho currentSelected control trong store
            // mục đích đê cập nhật lại view nhập các thuộc tính
            $("#editor_ifr").contents().find('body').on('click','.s-control',function(e){
                e.stopPropagation();
                e.preventDefault();
                $(clientFrameWindow.document).find('.on-selected').removeClass('on-selected')
                if(!$(this).hasClass('on-selected')){
                    $(this).addClass('on-selected');
                }
                let type = $(this).attr('s-control-type');
                let controlId = $(this).attr('id');
                let table = $(this).closest('.s-control-table');
                if(table.length > 0 && controlId != table.attr('id')){
                    let tableId = table.attr('id');
                    let control = thisCpn.editorStore.allControl[tableId]['listFields'][controlId];
                    thisCpn.selectControl(control.properties, control.formulas,tableId);
                }
                else{
                    let control = thisCpn.editorStore.allControl[controlId];
                    thisCpn.selectControl(control.properties, control.formulas,controlId);
                }
            })

            // sự kiện thả control vào doc
            // xử lí thêm props của control vào store
            $(clientFrameWindow.document).find('body,html').on('drop', function(event) {
                event.preventDefault();
                event.stopPropagation();
                var e;
                if (event.isTrigger)
                    e = triggerEvent.originalEvent;
                else
                    var e = event.originalEvent;
                try {
                    var control = e.dataTransfer.getData('control');
                    control = JSON.parse(control)
                    var insertionPoint = $("#editor_ifr").contents().find(".drop-marker");
                    var checkDiv = $(control.html);
                    let typeControl = checkDiv.attr('s-control-type');
                    var inputid = 's-control-id-' + Date.now();
                    checkDiv.attr('id', inputid);
                    insertionPoint.after(checkDiv);
                    let table = insertionPoint.closest('.s-control-table'); // nếu kéo control vào table thì lưu prop của control đó vào table trong allControl của state
                    let idTable = '';
                    checkDiv.prop('readonly', false);
                    if (checkDiv.attr('s-control-type') != 'table') {
                        checkDiv.attr('contenteditable', false);
                    }
                    insertionPoint.remove();
                    thisCpn.selectControl(control.properties, control.formulas,inputid);
                    if(table.length > 0){   // nếu keo control vào trong table thì update dữ liệu trong table của state
                        idTable = table.attr('id');
                        thisCpn.addToAllControlInTable(inputid,{properties: control.properties, formulas : control.formulas,type:typeControl},idTable);
                    }
                    else{
                        thisCpn.addToAllControlInDoc(inputid,{properties: control.properties, formulas : control.formulas,type:typeControl});
                    }
                    // set_window_property(inputid, objecttype);
                } catch (e) {}
            });
            

            function GetInsertionCSS() {
                var styles = ".reserved-drop-marker{width:100%;height:2px;background:#00a8ff;position:absolute}.reserved-drop-marker::after,.reserved-drop-marker::before{content:'';background:#00a8ff;height:7px;width:7px;position:absolute;border-radius:50%;top:-2px}.reserved-drop-marker::before{left:0}.reserved-drop-marker::after{right:0}";
                styles += "[data-dragcontext-marker],[data-sh-parent-marker]{outline:#19cd9d solid 2px;text-align:center;position:absolute;z-index:123456781;pointer-events:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}[data-dragcontext-marker] [data-dragcontext-marker-text],[data-sh-parent-marker] [data-sh-parent-marker-text]{background:#19cd9d;color:#fff;padding:2px 10px;display:inline-block;font-size:14px;position:relative;top:-24px;min-width:121px;font-weight:700;pointer-events:none;z-index:123456782}[data-dragcontext-marker].invalid{outline:#dc044f solid 2px}[data-dragcontext-marker].invalid [data-dragcontext-marker-text]{background:#dc044f}[data-dragcontext-marker=body]{outline-offset:-2px}[data-dragcontext-marker=body] [data-dragcontext-marker-text]{top:0;position:fixed}";
                styles += '.drop-marker{pointer-events:none;}.drop-marker.horizontal{background:#00adff;position:absolute;height:2px;list-style:none;visibility:visible!important;box-shadow:0 1px 2px rgba(255,255,255,.4),0 -1px 2px rgba(255,255,255,.4);z-index:123456789;text-align:center}.drop-marker.horizontal.topside{margin-top:0}.drop-marker.horizontal.bottomside{margin-top:2px}.drop-marker.horizontal:before{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-top:-3px;float:left;box-shadow:0 1px 2px rgba(255,255,255,.4),0 -1px 2px rgba(255,255,255,.4)}.drop-marker.horizontal:after{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-top:-3px;float:right;box-shadow:0 1px 2px rgba(255,255,255,.4),0 -1px 2px rgba(255,255,255,.4)}.drop-marker.vertical{height:50px;list-style:none;border:1px solid #00ADFF;position:absolute;margin-left:3px;display:inline;box-shadow:1px 0 2px rgba(255,255,255,.4),-1px 0 2px rgba(255,255,255,.4)}.drop-marker.vertical.leftside{margin-left:0}.drop-marker.vertical.rightside{margin-left:3px}.drop-marker.vertical:before{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-top:-4px;top:0;position:absolute;margin-left:-4px;box-shadow:1px 0 2px rgba(255,255,255,.4),-1px 0 2px rgba(255,255,255,.4)}.drop-marker.vertical:after{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-left:-4px;bottom:-4px;position:absolute;box-shadow:1px 0 2px rgba(255,255,255,.4),-1px 0 2px rgba(255,255,255,.4)}';
                styles += 'body{background:white !important;font-size:11px;font-family:Roboto,sans-serif;} ';
                styles += 'body > div:not(.mce-resizehandle){min-height:30px;} ';
                styles += 'p{margin:0 !important;} ';
                styles += '@page { margin: 0; }';
                styles += 'table td, table th{ border: 1px dotted #ccc !important;padding: 2px !important;height:25px !important}';
                styles += '.on-selected{border:1px dashed #2196f3 !important;cursor: pointer !important;}';
                styles += '.s-control-tracking-value,.s-control-approval-history,.s-control-report,.s-control-file-upload,.s-control-reset,.s-control-draf,.s-control-submit,.s-control-text,.s-control-select,.s-control-document,.s-control-phone,.s-control-email,.s-control-currency,.s-control-radio,.s-control-color,.s-control-percent,.s-control-hidden,.s-control-user,.s-control-filter,.s-control-date,.s-control-datetime,.s-control-month,.s-control-time,.s-control-number{width: auto;height: 25px;border-radius: 3px;font-size: 11px;border:1px solid #e9ecef;font-family:Roboto,sans-serif;color:gray;padding: 0 5px;outline: 0!important;}'
                styles += '.s-control:not(.s-control-table) {background: rgb(233, 236, 239);min-width: 50px;max-width:120px;outline: none !important;margin:1px}';
                styles += '.s-control-reset,.s-control-draft,.s-control-submit{padding: 5px 8px;}';
                styles += '.s-control-user,.s-control-select,.s-control-document{width: 120px;}';
                styles += '.s-control-error{border: 1px solid red !important;}';
                styles += '.s-control-label{font-size:11px;color:gray;border:1px solid #e9ecef;padding:7px 8px 6px 7px;border-radius:4px;}';
                styles += '.mce-input-padding{width: 100px !important;left: 120px !important;padding:0 4px}';
                styles += '.mce-offscreen-selection{display:none !important;}';
                styles += '.s-control-table{width:100%;text-align: left;border-collapse: collapse;font-size: 11px;}';
                styles += '.ephox-snooker-resizer-rows {cursor: row-resize}';
                styles += '.ephox-snooker-resizer-cols {cursor: col-resize}';
                styles += '.ephox-snooker-resizer-bar {background-color: #b4d7ff;opacity: 0;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}';
                return styles;
            }
        }
    },
}
</script>
<style>
    
    .d-flex{
        display: flex;
    }
    .sym-document__side-bar-right,.sym-document__side-bar-left{
        height: 100%;
        width: 240px;
    }
    .sym-document__side-bar-right{
        background: #ffffff;

    }
    .sym-document__side-bar-left .v-tab,.sym-document__side-bar-right .v-tab{
        font-size: 11px;
        padding: 0 8px;
    }
    .sym-document-editor .tox-sidebar-wrap{
        width: 21cm;
        margin: auto;
    }
    .sym-document-editor .tox-tinymce{
        height: 100% !important;
    }
    .container {
        padding: 0;
    }
    .sym-document-action{
        border-right: 1px solid #cdcdcd;
        border-left: 1px solid #cdcdcd;
        height: 30px;
        background: #f2f2f2;
    }
    /* body */
    .sym-document-body{
        height: calc(100% - 10px);
    }


    /* editor  */

    .sym-document-editor{
        min-width: 21cm !important;
        max-width: calc(100% - 480px) !important;
        /* overflow: auto; */
        background: #c5c5c5;
        /* overflow: hidden; */
    }
    /* end editor */

    /* end body */

    
    .sym-document-editor .tox .tox-tbtn{
        font-size: 13px;
        font-family: "Roboto", sans-serif;
        height: 25px;
    }
    .sym-document-editor .tox-editor-header{
        border-bottom: 1px solid #d1d1d1;
    }
</style>