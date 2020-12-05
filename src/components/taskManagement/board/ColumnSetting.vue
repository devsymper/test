<template>
    <div class="h-100 w-100">
        <div style="height:40px">
            <div class="d-flex justify-space-between">
                <h2 class="ml-4">Column manager</h2>
                <v-btn small class="ml-1 px-1" solo depressed color="#999" >
                    <span style="color:white">Add column</span>
                </v-btn>
            </div>
        </div>
        <div style="height:calc(100% - 40px);background:#eeeeee">
            
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    name:"columnSetting",
    props:{
        listColumn:{
            type:Array,
            default() {
                return [];
            }
        }
    },
    components: {
        draggable,
        VuePerfectScrollbar
    },
    data(){
        return{
            headers: ["id", "name", "sport"],
            list: [
                { id: 1, name: "Abby", sport: "basket" },
                { id: 2, name: "Brooke", sport: "foot" },
                { id: 3, name: "Courtenay", sport: "volley" },
                { id: 4, name: "David", sport: "rugby" }
            ],
        }
    }
}
</script>

<style scoped>
.ghost-card {
    opacity: 0.5;
    background: #F7FAFC;
    border: 1px solid #4299e1;
}
</style>