<template>
<div class="w-100  h-100 symper-dashboard-workspace">
    <VuePerfectScrollbar 
        ref="cellContainer"
        :style="{
            height:workspaceHeight
        }" 
        tabindex="0"
        @ps-scroll-y="handleDashboardScrolled" 
        @keyup.ctrl.86="checkPasteReport"
        @click="selectDashboard()">
        <grid-layout
            tabindex="0"
            @layout-updated="handleLayoutRendered"
            ref="gridLayout"
            class="symper-dashboard-layout"
            :layout.sync="currentLayout"
            :col-num="48"
            :row-height="2"
            :is-resizable="!dashboardConfig.info.lockWorkspace"
            :is-draggable="!dashboardConfig.info.lockWorkspace"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[8,8]"
            :use-css-transforms="true"
            :style="{
                width : dashboardStyle.size.w,
                height : dashboardStyle.size.h,
                backgroundColor : dashboardStyle.style.background.color
            }">
                            
            <div 
                v-for="item in currentLayout " 
                tabindex="0"
                @click.stop="selectCell(item.cellId)"  
                @keyup.ctrl.67="checkCopyReport"
                @keyup.ctrl.86="checkPasteReport"
                @keyup.ctrl.88="checkCutReport"
                :key="item.i">
                <grid-item 
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                        :symper-cell-id="item.cellId"
                        :class="{   
                                'symper-grid-item symper-dashboard-cell-wrapper' : true,
                                'dashboard-cell-with-icon':dashboardConfig.allCellConfigs[item.cellId].viewConfigs.showIcon,
                                'selected-report':dashboardConfig.allCellConfigs[item.cellId].viewConfigs.isSelecting}"
                        @resized="handleResizeItem"
                        @resize="handleResizingItem">
                    <DashboardCell 
                        v-if="item.active"
                        :ref="item.cellId"
                        :layoutItem="item"
                        :isView="isView"
                        :instanceKey="instanceKey"
                        :cellConfigs="dashboardConfig.allCellConfigs[item.cellId]">
                    </DashboardCell>
                </grid-item>
            </div>
        </grid-layout>
    </VuePerfectScrollbar>

    <v-tabs ref="dashboardTabs" v-model="dashboardConfig.info.activeTabIndex" >
        <v-tab  v-for="(tab, idx) in dashboardConfig.info.tabsAndPages.tabs" :key="tab.id" :symper-id="tab.id">
            <div>
                <span v-if="!tab.editTabName && !tab.name && !isView">
                    <i  class="mdi mdi-plus fs-16"></i>
                </span>
                <div class="pr-2 w-100" v-else>
                    <input
                        :ref="'dashboardTab'+idx"
                        :class="{
                            'tab-name-input': true,
                            'invalid-tab-name': invalidTabName
                        }"
                        v-if="tab.editTabName"
                        size="mini"
                        placeholder="Enter tab name"
                        @change="(vl) => {
                            changeTabName(idx,vl)
                        }"
                        @input="handleInputTabname"
                        @blur="changeTabName(idx)"
                        v-model="tab.name"/>
                    <span class="dashboard-tab-item-name" v-else :symper-id="tab.id">
                        {{tab.name}}
                    </span>
                    <v-menu
                        top
                        offset-y
                        v-if="!isView && !tab.editTabName"
                        :close-on-content-click="true"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                @click="switchTab(idx)"
                                v-bind="attrs"
                                v-on="on"
                                x-small
                                icon
                                class="dashboard-tab-options"
                            >
                                <i class="fs-16 mdi mdi-dots-horizontal"></i>
                            </v-btn>
                        </template>
                        
                        <v-list>
                            <v-list-item
                                class="py-1"
                                v-if="dashboardConfig.info.tabsAndPages.tabs.length > 1"
                                @click="handleCommandOnTabs({
                                    action: 'remove',
                                    tabIdx: idx
                                })">
                                <i class="mdi mdi-trash-can-outline fs-14"></i> <span class="ml-2 fs-13">Xóa</span>
                            </v-list-item>
                            <v-list-item
                                class="py-1"
                                @click="handleCommandOnTabs({
                                action: 'rename',
                                tabIdx: idx
                            })">
                                <i class="mdi mdi-lead-pencil  fs-14"></i><span class="ml-2 fs-13">Đổi tên</span>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </v-tab>
    </v-tabs>
