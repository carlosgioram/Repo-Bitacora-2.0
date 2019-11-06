var DescargaServer = function () {
};

function listFilesInFolder(folderName) {

  Logger.log("(1) -----> " + folderName)


  var folder = DriveApp.getFoldersByName(folderName).next();
  var contents = folder.getFiles();

  Logger.log("(2) -----> " + contents.length)

  var file, data, sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();

  sheet.appendRow(["Name", "Date", "Size", "URL", "Download", "Description", "Type"]);

  for (var i = 0; i < contents.length; i++) {

    file = contents[i];

//    if (file.getFileType() == "SPREADSHEET") {
//      continue;
//    }

    data = [
      file.getName(),
      file.getDateCreated(),
      file.getSize(),
      file.getUrl(),
      "https://docs.google.com/uc?export=download&confirm=no_antivirus&id=" + file.getId(),
      file.getDescription(),
      file.getFileType().toString()
    ];

    sheet.appendRow(data);
    return data;

  }

};

function descargaServerObtenerPlanCuenta() {
  try {
    var descargaServer = new DescargaServer();
    var datos = descargaServer.obtenerPlanCuenta();
    var datosInplant = descargaServer.ObtenerInplants();
    var datosGerente = descargaServer.ObtenerGerentes();

    var csvFile = descargaServerJsonToCsv(datos);
    var csvFileInplant = descargaServerJsonToCsvInplant(datosInplant);
    var csvFileGerente = descargaServerJsonToCsvGerente(datosGerente);

    var folder = DriveApp.getFolderById('10rjaN-JzEMSAAItqmpsIpVFKp0pZJzew');
    var fecha = new Date();
    var existeChildFolder = false;
    var existeChildChildFolder = false;
    var childFolder = undefined;
    var childChildFolder = undefined;
    var childFolders = folder.searchFolders("title = '" + fecha.getFullYear() + "'");



    while (childFolders.hasNext()) {
      childFolder = childFolders.next();
      existeChildFolder = true;
      var childChildFolders = childFolder.searchFolders("title = '" + descargaServerNumeroToMes(fecha.getMonth()) + "'");
      while (childChildFolders.hasNext()) {
        childChildFolder = childChildFolders.next();
        existeChildChildFolder = true;
      }
    }
    if (!existeChildFolder && !existeChildChildFolder) {

      childFolder = folder.createFolder(fecha.getFullYear())
      childChildFolder = childFolder.createFolder(descargaServerNumeroToMes(fecha.getMonth()));
      childChildFolder.createFile('Cerradores.csv', csvFile);
      childChildFolder.createFile('Inplants.csv', csvFileInplant);
      childChildFolder.createFile('Gerentes.csv', csvFileGerente);
    } else if (!existeChildChildFolder) {
      childChildFolder = childFolder.createFolder(descargaServerNumeroToMes(fecha.getMonth()));
      childChildFolder.createFile('Cerradores.csv', csvFile);
      childChildFolder.createFile('Inplants.csv', csvFileInplant);
      childChildFolder.createFile('Gerentes.csv', csvFileGerente);
    } else {
      var files = childChildFolder.getFiles();
      while (files.hasNext()) {
      var file = files.next();
        if(file.getName() === "Cerradores.csv"){
      childChildFolder.removeFile(file);
    } else if (file.getName() === "Gerentes.csv"){
      childChildFolder.removeFile(file);
    }else if (file.getName() === "Inplants.csv"){
      childChildFolder.removeFile(file);
    }
      Logger.log(file.getName());
      }
      childChildFolder.createFile('Cerradores.csv', csvFile);
      childChildFolder.createFile('Inplants.csv', csvFileInplant);
      childChildFolder.createFile('Gerentes.csv', csvFileGerente);
    }
  } catch (e) {
    throw e;
  }
}


function descargaServerNumeroToMes(numero) {
  var MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
  return MESES[numero];
}

