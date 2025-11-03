function probarConexion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName('Datos');
  Logger.log('Archivo: ' + ss.getName());
  Logger.log('Hoja encontrada: ' + hoja);
}

function doGet(e) {
  const hoja = 'Datos'; // nombre de la pestaña en tu Google Sheets
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(hoja);

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: `No se encontró la hoja "${hoja}"` })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const palabra = (e.parameter.palabra || '').toLowerCase().trim();
  if (!palabra) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Falta el parámetro "palabra"' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Leer todas las palabras de la columna A (desde A2 hacia abajo)
  const datos = sheet.getRange('A2:A').getValues()
    .flat()
    .filter(String)
    .map(p => p.toLowerCase());

  const existe = datos.includes(palabra);

  return ContentService.createTextOutput(
    JSON.stringify({ existe })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const hoja = 'Datos'; // nombre de la pestaña
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(hoja);

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: `No se encontró la hoja "${hoja}"` })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const palabra = (e.parameter.palabra || '').trim();
  const traduccionManual = (e.parameter.traduccion || '').trim();

  if (!palabra) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Falta parámetro "palabra"' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Verificar duplicado desde la primera fila
  const datos = sheet.getRange('A1:A').getValues().flat().filter(String);
  if (datos.map(p => p.toLowerCase()).includes(palabra.toLowerCase())) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Duplicado' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Calcular la primera fila vacía
  const fila = sheet.getLastRow() + 1;

  // Columna A: palabra
  sheet.getRange(`A${fila}`).setValue(palabra);

  // Columna B: pinyin
  sheet.getRange(`B${fila}`).setFormula(`=pinyin(A${fila})`);

  // Columna C: traducción manual o fórmula zh→es
  if (traduccionManual) {
    sheet.getRange(`C${fila}`).setValue(traduccionManual);
  } else {
    // ⚠️ En español se usan punto y coma
    sheet.getRange(`C${fila}`).setFormula(`=GOOGLETRANSLATE(A${fila};"zh-CN";"ES")`);
  }

  // Columna D: traducción zh→en
  sheet.getRange(`D${fila}`).setFormula(`=GOOGLETRANSLATE(A${fila};"zh-CN";"EN")`);

  // Columna J: fecha
  sheet.getRange(`J${fila}`).setValue(new Date());

  return ContentService.createTextOutput(
    JSON.stringify({ resultado: 'ok', palabra, fila })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Convierte texto chino en pinyin usando la API de Google Translate (no oficial).
 * Uso en Sheets: =pinyin(A1)
 */
function pinyin(texto) {
  if (!texto) return '';
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=zh-CN&dt=rm&q=' + encodeURIComponent(texto);
    const respuesta = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const datos = JSON.parse(respuesta.getContentText());
    const resultado = datos[0].map(item => item[3] || item[0]).join(' ').trim();
    return resultado;
  } catch (e) {
    return 'Error';
  }
}

