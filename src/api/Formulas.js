import Api from "./api";
import { appConfigs } from "./../configs.js";

var api = new Api(appConfigs.apiDomain.formulasService)
export const formulasApi = {

    saveMultiFormulas(data) {
        return api.post('formulas/batch', data);
    },
    execute(data) {
        let testHeader = {
            Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cGUiOiJKV1QifQ==.eyJkb21haW4iOiJ2MmRhdG50LmRldi5zeW1wZXIudm4iLCJ1c2VyX2VtYWlsIjoidGllbmRhdGJ0MTlAZ21haWwuY29tIiwic3VwcG9ydGVyX2lkIjoiMTIiLCJzdXBwb3J0ZXJfZW1haWwiOiJzdXBwb3RlckBzeW1wZXIudm4iLCJzdXBwb3J0ZXJfbmFtZSI6InN1cHBvcnRlciIsImJhX3JvbGVzIjoiIn0=.ODRiY2UzMmQ3ZGQ3N2FkODRhZWNmNGJiN2NiYWJjOGU0OTViYzYyNmFkNTM5NGQ0NDJkNThhMTRiMGM5MDdlNzU1YjU0N2QyY2ExYTJiYTEwMDViMDY4Y2QyYjJlMmE0YjA3NDE1ZWQxMmJhZTZjZmVlYTYzYmM3ZWFhNmEwNzIxOWI4ZjY4NjdmYjhiZmE3MDRjNmVlMjExYTIxNTI0MGQ2NzkxNWM1OWVhMDFhZmZiMmIwNzBhM2Q0ZDNiNjk5YzZjMGQ5MjhlNTU5YzJiOWVlODdjOGNmODhiZDI2YzYwMzIwMzljM2IwZmQ0ZjZjNjJhNTBhMmVkMDk2ZDA1YmYxZDc0Yzc3ZjczOTc2OGEzNWM1Y2Q0MjhiODg4ZjY1NWEwZDMzODdhZTRlZjE5ZmJlMGNjYmE4ZjIwNWIzNDZhNzNiMWMxMzdmNDgzYjM2Y2M2Y2YwMzA4YjI0NGMxODc0MmRiZjlkOGMwZTdmN2Q3NTBjY2I4ZjkzMmU2YjFhMjc1ZDg0NTdlMDYwNTIzYTI0NDFmZjRiNTlkZWNmNDU4YTU4YThjMjRjOTY2ZDdhZjk0YzE4MTI3ZTZlZTRjOTI3YjI2NDI1ODI4N2MyODk3M2IwMDdhNDlmNzk1MzdkMmQ4ODM1ZDVhZDg3ZDU0YzAyY2MwYTY2MzQwNTA0NzY="
        }
        return api.post('formulas/get-data', data, testHeader);
    }
};