let commonProps = {
    "module": "file",
    "resource": "file",
    "scope": "file",
};

export default [{
        ...commonProps,
        "action": "list",
        "handler": function(param) {
            window.open('https://file.dev.symper.vn', '_blank');
        }
    },
]