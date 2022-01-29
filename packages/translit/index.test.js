const translit = require('./index');

test('unsupported locale', () => {
  expect(() => translit('', 'en')).toThrow();
});

test('undefined', () => {
  expect(translit(undefined, 'uk')).not.toBeDefined();
});

test('null', () => {
  expect(translit(null, 'uk')).toBeNull();
});

test('empty', () => {
  expect(translit('', 'uk')).toBe('');
});

const src = {
  Алушта: 'Alushta',
  Андрій: 'Andrii',
  Борщагівка: 'Borshchahivka',
  Борисенко: 'Borysenko',
  Вінниця: 'Vinnytsia',
  Володимир: 'Volodymyr',
  Гадяч: 'Hadiach',
  Богдан: 'Bohdan',
  Згурський: 'Zghurskyi',
  Ґалаґан: 'Galagan',
  Ґорґани: 'Gorgany',
  Донецьк: 'Donetsk',  
  Дмитро: 'Dmytro',
  Рівне: 'Rivne',  
  Олег: 'Oleh',  
  Есмань: 'Esman',  
  Єнакієве: 'Yenakiieve',
  Гаєвич: 'Haievych',
  "Короп’є": 'Koropie',
  Житомир: 'Zhytomyr',
  Жанна: 'Zhanna',
  Жежелів: 'Zhezheliv',
  Закарпаття: 'Zakarpattia',
  Казимирчук: 'Kazymyrchuk',
  Медвин: 'Medvyn',
  Михайленко: 'Mykhailenko',
  Іванків: 'Ivankiv',
  Іващенко: 'Ivashchenko',
  Їжакевич: 'Yizhakevych',
  Кадиївка: 'Kadyivka',
  "Мар’їне": 'Marine',
  Йосипівка: 'Yosypivka',
  Стрий: 'Stryi',
  Олексій: 'Oleksii',
  Київ: 'Kyiv',
  Коваленко: 'Kovalenko',
  "Біла Церква": 'Bila Tserkva',
  Чернівці: 'Chernivtsi',
  Шевченко: 'Shevchenko',
  Шостка: 'Shostka',
  Кишеньки: 'Kyshenky',
  Щербухи: 'Shcherbukhy',
  Гоща: 'Hoshcha',
  Гаращенко: 'Harashchenko',
  Юрій: 'Yurii',
  Корюківка: 'Koriukivka',
  Яготин: 'Yahotyn',
  Ярошенко: 'Yaroshenko',
  Костянтин: 'Kostiantyn',
  "Знам’янка": 'Znamianka',
  Феодосія: 'Feodosiia',
  Згорани: 'Zghorany',
  Розгон: 'Rozghon',
};

Object.keys(src).forEach((key) => {
  test(key, () => {
    expect(translit(key, 'uk')).toBe(src[key].toLowerCase());
  });
});

const srcRus = 'Иван Алексеев, известный под сценической кличкой Noize MC записал альбом с показательным названием «Неразбериха». Получилась питательная и где-то даже успокоительная смесь из хип-хопа, гранжа, регги и брейк-бита';
const result = 'Ivan Alekseev, izvestnyi pod scenicheskoi klichkoi Noize MC zapisal albom s pokazatelnym nazvaniem «Nerazberiha». Poluchilas pitatelnaya i gde-to daje uspokoitelnaya smes iz hip-hopa, granja, reggi i breik-bita';

test('Russian', () => {
  expect(translit(srcRus, 'ru')).toBe(result.toLowerCase());
});
