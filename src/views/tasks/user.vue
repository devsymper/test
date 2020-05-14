<template>
    <div>
        <div class="d-inline-block float-left" style="width: 50px;">
            <v-avatar size="30">
                <v-img 
                    :src="user.avatar" alt=""
                    v-if="!!user.avatar"
                ></v-img>
                <v-icon
                    v-else
                    v-text="user.avatar"
                ></v-icon>
            </v-avatar>
        </div>
        <div class="d-inline-block">
            <div class="subtitle-2 font-weight-medium">{{user.name}}</div>
            <div class="grey--text" style="font-size:10px !important">{{user.role}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "user",
    props: {
        user: {
            type: Object,
            default: () => {}
        }
    }
}
</script>

<style>

</style>