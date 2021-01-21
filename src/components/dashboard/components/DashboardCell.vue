<template>
    <div 
        class="w-100 h-100 border-all"
        @click="selectThisCell">
        <div class="w-100 h-100 cell-placeholder" v-if="cellConfigs.sharedConfigs.data && cellConfigs.sharedConfigs.data.length == 0">
            <img :src="'img/dashboard/report-builder/'+cellConfigs.sharedConfigs.type+'.png'" height="40px" width="40px">
        </div>
        <div class="h-100 w-100" v-else>
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
    components: {
        ...reportComps
    },
    methods: {
        selectThisCell(){
            this.$store.commit('dashboard/setSelectedCell', {id: this.cellConfigs.sharedConfigs.cellId, instanceKey: this.instanceKey});
        },
    },
    computed: {
        reportTag(){
            let className = chartClasses[this.cellConfigs.sharedConfigs.type].name;
            if(reportComps[className]){
                return className;
            }else{
                return null;
            }
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