<template>
  <div
    class="form-embed"
    id="form-add-size"
    style="position:absolute"
    :style="position"
    v-bind:class="{'d-none' : !skh.statusFormAddSizeTable}"
  >
    <div class="input-link">
      <label for="embed-row-count">Số hàng:</label>
      <input
        id="embed-row-count"
        name="embed-row-count"
        v-model="row"
        type="number"
        class="embed-row-count"
      />
      <label for="embed-cols-count">Số cột:</label>
      <input
        id="embed-cols-count"
        name="embed-cols-count"
        v-model="col"
        type="number"
        class="embed-cols-count"
      />
    </div>
    <div class="text-right">
      <button class="btn-add-handson" @click.stop="addSizeTable">Thêm</button>
      <button class="btn-cancel-embed" @click.stop="cancelForm">Hủy bỏ</button>
    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      col: null,
      row: null,
      position: { top: 0, left: 0 }
    };
  },
  components:{

  },
  methods: {
    setPosition(pos) {
      this.position = { top: pos.top + 80 + "px", left: pos.left - 10 + "px" };
    },
    cancelForm() {
      this.$store.commit("kh/changeStatusFormAddSizeTable", false);
    },
    addSizeTable() {
      var col = this.col;
      var row = this.row;
      let size={};
      size.row=row;
      size.col=col;
      this.$store.commit("kh/setSizeTable", size);
       
      this.$store.commit("kh/changeStatusFormAddSizeTable", false);
      this.$store.commit("kh/changeStatusHansonTable", true);

    }
  },
  computed: {
    skh() {
      return this.$store.state.kh;
    }
  }
};
</script>

<style scoped>
.form-embed {
  position: absolute;
  z-index: 999;
  background: white;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  font-size: 14px;
}
.form-embed input {
  width: 80px;
  border-color: #ccc;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
}
.btn-add-handson {
  background-color: #207ab7;
  color: white;
  border-color: #f0f0f0;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  box-shadow: none;
  outline: 0;
  padding: 4px 8px;
}
.btn-cancel-embed {
  background-color: #f0f0f0;
  color: #222f3e;
  border-color: #f0f0f0;
  border-radius: 3px;
  border-style: solid;
  border-width: 1px;
  box-shadow: none;
  outline: 0;
  padding: 4px 8px;
}
.text-right {
  padding-top: 5px;
}
</style>