function descargaServerJsonToCsv(datos) {
  try {
    var csvFile = '';
    var renglon = undefined;
    datos.forEach(function (element) {
      renglon = JSON.parse(element);
      /*Logger.log(renglon);*/
      csvFile += [renglon.DIVISION,
        renglon.REG_SECOBAN,
        renglon.REG_PROCREDIT,
        renglon.NOMBRE_PROCREDIT,
        renglon.PUESTO,
        renglon.ALTA,
        renglon.BAJA,
        renglon.COLOC_UNICO,
        renglon.PEMEX,
        renglon.AP,
        renglon.SUMA,
        renglon.META,
        renglon.LOGRO_MES,
        renglon.SUMA_PF,
        renglon.META_PF,
        renglon.LOGRO_PF,
        renglon.PAGO_PF,
        renglon.META_PM,
        renglon.REAL_PM,
        renglon.LOGRO_PM,
        renglon.META_AP,
        renglon.REAL_AP,
        renglon.LOGRO_AP,
        renglon.META_PYP,
        renglon.REAL_PYP,
        renglon.LOGRO_PYP,
        renglon.PAGO_OP,
        renglon.TOTAL_MES,
        renglon.META_GM,
        renglon.LOGRO_GM,
        renglon.EXCEDENTE,
        renglon.COMISION_GM,
        renglon.COLOC_SEG,
        renglon.META_S,
        renglon.LOGRO_S,
        renglon.MONTO_PAGO,
        renglon.INCOMPLETOS,
        renglon.DESCTO,
        renglon.A_PAGAR,
        renglon.FH_CIERRE
      ].join(',') + '\r\n';
    });
    //Logger.log(csvFile);
    return csvFile;
  } catch (err) {
    Logger.log(err);
  }
}



function descargaServerJsonToCsvInplant(datosInplant) {
  try {
    var csvFileInplant = '';
    var renglon = undefined;
    datosInplant.forEach(function (element) {
      renglon = JSON.parse(element);
      /*Logger.log(renglon);*/
      csvFileInplant += [renglon.DIVISION,
        renglon.REG_SECOBAN,
        renglon.REG_PROCREDIT,
        renglon.NOMBRE_PROCREDIT,
        renglon.PUESTO,
        renglon.ALTA,
        renglon.BAJA,
        renglon.TRAMO_GR_TOTAL,
        renglon.TRAMO_ASESOR_TOTAL,
        renglon.PEMEX_TOTAL,
        renglon.AP_TOTAL,
        renglon.SUMA_TOTAL,
        renglon.META_TOTAL,
        renglon.LOGRO_TOTAL,
        renglon.SUMA_FN,
        renglon.META_FN,
        renglon.LOGRO_FN,
        renglon.PAGO_FN,
        renglon.SUMA_FU,
        renglon.META_FU,
        renglon.LOGRO_FU,
        renglon.PAGO_FU,
        renglon.SUMA_MR,
        renglon.META_MR,
        renglon.LOGRO_MR,
        renglon.AP,
        renglon.META_AP,
        renglon.LOGRO_AP,
        renglon.MORALES_AP,
        renglon.SUMA_GM,
        renglon.META_GM,
        renglon.LOGRO_GM,
        renglon.EXCEDENTE,
        renglon.COMISION_GM,
        renglon.SUMA_SEG,
        renglon.META_SEG,
        renglon.LOGRO_SEG,
        renglon.PAGO_SEG,
        renglon.EXP_INCOMPLETOS,
        renglon.DEDUCCIONES,
        renglon.TOTAL_PAGAR
      ].join(',') + '\r\n';
    });
    //Logger.log(csvFile);
    return csvFileInplant;
  } catch (err) {
    Logger.log(err);
  }
}

