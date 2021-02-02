export default class NodeIO{
    constructor(
        idDataset=0,
        columnName='',
        type='',
        symperDocId=0,
        title='',
        uid,
        from
    ) {

            this.uid = uid;
            this.idDataset = idDataset;
            this.columnName = columnName;
            this.type = type;
            this.symperDocId = symperDocId;
            this.title = title;
            this.from = from;
    }
}