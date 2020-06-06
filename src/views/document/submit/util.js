/**
 * Chứa các phương thức bổ trợ
 */

const DATE_TIME_FORMAT = {
    date: 'YYYY-MM-DD',
    time: 'HH:mm:ss',
    dateTime: 'YYYY-MM-DD HH:mm:ss'
};
export default class Util {

    /**
     * Viết hoa chữ cái đầu tiên trong chuỗi
     * @param {string} str Chuỗi cần viết hoa chữ cái đầu
     */
    static toUpperCaseFirstCharacter = function(str) {
            return str.replace(/^\w/, c => c.toUpperCase());
        }
        /**
         * Viết thuowfng chữ cái đầu tiên trong chuỗi
         * @param {string} str Chuỗi cần viết hoa chữ cái đầu
         */
    static toLowerCaseFirstCharacter = function(str) {
        return str.replace(/^\w/, c => c.toLowerCase());
    }

    static requireRedDot = function(sign) {
        return '<i data-require-sign="' + sign + '" class="fa fa-circle required-markup" title="Bạn phải nhập vào trường này" aria-hidden="true"></i>';
    };
    /**
     * Đếm số chữ số tối đa đằng sau dấu phẩy trong dãy các số
     * @param {Array} nums dãy các chữ số
     */
    static maxDecimalInNumber = function(nums) {
        let max = 0;
        for (let num of nums) {
            if (isNaN(Number(num))) {
                return 0;
            }
            num = (num + '').split('.');
            if (num[1]) {
                max = num[1].length > max ? num[1].length : max;
            }
        }
        return max;
    }

    static debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    static formatNumber = function(num, fix = 3) {
        return parseFloat(Number(num).toFixed(fix)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    static removeFormatNumber = function(num) {
        return parseFloat((num + '').replace(/,/g, ''));
    }

    static getTimeFormat = function(value, format = "str") {
        if (format == 'number') {
            if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                value = value.split(':');
                return Number(value[0]) * 60 + Number(value[1]);
            } else if (/^[0-9]*$/.test(value)) {
                return value;
            } else {
                return 0;
            }
        } else if (format == 'str') {
            if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
                return value;
            } else if (/^[0-9]*$/.test(value)) {
                value = Number(value);
                return Math.floor(value / 60) + ":" + value % 60;
            } else {
                return '00:00';
            }
        }
    }

    static convertYMDtoDMY = function(vl) {
        if (/^((19|20)\d{2})-((0|1)\d{1})-((0|1|2|3)\d{1})/.test(vl)) {
            vl = vl.split('-');
            return vl[2] + '/' + vl[1] + '/' + vl[0];
        } else {
            return vl;
        }
    }

    static toFixedNumber = function(num, fix = 5) {
        return parseFloat(Number(num).toFixed(fix));
    }

    /**
     * chuyển dòng thành các cột
     */
    static convertRow2Col = function(arr) {
        let rsl = {};
        if (arr.length > 0) {
            for (let name in arr[0]) {
                rsl[name] = [arr[0][name]];
            }

            for (let i = 1; i < arr.length; i++) {
                for (let name in arr[i]) {
                    rsl[name].push(arr[i][name]);
                }
            }
        }
        return rsl;
    }



    /**
     * chuyển cột thành dòng
     */
    static convertCol2Row = function(arr) {

    }


    static findDateRange = function(dates) {
        let ranges = [];
        let newStartDate = '0001-01-01';
        for (let dateStr of dates) {
            let date = moment(dateStr);
            let diff = date.diff(moment(newStartDate), 'days');
            if (diff == 0 || diff == 1) {
                ranges[ranges.length - 1].to = dateStr;
            } else {
                ranges.push({
                    from: dateStr,
                    to: dateStr
                });
            }
            newStartDate = dateStr;
        }
        return ranges;
    }

    static formatDateRange = function(ranges, format) {
        let rsl = [];
        for (let range of ranges) {
            let matchPat = format.match(/(from\((.*?)\)|to\((.*?)\))/ig);

            if (matchPat.length == 2) {
                let patFrom = matchPat[0];
                let patTo = matchPat[1];
                if (matchPat[1].includes('from') && matchPat[0].includes('to')) {
                    let patFrom = matchPat[1];
                    let patTo = matchPat[0];
                }

                console.log(patFrom.match(/\((.*?)\)/), patTo.match('\((.*?)\)'));

                let fromVl = moment(range.from);
                let toVl = moment(range.to);

                let pattInMoFrom = patFrom.match(/\((.*?)\)/)[1];
                let pattInMoTo = patTo.match(/\((.*?)\)/)[1];

                //Nếu hai ngày giống nhau
                if (range.from == range.to) {
                    rsl.push(toVl.format(pattInMoTo));
                    continue;
                }
                //Phát hiện lệch tháng
                if (fromVl.format('MM') != toVl.format('MM')) {
                    let seperatorFrom = pattInMoFrom.replace(/[a-z]/ig, '');
                    let seperatorTo = pattInMoTo.replace(/[a-z]/ig, '');
                    let seperator = '/';
                    if (seperatorFrom == '') {
                        if (seperatorTo != '') {
                            seperator = seperatorTo[0];
                        }
                    } else {
                        if (seperatorTo == '') {
                            seperator = seperatorFrom[0];
                        }
                    }

                    if (!pattInMoFrom.includes('MM') && !pattInMoFrom.includes('mm')) {

                        pattInMoFrom += seperator + 'MM';
                    }

                    if (!pattInMoTo.includes('MM') && !pattInMoTo.includes('mm')) {

                        pattInMoTo += seperator + 'MM';
                    }
                }
                //Phát hiện lệch năm
                if (fromVl.format('YYYY') != toVl.format('YYYY')) {
                    let seperatorFrom = pattInMoFrom.replace(/[a-z]/ig, '');
                    let seperatorTo = pattInMoTo.replace(/[a-z]/ig, '');
                    let seperator = '/';
                    if (seperatorFrom == '') {
                        if (seperatorTo != '') {
                            seperator = seperatorTo[0];
                        }
                    } else {
                        if (seperatorTo == '') {
                            seperator = seperatorFrom[0];
                        }
                    }

                    if (!pattInMoFrom.includes('YYYY') && !pattInMoFrom.includes('yyyy')) {
                        pattInMoFrom += seperator + 'YYYY';
                    }

                    if (!pattInMoTo.includes('YYYY') && !pattInMoTo.includes('yyyy')) {
                        pattInMoTo += seperator + 'YYYY';
                    }
                }

                fromVl = fromVl.format(pattInMoFrom);
                toVl = toVl.format(pattInMoTo);

                rsl.push(format.replace(patFrom, fromVl).replace(patTo, toVl));
            }
        }
        return rsl.join(',');
    }
    static getFileExtension = function(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    }

    static makeErrNoti = function(msg, sign) {
        return `<i
                data-sign="` + sign + `"
                onclick="parent.processUIErr(event)"
                class="fa fa-info-circle text-danger bkerp-icon-error"
                aria-hidden="true" >
            </i>
            <div
                data-sign="` + sign + `"
                class="notification p-2 rounded hideNoti box-error-mess">
                <div class="header pb-1">
                    <i
                        class="fa fa-info-circle text-danger mr-2"
                        aria-hidden="true">
                    </i>
                    Lỗi
                </div>
                <div class="content pt-1"> ` + msg + `
                </div>
            </div> `;
    }
    static generateString = function(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}