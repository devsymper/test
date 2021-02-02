<template>
    <div class="border-bottom-1 pl-2 py-1 d-flex justify-space-between">
		<ReportSideBar style="margin-top: -6px" />
        <div style="line-height: 30px;" class="ml-8">
            <input 
                :style="{
                    width: inputWidth
                }"
                type="text" 
                title="Sửa tên dashboard"
                v-model="dashboardInfo.dashboardName" 
                v-if="!isView"
                class="symper-dashboard-title px-1">
            <span 
                ref="fakeTitle" 
                class="symper-dashboard-title px-1" 
                :style="{
                    position: isView ? 'relative' : 'absolute',
                    top: isView ? '0px' : '-99999px',
                    left: isView ? '0px' : '-99999px',
                }">
                {{dashboardInfo.dashboardName}}
            </span>
        </div>

        <div class="px-2" style="line-height: 30px;">
             <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-if="!isView"
                        class="mr-2"
                        @click="handleLockWorkspace"
                        v-bind="attrs"
                        v-on="on"
                        icon
                    >
                        <v-icon small :color="dashboardInfo.lockWorkspace ? 'orange lighten-1' : ''">
                            {{dashboardInfo.lockWorkspace ? 'mdi-lock-outline' : 'mdi-lock-open-outline'}}
                        </v-icon>
                    </v-btn>
                </template>
                <span>{{dashboardInfo.lockWorkspace ? 'Mở tương tác' : 'Khóa tương tác'}}</span>
            </v-tooltip>
            <v-btn
                depressed
                small
                color="primary"
                @click="saveDashboard"
            >
                <v-icon small dark class="mr-2">mdi-content-save</v-icon>
                <span>Lưu</span>
            </v-btn>
        </div>
    </div>
</template>

