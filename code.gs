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
  if (!palabra) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Falta parámetro "palabra"' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Verificar duplicado
  const datos = sheet.getRange('A2:A').getValues().flat().filter(String);
  if (datos.map(p => p.toLowerCase()).includes(palabra.toLowerCase())) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Duplicado' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Insertar la palabra al final
  sheet.appendRow([palabra, '', '', '', '', '', '', '', '', new Date()]);

  return ContentService.createTextOutput(
    JSON.stringify({ resultado: 'ok', palabra })
  ).setMimeType(ContentService.MimeType.JSON);
}
