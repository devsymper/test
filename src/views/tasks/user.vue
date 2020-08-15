<template>
    <div>
        <div class="d-inline-block float-left" style="width: 50px;">
            <v-avatar size="30">
                <v-img 
                    :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"
                ></v-img>
                <!-- <v-icon
                    v-else
                    v-text="user.avatar"
                ></v-icon> -->
            </v-avatar>
        </div>
        <div class="d-inline-block">
            <div class="fs-13 font-weight-medium">{{user.displayName}}</div>
            <!-- <div class="grey--text fs-11">{{user.role}}</div> -->
            <div class="grey--text fs-12">Chức vụ</div>
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