function descargaServerJsonToCsvGerente(datosGerente) {
  try {
    var csvFileGerente = '';
    var renglon = undefined;
    datosGerente.forEach(function (element) {
      renglon = JSON.parse(element);
      /*Logger.log(renglon);*/
      csvFileGerente += [renglon.DIVISION,
        renglon.REG_NOMINA,
        renglon.REG_PROCREDIT,
        renglon.NOMBRE_PROCREDIT,
        renglon.ALTA,
        renglon.BAJA,
        renglon.SUMA_TOTAL,
        renglon.META_TOTAL,
        renglon.LOGRO_TOTAL,
        renglon.PAGO_OTROS_CANALES,
        renglon.OTROS_CANALES,
        renglon.SUMA_FN,
        renglon.META_FN,
        renglon.LOGRO_FN,
        renglon.PUNTOS_FN,
        renglon.COLOCACION_FU,
        renglon.META_FU,
        renglon.LOGRO_FU,
        renglon.PUNTOS_FU,
        renglon.COLOCACION_MR,
        renglon.META_MR,
        renglon.LOGRO_MR,
        renglon.PUNTOS_MR,
        renglon.AP,
        renglon.META_AP,
        renglon.LOGRO_AP,
        renglon.PUNTOS_AP,
        renglon.SUMA_GM,
        renglon.META_GM,
        renglon.LOGRO_GM,
        renglon.PUNTOS_GM,
        renglon.EXCEDENTE,
        renglon.T_GANAMAS,
        renglon.USO_PP,
        renglon.LOGRO_PP,
        renglon.DOR_PP,
        renglon.PORC_CAPILARIDAD,
        renglon.PTOS_CAPILARIDAD,
        renglon.POLIZA,
        renglon.META_SEG,
        renglon.LOGRO_SEG,
        renglon.PAGO_SEG,
        renglon.EXP_INC,
        renglon.PTOS_GLOBAL,
        renglon.CONSECUCION,
        renglon.BONO_REFERENCIA,
        renglon.SEG_GMAS,
        renglon.TOTAL_BONIFICACION,
        renglon.FH_CIERRE
      ].join(',') + '\r\n';
    });
    //Logger.log(csvFile);
    return csvFileGerente;
  } catch (err) {
    Logger.log(err);
  }
}


/*Descarga Inplants por Division*/
function descargaDivInplantCSV(datos) {

 try {
    var csvFile = '';
    var renglon = undefined;
    datos.forEach(function (element) {
      renglon = JSON.parse(element);
      /*Logger.log(renglon);*/
      csvFile += [renglon.NIVEL,
        renglon.DIVISION,
        renglon.REG_PROCREDIT,
        renglon.NOMBRE_PROCREDIT,
        renglon.PUESTO,
        renglon.COLOCACION,
        renglon.META,
        renglon.LOGRO,
        renglon.MORAL,
        renglon.META_MORAL,
        renglon.LOGRO_MR,
        renglon.AP,
        renglon.META_AP,
        renglon.LOGRO_AP,
        renglon.COLOCACION_AC,
        renglon.META_AC,
        renglon.LOGRO_AC,
        renglon.MORAL_AC,
        renglon.META_MORAL_AC,
        renglon.LOGRO_MR_AC,
        renglon.AP_AC,
        renglon.META_AP_AC,
        renglon.LOGRO_AP_AC,
        renglon.FH_CIERRE
      ].join(',') + '\r\n';
    });
    //Logger.log(csvFile);
    return csvFile;
  } catch (err) {
    Logger.log(err);
  }
}

