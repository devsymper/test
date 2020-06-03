import { util } from "./../plugins/util.js";
export default class Api {
    /**
     * Khởi tạo một class Api với base url
     * @param {String} baseUrl
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl[baseUrl.length - 1] == "/" ? baseUrl : baseUrl + "/";
    }

    /**
     * Tạo url từ uri
     * @param {String} uri uri
     */
    getFullUrl(uri) {
        uri = uri.trim();
        if (uri == '') {
            return this.baseUrl.substr(0, this.baseUrl.length - 1);
        }
        if (uri.indexOf("http://") === 0 || uri.indexOf("https://") === 0) {
            return uri;
        } else {
            uri = uri[0] == "/" ? uri.substring(1) : uri;
            return this.baseUrl + uri;
        }
    }

    /**
     * Thực hiện post request
     * @param {String} uri uri của API
     * @param {Object} data data muốn gửi về cho server
     * @param {Object} header custom header cho request
     * @param {Object} options các option thêm cho request theo Jquery Ajax
     * @returns {Object} Đối tượng có thể sử dụng như của promise
     */
    post(uri, data, header = {}, options = {}) {
        let url = this.getFullUrl(uri);
        return this.callApi("POST", url, data, header, options);
    }

    /**
     * Thực hiện get request
     * @param {String} uri uri của API
     * @param {Object} data data muốn gửi về cho server
     * @param {Object} header custom header cho request
     * @param {Object} options các option thêm cho request theo Jquery Ajax
     * @returns {Object} Đối tượng có thể sử dụng như của promise
     */
    get(uri, data = {}, header = {}, options = {}) {
        let url = this.getFullUrl(uri);
        return this.callApi("GET", url, data, header, options);
    }

    /**
     * Thực hiện put request
     * @param {String} uri uri của API
     * @param {Object} data data muốn gửi về cho server
     * @param {Object} header custom header cho request
     * @param {Object} options các option thêm cho request theo Jquery Ajax
     * @returns {Object} Đối tượng có thể sử dụng như của promise
     */
    put(uri, data, header = {}, options = {}) {
        let url = this.getFullUrl(uri);
        return this.callApi("PUT", url, data, header, options);
    }

    /**
     * Thực hiện delete request
     * @param {String} uri uri của API
     * @param {Object} data data muốn gửi về cho server
     * @param {Object} header custom header cho request
     * @param {Object} options các option thêm cho request theo Jquery Ajax
     * @returns {Object} Đối tượng có thể sử dụng như của promise
     */
    delete(uri, data, header = {}, options = {}) {
        let url = this.getFullUrl(uri);
        return this.callApi("DELETE", url, data, header, options);
    }

    /**
     * Thực hiện gọi một request tới server
     * @param {String} method Phương thức áp dụng cho request này
     * @param {String} url url cần gọi của API
     * @param {Object} data data muốn gửi về cho server
     * @param {Object} headers custom header cho request
     * @param {Object} options các option thêm cho request theo Jquery Ajax
     * @returns {Object} Đối tượng có thể sử dụng như của promise
     */
    callApi(method, url, data, headers, options) {
        headers = Object.assign({
            Authorization: `Bearer ${util.auth.getToken()}`,
            // 'Symper-Request-Name': headers.sname ? headers.sname : `${method}: ${url}`,
            // 'Symper-Cache-Strategy': headers.scache ? 'cache-first' : 'network-first' // hoặc network-first
        }, headers);
        let defaultOptions = {
            method: method,
            data: data,
            url: url,
            dataType: 'json',
            crossDomain: true,
            headers: headers
        };
        options = Object.assign(defaultOptions, options);
        return $.ajax(options);
    }
}