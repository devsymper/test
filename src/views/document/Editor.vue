<template>
    <v-flex class="d-flex sym-document" style="height:calc(100%);">
        <div class="sym-document__side-bar-left">
            <sidebar-left/>
        </div>
            <vue-resizable 
            :active="['r']" 
            width="calc(100% - 480px)" 
            @resize:move="resizeEditor" 
            height="calc(100% - 20px)" class="sym-document-editor">

            <div class="sym-document-body">
                <div class="sym-document-action">
                    <editor-action @document-action-save-document="openPanelSaveDocument"/>
                </div>
                    
                    <editor id="editor" api-key="APIKEY"
                    ref="editor"
                    @onKeyUp="detectKeyEvent"
                    @onClick="detectClickEvent"
                    @onBlur="detectBlurEditorEvent"
                    :init="{
                        forced_root_block:'p',
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
                        bullist numlist outdent indent | removeformat emoticons | table |  preview',
                        fontsize_formats: '8pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt 32pt 34pt 36pt',
                        font_formats: 'Roboto = Roboto,sans-serif; Andale Mono=andale mono,times;'+ 'Arial=arial,helvetica,sans-serif;'+ 'Arial Black=arial black,avant garde;'+ 'Book Antiqua=book antiqua,palatino;'+ 'Comic Sans MS=comic sans ms,sans-serif;'+ 'Courier New=courier new,courier;'+ 'Georgia=georgia,palatino;'+ 'Helvetica=helvetica;'+ 'Impact=impact,chicago;'+ 'Symbol=symbol;'+ 'Tahoma=tahoma,arial,helvetica,sans-serif;'+ 'Terminal=terminal,monaco;'+ 'Times New Roman=times new roman,times;'+ 'Trebuchet MS=trebuchet ms,geneva;'+ 'Verdana=verdana,geneva;'+ 'Webdings=webdings;'+ 'Wingdings=wingdings,zapf dingbats',
                        valid_elements: '*[*]',
                        content_css:['https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'],
                        setup: function(ed){
                            ed.ui.registry.addMenuItem('settingtable', {
                                text: 'Setting table',
                                disabled : false,
                                onAction: function(e) {
                                    showControlTable(e);
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
        <save-doc-panel ref="saveDocPanel" @save-doc-action="validateControl"/>
        <err-message :listErr="listMessageErr" ref="errMessage"/>
    </v-flex>
</template>
<script>

//
import Editor from '@tinymce/tinymce-vue'
import EditerAction from './items/Action.vue'
import SideBarLeft from './sideleft/SideBarLeft.vue'
import SideBarRight from './sideright/SideBarRight.vue'
import TableSetting from './items/TableSetting.vue'
import AutoCompleteControl from './items/AutoCompleteControl.vue'
import controlCss from  "./../../assets/css/document/control/control.css";
import SaveDocPanel from "./../../views/document/items/SaveDocPanel.vue";
import ErrMessagePanel from "./../../views/document/items/ErrMessagePanel.vue";
import { GetControlProps } from "./../../components/document/controlPropsFactory.js";
import { documentApi } from "./../../api/Document.js";

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
        'editor-action' : EditerAction,
        's-table-setting' : TableSetting,
        'auto-complete-control' : AutoCompleteControl,
        'save-doc-panel': SaveDocPanel,
        'err-message': ErrMessagePanel,
        "vue-resizable":VueResizable,
    },
    created() {
        let thisCpn = this;

        // ham nhan sự kiện từ formtpl
        this.$evtBus.$on("blur-input", locale => {
            let name = locale.name
            let value = locale.value
            let elements = $('#editor_ifr').contents().find('#'+this.currentSelectedControlId);
            let table = elements.closest('.s-control-table');
            let tableId = '0'
            if(table.length > 0 && this.currentSelectedControlId != table.attr('id')){
                let id = table.attr('id');
                tableId = id
            }
            this.$store.commit(
                "document/updateProp",{id:this.currentSelectedControlId,name:name,value:value,tableId:tableId}
            );
        });
    },
    data(){
        return{
            isAutocompleteControl:false,
            currentSelectedControlId:'',
            listMessageErr:[]
        }
    },
    methods:{
        openPanelSaveDocument(){
            $('#editor_ifr').contents().find('.on-selected').removeClass('on-selected');
            this.selectControl({},{});
            this.$refs.saveDocPanel.showDialog()
        },
        saveDocument(documentProps){
            let thisCpn = this;
            let htmlContent = this.$refs.editor.editor.getContent()
            let allControl = JSON.stringify(this.editorStore.allControl);
            documentApi.saveDocument({documentProperty:documentProps,fields:allControl,content:htmlContent}).then(res => {
                if (res.status == 200) {
                    thisCpn.$router.push('/documents');
                }
            })
            .catch(err => {
                console.log("error from add user api!!!", err);
            })
            .always(() => {
            });
        },
        hasHistory () { return window.history?.length > 2 },
        validateControl(documentProperties){
            let thisCpn = this;
            let allControl = this.editorStore.allControl;
            let listControlName = [];
            this.listMessageErr = [];
            $('#editor_ifr').contents().find('.s-control-error').removeClass('s-control-error');
            //check trung ten control
            for(let controlId in allControl){
                let control = allControl[controlId];
                if(control.properties.name.value == ''){
                    let controlEl = $('#editor_ifr').contents().find('#'+controlId);
                    controlEl.addClass('s-control-error');
                    if(this.listMessageErr.indexOf('Không được bỏ trống tên control') === -1){
                        this.listMessageErr.push('Không được bỏ trống tên control');
                    }
                }
                else{
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
                }

                // check control Name trong cong thức
                for(let f in control.formulas){
                    if(control.formulas[f].value != ""){
                        let formula = control.formulas[f].value;
                        let controlName = formula.match(/(?<=f.)(\w+)/g);
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

            }
            


            if(this.listMessageErr.length == 0 && $('#editor_ifr').contents().find('.s-control-error').length == 0){
                this.saveDocument(documentProperties);
                
            }
            else{
                this.$refs.saveDocPanel.hideDialog();
                setTimeout(function(){
                thisCpn.$refs.errMessage.showDialog();

                },300)
            }
            
        },
        addColumnTable(listRowData){
            let elements = $('#editor_ifr').contents().find('[data-mce-selected="1"]');
            let thead = ``;
            let tbody = ``;
            for(let i = 0; i < listRowData.length; i++ ){
                let row = listRowData[i];
                let type = row.type;
                let control = GetControlProps(type);
                control.properties.name.value = row.name;
                control.properties.title.value = row.title;
                let controlEl = $(control.html);
                
                controlEl.attr('id', row.key);
                console.log(controlEl);
                thead += `<th>`+row.columnName+`</th>`
                tbody += `<td>`+controlEl[0].outerHTML+`</td>`
                this.addToAllControlInDoc(row.key,{properties: control.properties, formulas : control.formulas,type:type})
            }
            console.log(listRowData);
            // chua xoa duoc cot khi luu
            elements.attr('data-table',JSON.stringify(listRowData))
            elements.find('thead tr th').slice(1,elements.find('thead tr th').length - 1).detach()
            elements.find('tbody tr td').slice(1,elements.find('tbody tr td').length - 1).detach()
            elements.find('thead tr th:first-child').after(thead);
            elements.find('tbody tr td:first-child').after(tbody);
        },
        showControlTable(e) {
                let elements = $('#editor_ifr').contents().find('[data-mce-selected="1"]');
                if(elements.hasClass('s-control-table') || elements.parent().hasClass('s-control-table')){
                    let thead = elements.find('thead tr th');
                    let tbody = elements.find('tbody tr td');
                    let table = (elements.hasClass('s-control-table')) ? element : elements.parent();
                    let tableId = table.attr('id');

                    
                    let listData = [];
                    if($(tbody[1].innerHTML).length > 0){
                        for(let i = 1; i< thead.length - 1; i++){
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
        addToAllControlInDoc(controlId,control){
            this.$store.commit(
                "document/addControl",{id:controlId,props:control}
            );  
        },
        addToAllControlInTable(controlId,control,tableId){
            this.$store.commit(
                "document/addControlToTable",{id:controlId,props:control,tableId:tableId}
            );  
        },
        selectControl(properties,formulas){
            this.$store.commit(
                "document/addCurrentControl",
                {properties:properties,
                formulas:formulas}
            );
        },
        hideAutocompletaControl(){
            $('.list-control-autocomplete').css({
                'display': 'none',
            })
        },
        insertControl(type){
            this.hideAutocompletaControl();
            $(this.$refs.editor.editor.selection.getNode()).html($(this.$refs.editor.editor.selection.getNode())[0].innerHTML.slice(0, -1))
            let control =  GetControlProps(type);
            var checkDiv = $(control.html);
            var inputid = 's-control-id-' + Date.now();
            checkDiv.attr('id', inputid);
            if (checkDiv.attr('s-control-type') != 'table') {
                checkDiv.attr('contenteditable', false);
            }
            // $(this.$refs.editor.editor.selection.getNode()).after()
            this.$refs.editor.editor.execCommand('mceInsertContent', false, checkDiv[0].outerHTML + '&nbsp;');
            this.selectControl(control.properties, control.formulas);
            this.addToAllControlInDoc(inputid,{properties: control.properties, formulas : control.formulas,type:type});
            
        },
        detectKeyEvent(event){
            let thisCpn = this;
            switch (event.keyCode) {
                case 191:
                    var scroll_top = $("#editor_ifr").contents().scrollTop();
                    var nodePosition = $(thisCpn.$refs.editor.editor.selection.getNode()).position();
                    var off = $(thisCpn.$refs.editor.editor.selection.getNode()).offset();
                    var top = nodePosition.top;
                    var left = nodePosition.left;
                    var width_toolbox = $('.sym-document__side-bar-left').width();
                    let marginDoc = $('.tox-sidebar-wrap').css('marginLeft').replace('px', '');
                    $('.list-control-autocomplete')
                    .css({
                        'top': top + 150 - scroll_top,
                        'left': left + width_toolbox + parseInt(marginDoc),
                    })
                    setTimeout(function(){
                        $('.list-control-autocomplete')
                        .css({
                            'display': 'block',
                        })
                    },10)
                    break;
                case 38:
                   
                    break;
                case 40:
                    
                    break;
                case 13:
                    
                    break;
                case 9:
                   
                    break;
                case 8:
                    // if(this.isShowAutocompleteControl == true && $("#editor_ifr").contents().find('body').html().indexOf("/") < 0){
                    //     $('.list-control-autocomplete').css({
                    //         'display': 'none',
                    //     })
                    // }
                    break;
            }
        },
        //su kiện click vào editor
        detectClickEvent(event){
        // kiểm tra nếu click ngoài khung autocomplete control thì đóng lại
            if (event.target.id != 'list-control-autocomplete' && $(event.target).parents('#list-control-autocomplete').length == 0) {
                this.hideAutocompletaControl();
            }
        },
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
   
        
     
    },
    mounted(){
        let thisCpn = this;
        
        let interval = setInterval(() => {
            if(thisCpn.$refs.editor.editor != undefined &&  typeof thisCpn.$refs.editor.editor != 'undefined' ){
                // thisCpn.$refs.editor.editor.focus();
                clearInterval(interval)
                var currentElement, currentElementChangeFlag, elementRectangle, countdown, dragoverqueue_processtimer;
                $(".sym-control").on('dragstart', function(event) {
                    dragoverqueue_processtimer = setInterval(function() {
                        DragDropFunctions.ProcessDragOverQueue();
                    }, 100);
                    var controlType = $(this).attr('control-type');
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
                //click vào 1 control trong doc thì lấy từ store ra
                $(clientFrameWindow.document).on('click','.s-control',function(e){
                    e.stopPropagation();
                    e.preventDefault();
                    $(clientFrameWindow.document).find('.on-selected').removeClass('on-selected')
                    if(!$(this).hasClass('on-selected')){
                        $(this).addClass('on-selected');
                    }
                    let type = $(this).attr('s-control-type');
                    let controlId = $(this).attr('id');
                    thisCpn.currentSelectedControlId = controlId;
                    let table = $(this).closest('.s-control-table');
                    if(table.length > 0 && controlId != table.attr('id')){
                        let tableId = table.attr('id');
                        console.log(controlId);
                        
                        let control = thisCpn.editorStore.allControl[tableId]['listFields'][controlId];
                        thisCpn.selectControl(control.properties, control.formulas);
                    }
                    else{
                        let control = thisCpn.editorStore.allControl[controlId];
                        thisCpn.selectControl(control.properties, control.formulas);
                    }
                })

                
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
                        thisCpn.currentSelectedControlId = inputid;
                        checkDiv.attr('id', inputid);
                        insertionPoint.after(checkDiv);
                        let table = insertionPoint.closest('.s-control-table'); // nếu kéo control vào table thì lưu prop của control đó vào table trong allControl của state
                        let idTable = '';
                        console.log(table);
                        
                        
                        checkDiv.prop('readonly', false);
                        if (checkDiv.attr('s-control-type') != 'table') {
                            checkDiv.attr('contenteditable', false);
                        }
                        insertionPoint.remove();
                        thisCpn.selectControl(control.properties, control.formulas);
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

                function GetInsertionCSS() {
                    var styles = "" +
                        ".reserved-drop-marker{width:100%;height:2px;background:#00a8ff;position:absolute}.reserved-drop-marker::after,.reserved-drop-marker::before{content:'';background:#00a8ff;height:7px;width:7px;position:absolute;border-radius:50%;top:-2px}.reserved-drop-marker::before{left:0}.reserved-drop-marker::after{right:0}";
                    styles += "[data-dragcontext-marker],[data-sh-parent-marker]{outline:#19cd9d solid 2px;text-align:center;position:absolute;z-index:123456781;pointer-events:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif}[data-dragcontext-marker] [data-dragcontext-marker-text],[data-sh-parent-marker] [data-sh-parent-marker-text]{background:#19cd9d;color:#fff;padding:2px 10px;display:inline-block;font-size:14px;position:relative;top:-24px;min-width:121px;font-weight:700;pointer-events:none;z-index:123456782}[data-dragcontext-marker].invalid{outline:#dc044f solid 2px}[data-dragcontext-marker].invalid [data-dragcontext-marker-text]{background:#dc044f}[data-dragcontext-marker=body]{outline-offset:-2px}[data-dragcontext-marker=body] [data-dragcontext-marker-text]{top:0;position:fixed}";
                    styles += '.drop-marker{pointer-events:none;}.drop-marker.horizontal{background:#00adff;position:absolute;height:2px;list-style:none;visibility:visible!important;box-shadow:0 1px 2px rgba(255,255,255,.4),0 -1px 2px rgba(255,255,255,.4);z-index:123456789;text-align:center}.drop-marker.horizontal.topside{margin-top:0}.drop-marker.horizontal.bottomside{margin-top:2px}.drop-marker.horizontal:before{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-top:-3px;float:left;box-shadow:0 1px 2px rgba(255,255,255,.4),0 -1px 2px rgba(255,255,255,.4)}.drop-marker.horizontal:after{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-top:-3px;float:right;box-shadow:0 1px 2px rgba(255,255,255,.4),0 -1px 2px rgba(255,255,255,.4)}.drop-marker.vertical{height:50px;list-style:none;border:1px solid #00ADFF;position:absolute;margin-left:3px;display:inline;box-shadow:1px 0 2px rgba(255,255,255,.4),-1px 0 2px rgba(255,255,255,.4)}.drop-marker.vertical.leftside{margin-left:0}.drop-marker.vertical.rightside{margin-left:3px}.drop-marker.vertical:before{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-top:-4px;top:0;position:absolute;margin-left:-4px;box-shadow:1px 0 2px rgba(255,255,255,.4),-1px 0 2px rgba(255,255,255,.4)}.drop-marker.vertical:after{content:"";width:8px;height:8px;background:#00adff;border-radius:8px;margin-left:-4px;bottom:-4px;position:absolute;box-shadow:1px 0 2px rgba(255,255,255,.4),-1px 0 2px rgba(255,255,255,.4)}';
                    styles += 'table,tr,td{border:none;} ';
                    styles += 'body{background:white !important;} ';
                    styles += 'p{margin:0 !important;} ';
                    styles += '@page { margin: 0; }';
                    styles += 'table td, table th{ border: 1px solid #ccc !important;padding: .4rem !important;}';
                    styles += '.on-selected{border:1px dashed #2196f3 !important;cursor: pointer !important;}';
                    styles += '.s-control-tracking-value,.s-control-approval-history,.s-control-report,.s-control-file-upload,.s-control-reset,.s-control-draf,.s-control-submit,.s-control-text,.s-control-select,.s-control-document,.s-control-phone,.s-control-email,.s-control-currency,.s-control-radio,.s-control-color,.s-control-percent,.s-control-hidden,.s-control-user,.s-control-filter,.s-control-date,.s-control-datetime,.s-control-month,.s-control-time,.s-control-number{width: auto;height: 25px;border-radius: 3px;font-size: 13px;padding: 0 5px;outline: 0!important;}'
                    styles += '.s-control:not(.s-control-table) {background: rgb(233, 236, 239);min-width: 50px;max-width:150px;outline: none !important;margin:1px;border:none}';
                    styles += '.s-control-reset,.s-control-draf,.s-control-submit{padding: 5px 8px;}';
                    styles += '.s-control-error{border: 1px solid red !important;}';
                    return styles;
                }
            }
        }, 2000);    
        
    }
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

    /* action */
    .sym-document-list-action{
        padding: 0;
        height: 30px;
        display: flex;
    }
  
    .sym-document-list-action .v-list-item{
        min-height: unset;
        flex: unset;
        padding: 0;
    }
    .sym-document-list-action .v-list-item:last-child{
        margin-left: auto;
        margin-right: 8px;
    }
    .sym-document-list-action .v-list-item .v-list-item__icon{
        margin: 3px 8px;
    }
    .sym-document-list-action .v-list-item .v-list-item__title{
        font-size: 12px;
    }
    .sym-document-editor .tox .tox-tbtn{
        font-size: 13px;
        font-family: "Roboto", sans-serif;
        height: 25px;
    }
    .sym-document-editor .tox-editor-header{
        border-bottom: 1px solid #d1d1d1;
    }
</style>