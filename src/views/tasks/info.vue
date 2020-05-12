<template>
    <div class="pt-6">
        <v-row class="body-2">
            <v-col cols="3">
                <v-icon small class="mr-2 mb-1">mdi-format-text</v-icon>
                {{$t("tasks.taskTitle")}}
            </v-col>
            <v-col cols="9">
                {{task.name}}
            </v-col>
            <v-col cols="3">
                <v-icon small class="mr-2 mb-1">mdi-calendar</v-icon>
                {{$t("tasks.header.createDate")}}
            </v-col>
            <v-col cols="9">
                {{$moment(task.date, "DD-MM-YYYY").fromNow()}}
            </v-col>
            <v-col cols="3" class="pb-1">
                <v-icon small class="mr-2 mb-1">mdi-account</v-icon>
                {{$t("tasks.header.owner")}}
            </v-col>
            <v-col cols="9" class="pb-1">
                <user :user="task.owner"></user>
            </v-col>
            <v-col cols="3" class="pt-0">
                <v-icon small class="mr-2 mb-1">mdi-account</v-icon>
                {{$t("tasks.header.assignee")}}
            </v-col>
            <v-col cols="9" class="pt-0">
                <user :user="task.assignee"></user>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import user from "./user";
export default {
    name: "info",
    components: {
        user
    },
    props: {
        task: {
            type: Object,
            default: () => {}
        }
    },
}
</script>

<style>

</style>