import { autoLoadNodeClasses } from "@/components/dataflow/configPool/dataflowConfig.js";
import _cloneDeep from "lodash/cloneDeep";
let mapTypeToNodeClass = autoLoadNodeClasses();

export const DISPLAY_CONFIGS = {
    width: 50,
    height: 50,
    padding: 7.5,
    labelFontSize: 13,
    highlightWidBordergetColor: '#f58634',
    normalWidgetBorderColor: '#8f8f8f',
    hightlightWidth: 3,
    normalWidth: 2,
};

function makeTextBreak(text) {
    return joint.util.breakText(text, {
        width: DISPLAY_CONFIGS.width * 2,
        height: DISPLAY_CONFIGS.height * 3,
        title: text
    }, {
        'font-size': DISPLAY_CONFIGS.labelFontSize,
        title: text
    });
}

var removeIconSvg = `<g width="15" height="15" class="d-none symper-widget-remove" >
                        <g  transform="matrix(1,0,0,1,25,-3)">
                            <circle stroke-width="0" r="7" fill="#FF1D00" cursor="pointer" >
                            </circle>
                            <path d="M -3 -3 3 3 M -3 3 3 -3" fill="none" stroke="#FFFFFF" stroke-width="2" pointer-events="none" joint-selector="icon">
                            </path>
                        </g>
                    </g>`;
export const registerNodeDisplay =  function(){
    var defaultAttrs = {
        size: { width: 50, height: 50 },
        root: {
            magnet: false
        },
        allowOrthogonalResize: false,
        attrs: {
            size: { width: 50, height: 50 },
            image: {
                height: DISPLAY_CONFIGS.height,
                width: DISPLAY_CONFIGS.width,
            },
            root: {
                dataTooltip: 'Ellipse with ports',
                dataTooltipPosition: 'left',
                dataTooltipPositionSelector: '.joint-stencil'
            },
            rect: {
                rx: 5,
                ry: 5,
            },
            '.symper-widget': {
                height: DISPLAY_CONFIGS.height,
                width: DISPLAY_CONFIGS.width,
                stroke: 'black',
                strokeWidth: 1,
                fill: 'white'
            },
            '.symper-widget-frame': {
                height: DISPLAY_CONFIGS.height,
                width: DISPLAY_CONFIGS.width,
                stroke: DISPLAY_CONFIGS.normalWidgetBorderColor
            },
            '.symper-widget-image': {
                height: DISPLAY_CONFIGS.height - 2 * DISPLAY_CONFIGS.padding,
                width: DISPLAY_CONFIGS.width - 2 * DISPLAY_CONFIGS.padding,
                x: DISPLAY_CONFIGS.padding,
                y: DISPLAY_CONFIGS.padding,
            },
            '.symper-widget-label': {
                y: DISPLAY_CONFIGS.height + 15,
                fill: 'black',
                strokeWidth: '0px',
                fontSize: DISPLAY_CONFIGS.labelFontSize
            }
        },
        ports: {
            groups: {
                'in': {
                    markup: [{
                        tagName: 'circle',
                        selector: 'portBody',
                        attributes: {
                            'r': 5
                        }
                    }],
                    position: {
                        name: 'right',

                        args: {
                            x: 0,
                            y: DISPLAY_CONFIGS.height / 2,
                        },
                    },
                    attrs: {
                        portLabel: {
                            fontSize: 11,
                            fill: '#61549c',
                            fontWeight: 800
                        },
                        portBody: {
                            magnet: true,
                            r: 5,
                            x: DISPLAY_CONFIGS.width,
                            y: DISPLAY_CONFIGS.height - 5,
                            fill: 'gray',
                            stroke: 'white',
                            strokeWidth: 3
                        }
                    },
                    label: {
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    }
                },
                'out': {
                    markup: [{
                        tagName: 'circle',
                        selector: 'portBody',
                        attributes: {
                            'r': 5
                        }
                    }],
                    position: {
                        name: 'right',

                        args: {
                            x: DISPLAY_CONFIGS.width,
                            y: DISPLAY_CONFIGS.height / 2,
                        },
                    },
                    attrs: {
                        portLabel: {
                            fontSize: 11,
                            fill: '#61549c',
                            fontWeight: 800
                        },
                        portBody: {
                            magnet: true,
                            r: 5,
                            x: DISPLAY_CONFIGS.width,
                            y: DISPLAY_CONFIGS.height - 5,
                            fill: 'gray',
                            stroke: 'white',
                            strokeWidth: 3
                        }
                    },
                    label: {
                        position: {
                            name: 'right',
                            args: {
                                y: 0
                            }
                        }
                    }
                }
            },
            items: [
                { group: 'out' },
                { group: 'in' },
            ]
        }
    };
    var prototypeProps = {
        portMarkup: '<circle class="port-body"  />',
        markup: ['<g class="symper-widget">',
            '<rect class="symper-widget-frame"/>',
            '<image class="symper-widget-image"/>',
            '<text class="symper-widget-label"/>',
            removeIconSvg,
            '</g>'
        ].join(''),
        portLabelMarkup: [{
            tagName: 'text',
            selector: 'portLabel'
        }]
    };
    for (let type in mapTypeToNodeClass) {
        let customttr = _cloneDeep(defaultAttrs);
        let customProp = _cloneDeep(prototypeProps);
        customttr.attrs['.symper-widget-image'].xlinkHref = require('@/../public/img/dataflow/' + type + '.svg');
        customttr.attrs.root.title = type;
        customttr.attrs['.symper-widget-label'].text = makeTextBreak(type);
        if (type === 'Load') {
            customttr.ports.items.splice(1, 1)
        }
        joint.shapes.standard.Image.define('app.' + type, customttr, customProp);
    }
    joint.shapes.standard.Link.define('app.Link', {
        z: 0,
        router: {
            name: 'manhattan',
            args: {
                elementPadding: 100,
            }
        },
        connector: {
            name: 'rounded'
        },
        labels: [],
        attrs: {
            line: {
                z: 1,
                stroke: '#8f8f8f',
                strokeWidth: 2,
                fill: 'none',
                sourceMarker: {
                    type: 'path',
                    d: 'M 0 0 0 0',
                    stroke: 'none'
                },
                targetMarker: {
                    type: 'path',
                    d: 'M 15 -5 L 5 0 L 15 5 Z',
                    stroke: 'none',

                }
            }
        }
    },);
};


// lưu các thông số của node hiện tại đang được chọn
// var currentNode = {};
// window.currentNode = currentNode;

// function setPrevNodeConfigs() {
//     if (currentNode.jointNode) {
//         let prevNode = currentNode.jointNode.model ? currentNode.jointNode.model : currentNode.jointNode;
//         let currentConfig = SDataflowEditor.getCurrentConfigs();
//         if(currentConfig.saveAs){
//             ListWidget[prevNode.id].configs = currentConfig;
//         }
//     }
// }

// function showHomeConfig() {
//     SDataflowEditor.setConfigs('home', SDataflowEditor.homeConfigs);
// }

// function selectPaper() {
//     if (currentNode.jointNode) {
//         unHighlightNode(currentNode.jointNode);
//     }
//     setPrevNodeConfigs();
//     showHomeConfig();
// }

// function disSelectNode(node) {
//     unHighlightNode(node);
// }