<template>
    <div class="pt-2">
        <div class="subtask-container">
            <listTask
                headerTitle="List related tasks"
                :smallComponentMode="true"
                :filterFromParent="taskFilter">
            </listTask>
        </div>
    </div>
</template>

<script>
import listTask from "./List";
export default {
    name: "relatedItems",
    components: {
        listTask
    },
    props: {
        taskInfo: {
            type: Object,
            default(){
                return {
                    action: {
                        parameter: {
                            taskId
                        }
                    }
                }
            }
        }
    },
    computed: {
        taskFilter(){
            return {
                // ownerLike: String(this.$store.state.app.endUserInfo.id),
                processInstanceId: this.taskInfo.action.parameter.processInstanceId,
                assigneeLike:  String(this.$store.state.app.endUserInfo.id)
            }
        }
    },
}
</script>

<style>

</style>