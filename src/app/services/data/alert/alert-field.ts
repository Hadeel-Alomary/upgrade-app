
export class AlertField{
    constructor (public id:string, public name:string){}


    private static fields:AlertField[] = [];

    public static getFieldById(id:string):AlertField{
        return AlertField.getFields().find(field => field.id == id);
    }

    public static getFields():AlertField[]{

        if(AlertField.fields.length <= 0){
            AlertField.fields.push(new AlertField('last','الاغلاق'));
            AlertField.fields.push(new AlertField('lasttradeprice','آخر'));
            AlertField.fields.push(new AlertField('lastvolume','حجم آخر'));
            AlertField.fields.push(new AlertField('change','التغير'));
            AlertField.fields.push(new AlertField('pchange','التغير %'));
            AlertField.fields.push(new AlertField('bidvolume','حجم أفضل طلب'));
            AlertField.fields.push(new AlertField('bidprice','الطلب'));
            AlertField.fields.push(new AlertField('askprice','العرض'));
            AlertField.fields.push(new AlertField('askvolume','حجم أفضل عرض'));
            AlertField.fields.push(new AlertField('volume','الحجم'));
            AlertField.fields.push(new AlertField('value','القيمة'));
            AlertField.fields.push(new AlertField('trades','الصفقات'));
            AlertField.fields.push(new AlertField('open','الافتتاح'));
            AlertField.fields.push(new AlertField('high','اعلى'));
            AlertField.fields.push(new AlertField('low','ادنى'));
            AlertField.fields.push(new AlertField('pclose','الاغلاق السابق'));
            AlertField.fields.push(new AlertField('infloworders','أوامر السيولة الداخلة'));
            AlertField.fields.push(new AlertField('outfloworders','أوامر السيولة الخارجة'));
            AlertField.fields.push(new AlertField('inflowvolume','حجم  السيولة الداخلة'));
            AlertField.fields.push(new AlertField('outflowvolume','حجم السيولة الخارجة'));
            AlertField.fields.push(new AlertField('inflowvalue','قيمة السيولة الداخلة'));
            AlertField.fields.push(new AlertField('outflowvalue','قيمة السيولة الخارجة'));
            AlertField.fields.push(new AlertField('week52high','الأعلى سنوي'));
            AlertField.fields.push(new AlertField('week52low','الأدنى سنوي'));
            AlertField.fields.push(new AlertField('max','الحد الأعلى'));
            AlertField.fields.push(new AlertField('min','الحد الأدنى'));
            AlertField.fields.push(new AlertField('phigh','الأعلى السابق'));
            AlertField.fields.push(new AlertField('plow','الأدنى السابق'));
            AlertField.fields.push(new AlertField('fprice','قيمة الحق الارشادية'));
            AlertField.fields.push(new AlertField('tbv','إجمالي حجم الطلب'));
            AlertField.fields.push(new AlertField('tav','إجمالي حجم العرض'));
            AlertField.fields.push(new AlertField('wgi','الوزن في المؤشر'));
            AlertField.fields.push(new AlertField('wsi','الوزن في القطاع'));
            AlertField.fields.push(new AlertField('egi','التأثير على المؤشر'));
            AlertField.fields.push(new AlertField('esi','التأثير على القطاع'));
            AlertField.fields.push(new AlertField('maxlv','أكبر حجم آخر'));
        }
        return AlertField.fields;
    }
}
