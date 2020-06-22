<template>
    <div class="w-100 h-100 ">
        <v-text-field
            :label="$t('common.search')"
            dense
            hide-details
            v-model="searchUserKey"
            append-icon="mdi-magnify"
            single-line
            outlined
            class="mb-4 mt-4"
        ></v-text-field>
        <v-row class="list-users-in-task">
            <div class="w-100 mb-2 pl-3" v-for="(users, role) in tabData" :key="role" >
                <div class="fs-13 font-weight-bold">
                    <v-icon class="mr-3">mdi-account</v-icon> {{$t("tasks.header."+role)}}
                </div>
                <div class="pl-10 pt-2 " v-for="userItem in tabData[role]" :key="userItem.id">
                    <user :user="userItem"></user>
                </div>
            </div>
        </v-row>
    </div>
</template>

<script>
import user from "./user";
export default {
    name: "people",
    components: {
        user
    },
    props: {
        tabData: {
            type: Object,
            default: () => {}
        },
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
            searchUserKey: '',
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