function tranformacionesGetSpreadSheet(cual) {
  var ssHoja = 'Base';
  if (cual === 'transformaciones') {
    ssHoja = 'Base';
  } else if (cual === 'Usuarios') {
    ssHoja = 'Usuarios';
  } else if (cual === 'Perfilado') {
    ssHoja = 'Perfilado';
  } else if (cual === 'Estatus') {
    ssHoja = 'Estatus';
  } else if (cual === 'originales') {
    ssHoja = cual;
  }
  try{
    var ss = SpreadsheetApp.openById('1vaPwWGvWSOrpP4qfWkJef_0_KYcI-z2noRmPWouX4-E');
    var sheet = ss.getSheetByName(ssHoja);
    //obteniendo la última Fila de registro que tengamos y también columna (esta última no es necesaria)
    var lastRow = sheet.getLastRow();
    var lasColumn = sheet.getLastColumn();
  //  Logger.log(lastRow);
   // Logger.log(lasColumn);

    var range = ssHoja === 'Base' ? sheet.getRange(2,1, lastRow, lasColumn) : sheet.getRange(1,1,lastRow,lasColumn);
    //var range = sheet.getRange('A2:CI'+lastRow);
    var values = range.getValues();
    //Logger.log(values)
    var valuesSinBlancos = ssHoja === 'Base' || ssHoja === 'Usuarios' ? values.filter(function (value) { return value[0] !== ''}) : values;
  //  Logger.log(valuesSinBlancos)

    //JSON.stringify(
    return JSON.stringify(valuesSinBlancos);
  }catch (e) {
    Logger.log(e);
    throw e;
  }
}

function transformacionesSaveSpreadSheet(rango, data, cual) {
  var ssHoja = 'Base';
  if (cual === 'Transformaciones') {
    ssHoja = 'Base';
  } else if (cual === 'Usuarios') {
    ssHoja = 'Usuarios';
  } else if (cual === 'Estatus') {
    ssHoja = 'Estatus';
  } else if (cual === 'Clientes') {
    ssHoja = 'Clientes';
  } else if (cual === 'originales') {
    ssHoja = 'originales';
  }
  // rango = 'A7:B7';
  // data = [['dato', 'dato2']];
  // rango = 'A7:A8';
  // data = [['uno'],['dos']];
  if (data.indexOf('{') === -1 ) {
    data = [data.split(',')];
   // Logger.log('Solo lo divide')
  } else {
    data = JSON.parse(data);
    // Este porque esta??
   // Logger.log('esto es la data que se va a guardar  : ',data);
   // Logger.log(Object.getOwnPropertyNames(data).length);
    if (data['A'] || data['G'] || data['CK']) {
      data = [data].map(function (dato) { return Object.keys(dato).map(function (dat) { return dato[dat] }) });
    } else {
      data = data.map(function (dato) { return Object.keys(dato).map(function (dat) { return dato[dat] }) });
    }
  }
  rango = rango ? rango.toString() : '';

  //Logger.log(rango)
  //Logger.log(data);
  try {
    var ss = SpreadsheetApp.openById('1vaPwWGvWSOrpP4qfWkJef_0_KYcI-z2noRmPWouX4-E');
    var sheet = ss.getSheetByName(ssHoja);
    if (rango === '') {
      sheet.appendRow(data[0]);
    } else if (rango === 'buscar') {
     // Logger.log('Buasjdfñlajsdñfa')
      var lastRow = sheet.getLastRow();
      var ranguito = 'A' + (lastRow + 1) + ':' + 'G' + (lastRow + data.length);
     // Logger.log(ranguito);
      var range = sheet.getRange(ranguito);
      range.setValues(data);
    } else {
      var range = sheet.getRange(rango);
      range.setValues(data);
    }
    return true;
  } catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('insertarSpreadSheet %s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
    throw e;
  }
}

function spreadSheetsAcciones(objeto, datos){
    datos = datos.split(';');
    for(var x in datos){
      datos[x] = datos[x].split(',');
    }
    //Logger.log(datos);
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);
  try{
    var ss = SpreadsheetApp.openById('1vaPwWGvWSOrpP4qfWkJef_0_KYcI-z2noRmPWouX4-E');
    var sheet = ss.getSheetByName(objeto.hoja);
    var range = sheet.getRange(objeto.rango);
    //Logger.log(range.getValues());
    if(objeto.accion == "Editar" || objeto.accion == "Agregar"){
      range.setValues(datos);
    }
    if(objeto.accion == "Eliminar"){
      sheet.deleteRow(objeto.idEliminar)
    }
    return true;

  }catch (e) {
    e = (typeof e === 'string') ? new Error(e) : e;
    Logger.severe('insertarSpreadSheet %s: %s (linea %s, archivo "%s"). Stack: "%s" . Por %s.', e.name || '',
                  e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', Session.getActiveUser().getEmail() || '');
    throw e;
  }finally {
    lock.releaseLock();
  }


}