</div>  
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import VueGridLayout from 'vue-grid-layout';
import DashboardCell from "@/components/dashboard/components/DashboardCell.vue";
import { util } from '../../../plugins/util';
import _cloneDeep from "lodash/cloneDeep";
import ReportRenderManagement from "@/components/dashboard/reports/ReportRenderManagement.js";
import ReportTranslatorWorker from 'worker-loader!@/worker/dashboard/ReportTranslator.Worker.js';
import _isEmpty from "lodash/isEmpty";
import Sortable from "sortablejs";
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
var mapTypeToClasses = autoLoadChartClasses();

export default {
    created(){
        let self = this;
        this.reportRenderManagement = new ReportRenderManagement(this);
        this.reportTranslatorWorker = new ReportTranslatorWorker();
        this.listenFromWorker(this.reportTranslatorWorker);
        this.$evtBus.$on('bi-report-change-display', (data) => {
            self.translateReportConfig(data.id, data.type);
        });
    },
    components: {
        DashboardCell,
        VuePerfectScrollbar,
        'grid-layout': VueGridLayout.GridLayout,
        'grid-item': VueGridLayout.GridItem
    },
    data(){
        return {
            workspaceHeight:'',
            invalidTabName: false,
            showTabOptions: false,
            activeAutoScroll: false
        }
    },
    computed: {
        dashboardConfig(){
            return this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs;
        },
        currentLayout(){
            let info = this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs.info;
            return info.layout[info.currentTabPageKey];
        },
        dashboardStyle(){
            let config = this.$store.state.dashboard.allDashboard[this.instanceKey];
            return config.dashboardConfigs.allCellConfigs.global.viewConfigs.displayOptions.dashboardStyle;
        },
        isView(){
            return this.action == 'view';
        },
        thisDashboardData(){
            return this.$store.state.dashboard.allDashboard[this.instanceKey]
        }
    },
    methods: {
        checkCopyReport(evt){
            this.$store.commit('dashboard/copyReport', {
                dashboardConfigs: this.dashboardConfig,
                reportId: this.thisDashboardData.currentCellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        checkCutReport(evt){
            this.$store.commit('dashboard/cutReport', {
                dashboardConfigs: this.dashboardConfig,
                reportId: this.thisDashboardData.currentCellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        checkPasteReport(evt){
            this.$store.commit('dashboard/pasteReport', {
                instanceKey: this.instanceKey
            });
        },
        autoScrollBottom(offset){
            this.$refs.cellContainer.$el.scrollTop = this.$refs.cellContainer.$el.scrollTop + offset;
        },
        /**
         * Thêm cell mới vào dashboard
         */ 
        addCell(type, cellSize = {}, active = false){
            this.$store.commit('dashboard/addCellToLayout', {
                instanceKey: this.instanceKey,
                type,
                cellSize,
                active
            });
        },
        onDragTabEnd(evt) {
            let self = this;
            let tabEl = $(self.$refs.dashboardTabs.$el).find('.dashboard-tab-item-name');
            let names = [];
            let ids = [];
            let count = 0;

            let mapNameToTab = self.dashboardConfig.info.tabsAndPages.tabs.reduce((map, el) => {
                map[el.name] = el;
                return map;
            }, {});
        
            for(let item of tabEl){
                let name = $(item).text().trim();
                let id = $(item).attr('symper-id');
                names.push(name);
                ids.push(id);
            }

            let newArr = [];
            let tab = null;
            for(let i = 0; i < names.length; i++){
                tab = mapNameToTab[names[i]];
                tab.id = util.str.randomString(6);
                newArr.push(tab);
            }
            newArr.push({
                id: util.str.randomString(6),
                active: false,
                editTabName:false,
                name:""
            });
            self.dashboardConfig.info.tabsAndPages.tabs = newArr;
            setTimeout((self) => {
                for(let i = 0 ; i < newArr.length; i++){
                    if(newArr[i].name.trim() == self.dashboardConfig.info.currentTabPageKey.trim()){
                        self.dashboardConfig.info.activeTabIndex = i;
                        break;
                    }
                }
            }, 0, this);
        },
        dragAndDropTabs(){
            let el = $(this.$refs.dashboardTabs.$el).find('.v-slide-group__content.v-tabs-bar__content')[0];
            let sortTabs = Sortable.create(el, {
                animation: 200,
                filter: ".el-icon-close",
                onEnd: this.onDragTabEnd,
                ghostClass: 'ghost-class-dragging',
                dragClass: 'ghost-class-dragging',
                chosenClass: 'ghost-class-dragging',
            });
        },
        listenFromWorker(workerObj){
            let self = this;
            workerObj.addEventListener("message", function (event) {
                let data = event.data;
                let action = data.action;
                if(self[action]){
                    self[action](data.data);
                } else {
                    console.error(` action ${action} not found `);
                }
            });
        },
        onChangeCellConfigs(changeType, cellId){
            this.translateReportConfig(cellId, changeType)
        }, 
        getReportWraperSize(cellId){
            let size = util.getComponentSize(this.$refs[cellId][0]);
            let titleAttr = this.dashboardConfig.allCellConfigs[cellId].rawConfigs.style.title.children;
            if(titleAttr.show.value && titleAttr.titleText.value){
                size.h -= 35;
            }
            return size;
        },
        getDashboardId(){
            let cond = this.$route.name == 'editDashboard' || this.$route.name == 'viewDashboard';
            if(cond){
                return this.$route.params.id;
            }else{
                return 0;
            }
        },
        canReportTranslate(cell){
            let columnSetting = cell.rawConfigs.setting;
            let canTranslate = false;
            for(let key in columnSetting){
                if(columnSetting[key].selectedColums && columnSetting[key].selectedColums.length > 0){
                    canTranslate = true;
                    break;
                }
            }
            return canTranslate;
        },
        translateReportConfig(cellId, changeType = 'data'){
            // các loại change data hợp lệ
            let validChangeType = {
                data: true, // khi thay đổi ảnh hưởng tới dữ liệu cuẩ report
				style: true, // khi thay đổi cấu hình style của report (ko ảnh hưởng tới dữ liệu)
				autocomplete: true // khi gõ trong filter của droplist để lấy danh sách các item cần thiết
            };
            let cell = this.dashboardConfig.allCellConfigs[cellId];
            if(!validChangeType[changeType]){
                console.error("Invalid change type!");
                return;
            }

            if(!this.canReportTranslate(cell)){
                return;
            }

            let reportSize = this.getReportWraperSize(cellId);
            if(changeType != 'style' && changeType != 'autocomplete'){
                cell.viewConfigs.loadingData = true;
            }

            let dataPost = {
                action: 'translateReportConfig',
                data: {
                    extra: {
                        size: reportSize,
                        relations: this.dashboardConfig.info.relations,
                        dashboardId: this.getDashboardId(),
                        changeType
                    },
                    cell: {
                        rawConfigs: cell.rawConfigs,
                        sharedConfigs: cell.sharedConfigs
                    },
                    oldDisplayOption: cell.viewConfigs.displayOptions,
                }
            };
            this.reportTranslatorWorker.postMessage(dataPost);
        },
        applyTranslatedConfig(data){
            try {    
                if(!_isEmpty(data)){
                    if(data.error){
                        this.$snotifyError(data, "Can not get report data ", data.error);
                    }else{
                        let cell = this.dashboardConfig.allCellConfigs[data.cellId];
                        cell.sharedConfigs.data = data.originData;
                        let classOfType = mapTypeToClasses[cell.sharedConfigs.type];
                        data.translatedData = classOfType.editTranslatedData(data.translatedData);
                        this.$set(cell.viewConfigs, 'displayOptions', data.translatedData);
                    }
                }
            } catch (error) {
                
            } finally {
                this.dashboardConfig.allCellConfigs[data.cellId].viewConfigs.loadingData = false;
            }
        },
        renderCellsInViewport(){
            let scrollY = this.$refs.cellContainer.$el.scrollTop;;
            let layout = this.dashboardConfig.info.layout;
            let tabKey = this.dashboardConfig.info.currentTabPageKey;
            let viewportHeight = this.workspaceHeight;
            this.reportRenderManagement.renderCellsInViewport(scrollY, layout, tabKey, viewportHeight);
        },
        handleLayoutRendered(){
            setTimeout((self) => {
                self.renderCellsInViewport();
            }, 0, this);
        },
        addTab(){
            let tabs = this.dashboardConfig.info.tabsAndPages.tabs;
            let newTabName = 'tab '+ tabs.length;
            tabs[tabs.length - 1].name = newTabName;

            this.dashboardConfig.info.currentTabPageKey = newTabName;
            this.$set(this.dashboardConfig.info.layout, newTabName, []);
            this.$set(this.dashboardConfig.info.drillThrough, newTabName, []);
            
            this.dashboardConfig.info.activeTabIndex = (tabs.length - 1);
            this.switchTab(tabs.length - 1);

            tabs.push({
                name: '',
                active: false,
                id: Date.now() + util.str.randomString(6),
                editTabName:false
            });
        },
        switchTab(newTabIndex, oldIndex = -1){
            this.$store.commit('dashboard/setSelectedCell', {id: 'global', instanceKey: this.instanceKey});
            this.dashboardConfig.info.currentTabPageKey = this.dashboardConfig.info.tabsAndPages.tabs[newTabIndex].name;
            for(let tab of this.dashboardConfig.info.tabsAndPages.tabs){
                tab.active = false;
            }
            setTimeout((self) => {
                let info = self.dashboardConfig.info;
                info.tabsAndPages.tabs[newTabIndex].active = true;
                
                info.activeTabIndex = newTabIndex;
                info.currentTabPageKey = info.tabsAndPages.tabs[newTabIndex].name;
                self.renderCellsInViewport();
                self.deactiveCellsInTab(oldIndex);
            }, 200, this);
        },
        deactiveCellsInTab(tabIndex){
            if(tabIndex != -1){
                let tabName = this.dashboardConfig.info.tabsAndPages.tabs[tabIndex].name;
                this.reportRenderManagement.deactiveCells(this.dashboardConfig.info.layout[tabName]);   
            }
        },
        handleCommandOnTabs(info){
            let tabId = info.tabIdx;
            let tabs = this.dashboardConfig.info.tabsAndPages.tabs;
            let tab = tabs[tabId];
            if(info.action == 'rename'){
                this.$set(tab, 'editTabName', true);
                this.oldNameOfTab = _cloneDeep(tab.name);
                setTimeout((self) => {
                    self.$refs['dashboardTab'+tabId][0].focus();
                }, 100, this);
            }else if(info.action == 'remove' && tabs.length > 1){
                if(tabId == this.dashboardConfig.info.activeTabIndex){
                    if(tabId == 0){
                        this.switchTab(1);
                    }else{
                        this.switchTab(tabId-1);
                    }
                }
                setTimeout((self) => {
                    tabs.splice(tabId, 1);  
                    this.$store.commit('dashboard/setSelectedCell', {id: 'global', instanceKey: this.instanceKey});
                    let layout = self.dashboardConfig.info.layout[tab.name];
                    for(let cell of layout){
                        self.$delete(self.dashboardConfig.allCellConfigs, cell.cellId) ;    
                    }
                    self.$delete(self.dashboardConfig.info.layout, tab.name) ;
                    self.$delete(self.dashboardConfig.info.drillThrough, tab.name) ;
                }, 500, this);
            }
        },
        handleInputTabname(vl){
            if(!vl){
                this.invalidTabName = true;
            }else{
                this.invalidTabName = false;
            }
        },
        setWorkspaceHeight(){
            this.workspaceHeight = (util.getComponentSize(this).h - 40)+'px';
        },
        selectCell(cellId){
        },
        changeTabName(tabId, evt = null){
            let newName = null;
            if(evt){
                newName = evt.target.value;
            }
            if(typeof newName == 'string' && !newName.trim()){
                this.invalidTabName = true;
                this.$snotifyError({}, "Tên của tab không được để trống");
                return;
            }else{
                this.invalidTabName = false;
            }
            if(!newName){
                return;
            }
            let tab = this.dashboardConfig.info.tabsAndPages.tabs[tabId];
            this.$set(tab, 'editTabName', false);
            let oldName = this.oldNameOfTab;
            let layout = this.dashboardConfig.info.layout;
            let drillThrough = this.dashboardConfig.info.drillThrough;

            this.$set(layout, newName, layout[oldName]) ;
            this.$set(drillThrough, newName, drillThrough[oldName]) ;
            
            if(this.dashboardConfig.info.activeTabIndex == tabId){
                this.dashboardConfig.info.currentTabPageKey = newName;
            }

            tab.name = newName;
            layout[oldName] = null;
            drillThrough[oldName] = null;

            this.$delete(layout, oldName) ;
            this.$delete(drillThrough, oldName) ;
        },
        handleDashboardScrolled(){
            if(this.debounceActivateReport){
                clearTimeout(this.debounceActivateReport);
            }
            this.debounceActivateReport = setTimeout((self) => {
                self.renderCellsInViewport();
            }, 100, this);
        },
        selectDashboard(){
            this.$store.commit('dashboard/setSelectedCell', {id: 'global', instanceKey: this.instanceKey});
        },
        handleResizingItem(){
            if(event.pageY >= (window.innerHeight - 40)){
                this.activeAutoScroll = true;
            }else{
                this.activeAutoScroll = false;
            }
        },
        handleResizeItem(i, newH, newW, newHPx, newWPx){
            this.activeAutoScroll = false;
            setTimeout(() => {
                this.translateReportConfig(i, 'style');            
            }, 0);
        },
    },
    mounted(){
        this.setWorkspaceHeight();
        this.dragAndDropTabs();
    },
    props: {
        instanceKey: {
            defaul: ''
        },
        action: {
            defaul: 'view'
        },
    },
    watch: {
        'dashboardConfig.info.activeTabIndex': {
            handler(newVl, oldValue){
                let tabs = this.dashboardConfig.info.tabsAndPages.tabs;
                if(newVl == tabs.length - 1){
                    this.addTab();
                }else if(newVl > -1 && newVl < tabs.length && oldValue > -1 && oldValue < tabs.length){
                    this.switchTab(newVl, oldValue)
                }
            }
        },
        activeAutoScroll(vl){
            if(vl){
                this.autoScrollAction = setInterval((self) => {
                    self.autoScrollBottom(5);
                }, 10, this);
            }else{
                clearInterval(this.autoScrollAction);
            }
        },
        'thisDashboardData.currentCellConfigs.rawConfigs.setting': {
            deep: true,
            handler(oldVl, newVl){
                if(newVl){
                    this.$store.commit('dashboard/hightlightSelectedDatasetAndCols', {
                        id: this.thisDashboardData.currentCellConfigs.sharedConfigs.cellId,
                        instanceKey: this.instanceKey
                    });
                }
            }
        }
    }

}
</script>

<style>
.symper-dashboard-workspace .tab-name-input {
    height: 28px;
    border: 1px solid rgb(206, 206, 206);
}

.dashboard-tab-options{
    position: relative;
    right: -20px;
    visibility: hidden;
}

.symper-dashboard-workspace .v-tab:hover .dashboard-tab-options{
    visibility: visible;
}

.symper-dashboard-cell-wrapper.selected-report{
    border-color: #f58634!important;
}

.symper-dashboard-cell-wrapper{
    border: 2px solid #ffffff00;
}


.vue-grid-item .vue-resizable-handle{
    display: none;
}

.vue-grid-item:hover .vue-resizable-handle{
    display: block;
}


.invalid-tab-name input{
    background-color: rgba(255, 0, 0, 0.37);
}

.ghost-class-dragging {
    background-color: rgb(255, 227, 176)!important;
}
</style>