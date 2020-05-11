<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <v-text-field
                    class="sym-small-size bg-grey"
                    dense
                    solo
                    flat
                    append-icon="mdi-magnify"
                    :placeholder="$t('common.search')"
                ></v-text-field>
            </v-col>
            <v-col cols="12" class="pt-0">
                <div class="subtitle-2">
                    <v-icon>mdi-account</v-icon> {{$t("tasks.header.owner")}}
                </div>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "people",
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