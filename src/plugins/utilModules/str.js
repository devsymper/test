/**
 */
export const str = {

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = d.getHours(),
            minute = d.getMinutes(),
            seconds = d.getSeconds();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-') + " " + [hour, minute, seconds].join(':');
    },


    nonAccentVietnamese(str, alphabetAndNumOnly = false) {
        str = str.toLowerCase().trim();
        //     We can also use this instead of from line 11 to line 17
        //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
        //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
        //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
        //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
        //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
        //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
        //     str = str.replace(/\u0111/g, "d");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ|Đ/g, "d");
        str = str.replace(/\s+/g, "_");

        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        if(alphabetAndNumOnly){
            str =  str.replace(/\.|-/g,'_').replace(/[^0-9a-zA-Z_]/g,'');
        }
        return str;
    },

    randomString(length = 6) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    },

    getCamelSpaceFromPascalText(str) {
        str = str.replace(/_/g, ' ');
        str = str[0].toUpperCase() + str.slice(1);
        return str;
    },

    toSnakeCase(inputString) {
        return inputString.split('').map((character) => {
                if (character == character.toUpperCase()) {
                    return '_' + character.toLowerCase();
                } else {
                    return character;
                }
            })
            .join('');
    },

    hashCode(str) {
        if (Array.prototype.reduce) {
            return str.split("").reduce(function(a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        } else {

            var hash = 0,
                i, chr, len;
            if (str.length == 0) return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
    },
    mapLanguageToMoment() {
        return { 'en': 'en', 'vn': 'vi' } // biến chuyển định dạng ngôn ngữ sang thư viện moment js hiểu được
    },

    getSubString(str, start, openChar, closeChar, caseInsensitive) {
        let pattern = new RegExp(start);
        if(!caseInsensitive){
            pattern = new RegExp(start, 'i');
        }
        let startMatch = str.match(pattern);
        let firstPos = -1;
        if(startMatch){
            firstPos = startMatch.index;
        }
        
        let rsl = {
            start: -1,
            end: -1
        };
        if (firstPos > -1) {
            rsl.start = firstPos;
            let startIndex = firstPos + start.length;
            let endIndex = firstPos;
            let countMatches = 0;
            for (let i = startIndex; i < str.length; i++) {
                if (str[i] == openChar) {
                    countMatches += 1;
                } else if (str[i] == closeChar) {
                    countMatches -= 1;
                }

                if (countMatches == 0) {
                    endIndex = i;
                    rsl.end = endIndex + 1;
                    break;
                }
            }
        }
        return rsl;
    },

    getTargetInSubstring(rsl, str, startIndex, endIndex, start, openChar, closeChar, caseInsensitive) {
        let substr = str.substring(startIndex, endIndex);
        let firstPos = substr.indexOf(start);
        if (firstPos > -1) {
            let section = this.getSubString(substr, start, openChar, closeChar, caseInsensitive);
            if (section.start > -1 && section.end > -1) {
                rsl.push(section);
                section.start += startIndex;
                section.end += startIndex;
                this.getTargetInSubstring(rsl, substr, section.end - startIndex, str.length, start, openChar, closeChar);
            }
        }
    },

    /**
     * Hàm lấy ra sub string nằm giữa cặp ký tự đóng mở 
     * @param {String} str chuỗi cần tìm kiếm
     * @param {String} start chuỗi bắt đầu , có thể là tên hàm
     * @param {String} openChar ký tự mở để bắt đầu tìm chuỗi
     * @param {String} closeChar ký tự đóng để kết thúc việc tìm chuỗi
     * @param {Boolean} caseInsensitive cờ đánh dấu xem biến "start" có được tìm kiếm theo kiểu phân biệt hoa thường hay ko,
     */
    getBoundedSubstr(str, start = '', openChar = '(', closeChar = ')', caseInsensitive = false) {
        let sections = [];
        this.getTargetInSubstring(sections, str, 0, str.length, start, openChar, closeChar, caseInsensitive);
        let rsl = [];
        for (let item of sections) {
            rsl.push(str.substring(item.start, item.end));
        }
        return rsl;
    },
    /**
     * Hàm chuyển file size sang định dạng kb, mb....
     * @param {*} size 
     */
    getFileSize(bytes, decimals = 2){
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}