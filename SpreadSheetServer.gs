/**
 * Takes a positive integer and returns the corresponding column name.
 * @param {number} num  The positive integer to convert to a column name.
 * @return {string}  The column name.
 */
function toColumnName(num) {
  for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
    ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
  }
  return ret;
}

function obtenerFechaAhora() {

  var d = new Date();
  /*var stringFecha = ("00" + d.getDate()).slice(-2) + "/" +
    ("00" + (d.getMonth() + 1)).slice(-2) + "/" +
      d.getFullYear() + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
          ("00" + d.getMinutes()).slice(-2) + ":" +
            ("00" + d.getSeconds()).slice(-2);*/

  var stringFecha =  d.getFullYear()+ "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) + "-" + ( ("00" + d.getDate()).slice(-2));

  return stringFecha;

}

function getUnique(column, spreadsheet) {

  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try{

    var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
    sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);
    var data = sheet.getDataRange().getValues();// get all data
    var newdata = new Array();
    for (nn in data) {
      var duplicate = false;
      for (j in newdata) {
        if (data[nn][column] == newdata[j][0]) {
          duplicate = true;
        }
      }
      if (!duplicate) {
        newdata.push([data[nn][column]]);
      }
    }

  }catch (e) {
        Logger.log(e);
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Con los objetos objeto: %s, spreadsheet: %s Por %s.',
                e.name || '', e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', JSON.stringify(column) || '', JSON.stringify(spreadsheet) || '',  Session.getActiveUser().getEmail() || '');
        throw e;
    } finally {
        lock.releaseLock();
    }


  return newdata;

}

function obtenerUltimoValor(column, spreadsheet) {

  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try{

    var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
    sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);
    var lastRow = sheet.getLastRow();
    var values = sheet.getRange(column + lastRow + ":" + column + lastRow).getValues();

  }catch (e) {
        Logger.log(e);
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Con los objetos objeto: %s, spreadsheet: %s Por %s.',
                e.name || '', e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', JSON.stringify(column) || '', JSON.stringify(spreadsheet) || '',  Session.getActiveUser().getEmail() || '');
        throw e;
    } finally {
        lock.releaseLock();
    }


  return values[0][0];

}

/**
 * Metodo generico para actualizar cualquier spreadsheet.
 * @param objeto rowPosition indice a ser eliminado (se empieza en 1) y howMany este puede venir nulo, y en caso de traer un numero sera el numero de renglones hacia abajo a ser eliminados a partir de rowPosition
 * @param spreadsheet objeto con SHEET_KEY {string}, GID {number} y FORMATS {array}.
 * @returns {string}.
 */
function eliminarRenglonesPorRangoSpreadSheet(objeto, spreadsheet) {
    Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);
    try {
        var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
        sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);

        if (objeto && objeto.rowPosition && objeto.howMany) {
            sheet.deleteRows(Number(objeto.rowPosition) + 1, objeto.howMany);
        } else if (objeto && objeto.rowPosition) {
            sheet.deleteRow(Number(objeto.rowPosition) + 1);
        }
    } catch (e) {
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
        throw e;
    } finally {
        lock.releaseLock();
    }

    return 'Se realizo eliminacion';
}

/**
 * Metodo generico para actualizar cualquier spreadsheet.
 * @param objeto indices indices a ser eliminado (se empieza en 1)
 * @param spreadsheet objeto con SHEET_KEY {string}, GID {number} y FORMATS {array}.
 * @returns {string}.
 */
function eliminarRenglonesSpreadSheet(objeto, spreadsheet) {
  //aaa
    Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);
    try {
        var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
        sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);

        if (objeto && objeto.indices) {
            var recorrer = objeto.indices.split(',');
            var i = 0;
            for (i; i < recorrer.length; i++) {
                //Se elimina el offset de los valores.
                sheet.deleteRow(Number(recorrer[i]) + 1 - i);
            }
        }
    } catch (e) {
        Logger.log(e);
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Con los objetos objeto: %s, spreadsheet: %s Por %s.',
                e.name || '', e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', JSON.stringify(objeto) || '', JSON.stringify(spreadsheet) || '',  Session.getActiveUser().getEmail() || '');
        throw e;
    } finally {
        lock.releaseLock();
    }

    return 'Se realizo eliminacion';
}

