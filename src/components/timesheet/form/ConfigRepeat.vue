<template>
    <div class="pl-2 pt-3">
        <div>
            Lặp lại tùy chỉnh
        </div>
        <v-row class="w-100">
            <v-col class="col-md-4 fs-13 ">
                Lặp lại mỗi:
            </v-col>
            <v-col class="col-md-2">
                <input style="width:50px; border:1px solid lightgrey;margin-top:-20px" v-model="input" >
            </v-col>
             <v-col class="col-md-8">
                <v-select :item="list" v-model="selected" style="width:150px">
                </v-select>
            </v-col>
        </v-row>
        <div class="fs-13">
            Áp dụng vào
        </div>
        <div>
            <v-btn x-small v-for="(d,i) in day" :key="i" class="mr-2">
                {{d.name}}
            </v-btn>
        </div>
        <div class="fs-13 mt-1">
            Kết thúc
        </div>
        <div>
            <input class="mr-1 mt-1" type="checkbox" v-model="isRepeat">
             <span class="fs-13">Lặp lại</span>
        </div>
        <div>
        <input class="mr-1 mt-1" type="checkbox" v-model="endDate">
             <span class="fs-13">Vào ngày</span>
        </div>
        <div class="pb-10" >
            <v-btn @click="cancel()" text style="float:right">
                Thoát
            </v-btn>
             <v-btn text color="success" style="float:right">
               Lưu
            </v-btn>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
          isRepeat:false,
            endDate:'',
            input:'1',
            list:['Tuần',"Tháng"],
            selected:"Tuần",
            day:[
                {name:'T2',show:false},
                {name:'T3',show:false},
                {name:'T4',show:false},
                {name:'T5',show:false},
                {name:'T6',show:false},
                {name:'T7',show:false},
                {name:'CN',show:false},

      ]
    }
  },
  methods: {
      cancel(){
          this.$emit('cancel')
      }
    

  },
    
}
</script>
<style scoped>
    
</style>