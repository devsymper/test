<template>
    <div class="pl-3 pt-3">
        <div>
            Lặp lại tùy chỉnh
        </div>
        <v-row class="w-100">
            <v-col class="col-md-4 fs-13 ">
                Lặp lại mỗi:
            </v-col>
            <v-col class="col-md-2" style=" margin-top: -0px;">
                <input style="width:30px; border:1px solid lightgrey" class="pl-1 fs-13" v-model="input" >
            </v-col>
             <v-col class="col-md-6" style="margin-top:-24px;">
                <v-select
                    :menu-props="{'nudge-top':-40}"
                    class="select-repeat" :items="list" v-model="selected" style=" width:150px">
                </v-select>
            </v-col>
        </v-row>
        <div class="fs-13" style="margin-top:-24px;">
            Áp dụng vào
        </div>
        <div>
            <v-btn @click="selectDay(d.name)" x-small v-for="(d,i) in day" :key="i" class="mr-2" :style="{'background':d.show?'#3CB371':'#f1f3f4'}">
                {{d.name}}
            </v-btn>
        </div>
        <div class="fs-13 mt-3">
            Kết thúc
        </div>
        <div @click="isRepeat=!isRepeat">
            <input class="mr-1 mt-1" type="checkbox" v-model="isRepeat">
             <span class="fs-13">Không bao giờ</span>
        </div>
        <div>
        <v-row class="w-100" style="margin-top:-5px"  >
            <v-col @click="endDate=!endDate" class="col-md-4 fs-13 " style="margin-top:-5px">
              <input class="mr-1 mt-1" type="checkbox" v-model="endDate">
                <span class="fs-13">Vào ngày</span>
            </v-col>
            <v-col class="col-md-8 d-flex justify-end " >
              <v-menu offset-y nudge-top="-10">
                    <template v-slot:activator="{ on }">
                    <input 
                        v-on="on"
                        :disabled="!endDate"
                        class="w-100 fs-13 pl-1 ml-13"
                        :value="datePicker"
                        style=" border:1px solid lightgrey;" 
                        type="text">
                    </template>
                 <!-- date -->
                 <v-date-picker 
                        class="date-picker" 
                        no-title scrollable
                        color='orange' 
                      
                        v-model="datePicker" 
                        nudge-top="-10" 
                        :close-on-content-click="false" 
                        transition="scale-transition" 
                        offset-y width="290px" 
                       />
                 <!-- date -->
                </v-menu>
        </v-col>
        </v-row>
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
            datePicker:this.$moment().format('YYYY-MM-DD'),
            list:['Ngày','Tuần',"Tháng","Năm"],
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
      },
      selectDay(name){
          this.day.map(d=>{
              if(d.name==name){
                  d.show = !d.show
              }
          })

      }
    

  },
    
}
</script>
<style scoped>
    .select-repeat ::v-deep .v-select__slot{
        font-size:13px;
        margin-top:5px
    }
</style>