function eliminarConjuntoRenglonesQueContengan(objeto, spreadsheet) {

  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try {
        var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
        sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);
        var rows = sheet.getDataRange();
        var numRows = rows.getNumRows();
        var values = rows.getValues();
        var rowsDeleted = 0;
        var id = -1;
        var primero = true;
        for (var i = 0; i <= numRows - 1; i++) {
            var row = values[i];
            if (row[objeto.columna] == objeto.palabra) {
                if(primero) {
                  id = (parseInt(i) + 1);
                }
                primero = false;
                //ids.push((parseInt(i) + 1));
                //sheet.deleteRow((parseInt(i) + 1) - rowsDeleted);
                rowsDeleted++;
            }
        }
        if (id > 0 && rowsDeleted > 0) {
            sheet.deleteRows(id, rowsDeleted);
        }
    } catch (e) {
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
        throw e;
    }
}

function eliminarRenglonesQueContengan(objeto, spreadsheet) {
  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try {
        var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
        sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);
        var rows = sheet.getDataRange();
        var numRows = rows.getNumRows();
        var values = rows.getValues();
        var rowsDeleted = 0;
        for (var i = 0; i <= numRows - 1; i++) {
            var row = values[i];
            if (row[objeto.columna] == objeto.palabra) {
                sheet.deleteRow((parseInt(i) + 1) - rowsDeleted);
                rowsDeleted++;
            }
        }
    } catch (e) {
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
        throw e;
    }
}

/**
 * Metodo generico para actualizar cualquier spreadsheet.
 * @param objeto renglon a ser actualizado.
 * @param spreadsheet objeto con SHEET_KEY {string}, GID {number} y FORMATS {array}.
 * @returns {string}.
 */
function insertarSpreadSheet(objeto, spreadsheet) {

    Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);


    try {
        var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
        sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);

        var lastRow = sheet.getLastRow();

        var valoresLastRow = sheet.getRange('A' + lastRow + ":" + 'A' + lastRow).getValues();

      if(  valoresLastRow > 0 ){
        objeto.A = Number(valoresLastRow[0][0]) + 1;
      }else{
         objeto.A = 1;
      }

        var renglon = [];
        var primero = true;
        var inicioRango = '';
        var finRango = '';

        for (var k in objeto) {
          //Logger.log(k);
            if (primero) {
                inicioRango = k;
            }
            primero = false;
            finRango = k;
            renglon.push(objeto[k]);
        }

        var values = [];
        values.push(renglon);
        var formats = [];
        formats.push(JSON.parse(spreadsheet.FORMATS));
        var numRenglon = Number(objeto.A) + 1;
        var rango = "" + inicioRango + numRenglon + ":" + finRango + numRenglon;
        var range = sheet.getRange(rango);

        range.setNumberFormats(formats).setValues(values);

        var cell = sheet.getRange("A" + numRenglon);
        cell.setFormula("=ROW() - 1");
    } catch (e) {
        e = (typeof e === 'string') ? new Error(e) : e;
        Logger.severe('insertarSpreadSheet %s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
        throw e;
    } finally {
        lock.releaseLock();
    }

    return 'Se realizo la insercion';
}

/**
 * Metodo generico para actualizar cualquier spreadsheet.
 * @param objeto renglon a ser actualizado.
 * @param spreadsheet objeto con SHEET_KEY {string}, GID {number} y FORMATS {array}.
 * @returns {string}.
 */
function actualizarSpreadSheet(objeto, spreadsheet) {
  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');

  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try {
    var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
    sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);
    var renglon = [];
    var primero = true;
    var inicioRango = '';
    var finRango = '';

    for (var k in objeto) {
      if (primero) {
        inicioRango = k;
      }
      primero = false;
      finRango = k;
      renglon.push(objeto[k]);
    }

    var values = [];
    values.push(renglon);
    var formats = [];
    formats.push(JSON.parse(spreadsheet.FORMATS));
    var numRenglon = Number(objeto.A) + 1;
    var rango = "" + inicioRango + numRenglon + ":" + finRango + numRenglon;
    var range = sheet.getRange(rango);
    range.setNumberFormats(formats).setValues(values);

    var cell = sheet.getRange("A" + numRenglon);
    cell.setFormula("=ROW() - 1");

  } catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('actualizarSpreadSheet %s: %s (linea %s, archivo "%s"). Stack: "%s". Con los objetos objeto: %s, spreadsheet: %s  Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', JSON.stringify(objeto) || '', JSON.stringify(spreadsheet) || '', Session.getActiveUser().getEmail() || '');
    throw e;
  } finally {
    lock.releaseLock();
  }

  return 'Se realizo actualizacion';
}

/**
 * Siempre agrega la columna A como ROW() -1 y suma una columna al final del csv una columna para la fecha de carga.
**/

