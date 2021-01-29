<template>
    <v-menu
        v-model="isShow"
        content-class="task-filter"
        :close-on-content-click="false"
        :close-on-click="closeOnClick"
        offset-y
    >
        <template v-slot:activator="{ on: onMenu }">
            <v-tooltip bottom>
                <template v-slot:activator="{ on:onTooltip }">
                    <v-btn v-on="{...onMenu, ...onTooltip}"  depressed class="mr-2" small>
                        <v-icon size="18">mdi-filter-menu</v-icon>
                        <span class="ml-2">Lọc</span>
                    </v-btn>
                </template>
                <span>Lọc</span>
            </v-tooltip>
        </template>
        <v-list class="mt-2" :style="{'height':height+'px', 'padding': '0px'}" >
            <div class="body-filter h-100">
                <form-tpl 
                    :allInputs="filters"
                />
                <div class="mt-2 action">
                    <v-btn
                        depressed
                        small
                        color="primary"
                        class="float-right"
                        @click="applyFilter()"
                    >Áp dụng</v-btn>
                    <v-btn depressed small text class="mr-2 float-right" @click="isShow=false">Thoát</v-btn>
                </div>
            </div>
        </v-list>
    </v-menu>
</template>

<script>
import FormTpl from '@/components/common/FormTpl.vue'

export default {
    components: { FormTpl },
    props:{
        filters:{
            type: Object,
            default(){
                return {}
            }
        },
        height:{
            type: Number,
            default: 280
        }
    },
    data(){
        return{
            closeOnClick: true,
            isShow: false,
        }  
    },
    methods:{
        applyFilter(){
            this.$emit("apply-filter");
            this.isShow = false;
        }

    }
}
</script>

<style scoped>
.task-filter{
    overflow:hidden;
}
.body-filter{
    padding: 5px 10px;
}
.action{
    position: absolute;
    bottom: 5px;
    right: 5px;
}
</style>