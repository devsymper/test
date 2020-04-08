import Api from "./api";
var bpmneApi = new Api("https://bpmn-engine.symper.vn/api");
export default {
  /** 
   * Lấy danh sách các process đã được tạo ra
   */
  getListProcess() {
    return bpmneApi.get("process");
  }
};