function importCSVFromString(objeto, spreadsheet) {
  Logger.log(spreadsheet);
  Logger.log(spreadsheet.SHEET_KEY);
  Logger.log(spreadsheet.NOMBRE_HOJA);
  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);

  try{
    var sheet = SpreadsheetApp.openById(spreadsheet.SHEET_KEY);
    sheet = sheet.getSheetByName(spreadsheet.NOMBRE_HOJA);
    var csvData = Utilities.parseCsv(objeto.csv, ",");
    var formato = JSON.parse(spreadsheet.FORMATS);
    var formats = [];
    var llave = [];
    var fechaCarga = [];
    var fechaAhora = obtenerFechaAhora();
    var i = 0;

    for (i; i < csvData.length; i++) {
        llave.push(["=ROW() - 1"]);
        fechaCarga.push([fechaAhora]);
        formats.push(formato);
    }
    if (objeto.vaciarAntes) {
        Logger.log(objeto.vaciarAntes);
        sheet.getRange( 2, 1, sheet.getLastRow(), sheet.getLastColumn() ).clearContent();
        sheet.getRange(2, 2, csvData.length, csvData[0].length).setNumberFormats(formats).setValues(csvData);
        var lastRow = csvData.length;
        var numero = 2;
        var rango = "A" + numero + ":A" + (Number(csvData.length) + 1);
        //Logger.log('Rango para formulas de llave %s' , rango);
       // Logger.log('Rango para formulas de llave valores %s' , JSON.stringify(llave));
        var cell = sheet.getRange(rango);
        cell.setFormulas(llave);
        rango = toColumnName(sheet.getLastColumn()) + 2 + ":" + toColumnName(sheet.getLastColumn()) + (Number(csvData.length) + 1);
       // Logger.log('Rango para fecha de carga %s' , rango);
        //Logger.log('Rango para gechas valores %s' , JSON.stringify(fechaCarga));
        sheet.getRange(rango).setValues(fechaCarga);
    } else {
        var lastRow = sheet.getLastRow();
        sheet.getRange(lastRow + 1, 2, csvData.length, csvData[0].length).setNumberFormats(formats).setValues(csvData);
        var rango = "A" + (Number(lastRow) + 1) + ":A" + (Number(lastRow) + Number(csvData.length));
        Logger.log(rango);
        var cell = sheet.getRange(rango);
        cell.setFormulas(llave);
        rango = toColumnName(sheet.getLastColumn()) + (Number(lastRow) + 1) + ":" + toColumnName(sheet.getLastColumn()) + (Number(lastRow) + Number(csvData.length));
        Logger.log(rango);
        sheet.getRange(rango).setValues(fechaCarga);
    }
  }catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" .  Con los objetos objeto: %s, spreadsheet: %s  Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '',  JSON.stringify(objeto) || '', JSON.stringify(spreadsheet) || '', Session.getActiveUser().getEmail() || '');
    throw e;
  } finally {
    lock.releaseLock();
    return 'some';
  }

}

function importCSVFromGmail() {
  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try{
    var threads = GmailApp.search("from:reports@example.com");
    var message = threads[0].getMessages()[0];
    var attachment = message.getAttachments()[0];
    // Is the attachment a CSV file
    if (attachment.getContentType() === "text/csv") {
        var sheet = SpreadsheetApp.getActiveSheet();
        var csvData = Utilities.parseCsv(attachment.getDataAsString(), ",");
        // Remember to clear the content of the sheet before importing new data
        sheet.clearContents().clearFormats();
        sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
    }
  }catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
    throw e;
  } finally {
    lock.releaseLock();
  }
}

function importCSVFromGoogleDrive() {
  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try{
    var file = DriveApp.getFilesByName("data.csv").next();
    var csvData = Utilities.parseCsv(file.getBlob().getDataAsString());
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
  }catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
    throw e;
  } finally {
    lock.releaseLock();
  }
}

function importCSVFromWeb() {
  Logger = BaseLib.useSpreadsheet('1Xd5NiDQ3rsYWKUKFRAeddjAyR8QzoN4FG-TV46BFopE');
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);
  try{
    // Provide the full URL of the CSV file.
    var csvUrl = "https://ctrlq.org/data.csv";
    var csvContent = UrlFetchApp.fetch(csvUrl).getContentText();
    var csvData = Utilities.parseCsv(csvContent);
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
  }catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
    throw e;
  } finally {
    lock.releaseLock();
  }
}