function subirArchivo (name, bolb, tipo, caso) {
 // Logger.log('subir archivo .......................' ,name, bolb, tipo, caso);
  var folderId = DriveApp.getFolderById('1ed8sJIp71oOVNytCMBcH3ZvGiuV7ohVq');
  var folder = folderId.getFoldersByName(caso);
  var folderExiste = folder.hasNext() ?
    folder.next() : folderId.createFolder(caso);
   Logger.severe('folder existe   ', folder);
  var archivo = folderExiste.getFilesByName(name);
  while (archivo.hasNext()) {
    var file = archivo.next();
    file.setTrashed(true);
  }

  var decoded = Utilities.base64Decode(bolb);
  var blob = Utilities.newBlob(decoded, tipo, name);
  archivo = folderExiste.createFile(blob);
  Logger.log(archivo.getUrl());
  return archivo.getUrl();
}

//Obtener con ayuda del filtro
function tranformacionesGetFilteredSpreadSheet(cual, colFiltro, filtros) {
  var ssHoja = 'Clientes';
  if (cual) {
    switch (cual) {
      case 'Clientes':
        ssHoja = 'Clientes';
      break;
      case 'Estatus':
        ssHoja = 'Estatus';
      break;
      default:
        ssHoja = 'Clientes';
      break;
    }
  }
  if (!colFiltro) { colFiltro = 1 } else { colFiltro = Number(colFiltro) };
  if (!filtros) { filtros = '' }
  var filtro = SpreadsheetApp.newFilterCriteria().whenTextEqualTo(filtros);
  try{
    var ss = SpreadsheetApp.openById('1vaPwWGvWSOrpP4qfWkJef_0_KYcI-z2noRmPWouX4-E');
    var sheet = ss.getSheetByName(ssHoja);

    //obteniendo la última Fila de registro que tengamos y también columna (esta última no es necesaria)
    var lastRow = sheet.getLastRow();
    var lasColumn = sheet.getLastColumn();
   // Logger.log(lastRow);
    //Logger.log(lasColumn);

    var range = sheet.getRange(1,1,lastRow,lasColumn);
    //var range = sheet.getRange('A2:CI'+lastRow);
    var rangoFiltro;
    if (range.getFilter()) {
      range.getFilter().remove();
      rangoFiltro = range.createFilter().setColumnFilterCriteria(colFiltro, filtro);
    } else {
      rangoFiltro = range.createFilter().setColumnFilterCriteria(colFiltro, filtro);
    }
    var values = rangoFiltro.getRange().getValues();
    var valores = [];
    for (var d=0; d<values.length; d++) {
      if (!sheet.isRowHiddenByFilter(d+1)) {
        //Logger.log("Row #" + d + " is filtered - value: " + values[d][0]);
        valores.push(values[d]);
        continue;
      } else if (filtros === '') {
        valores.push(values[d]);
        continue;
      }
    }
    //Logger.log(JSON.stringify(valores));
    return JSON.stringify(valores);
  }catch (e) {
    Logger.log(e);
    throw e;
  }
}

//Guardar, a donde caiga, eliminando rows que existían previamente
function tranformacionesSaveFilteredSpreadSheet(cual, rows) {
  var ssHoja = 'Clientes';
  if (cual) {
    switch (cual) {
      case 'Clientes':
        ssHoja = 'Clientes';
      break;
      case 'Estatus':
        ssHoja = 'Estatus';
      break;
      default:
        ssHoja = 'Clientes';
      break;
    }
  }
  if (!rows) { return; } else {rows = rows.split(',')};
  try{
    var ss = SpreadsheetApp.openById('1vaPwWGvWSOrpP4qfWkJef_0_KYcI-z2noRmPWouX4-E');
    var sheet = ss.getSheetByName(ssHoja);
    rows.forEach(function (row) {
      sheet.deleteRow(row);
    });

    return 'Eliminado';
  }catch (e) {
    Logger.log(e);
    throw e;
  }
}
function deteleFolder(name){
   var folderId = DriveApp.getFolderById('1ed8sJIp71oOVNytCMBcH3ZvGiuV7ohVq');
  var folder = folderId.getFoldersByName(name);
  while (folder.hasNext()) {
    folder.next().setTrashed(true);
  // folder.next().setName('SEG00012')
  }

}