/*Descarga Ecas por Division*/
function descargaDivEcaCSV(datos) {

 try {
    var csvFile = '';
    var renglon = undefined;
    datos.forEach(function (element) {
      renglon = JSON.parse(element);
      /*Logger.log(renglon);*/
      csvFile += [renglon.NIVEL,
        renglon.DIVISION,
        renglon.NOMBRE_PROCREDIT,
        renglon.COLOCACION,
        renglon.META,
        renglon.LOGRO_MES,
        renglon.REAL_PM,
        renglon.META_PM,
        renglon.LOGRO_PM,
        renglon.REAL_AP,
        renglon.META_AP,
        renglon.LOGRO_AP,
        renglon.COLOCACION_AC,
        renglon.META_AC,
        renglon.LOGRO_MES_AC,
        renglon.REAL_PM_AC,
        renglon.META_PM_AC,
        renglon.LOGRO_PM_AC,
        renglon.REAL_AP_AC,
        renglon.META_AP_AC,
        renglon.LOGRO_AP_AC
      ].join(',') + '\r\n';
    });
    //Logger.log(csvFile);
    return csvFile;
  } catch (err) {
    Logger.log(err);
  }
}



/*Descarga Ecas por Division*/
function descargaDivDamCSV(datos) {

 try {
    var csvFile = '';
    var renglon = undefined;
    datos.forEach(function (element) {
      renglon = JSON.parse(element);
      /*Logger.log(renglon);*/
      csvFile += [renglon.DIVISION,
        renglon.NOMBRE_PROCREDIT,
        renglon.COLOCACION,
        renglon.META,
        renglon.LOGRO,
        renglon.MORAL,
        renglon.META_MORAL,
        renglon.LOGRO_MORAL,
        renglon.ARREND,
        renglon.META_ARREND,
        renglon.LOGRO_ARREND,
        renglon.COLOCACION_AC,
        renglon.META_AC,
        renglon.LOGRO_AC,
        renglon.MORAL_AC,
        renglon.META_MORAL_AC,
        renglon.LOGRO_MORAL_AC,
        renglon.ARREND_AC,
        renglon.META_ARREND_AC,
        renglon.LOGRO_ARREND_AC,
        renglon.FH_CIERRE
      ].join(',') + '\r\n';
    });
    //Logger.log(csvFile);
    return csvFile;
  } catch (err) {
    Logger.log(err);
  }
}

function getTree(objeto) {
  var outputRows = [];
  outputRows = getFolderTree_(outputRows, objeto.folderId, objeto.listFiles, objeto.searchDepthMax);
  return JSON.stringify(outputRows);
}

function getFolderTree_(outputRows, folderId, listFiles, searchDepthMax) {
  var parentFolder;
  var searchDepth = -1;
  try {
    parentFolder = DriveApp.getFolderById(folderId);
    outputRows = getChildFolders_(searchDepth, parentFolder.getName(), parentFolder, listFiles, outputRows, searchDepthMax);
  } catch (e) {
    throw e;
  }
  return outputRows;
}

function getChildFolders_(searchDepth, parentFolderName, parentFolder, listFiles, outputRows, searchDepthMax) {
  var childFolders = parentFolder.getFolders();
  var childFolder = null;
  searchDepth += 1;
  try{
    var nodes = [];
    while (childFolders.hasNext() && searchDepth < searchDepthMax) {
      childFolder = childFolders.next();

      var parentFolderNameCadena = parentFolderName + "/" + childFolder.getName();
      var parentFolderNameCadenaArreglo = parentFolderNameCadena.split('/');

      if (parentFolderNameCadenaArreglo.length <= 2) {
        outputRows.push(
          {
            text : childFolder.getName(),
            tipo : 'Folder',
            name : childFolder.getName(),
            id : childFolder.getId(),
            url : childFolder.getUrl(),
            parentFolderName : parentFolderNameCadena,
            dateCreated : childFolder.getDateCreated(),
            lastUpdated : childFolder.getLastUpdated(),
            description : childFolder.getDescription(),
            size : childFolder.getSize(),
            owner : childFolder.getOwner(),
            sharingPermission : childFolder.getSharingPermission(),
            sharingAccess : childFolder.getSharingAccess(),
            icon: 'glyphicon glyphicon-folder-close'
          }
        );
      } else if (parentFolderNameCadenaArreglo.length === 3) {
        var folderNameEncontrar = parentFolderName;
        nodes.push({
          text : childFolder.getName(),
          tipo : 'Folder',
          name : childFolder.getName(),
          id : childFolder.getId(),
          url : childFolder.getUrl(),
          parentFolderName : parentFolderNameCadena,
          dateCreated : childFolder.getDateCreated(),
          lastUpdated : childFolder.getLastUpdated(),
          description : childFolder.getDescription(),
          size : childFolder.getSize(),
          owner : childFolder.getOwner(),
          sharingPermission : childFolder.getSharingPermission(),
          sharingAccess : childFolder.getSharingAccess(),
          icon: 'glyphicon glyphicon-folder-close',
          selectedIcon: "glyphicon glyphicon-folder-open",
        });
        for(var x in outputRows){
          if(outputRows[x].parentFolderName === folderNameEncontrar){
            outputRows[x].nodes = nodes;
          }
        }
      }
      outputRows = getChildFolders_(searchDepth++, parentFolderName + "/" + childFolder.getName(), childFolder, listFiles, outputRows, searchDepthMax);
    }
  } catch (e) {
    throw e;
  }
  return outputRows;
}

