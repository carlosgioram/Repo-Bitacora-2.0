function spreadSheetsGetOptions() {
  try{
    var ss = SpreadsheetApp.openById('1UXW1L_eiuji52w9JwWjT967W4pnsrttxKuyzjvSQJcI');
    var sheet = ss.getSheetByName('Opciones');

    //obteniendo la última Fila de registro que tengamos y también columna (esta última no es necesaria)
    var lastRow = sheet.getLastRow();
    var lasColumn = sheet.getLastColumn();

    Logger.log(lastRow);
    Logger.log(lasColumn);

    var range = sheet.getRange(1, 1, lastRow, lasColumn);
    // var range = sheet.getRange('A2:CG'+lastRow);
    var values = range.getValues();
    var objeto = {}
    for (i=0; i <= values.length; i++) {
      if (values[i]) {
        //Logger.log(values[i])
        if (i == 0) {
          for (n=0; n<= values[i].length; n++) {
            if (values[i][n]) {
              objeto[values[i][n]] = [];
            }
          }
        } else {
          for (d=0; d<= values[i].length; d++) {
            if (values[i][d]) {
              objeto[values[0][d]].push(values[i][d]);
            }
          }
        }
      }
    }
    Logger.log(objeto)
    return objeto;
  }catch (e) {
    Logger.log(e);
    throw e;
  }
}
