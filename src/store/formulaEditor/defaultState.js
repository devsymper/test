const defaultState = {
    completions: {
        docs: {},
        orgcharts: {}
    },
    /**
     * Các từ khóa động đã được set cho editor, phục vụ cho việc không bị trùng lặp keyword 
     */
    dynamicCompletionItems: {
        
    },
    /**
     * Đánh dấu cho các instance của editor là đã load các từ khóa tĩnh chưa
     */
    didSetStaticCompletionItems: false 
};

export default defaultState;