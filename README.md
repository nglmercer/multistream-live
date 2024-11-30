# Node + Express Service Starter

This is a simple API sample in Node.js with express.js 

## Getting Started

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```

## demo in livesocket.onrender.com
i hosted this with onrender deploy


## alert api 
este es un ejemplo de alerta que recibe para poder crear los elementos
```json5
{
    "template": "multi-grid",
    "content": "John Doe donated $50! Thank you!",
    "duration": 5000,
    "src": [
        {
            "nombre": "imagen1.png",
            "path": "https://picsum.photos/200/200",
            "mediaType": "image/png",
        },
        {
            "nombre": "imagen2.jpg",
            "path": "c:/user/example/imagen2.jpg",
            "mediaType": "image/jpg",
        },
        {
            "nombre": "video.mp4",
            "path": "c:/user/example/video.mp4",
            "mediaType": "video/mp4",
        },
        {
            "nombre": "audio.mp3",
            "path": "c:/user/example/audio.mp3",
            "mediaType": "audio/mp3",
        },
        
        ]
}
// si el template es texto ignoramos el src, si es que en el template no se usa
```json5
{
    "template": "text",
    "content": "John Doe donated $50! Thank you!",
    "duration": 5000,
    "src": [{"example": "el contenido sera ignorado"}]
}
```

## 
class ObjectComparator {
  constructor(mainObject) {
    this.mainObject = mainObject;
  }
  // Ahora devuelve todos los tipos de comparación para cada clave
  compareKeys(objectsToCompare, keysToCheck) {
    if (Array.isArray(objectsToCompare)) {
      // Si es un array, procesamos todos los objetos
      return objectsToCompare.map(obj => {
        return this.compareSingleObject(obj, keysToCheck);
      });
    } else {
      // Si es un solo objeto, simplemente lo procesamos
      return this.compareSingleObject(objectsToCompare, keysToCheck);
    }
  }
  compareSingleObject(obj, keysToCheck) {
    const result = {};
    keysToCheck.forEach(key => {
      const keyName = typeof key === 'object' ? key.key : key;
      const compareType =
        typeof key === 'object' && key.compare ? key.compare : 'isEqual';
      result[keyName] = this.compareValues(
        this.mainObject[keyName],
        obj[keyName]
      );
    });
    return result;
  }
  compareValues(value1, value2) {
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return this.compareStrings(value1, value2);
    } else if (typeof value1 === 'number' && typeof value2 === 'number') {
      return this.compareNumbers(value1, value2);
    } else {
      return { isEqual: value1 === value2 };
    }
  }
  compareStrings(str1, str2) {
    return {
      isEqual: str1 === str2,
      contains: str1.includes(str2),
      startsWith: str1.startsWith(str2),
      endsWith: str1.endsWith(str2),
    };
  }
  compareNumbers(num1, num2) {
    const maxRange2 = num2 * 1.1; // 110% del valor de num2
    const minRange2 = num2 * 0.9; // 90% del valor de num2
    return {
      isEqual: num1 === num2,
      isLess: num1 < num2,
      isGreater: num1 > num2,
      isLessOrEqual: num1 <= num2,
      isGreaterOrEqual: num1 >= num2,
      isInRange: num1 >= minRange2 && num1 <= maxRange2,
    };
  }
}
function compareObjects(mainObject, objectsToCompare, keysToCheck, callback) {
  const comparator = new ObjectComparator(mainObject);
  const comparisonResults = comparator.compareKeys(
    objectsToCompare,
    keysToCheck
  );
  const validResults = [];
  let coincidentobjects = {};
  // Ejecutar el callback si se proporciona
  if (callback && typeof callback === 'function') {
    comparisonResults.forEach((comparisonResult, index) => {
      const allComparisonsTrue = getComparisonValues(
        comparisonResult,
        keysToCheck
      );
     
      if (allComparisonsTrue.allTrue) {
        callback(objectsToCompare[index], index,allComparisonsTrue);
        validResults.push(objectsToCompare[index]);
        coincidentobjects = allComparisonsTrue;
      }
    });
  }
  return { comparisonResults, validResults, coincidentobjects }; // Retornar solo los objetos válidos
}
function getComparisonValues(obj, keysToCheck) {
  const result = {};
  let allTrue = true; // Variable para rastrear si todos son true
  keysToCheck.forEach(({ key, compare }) => {
    if (obj[key] && obj[key][compare] !== undefined) {
      result[key] = obj[key][compare];
      // Si alguno de los valores no es true, establecer allTrue en false
      if (!obj[key][compare]) {
        allTrue = false;
      }
    }
  });
  // Añadir el resultado de la verificación allTrue
  result.allTrue = allTrue;
  return result;
} 
EN MI CODIGO EVALUO SI EXISTEN ciertos valores y devuelvo los resultados en un array pero si es que el valor es true, entonces devuelve el objeto si o ya sea que el comparison sea cual sea 
const mainObject = { uniqueId: 1, giftName: "Test", diamondCount: 100 };
const objectsToCompare = [
  { id: 1, name: "Test", value: 105 },
  { id: "true", name: "true", value: "true" },
  { id: 1 name: "Test", value: "true" },
  { id: 1 name: "true", value: "true" },
  { id: 3, name: "Test", value: 100 }
];
const keysToCheck = [
  { key: "id", compare: "isEqual" },
  { key: "name", compare: "contains" },
  { key: "value", compare: "isInRange" }
];

const result = compareObjects(mainObject, objectsToCompare, keysToCheck, (obj, index, allComparisons) => {
  console.log(Objeto ${index} cumple las condiciones:, obj, allComparisons);
}); // este { id: "true", name: "true", value: "true" }, { id: 1 name: "true", value: "true" },
debe existir  y solamente debe estar incluido cuando se le pasa a la function un parametro estra de includetrue = "true", quiero modificar la clase en si para que haga la comparacion y apruebe el valor de includetrue