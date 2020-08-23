<template>
    <v-autocomplete
        v-model="selected"
        :items="allUser"
        filled
        dense
        :disabled="disabled"
        solo
        flat
        chips
        item-text="displayName"
        item-value="id"
        background-color="#fbfbfb"
        :placeholder="$t('common.search')"
        class="sym-small-size sym-pad-0 sym-style-input"
        :multiple="isMulti"
        @change="handleChangeValue"
        ref="userSelectAutocomplete"
    >
        <template v-slot:selection="data">
            <v-chip
                :color="color"
                v-bind="data.attrs"
                :input-value="data.selected"
                :close="!compactChip"
                small
                :class="textColor+ ' mt-1'"
                @click:close="remove(data.item)"
            > 
                <v-avatar sizes="23" left v-if="compactChip">
                    <v-img  sizes="23" :src="data.item.avatar ? data.item.avatar : avatarDefault"></v-img>
                </v-avatar>
                <span class="fs-11">{{ data.item.displayName }}</span>
            </v-chip>
        </template>
        <template v-slot:item="data">
            <template>
                <v-list-item-avatar height="20" width="20" size="20" class="mt-1 mb-1">
                    <v-img sizes="20" height="20" width="20" :src="data.item.avatar ? data.item.avatar : avatarDefault"></v-img>
                </v-list-item-avatar>
                <v-list-item-content class="pt-0 pb-0">
                    <v-list-item-title v-html="data.item.displayName"></v-list-item-title>
                    <v-list-item-subtitle class="caption" style="font-size:10px !important" v-html="data.item.role"></v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action class="mt-0 mb-0">
                    <v-icon v-if="typeof(selected.indexOf) != 'undefined' && selected.indexOf(data.item.id) >= 0" color="success" small>mdi-check</v-icon>
                </v-list-item-action>
            </template>
        </template>
    </v-autocomplete>
</template>

<script>
import avatarDefault from "@/assets/image/avatar_default.jpg";

export default {
    name: "userSelector",
    props: {
        color: {
            type: String,
            default: "green lighten-4"
        },
        textColor: {
            type: String,
            default: "blue-grey--text"
        },
        value: {
            type: Array,
            default: () => []
        },
        isMulti: {
            type: Boolean,
            default: true,
        },
        compactChip: {
            type: Boolean,
            default: false,
        },
        flat: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    watch: {
        selected(items){
            let userToInput = items;
            if (!Array.isArray(items)) {
                userToInput = [items]
            }
            this.$emit("change", userToInput);
            this.$emit("input", userToInput);
        },
        value: {
            deep: true,
            immediate: true,
            handler(after){
                this.selected = after;
            }
        }
    },
    mounted() {
        this.selected = this.value;
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
            avatarDefault: avatarDefault,
            autoUpdate: true,
            isUpdating: false,
            selected: [],
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
            users: {
                1: { name: 'Sandra Adams', role: 'BA', avatar: srcs[1] },
                2: { name: 'Ali Connors', role: 'BA', avatar: srcs[2] },
                3: { name: 'Trevor Hansen', role: 'BA', avatar: srcs[3] },
                4: { name: 'Tucker Smith', role: 'BA', avatar: srcs[2] },
                5: { name: 'Britta Holt', role: 'BA', avatar: srcs[4] },
                6: { name: 'Jane Smith ', role: 'BA', avatar: srcs[5] },
                7: { name: 'John Smith', role: 'BA', avatar: srcs[1] },
                8: { name: 'Sandra Williams', role: 'BA', avatar: srcs[3] },
            }
        }
    },
    methods: {
        remove (item) {
            const index = this.selected.indexOf(item.id)
            if (index >= 0) {
                this.selected.splice(index, 1)
                this.$emit("change", this.selected);
                this.$emit("input", this.selected);
            }
        },
        handleChangeValue(value){
            this.$refs.userSelectAutocomplete.lazySearch= '';
        },
        getUser(id) {
            if (id == null || id == NaN) {
                return null;
            }
            return this.users[id];
        }
    },
    computed: {
        allUser(){
            return this.$store.state.app.allUsers;
        }
    }
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