<template>
    <v-navigation-drawer
        v-model="tableDisplayConfig.show"
        v-show="tableDisplayConfig.show"
        absolute
        class="pa-2 pl-4"
        right
        :style="{width: tableDisplayConfig.width+'px','z-index':'7'}"
    >
        <div class="title">
            <div>
                {{$t('common.list_config')}}
                <v-icon
                    class="close-btn float-right"
                    @click="tableDisplayConfig.show = false"
                >mdi-close</v-icon>
            </div>
            
            <div class="pb-2 justify-space-between d-flex mt-2" v-if="showActionPanelInDisplayConfig">
                <div class="subtitle-2">{{$t('common.always_show_sidebar')}}</div>
                <v-switch style="height: 25px" v-model="tableDisplayConfig.value.alwaysShowSidebar" class="float-right pt-0 mt-0" ></v-switch>
            </div>
            <div class="pb-2">
                <div class="subtitle-2">{{$t('table.wrap_text_mode')}}</div>
                <div>
                    <v-btn-toggle
                        dense
                        v-model="tableDisplayConfig.value.wrapTextMode"
                        mandatory
                        tile
                        color="amber darken-4"
                        group
                    >
                        <v-btn small>{{$t('table.wrap_tex_mode.wrap')}}</v-btn>
                        <v-btn small>{{$t('table.wrap_tex_mode.clip')}}</v-btn>
                    </v-btn-toggle>
                </div>
            </div>
            <div class="pb-2">
                <div class="subtitle-2">{{$t('table.display_density')}}</div>
                <div>
                    <v-btn-toggle
                        dense
                        v-model="tableDisplayConfig.value.densityMode"
                        mandatory
                        tile
                        color="amber darken-4"
                        group
                    >
                        <v-btn small>{{$t('table.display_density_mode.loosen')}}</v-btn>
                        <v-btn small>{{$t('table.display_density_mode.medium')}}</v-btn>
                        <v-btn small>{{$t('table.display_density_mode.compact')}}</v-btn>
                    </v-btn-toggle>
                </div>
            </div>
            <div class="pb-2">
                <div class="subtitle-2">{{$t('table.column_config')}}</div>
                <draggable
                    class="list-group"
                    tag="div"
                    v-model="tableColumnsClone"
                    v-bind="tableDisplayConfig.dragOptions"
                    @start="tableDisplayConfig.drag = true"
                    @end="handleStopDragColumn"
                >
                    <transition-group
                        type="transition"
                        :name="!tableDisplayConfig.drag ? 'flip-list' : null"
                    >
                        <div
                            class="fs-13 column-drag-pos"
                            v-for="(column,idx) in tableColumnsClone"
                            :key="column.data"
                        >
                            <v-icon size="18" class="mr-2">{{getDataTypeIcon(column.type)}}</v-icon>
                            <span class="fw-400">{{columnTitle(column.columnTitle)}}</span>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        @click="configColumnDisplay('symperFixed',column,idx)"
                                        class="float-right"
                                        small
                                        color="grey"
                                        text
                                        v-on="on"
                                        icon
                                    >
                                        <v-icon
                                            size="18"
                                        >{{column.symperFixed ? 'mdi-roller-skate-off': 'mdi-roller-skate'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span>{{ column.symperFixed ? $t('table.unfreeze_column') : $t('table.freeze_column') }}</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-on="on"
                                        class="float-right"
                                        small
                                        text
                                        icon
                                        color="grey"
                                        @click="configColumnDisplay('symperHide',column, idx)"
                                    >
                                        <v-icon
                                            size="18"
                                        >{{column.symperHide ? 'mdi-eye-off-outline': 'mdi-eye-outline'}}</v-icon>
                                    </v-btn>
                                </template>
                                <span
                                    class="fw-400"
                                >{{ column.symperHide ? $t('table.show_column') : $t('table.hide_column') }}</span>
                            </v-tooltip>
                        </div>
                    </transition-group>
                </draggable>
            </div>
        </div>
        <template v-slot:append>
            <div class="w-100 pt-2">
                <v-btn
                    :loading="savingConfigs"
                    small
                    color="primary"
                    @click="saveTableDisplayConfig()"
                    class="float-right"
                >
                    <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                    {{$t('common.save')}}
                </v-btn>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script>
import { appConfigs } from "./../../../configs.js";
import draggable from "vuedraggable";
import { util } from '../../../plugins/util';
export default {
    components: {
        draggable,
    },
    watch: {
        tableColumns: {
            deep: true,
            handler(){
                this.tableColumnsClone = util.cloneDeep(this.tableColumns);
            }
        }
    },
    data(){
        return {
            savingConfigs: false,
            tableColumnsClone: []
        }
    },
    computed: {},
    props: {
        tableDisplayConfig: {
            type: Object,
            default(){
                return {}
            }
        },
        showActionPanelInDisplayConfig:{
            type: Boolean,
            default: true,
        },
        tableColumns: {
            type: Array,
            default(){
                return []
            }
        },
        headerPrefixKeypath: {
            type: String,
            default: ''
        }
    },
    methods: {
        saveTableDisplayConfig(){
            this.$emit('save-list-display-config');
        },
        resetTableColumnsData(){
            // this.tableColumnsClone = util.cloneDeep(this.tableColumns);
        },
        handleStopDragColumn(){
            this.$emit('drag-columns-stopped', this.tableColumnsClone);
        },
        configColumnDisplay(type, column, idx){
            this.$emit('change-colmn-display-config',type,idx);
        },
        getDataTypeIcon(type) {
            return appConfigs.dataTypeIcon[type];
        },
        
        columnTitle(title) {
            let prefix = this.headerPrefixKeypath;
            prefix =
                prefix[prefix.length - 1] == "." || prefix == ""
                    ? prefix
                    : prefix + ".";
            if(prefix){
                return this.$t(prefix + title);            
            }else{
                return title;
            }
        },
    }
    
};
</script>

<style>

.column-drag-pos[draggable="true"] {
    background-color: #ffe6d2;
}
</style>