<script>
import ReportSideBar from '@/views/report/ReportSideBar'
import { getDefaultDashboardConfig } from "@/components/dashboard/configPool/dashboardConfigs.js";
import { util } from '../../../plugins/util';
import { dashboardApi } from "@/api/dashboard.js";
export default {
	components:{
		ReportSideBar
	},
    watch: {
        'dashboardInfo.dashboardName': function(){
            this.inputWidth = (this.$refs.fakeTitle.getBoundingClientRect().width + 10) + 'px';
        }
    },
    methods: {
        getCellSettingAndStyleToSave(cell){
            let cellSettings = {};
            for(let name in cell.setting){
                cellSettings[name] = cell.setting[name].selectedColums;
            }

            let cellStyle = {};
            let attr = {};
            for(let key in cell.style){
                attr = cell.style[key];
                cellStyle[attr.name] = {};
                for(let itemName in attr.children){
                    cellStyle[attr.name][itemName] = {
                        value:attr.children[itemName].value
                    }
                }
            }
            let extraConfig = {};
            if(cell.extra){
                extraConfig = cell.extra
            }
            return {
                settings : cellSettings,
                style : cellStyle,
                extra: extraConfig
            }
        },
        getDashboardConfigs(){
            // lưu lại các dataset liên quan tới dashboard này
            let dashboardConfigs = this.dashboardConfigs;
            let layout = {}, cells = {};

            for(let tabKey in dashboardConfigs.info.layout){
                let tabLayout = dashboardConfigs.info.layout[tabKey];
                layout[tabKey] = {};
                for(let item of tabLayout){
                    let cellId = item.cellId;
                    layout[tabKey][cellId] = {
                        x:item.x,
                        y:item.y,
                        h:item.h,
                        w:item.w,
                    }; 
                    let cellConfigs = dashboardConfigs.allCellConfigs[cellId];
                    let cell = cellConfigs.rawConfigs;
                    let settingAndStyle = this.getCellSettingAndStyleToSave(cell);
                    // xét riêng trường hợp cho editor
                    if(cellConfigs.sharedConfigs.type == 'editor'){
                        settingAndStyle.settings = {
                            content : cellConfigs.viewConfigs.displayOptions.content
                        };
                    }

                    cells[cellId] = {
                        settings            : settingAndStyle.settings,
                        style               : settingAndStyle.style,
                        extra               : settingAndStyle.extra,
                        format              : {},
                        condition           : cell.condition,
                        type                : cellConfigs.sharedConfigs.type,
                        columnAndDtsInside  : cellConfigs.viewConfigs.selectedDataset
                    }
                }
            }
            
            let globalSetting = this.getCellSettingAndStyleToSave(this.dashboardConfigs.allCellConfigs.global.rawConfigs);
            cells['global'] = {
                settings            : globalSetting.settings,
                style               : globalSetting.style,
                format              : {},
                condition           : [],
                type                : 'global',
                columnAndDtsInside  : {}
            }
            return {
                cells : cells,
                layout : layout,
                tabsAndPages: dashboardConfigs.info.tabsAndPages,
                drillThrough: dashboardConfigs.info.drillThrough
            };
        },
        async saveDashboard(){
            let idDashboard = 0;
            let action = this.action;
            if(this.action == 'edit'){
                idDashboard = this.idDashboard;
            }

            let dashboardInfo = this.dashboardInfo;
            let dashboardConfig = this.getDashboardConfigs();
            let addedMeasures = this.dashboardConfigs.info.addedMeasures ? this.dashboardConfigs.info.addedMeasures : {};

            let data = {
                name            : dashboardInfo.dashboardName,
                cells           : dashboardConfig.cells,
                tabsAndPages    : dashboardConfig.tabsAndPages,
                drillThrough    : dashboardConfig.drillThrough,
                layout          : dashboardConfig.layout,
                extra           : {
                    relateDatasets:dashboardInfo.datasets,
                    relations : dashboardInfo.relations,
                    addedMeasures: addedMeasures
                },
                action          : action,
                id_folder       : this.$route.params.idnode,
                id_dashboard    : idDashboard
            };

            if(data.name.toLowerCase().includes('test')){
                let res = {};
                if(action == 'edit'){
                    res = await dashboardApi.updateDashboard(idDashboard, data);
                }else if(action == 'clone' || action == 'create'){
                    res = await dashboardApi.createDashboard(data);
                }

                if(res.status == 200){
                    this.$snotifySuccess("Lưu dashboard thành công");
                    if(action == 'clone' || action == 'create'){
                        this.$router.push(`/dashboards/${res.data.id}/edit`);
                    }
                }else{
                    this.$snotifyError(res, "Lưu dashboard thất bại");
                }
            }else{
                this.$snotifyWarning("Chưa thể lưu dashboard", "Do đang trong quá trình thử nghiệm,nên trong tên dashboad cần chứa từ 'test' để có thể lưu");
            }
        },
        handleLockWorkspace(){
            this.dashboardInfo.lockWorkspace = !this.dashboardInfo.lockWorkspace;
        },
    },
    computed: {
        dashboardInfo(){
            if(this.instanceKey){
                return this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs.info;
            }
        },
        dashboardConfigs(){
            if(this.instanceKey){
                return this.$store.state.dashboard.allDashboard[this.instanceKey].dashboardConfigs;
            }
        },
        isView() {
            return this.action == 'view'
        },
    },
    props: {
        instanceKey: {
            default: ''
        },
        action: {
            default: 'view'
        },
        idDashboard: {
            default: 0
        }
    },
    data(){
        return {
            inputWidth: '150px'
        }
    }
}
</script>

<style>
.symper-dashboard-title {
    font-size: 16px;
    font-weight: 500;
    border: 1px solid white;
    white-space: nowrap;
    min-width: 150px;
    max-width: 600px;
}

input.symper-dashboard-title:hover {
    border: 1px solid rgb(224, 224, 224);
}

input.symper-dashboard-title:focus {
    border: 1px solid #f58634;
}
</style>