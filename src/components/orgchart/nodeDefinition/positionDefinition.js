let shapeSize = {
    width: 200,
    height: 50
};

export const DEFAULT_POSITION_DISPLAY = { fill: 'white', 'stroke-width': 1, 'rx': 4, 'ry': 4, stroke: '#585858' };
export const FOUCUS_POSITION_DISPLAY = { 'stroke-width': 2, 'rx': 4, 'ry': 4, stroke: '#f58634' };
export const DEFAULT_POSITION_ATTRS = {
    '.card': DEFAULT_POSITION_DISPLAY,
    '.name': { 'text-anchor': 'middle', fill: '#000', text: '', 'font-family': 'Roboto', 'ref-x': 0.5, 'ref-y': 0.4 },
    '.btn.add': { 'ref-dx': -shapeSize.width / 2, 'ref-y': shapeSize.height, 'ref': '.card', event: 'element:add', cursor: 'pointer' },
    '.btn>circle': { r: 7, fill: 'green', stroke: 'green', 'stroke-width': 0 },
    '.btn>rect': { height: 20, width: 45, rx: 2, ry: 2, fill: 'transparent', 'stroke-width': 1 },
    '.btn.add>text': { fill: 'white', 'font-size': 15, 'font-weight': 400, stroke: 'white', x: -4, y: 5, 'font-family': 'Roboto' },
};

export const POSITION_NODE_DATA = {
    "type": "org.Member",
    "size": {
        "width": shapeSize.width,
        "height": shapeSize.height
    },
    "position": {
        "x": 50,
        "y": 200
    },
    "name": "Vị trí 1",
    "attrs": DEFAULT_POSITION_ATTRS
};
export const definePosition = function() {
    joint.setTheme('modern');
    joint.shapes.org.Member.prototype.markup = [
        '<g class="rotatable">',
        '<g class="scalable">',
        '<rect class="card"/>',
        '</g>',
        // '<text class="rank"/>',
        '<text class="name"/>',
        '<g class="btn add"><circle class="add"/><text class="add">+</text></g>',
        // '<g class="btn del"><circle class="del"/><text class="del">-</text></g>',
        // '<g class="btn edit"><rect class="edit"/><text class="edit">EDIT</text></g>',
        '</g>'
    ].join('');
}

export const createPositionNode = function(name) {
    var element = new joint.shapes.org.Member({
        size: { width: shapeSize.width, height: shapeSize.height },
        attrs: DEFAULT_POSITION_ATTRS
    }).on({
        'change:name': function(cell, name) {
            cell.attr('.name/text',
                joint.util.breakText(name, { width: 160, height: 45 },
                    cell.attr('.name'))
            );
        },
        'change:rank': function(cell, rank) {
            cell.attr('.rank/text', joint.util.breakText(rank, { width: 165, height: 45 }, cell.attr('.rank')));
        }
    }).set({
        name: name,
        // rank: rank
    });

    return element;
}