<template>
    <div 
        class="w-100 h-100 border-all"
        @click="selectThisCell">
        <div class="w-100 h-100 cell-placeholder" v-if="cellConfigs.sharedConfigs.data.length == 0">
            <img :src="'img/dashboard/report-builder/'+cellConfigs.sharedConfigs.type+'.png'" height="40px" width="40px">
        </div>
        <div class="h-100 w-100 symper-dashboard-cell" v-else>
            <div ref="cellTitle" class="symper-cell-title  pb-1 pt-1" :symper-cell-id="cellConfigs.sharedConfigs.cellId" :style="viewAttrs.symperTitle.style">
                <div class="cell-title-text text-ellipsis  d-inline-block pl-2 pr-2" style="width: calc(100% - 10px)">
                    <span style="cursor: text" v-if="isView">{{viewAttrs.symperTitle.text}}</span>
                    <span 
                        v-if="!edditingTitle && !isView"
                        style="cursor: text" 
                        @dblclick="editTitleCell" >
                        {{viewAttrs.symperTitle.text}}
                    </span>
                    <input class="w-100 border-none" v-else-if="!isView" ref="renameTitleInput" @blur="applyTitleChange" @change="applyTitleChange" type="text" v-model="viewAttrs.symperTitle.text">
                </div>
            </div>
            <DashboardCellOptions :isView="isView"/>
            <component 
                :is="reportTag"
                :cellConfigs="cellConfigs">
            </component>
        </div>
    </div>
</template>

<script>
import { getDefaultReportConfig } from "@/components/dashboard/configPool/reportConfig.js";
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
import DashboardCellOptions from "@/components/dashboard/components/DashboardCellOptions.vue";
function autoImportReportCells() {
    var context = require.context('@/components/dashboard/components/reportCells', true, /\.(vue)$/);
    var comps = {};
    let filename = '';
    context.keys().forEach((filePath) => {
        filename = filePath.match(/[^\\/:*?"<>|\r\n]+$/)[0].replace('.vue', '');
        comps[filename] = context(filePath).default;
    });
    return comps;
}
var reportComps = autoImportReportCells();
var chartClasses = autoLoadChartClasses();

export default { 
    data(){
        return {
            edditingTitle: false,
        }
    },
    components: {
        ...reportComps,
        DashboardCellOptions
    },
    methods: {
        selectThisCell(){
            this.$store.commit('dashboard/setSelectedCell', {id: this.cellConfigs.sharedConfigs.cellId, instanceKey: this.instanceKey});
        },
        applyTitleChange(){
            this.edditingTitle = false;
            let titleConfig = null;
            this.cellConfigs.rawConfigs.style.title.children.titleText.value = this.viewAttrs.symperTitle.text;
        },
        editTitleCell(){
            this.edditingTitle = true;
            setTimeout((self) => {
                $(self.$refs.renameTitleInput).focus();            
            }, 0, this);
        }
    },
    computed: {
        reportTag(){
            let className = chartClasses[this.cellConfigs.sharedConfigs.type].name;
            if(reportComps[className]){
                return className;
            }else{
                return null;
            }
        },
        viewAttrs(){
            return this.cellConfigs.viewConfigs.displayOptions;
        }
    },
    props: {
        layoutItem: {
            default(){
                return {}
            }
        },
        cellConfigs: {
            default(){
                return getDefaultReportConfig()
            }
        },
        instanceKey: {
            defaul: ''
        },
        isView: {
            default: true
        }
    }
}
</script>

<style>
.cell-placeholder img{
    height: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #cccccc;
    width: 20px;
    opacity: 0.4;
}

.cell-placeholder {
    background-color: #fdfdfd;
}

</style>