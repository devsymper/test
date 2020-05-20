<template>
    <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                class="sym-small-size bg-grey"
                dense
                solo
                v-on="on"
                flat
                v-model="date"
            ></v-text-field>
        </template>
        <v-date-picker 
            v-model="date" no-title 
            scrollable :readonly="readonly"
            :min="currDate"
            @input="selectDate"
        >
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: "datePicker",
    props: {
        value: {
            type: String,
            default: ""
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.date = this.value;
    },
    data: function() {
        return {
            date: "",
            menu: false,
            currDate: this.$moment().format("YYYY-MM-DD")
        }
    },
    methods: {
        selectDate() {
            this.menu = false;
            this.$refs.menu.save(this.date);
            this.$emit("change", this.date);
            this.$emit("input", this.date);
        }
    }
}
</script>