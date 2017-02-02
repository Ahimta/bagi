export default function translate(s: string) {
  const dict = {
    and: 'و',
    currency: 'ريال',

    'all-days': 'جميع الأيام',
    weekdays: 'أيام الأسبوع',
    weekends: 'نهاية الأسبوع',

    custom: 'مخصص',
    now: 'اﻵن',

    remaining: 'باقي',
    time: 'الوقت',
    value: 'القيمة',

    year: 'سنوات',
    month: 'شهور',
    week: 'أسابيع',
    day: 'أيام',
    hour: 'ساعات',
    minute: 'دقائق',
    second: 'ثواني',

    sat: 'السبت',
    sun: 'الأحد',
    mon: 'الاثنين',
    tue: 'الثلاثاء',
    wed: 'الأربعاء',
    thu: 'الخميس',
    fri: 'الجمعة',

    am: 'ص',
    pm: 'م',
  }

  return dict[s]
}