function getChildFiles_(parentFolder, childFolder, listFiles, outputRows, pathComplete) {
  var childFiles = childFolder.getFiles();
  var childFile = null;
  try{
    while (listFiles && childFiles.hasNext()) {
      childFile = childFiles.next();
      outputRows.push(
        {
          text : childFile.getName(),
          tipo : 'Archivo',
          parentFolderName : ( pathComplete === null ? '' : pathComplete ) +  "/" + childFile.getName(),
          name : childFile.getName()
        }
      );
    }
  } catch (e) {
    throw e;
  }
  return outputRows;
}


function getFilesFolder (idFolder) {
  var arrayFiles = [];
  folderId = DriveApp.getFolderById(idFolder);
  var childFiles = folderId.getFiles();
  var childFile;
  try{
    while (childFiles.hasNext()) {
      childFile = childFiles.next();
      arrayFiles.push(
        {
          archivo: childFile.getName(),
          name : childFile.getName(),
          id : childFile.getId(),
          url : childFile.getUrl(),
          downloadUrl : childFile.getDownloadUrl(),
          idFolderParent: idFolder,
        }
      );
    }
  } catch (e) {
    throw e;
  }
  //Logger.log(arrayFiles);
  return arrayFiles;
}



/*descargas sera visible para staff, gerente y apoyo administrativo*/


function cartaFiniquito(objeto) {
  //var newDoc = DocumentApp.create('Carta_finiquito');
  //var file = DriveApp.getFileById(newDoc.getId());
  var folder = DriveApp.getFolderById('1NvPUI3NdKRaNe3AGL3SnZah7rTSp0Ve5');
  var docid = DriveApp.getFileById('1B95IT4xUozEq53d5fooXReHOKqDVY8KneD-Q8P77UTk').makeCopy().getId(); //Copia del doc original
  //objeto.producto = 'Cuenta de Débito';
  //Logger.log(docid);
  var doc = DocumentApp.openById(docid);
  doc.setName('Carta_finiquito')
  var body = doc.getActiveSection();
   body.replaceText("{dia_hoy}", objeto.dia_hoy);
  body.replaceText("{mes_hoy}", objeto.mes_hoy);
  body.replaceText("{anio_hoy}", objeto.anio_hoy);

  body.replaceText("{dia}", objeto.dia);
  body.replaceText("{mes}", objeto.mes);
  body.replaceText("{anio}", objeto.anio);

  body.replaceText("{monto}", objeto.monto);
  body.replaceText("{monto_letra}", objeto.monto_letra);
  body.replaceText("{producto}", objeto.producto);
  body.replaceText("{producto_numero}", objeto.producto_numero);
  body.replaceText("{nombre}", objeto.nombre);
  body.replaceText("{sucursal}", objeto.sucursal);

  doc.saveAndClose();
  var newFile = DriveApp.createFile(doc.getAs('application/pdf'));
  folder.addFile(newFile);
  Logger.log(newFile.getUrl());
  Logger.log(newFile.getId());
  if(objeto.tipo == 'descargar'){
  //este objeto permitirá regresar un arreglo con los dos ids que en futuro se eliminaran y la nueva url para descargar el pdf
    var objetoResponse = {
                          idArray: [newFile.getId(), docid],
                          urlDowload: newFile.getDownloadUrl().slice(0,-8)
                          }
    return objetoResponse;
  }else{
    enviarCartaFiniquito(doc, objeto, docid, newFile);
  }


}

