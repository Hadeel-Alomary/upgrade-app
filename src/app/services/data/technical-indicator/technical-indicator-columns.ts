export class TechnicalIndicatorColumns {
    private static allColumns: TechnicalIndicatorColumns[];

    constructor(public colName: string, public topic: string) { }

    public static getAllColumns(): TechnicalIndicatorColumns[] {
        if (TechnicalIndicatorColumns.allColumns) {
            return TechnicalIndicatorColumns.allColumns;
        }
        TechnicalIndicatorColumns.allColumns = [];
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('issuedshares', 'ISSUEDSHARES_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('freeshares', 'FREESHARES_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('parvalue', 'PARVALUE_1day'));

        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('pivot', 'PIVOT_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('range', 'RANGE_1day'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support1', 'SUPPORT1_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support2', 'SUPPORT2_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support3', 'SUPPORT3_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('support4', 'SUPPORT4_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance1', 'RESISTANCE1_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance2', 'RESISTANCE2_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance3', 'RESISTANCE3_1day_pt0'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('resistance4', 'RESISTANCE4_1day_pt0'));

        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('phigh', 'HIGH_1day_pt1'));
        TechnicalIndicatorColumns.allColumns.push(new TechnicalIndicatorColumns('plow', 'LOW_1day_pt1'));

        return TechnicalIndicatorColumns.allColumns;
    }

    public static getColNameByTopic(topic: string): string {
        let col = TechnicalIndicatorColumns.getAllColumns().find(item => item.topic == topic);
        if (col) {
            return col.colName;
        }
        return '';
    }

    public static getColumnByName(columnName: string): TechnicalIndicatorColumns {
        let column = TechnicalIndicatorColumns.getAllColumns().find(item => item.colName == columnName);
        if (column) {
            return column;
        }
        return null;
    }
}
