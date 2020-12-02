<template>
    <div class="w-100 h-100">
        <div class="symper-title pt-2 pl-2" style="height:40px">Setting for Board XXX</div>
        <div  style="height:calc(100% - 40px); width:100%; background:#333">
            <v-tabs 
                class="w-100 h-100 fs-13 tab-board" 
                vertical>
                <v-tab class="fs-13">
                    <v-icon class="fs-15" left>
                    mdi-image-filter-tilt-shift
                    </v-icon>
                    General
                </v-tab>
                <v-tab class="fs-13">
                    <v-icon class="fs-15" left>
                    mdi-format-columns
                    </v-icon>
                    Columns
                </v-tab>

                <v-tab-item>
                    <detail-board 
                        :infoBoard="infoBoard"
                    />
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                    <v-card-text>
                        <p>
                        Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
                        </p>

                        <p>
                        Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
                        </p>

                        <p>
                        Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
                        </p>

                        <p>
                        Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
                        </p>

                        <p class="mb-0">
                        Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
                        </p>
                    </v-card-text>
                    </v-card>
                </v-tab-item>
             
            </v-tabs>
        </div>
    </div>
</template>

<script>
import DetailBoard from './DetailBoard.vue';
export default {
  components: { DetailBoard },
    name:"compSettingBoard",
    props:{
        infoBoard:{
            type:Object,
            default() {
                return {};
            }
        }
    },
    methods:{

    },
    created(){

    }
}
</script>

<style scoped>
.tab-board >>>.v-slide-group__wrapper{
    width:200px;
}
</style>