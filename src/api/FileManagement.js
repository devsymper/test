import Api from './api';
import {
    appConfigs
} from './../configs.js';

var coreApi = new Api(appConfigs.apiDomain.fileManagement);
export const fileManagementApi = {
    getFileByList(ids) {
        return coreApi.get('getFileByList', {
            ids: ids
        })
    },
    // Cần thay đổi đường dẫn cho hợp lý hơn ở phía backend
    uploadFileSymper(data, options) {
        return coreApi.post('uploadS', data, {}, options);
    },
    download(id){
        window.open('https://file.symper.vn/downloadS/'+id,'_blank');
    }
};