<template>
    <v-container fluid>
        <v-row class="pt-4">
            <v-col cols="12">
                <v-autocomplete
                    v-model="friends"
                    :disabled="isUpdating"
                    :items="people"
                    filled
                    dense
                    solo
                    flat
                    chips
                    item-text="name"
                    :background-color="'white'"
                    :height="30"
                    item-value="id"
                    append-icon="mdi-magnify"
                    :placeholder="$t('common.search')"
                    class="sym-small-size bg-grey"
                    multiple
                >
                    <template v-slot:selection="data">
                        <v-chip
                            color="green lighten-4"
                            v-bind="data.attrs"
                            :input-value="data.selected"
                            close
                            small
                            class="blue-grey--text"
                            @click:close="remove(data.item)"
                        >
                            {{ data.item.name }}
                        </v-chip>
                    </template>
                    <template v-slot:item="data">
                        <template>
                            <v-list-item-avatar size="30" class="mt-1 mb-1">
                                <img :src="data.item.avatar">
                            </v-list-item-avatar>
                            <v-list-item-content class="pt-0 pb-0">
                                <v-list-item-title v-html="data.item.name"></v-list-item-title>
                                <v-list-item-subtitle class="caption" style="font-size:10px !important" v-html="data.item.role"></v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action class="mt-0 mb-0">
                                <v-icon v-if="friends.indexOf(data.item.id) >= 0" color="success" small>mdi-check</v-icon>
                            </v-list-item-action>
                        </template>
                    </template>
                </v-autocomplete>
            </v-col>
        </v-row>
        <v-row id="listUser">
            <v-col cols="12" class="pt-0">
                <div class="subtitle-2 font-weight-bold">
                    <v-icon class="mr-3">mdi-account</v-icon> {{$t("tasks.header.owner")}}
                </div>
                <div class="pl-10 pt-2">
                    <user :user="task.owner"></user>
                </div>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="subtitle-2 font-weight-bold">
                    <v-icon class="mr-3">mdi-account</v-icon> {{$t("tasks.header.assignee")}}
                </div>
                <div class="pl-10 pt-2">
                    <user :user="task.assignee"></user>
                </div>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="subtitle-2 font-weight-bold">
                    <v-icon class="mr-3">mdi-account</v-icon> {{$t("tasks.header.watcher")}}
                </div>
                <div class="pl-10 pt-2">
                    <user :user="task.assignee"></user>
                </div>
                <div class="pl-10 pt-2">
                    <user :user="task.owner"></user>
                </div>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="subtitle-2 font-weight-bold">
                    <v-icon class="mr-3">mdi-account</v-icon> {{$t("tasks.header.participant")}}
                </div>
                <div 
                    v-for="id in friends" 
                    :key="id"
                    class="pl-10 pt-2"
                >
                    <user :user="getUser(id)"></user>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import user from "./user";
export default {
    name: "people",
    components: {
        user
    },
    props: {
        task: {
            type: Object,
            default: () => {}
        }
    },
    data: function() {
        const srcs = {
            1: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
            2: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
            3: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
            4: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
            5: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        }
        return {
            autoUpdate: true,
            isUpdating: false,
            friends: [],
            people: [
                { id: 1, name: 'Sandra Adams', role: 'BA', avatar: srcs[1] },
                { id: 2, name: 'Ali Connors', role: 'BA', avatar: srcs[2] },
                { id: 3, name: 'Trevor Hansen', role: 'BA', avatar: srcs[3] },
                { id: 4, name: 'Tucker Smith', role: 'BA', avatar: srcs[2] },
                { id: 5, name: 'Britta Holt', role: 'BA', avatar: srcs[4] },
                { id: 6, name: 'Jane Smith ', role: 'BA', avatar: srcs[5] },
                { id: 7, name: 'John Smith', role: 'BA', avatar: srcs[1] },
                { id: 8, name: 'Sandra Williams', role: 'BA', avatar: srcs[3] },
            ],
        }
    },
    methods: {
        remove (item) {
            const index = this.friends.indexOf(item.id)
            if (index >= 0) this.friends.splice(index, 1)
        },
        getUser(id) {
            return this.people.filter(user => {
                return user.id == id
            })[0];
        }
    },
}
</script>

<style scoped>
div#symper-app >>> .v-application >>> .v-list-item--active:hover::before,
div#symper-app >>> .v-application >>> .v-list-item--active::before{
    opacity: 0;
}

#listUser {
    overflow: auto;
    max-height: calc(100vh - 185px);
}

</style>