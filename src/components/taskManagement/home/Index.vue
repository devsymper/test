<template>
    <div class="w-100 h-100">
        <div style="height:20px" class="fs-22 font-weight-medium pl-3">Home Page</div>
        <div class="pl-3 pt-3 fs-13" style="height:200px">
            <div class="d-flex justify-space-between">Recent projects
                <div class="task-hover-poiter mr-2" style="color:#0000aa">
                    View all projects
                </div>
            </div>
            <div class="d-flex pt-4">
                <div style="width:200px;height:130px">
                     asssss
                </div>
                <div style="width:200px;height:130px">
                     asssss
                </div>
                <div style="width:200px;height:130px">
                     asssss
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    props:{
        recentPojects:{
            type: Array,
            default(){
                return []
            }
        }
    },
    data(){
        return{

        }
    }

}
</script>

<style scoped>
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
}

</style>