function eliminarCartasFiniquito(array){
  try{
    var contador = 0;
    for(var i = 0; i< array.length; i++){
      var idDoc = Drive.Files.remove(array[i]);
      contador++;
    }

    return contador;
  }catch (e) {
    return false;
  }
}

function enviarCartaFiniquito(doc, objeto, docid, newFile){
  try{
    var antes = MailApp.getRemainingDailyQuota();
    var bbvaLogo = Utilities.newBlob(Utilities.base64Decode(iconoBbva()), "image/png", "BbvaLogoBlob");
    var iconNaturaLogo = Utilities.newBlob(Utilities.base64Decode(iconNatura()), "image/png", "NaturaLogoBlob");

    /*mensaje.inlineImages = {
        bbvaLogo: bbvaLogo,
        iconNaturaLogo: iconNaturaLogo,
    }*/

    var adjuntos = [];
     var mensaje = {};
   mensaje.to = objeto.to;// Este es el correo a quien le llegan los correos//
   mensaje.cc = 'ivanalejandro.justo.contractor@bbva.com,joseluis.murillo.garcia.contractor@bbva.com';// Este es el correo a quien le llega copa
   mensaje.bcc = '';// Este es el correo a quien le llegan lo mails con copia oculta//
   mensaje.replyTo= 'no-reply';
   mensaje.subject = '[Carta finiquito]';
    mensaje.htmlBody = '<div align="center" style="background-color:#004481;width:100%;height: 40px;padding-top: 15px;"><img width="230px" src="cid:bbvaLogo" /></div> <div align="center" style="width: 100%; min-height: 50%;margin-left: 20px;margin-right: 143px;line-height: 21px;"> <br><br><span style="color: #004481; font-size: 18px"><b>Carta finiquito  </b></span><br> <br>  <br>  </div> <div align="center" style="width:100%;height: 50px;background:#004481;vertical-align: middle;padding-top: 5px; color: #fff"> <p style="margin:0cm 0cm 0pt;line-height:19px"><b style="font-size:12.8px;line-height:normal"> <font color="green" face="Webdings" size="6"><span style="font-size:12pt">P</span></font> </b> <font color="#fff" style="font-size:11px;line-height:normal">&nbsp;</font> <font color="#fff" face="Arial" size="1" style="line-height:normal"><span style="font-size:8pt">Antes de imprimir este e-mail piensa bien si es necesario hacerlo</span></font><br> </p> </div>'
   mensaje.noReply = true;

   adjuntos.push(doc.getAs('application/pdf'));
    mensaje.attachments = adjuntos


    MailApp.sendEmail(mensaje);
    var despues = MailApp.getRemainingDailyQuota();
    Logger.log(antes-despues);
    //Eliminando las copias para que solo quede la plantilla
    Drive.Files.remove(docid);
    Drive.Files.remove(newFile.getId());
    return (antes-despues);

  }catch(e){
    Logger.log(e);
      e = (typeof e === 'string') ? new Error(e) : e;
      Logger.severe('%s: %s (linea %s, archivo "%s"). Stack: "%s" . Con los objetos mensaje: %s, Por %s.',
              e.name || '', e.message || '', e.lineNumber || '', e.fileName || '', e.stack || '', JSON.stringify(mensaje) || '', Session.getActiveUser().getEmail() || '');
      Logger.log(e);
  }
}
