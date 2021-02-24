<template>
<div class="w-100  h-100 symper-dashboard-workspace">
    <VuePerfectScrollbar 
        ref="cellContainer"
        :style="{
            height: workspaceHeight
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
            :style="workspaceStyle">
                            
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
                            'selected-report':dashboardConfig.allCellConfigs[item.cellId].viewConfigs.isSelecting
                        }"
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
import { calcTitleCellHeight } from "@/components/dashboard/configPool/dashboardConfigs.js";
import CrossFilterManagement from "@/components/dashboard/components/filter/CrossFilterManagement.js";
import { getUsedDatasetsFromSetting } from "@/components/dashboard/configPool/reportConfig.js";

var mapTypeToClasses = autoLoadChartClasses();

export default {
    created(){
        let self = this;
        this.reportRenderManagement = new ReportRenderManagement(this);
        this.reportTranslatorWorker = new ReportTranslatorWorker();
        this.listenFromWorker(this.reportTranslatorWorker);
        this.$evtBus.$on('bi-report-change-display', (data) => {
            if(data.hasOwnProperty('instanceKey')){
                if(data.instanceKey == self.instanceKey){
                    if(data.type == 'filter'){
                        self.applyFilterFromCell(data.id);      
                    }else{
                        self.translateReportConfig(data.id, data.type);
                    }
                }
            }else{
                console.error("Data in event bi-report-change-display miss key instanceKey");
            }
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
            filter: {},
            crossFilterMng: {},
            workspaceHeight:'',
            invalidTabName: false,
            showTabOptions: false,
            activeAutoScroll: false,
            workspaceStyle: {
                height: '100%',
                width: '100%',
                backgroundColor: 'white'
            }
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
        /**
         * khởi tạo instance của Cross filter
         */
        initCrossFilterMng(idRelations){
            this.crossFilterMng = new CrossFilterManagement(idRelations);
        },
        translateSliderFilter(data,settingCol){
            let cols = [];
            let opertators = ['greaterthanorequal','lessthanorequal'];
            for(let i in opertators){
                cols.push({
                    "as":settingCol.as,
                    "agg":"not_agg",
                    "cond":{
                        "val": data.value[i],
                        "type":opertators[i]
                    },
                    "name":settingCol.name,
                    "type":settingCol.type,
                    "dataset":settingCol.dataset,
                    "validValue":true
                });
            }
            return cols;
        },
        /**
         * Chuyển đổi cấu hình của filter sang dạng giống với condition
         * @param {Object} cellFilter Đối tượng cấu hình của một cell
         */
        translateFilterCondition(cellFilter){
            let cellView = cellFilter.viewConfigs;
            let settingCol = cellFilter.rawConfigs.setting.value.selectedColums[0];
            let selectionMode = cellFilter.rawConfigs.style.selectionControl.children.selectionMode.value;

            if(selectionMode == 'default' && (settingCol.type == 'number' || settingCol.type == 'date')){
                return this.translateSliderFilter(cellView.displayOptions.data,settingCol);
            }
            let disSelectArr = Object.keys(cellView.disSelectedValues);
            let selectArr = Object.keys(cellView.selectedValues);

            

            if(selectArr.length == 0  ){
                return false;
            }
            let cond = {
                        "val":'',
                        "type":''
                    };
            let column = {
                    "as":settingCol.as,
                    "agg":"not_agg",
                    "cond":cond,
                    "name":settingCol.name,
                    "type":settingCol.type,
                    "dataset":settingCol.dataset,
                    "validValue":true
                };

            if(cellView.clickedAll){
                if(cellView.selectedAll){
                    cond.type = 'isall';
                }else{
                    cond.type = 'notin';
                    cond.val = disSelectArr.join(',');
                }
            }else{
                cond.type = 'in';
                cond.val = selectArr.join(',');
            }
            
            return [column];
        },
        getImpactedVars(impactedDatasets){
            let rsl = {};
            // let vars = this.dashboardConfigs.info.variables;
            // for(let name in vars){
            //     let item = vars[name];
            //     if(impactedDatasets[item.dataset]){
            //         rsl[name] = item;
            //     }
            // }
            return rsl;
        },
        getUsingDatasetAndColumns(){
            return this.thisDashboardData.allDatasetColumns;
        },
        /**
         * đánh dấu cho các report bị ảnh hưởng bởi variable thì không ngay nữa, đợi khi có được giá trị của variable thì mới chạy report đó
         * và gọi api để lấy data cho các variable
         */
        processVariablesWhenFilterChange(impactedDatasets){
            let getImpactedVars = this.getImpactedVars(impactedDatasets);
            let allCells = this.dashboardConfigs.allCellConfigs;
            for(let name in getImpactedVars){
                let item = getImpactedVars[name];
                for(let rpId of item.impactedReportsIds){
                    allCells[rpId].sharedConfigs.suspendedGetData = true;
                    this.getValueForVar(item, impactedDatasets);
                }
            }
        },
        getImpactedCrossFilter(selectedDataset, impactedDatasets){
            for(let dtsId in selectedDataset){
                if(impactedDatasets.hasOwnProperty(dtsId)){
                    return impactedDatasets[dtsId];
                }
            }
            return false;
        },
        async getValueForVar(variable, impactedDatasets = null){            
            let crossFilterCond = '';
            let self = this;
            let selectedDataset = {};
            selectedDataset[variable.dataset] = {};
            selectedDataset[variable.dataset][variable.name] = true;
            if(impactedDatasets){
                let impactedCrossFilter = this.getImpactedCrossFilter(selectedDataset, impactedDatasets)
                if(impactedCrossFilter){
                    crossFilterCond = impactedCrossFilter.dtsConds.join(' AND ');
                }
            }
            let configs = {
                cellId: variable.name,
                columns: {
                    value: [
                        {
                            agg: variable.agg,
                            as: variable.name,
                            cond: {val: "", type: "isall"},
                            dataset: variable.dataset,
                            name: variable.name,
                            origin_type: 'text',
                            type: "text"
                        }
                    ]
                },
                condition: [],
                crossFilterCond: crossFilterCond,
                dashboardId: 0,
                filter: [],
                needTotal: false,
                relations: Object.keys(this.dashboardConfigs.info.datasets),
                reportName: `Variable ${variable.name}`,
                reportType: "variable"
            };

            // reportDataGet.getData(configs).then((res) => {
            //     let varDef = this.dashboardConfigs.info.variables[res.data.cellId];
            //     let varName = varDef.name;
            //     let val = res.data[0][varName];

            //     for(let reportId in varDef.impactedReportsIds){
            //         // self
            //     }
            // });
        },
        getActivedCellIds(){
            let layout = this.currentLayout;
            let rsl = {};
            for(let cellLayout of layout){
                if(cellLayout.active){
                    rsl[cellLayout.i] = true;
                }
            }
            return rsl;
        },

        applyFilterFromCell(filterId){

            let allCells = this.thisDashboardData.dashboardConfigs.allCellConfigs;
            let cellFilter = allCells[filterId];
            this.filter[filterId] = this.translateFilterCondition(cellFilter);
            let allDatasetAndColumn = this.getUsingDatasetAndColumns();

            let datasetId = cellFilter.rawConfigs.setting.value.selectedColums[0].dataset;
            let impactedDatasets = this.crossFilterMng.makeConditionForAllDataset(datasetId);
            // this.processVariablesWhenFilterChange(impactedDatasets);
            let parentDatasetId = allDatasetAndColumn[datasetId].id_parent;
            let childDatasetId = {};

            for(let dtsId in allDatasetAndColumn){
                if(allDatasetAndColumn[dtsId].id_parent == datasetId ){
                    childDatasetId[dtsId] = true;
                } 
            }
            
            let activedCellIds = this.getActivedCellIds();
            for(let cell of this.currentLayout){
                let cellId = cell.i;
                let runCell = allCells[cellId];
                let sharedConfigs = runCell.sharedConfigs;
                let usedDts = sharedConfigs.usedDatasets;

                let isChildDataset = false;
                for(let subDtsId in childDatasetId){
                    if(usedDts.hasOwnProperty(subDtsId)){
                        isChildDataset  = true;
                        break;
                    }
                }

                let reportType = runCell.sharedConfigs.type;
                let impactedCrossFilter = this.getImpactedCrossFilter(usedDts, impactedDatasets)
                if((
                        usedDts.hasOwnProperty(datasetId) || 
                        usedDts.hasOwnProperty(parentDatasetId) || 
                        isChildDataset ||
                        impactedCrossFilter
                    ) && 
                    runCell.sharedConfigs.type != 'filter'
                ){
                    sharedConfigs.filter[filterId] = this.filter[filterId];
                    if(sharedConfigs.filter[filterId] && impactedCrossFilter){
                        sharedConfigs.crossFilterCond = impactedCrossFilter.dtsConds.join(' AND ');
                    }else{
                        sharedConfigs.crossFilterCond = undefined;
                    }

                    if(!this.filter[filterId]){
                        delete sharedConfigs.filter[filterId];
                    }

                    if(activedCellIds[cellId]){
                        this.translateReportConfig(cellId);
                    }
                }
            }
        },
        setDashboardSize(dashboardSize){
            let sizeMode = dashboardSize.dashboardSizeMode.value;
            if(sizeMode == 'realSize'){
                this.workspaceStyle.height = (Number(dashboardSize.height.value) ? dashboardSize.height.value : 720) + 'px'; 
                this.workspaceStyle.width = (Number(dashboardSize.width.value) ? dashboardSize.width.value : 1080) + 'px'; 
            }else if(sizeMode = "fitWidth"){
                let containerWidth = util.getComponentSize(this.$el).w;
                this.workspaceStyle.height = '100%'; 
                this.workspaceStyle.width = containerWidth + 'px'; 
            }else if(sizeMode = "fitScreen"){
                let containerSize = util.getComponentSize(this.$el);
                this.workspaceStyle.height = containerSize.h + 'px'; 
                this.workspaceStyle.width = containerSize.w + 'px'; 
            }
        },
        setDashboardStyle(style){
            this.setDashboardSize(style.dashboardSize.children);
            this.workspaceStyle.backgroundColor = style.dashboarStyle.children.bgColor.value;
        },
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
        addCell(type, active = false, cellSize = {}){
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
            if(cellId == 'global'){
                return {
                    h: 0,
                    w: 0
                };
            }else{
                let size = util.getComponentSize(this.$refs[cellId][0]);
                let titleAttr = this.dashboardConfig.allCellConfigs[cellId].rawConfigs.style.title.children;
                if(titleAttr.show.value){
                    size.h -= calcTitleCellHeight(titleAttr.textSize.value);
                }
                return size;
            }
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
            if(Object.keys(columnSetting).length == 0){
                canTranslate = true;
            }else{
                for(let key in columnSetting){
                    if(columnSetting[key].selectedColums && columnSetting[key].selectedColums.length > 0){
                        canTranslate = true;
                        break;
                    }
                }
            }
            return canTranslate;
        },
        translateReportConfig(cellId, changeType = 'data'){
            let cell = this.dashboardConfig.allCellConfigs[cellId];
            // các loại change data hợp lệ
            let validChangeType = {
                data: true, // khi thay đổi ảnh hưởng tới dữ liệu cuẩ report
				style: true, // khi thay đổi cấu hình style của report (ko ảnh hưởng tới dữ liệu)
				autocomplete: true // khi gõ trong filter của droplist để lấy danh sách các item cần thiết
            };
            if(changeType == 'data'){
                cell.sharedConfigs.usedDatasets = getUsedDatasetsFromSetting(cell.rawConfigs.setting);
            }
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
                        if(data.cellId == 'global'){
                            this.setDashboardStyle(cell.rawConfigs.style);
                        }
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
            if(this.status == 'init'){
                setTimeout((self) => {
                    self.renderCellsInViewport();
                }, 0, this);
            }
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
        status: {
            defaul: 'init'
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