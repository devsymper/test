<template>
  <div id="myModal" class="modal kh-handson">
    <div class="modal-content">
      <div class="kh-handson-header">
        <h2 style="width:95%">Bảng</h2>
        <v-icon class="btn-save-handson mr-1 fs-16" v-if="skh.statusEdit==false" @click.stop="saveData">mdi-content-save</v-icon>
        <v-icon class="btn-closes-handson fs-17" @click="invertStatusHandson">mdi-close</v-icon>
      </div>
      <div class="kh-handson-border" ref="handsonRef" id="handson-table">
        <!-- <hot-table ref="handsonRef" id="handson-table" :settings="hotSettings"></hot-table> -->
      </div>
    </div>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import Handsontable from "handsontable";
export default {
  data() {
    let self = this;
    return {
      hot:null,
      header: [],
      readOnly: false,
      rowData: [],
      hotSettings: {
        data: self.rowData,
        minRows: 3,
        minCols: 3,
        rowHeaders: true,
        colHeaders: true,
        autoWrapRow: true,
        fillHandle: true,
        licenseKey: "non-commercial-and-evaluation",
        width: "100%",
        manualRowResize: true,
        manualColumnResize: true,
        manualRowMove: true,
        manualColumnMove: true,
        // contextMenu: ['row_above', 'row_below', 'remove_row','col_left','col_right','remove_col','alignment'],
        filters: false,
        dropdownMenu: true,
        autoInsertRowBoolean: true,
        minSpareRows: 1,
        columnSorting: {
          indicator: true
        },
        autoColumnSize: {
          samplingRatio: 23
        },
        hiddenColumns: true
      }
    };
  },
  components: {
    HotTable
  },
  watch: {
    "skh.statusHansonTable": function(newVl) {
      var modal = document.getElementById("myModal");
      if (newVl == true) {
        modal.style.display = "block";
        setTimeout(() => {
          let size = this.skh.arrSizeTable;
          this.configTable(size);
        }, 200);
        //document.getElementById("hot-display-license-info").style.display = "none";
      
      } else {
        modal.style.display = "none";
      }
    },
    "skh.arrSizeTable":function(newVl){
      this.hot=null;
      this.header=[];
      this.rowData=[];
    }
  },
  computed: {
    skh() {
      return this.$store.state.kh;
    }
  },
  methods: {
    saveData() {
      this.$store.commit(
        "kh/setHotData",
        this.hot.getData()
      );
      this.invertStatusHandson();
      //this.hot.destroy();
      
    },
    invertStatusHandson() {
      this.$store.commit(
        "kh/changeStatusHansonTable",
        !this.skh.statusHansonTable
      );
      this.hot.destroy();
    },
    configTable(size) {
      let self=this;
      var data=this.skh.dataTable;
      var row = size.row;
      var col = size.col;
      var table = $("#handson-table")[0];
      if (data==null) {
          for (var i = 0; i < row; i++) {
          var arr = [];
          for (var j = 0; j < col; j++) {
            if (i == 0) {
              this.header.push("");
            }
            arr.push("");
          }
          this.rowData.push(arr);
        }
      }else{
        this.rowData=data;
        self.$store.commit("kh/setDataTable", null);
      }
      this.hot = new Handsontable(table, {
        data: this.rowData,
        rowHeaders: true,
        colHeaders: this.header,
        //readOnly: readOnly,
        licenseKey: "non-commercial-and-evaluation",
        stretchH: "all",
        autoWrapRow: true,
        fillHandle: true,
        width: "100%",
        manualRowResize: true,
        manualColumnResize: true,
        manualRowMove: true,
        manualColumnMove: true,
        // contextMenu: ['row_above', 'row_below', 'remove_row','col_left','col_right','remove_col','alignment'],
        filters: true,
        dropdownMenu: true,
        autoInsertRowBoolean: true,
        minSpareRows: 1,
        columnSorting: {
          indicator: true
        },
        autoColumnSize: {
          samplingRatio: 23
        },
        hiddenColumns: true,
        contextMenu: {
          items: {
            row_above: {},
            row_below: {},
            remove_row: {},
            col_left: {},
            col_right: {},
            remove_col: {},
            alignment: {},
            header_first_row: {
              name: "header first row",
              callback: function(key, selection, clickEvent) {
                // Callback for specific option
                var dataTable = hot.getData();
                var header = dataTable[0];
                dataTable.shift();
                hot.updateSettings({
                  colHeaders: header,
                  data: dataTable
                });
              }
            }
          }
        }
      });
    }
  },
  created() {}
};
</script>

<style  src="../../../node_modules/handsontable/dist/handsontable.full.css"></style>
<style scoped>
.kh-handson {
  background: white;
}

.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
/* The Close Button */
.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>