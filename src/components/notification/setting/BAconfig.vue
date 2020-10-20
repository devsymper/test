-<template>
    <div class="ml-6 mt-2 config-notification">
        <div  class="mb-3">
            <h4 >Cài đặt thông báo</h4>
        </div>
        <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Module phát sinh</v-col>
            <v-col class="col-md-6">  
                <v-autocomplete
                    outlined
                    dense
                    chips
                    small-chips
                    label="Chọn"
                    multiple
                >
                </v-autocomplete>
            </v-col>
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Hành động sinh ra notification</v-col>
            <v-col class="col-md-6">  
                <v-autocomplete
                   
                    
                    outlined
                    dense
                    chips
                    small-chips
                    label="Chọn"
                    multiple
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Đối tượng nhận notification</v-col>
            <v-col class="col-md-6">  
                <v-autocomplete
                   
                    
                    outlined
                    dense
                    chips
                    small-chips
                    label="Chọn"
                    multiple
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Hành động khi click notification</v-col>
            <v-col class="col-md-6">  
                <v-autocomplete
                   
                    
                    outlined
                    dense
                    chips
                    small-chips
                    label="Chọn"
                    multiple
                >
                </v-autocomplete>
            </v-col>
        </v-row>
         
        
          <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-6">
                Nội dung notification
            </v-col>
            <v-col class="fs-13 col-md-5">  
                Tham số
            </v-col>
        </v-row>
        <v-row>
            <v-col class="col-md-6">
                <v-textarea
                    label="Message"
                    counter
                    maxlength="120"
                    full-width
                    single-line
                >
                  <v-chip
                    class="ma-2"
                    color="primary"
                ></v-chip></v-textarea>
            </v-col>
            
            <v-col class="col-md-5 mr-3">
                 <v-textarea
                    label="Message"
                    counter
                    maxlength="120"
                    full-width
                    single-line
                ></v-textarea>
            </v-col>
        </v-row>
        <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Hình đại diện</v-col>
            <v-col class="col-md-6">  
                <v-autocomplete
                    outlined
                    dense
                    chips
                    small-chips
                    label="Chọn"
                    multiple
                >
                </v-autocomplete>
            </v-col>
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-15px">
            <v-col class="fs-13 col-md-5 " style="margin-top:-10px">Icon</v-col>
            <v-col class="col-md-6" style="margin-top:-10px">  
                <v-icon>mdi mdi-home</v-icon>
            </v-col>
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5 " style="margin-top:-5px">Trạng thái</v-col>
            <v-col class="col-md-6">  
               <v-checkbox style="margin-top:0px">
                
               </v-checkbox>
            </v-col>
        </v-row>
        <v-row class="mr-8 mt-5 d-flex justify-end">
            <v-btn text color="green"> Lưu</v-btn>
        </v-row>
    </div>
</template>
<script>
export default {
  watch: {
      isShow(){
          if(isShow){
              debugger
              this.drawer =true;
          }
      }
  },
  created () {
  },
  props: ['isShow'],
  methods: {
  },
    data(){
        return{
            
        }
    }
}
</script>
<style scoped>
    .config-notification ::v-deep fieldset{
        height:35px!important;
    }
    .config-notification ::v-deep .v-label{
        display:none;
    }
    .config-notification ::v-deep .v-text-field__slot{
        border:1px solid grey
     }
</style>