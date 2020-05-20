<template>
    <v-container fluid>
        <tblViews
            ref="listData"
            :getDataUrl="baseUrl"
            :pageTitle="$t('virtualdoc.detailTitle')"
            :containerHeight="tableHeight - 100"
            :useDefaultContext="false"
            :isCompactMode="true"
        >
            <template slot="extra-button">
                <v-btn
                    depressed
                    small
                    class="mr-2"
                    @click="openSidebar"
                >
                    <v-icon left dark>mdi-eye</v-icon>
                    {{$t('virtualdoc.common')}}
                </v-btn>
            </template>
            <template slot="right-panel-content">
                <detail-virtualdoc 
                    :isEdit="true"
                    :readonly="true"
                    ref="actionPanel"
                    @close-sidebar="closeSidebar"
                ></detail-virtualdoc>
            </template>
        </tblViews>
        <v-card-actions>
            <v-btn
                small
                class="btn-fixed-bottom"
                :class="{'right-100': $refs.listData != undefined && ($refs.listData.actionPanel || $refs.listData.tableDisplayConfig.show)}"
                @click="closeSidebar"
            >
                {{ $t("common.close") }}
            </v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
import tblViews from "../../components/common/ListItems";
import detail from "./update";
export default {
    name: "detailVirtualdoc",
    props: {
        virtualdoc: {
            type: Object,
            default: {}
        },
        tableHeight: {
            type:Number,
            default: 300
        }
    },
    components: {
        "detail-virtualdoc": detail,
        tblViews
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            virtualdocUrl: "virtualdocs",
        }
    },
    mounted() {
        this.$refs.actionPanel.setVirtualdocObject(this.virtualdoc);
    },
    computed: {
        baseUrl: function(){
            return this.apiUrl + this.virtualdocUrl +  "/" + this.virtualdoc.id + "/export";
        }
    },
    methods: {
        closeSidebar() {
            this.$emit("close-sidebar", {});
        },
        openSidebar() {
            this.$refs.listData.actionPanel = true;
        }
    }
}
</script>

<style>

</style>