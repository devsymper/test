'use strict';

(function(joint, util) {

    joint.shapes.standard.Link.define('mapping.Link', {
        z: -1,
        labels:[{"attrs":{"text":{"text":1}},"position":{"distance":0.15}},{"attrs":{"text":{"text":1}},"position":{"distance":0.85}}],
        symperLinkType:'oo',
        attrs: {
            line: {
                targetMarker: {
                    'type': 'circle',
                    'fill': 'white',
                    r:2,
                    'stroke-width':2

                },
                sourceMarker: {
                    'type': 'circle',
                    'fill': 'white',
                    r:2,
                    'stroke-width':2

                },
                stroke: 'gray'
            }
        },

    });

    joint.shapes.standard.HeaderedRecord.define('mapping.Record', {
        itemHeight: 25,
        itemOffset: 15,
        itemMinLabelWidth: 70,
        padding: { top: 35, left: 10, right: 10, bottom: 5 },
        itemOverflow: true,
        attrs: {
            body: {
                fill: 'white',
                stroke: '#344750',
                strokeWidth: 1,
              
            },
            symperDatasetConfigs:{
                id:0,
                label:''
            },
            root: {
                magnet: false
            },
            header: {
                strokeWidth: 1,
                stroke: '#344750',

            },
            headerLabel: {
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                fontSize:12,
                textWrap: {
                    ellipsis: true,
                    height: 24
                }
            },
            buttonsGroups: {
                stroke: 'black'
            },
            forksGroups: {
                stroke: 'lightgray'
            },
            itemBodies: {
                itemHighlight: {
                    stroke: '#00000000',
                    strokeWidth: 0,
                },
                
            },
            itemLabels: {
                magnet: 'true',
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'Roboto',
                itemHighlight: {
                    'fill': '#fe854f'
                },
                
            },
            itemLabels_disabled: {
                magnet: null,
                fill: '#aaaaaa',
                cursor: 'not-allowed'
            }
        }
    }, {

        setName: function(name, opt) {
            this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
        },

        getDefaultItem: function() {
            return {
                id: util.uuid(),
                label: 'new_item',
                icon: 'images/document.svg'
            };
        },

        getItemTools: function() {
            return [
                { action: 'edit', content: 'Edit Item' },
                { action: 'add-child', content: 'Add Child' },
                { action: 'add-next-sibling', content: 'Add Next Sibling' },
                { action: 'add-prev-sibling', content: 'Add Prev Sibling' },
                { action: 'remove', content: warning('Remove Item') }
            ];
        },

        getTools: function() {
            return [
                { action: 'add-item', content: 'Add Child' },
                { action: 'remove', content: warning('Remove Record') }
            ];
        },

        getInspectorConfig: function() {
            return {
                label: {
                    label: 'Label',
                    type: 'content-editable'
                },
                icon: {
                    label: 'Icon',
                    type: 'select-button-group',
                    options: [{
                        value: 'images/link.svg',
                        content: '<img height="42px" src="images/link.svg"/>'
                    }, {
                        value: 'images/document.svg',
                        content: '<img height="42px" src="images/document.svg"/>'
                    }, {
                        value: 'images/clipboard.svg',
                        content: '<img height="42px" src="images/clipboard.svg"/>'
                    }, {
                        value: 'images/file.svg',
                        content: '<img height="42px" src="images/file.svg"/>'
                    }]
                },
                highlighted: {
                    label: 'Highlight',
                    type: 'toggle'
                }
            }
        },
    });

    joint.shapes.mapping.RecordView = joint.shapes.standard.RecordView;

    function warning(text) {
        return '<span style="color:#fe854f">' + text + '</span>'
    }

})(joint, joint.util);

