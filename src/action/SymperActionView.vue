<template>
    <div class="symper-action-view" 
        :style="{
            width: myWidth,
            height: myHeight,
        }"
    >
        <component :is="actionViewCompon" class="h-100 w-100"></component>
    </div>
</template>

<script>
import {getKeyForAction} from "./index";
import actionMap from "./index";
import Vue from 'vue'

export default {
    props: {
        width: {
            default: '100%'
        },
        height: {
            default: '100%'
        },
        /**
         * Định nghĩa về action cần thực thi trong component này
         */
        actionDef : {
            type: Object,
            default(){
                return {
                    module: '',
                    resource: '',
                    scope: '',
                    action: ''
                }
            }
        },
        param: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    watch: {
        // actionDef: {
        //     deep: true,
        //     immediate: true,
        //     handler(newValue){
        //         this.displayActionView();
        //     }
        // }
    },
    mounted(){
        this.displayActionView();
    },
    data(){
        return {
            actionViewCompon: null
        }
    },
    methods: {
        async displayActionView(){
            let key = getKeyForAction(this.actionDef);
            if(actionMap.hasOwnProperty(key)) {
                if(actionMap[key].hasOwnProperty('$getActionLink')){
                    let link = actionMap[key].$getActionLink(this.param);
                    let matchRoute = this.$router.match(link);
                    if(matchRoute && matchRoute.matched && matchRoute.matched[0]){
                        let matchedRoute = matchRoute.matched[0];
                        for(let key in matchRoute.params){
                            this.$route.params[key] = matchRoute.params[key];
                        }

                        let componentData = await matchedRoute.components.default();
                        this.actionViewCompon = componentData.default ;
                    }
                }else{
                    console.warn('[SYMPER ACTION VIEW]: $getActionLink method not found in action definition', this.action, this.param);
                }
            } else {
                console.error('[SYMPER ACTION VIEW]: action key not found', this.action);
            }
        }
    },
    computed: {
        myWidth(){
            return isNaN(Number(this.width)) ? this.width : (this.width + 'px');
        },
        myHeight(){
            return isNaN(Number(this.height)) ? this.height : (this.height + 'px');
        },
    }
}
</script>

<style>

</style>