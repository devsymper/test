<template>
    <v-container fluid>
        <tblViews
            ref="listvirtualdoc"
            :getDataUrl="baseUrl"
            :pageTitle="$t('virtualdoc.detailTitle')"
            :containerHeight="tableHeight - 70"
            :useDefaultContext="false"
        >
        </tblViews>
        <v-card-actions>
            <v-btn
                small
                color="primary"
                class="float-right btn-fixed-bottom"
                @click="closeSidebar"
            >
                {{ $t("common.close") }}
            </v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
import tblViews from "../../components/common/ListItems";
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
        tblViews
    },
    data: function() {
        return {
            apiUrl: "https://v2hoangnd.dev.symper.vn/",
            virtualdocUrl: "virtualdocs",
        }
    },
    mounted() {
        
    },
    computed: {
        baseUrl: function(){
            return this.apiUrl + this.virtualdocUrl +  "/" + this.virtualdoc.id + "/export";
        }
    },
    methods: {
        closeSidebar() {
            this.$emit("close-sidebar", {});
        }
    }
}
</script>

<style>

</style>