function doGet(e){
  var flag    = true;
  var result  = {result:"no action"};
  var getData=JSON.parse(e.parameter.data);
  if(getData.action=="U" && getData.row[0]=="") getData.action="C";
  switch(getData.action){
    case "C":
      result= insert_value(getData);
      break;
    case "R":
      result= read_value  (getData);
      break;
    case "U":
      result= update_value(getData);
      break;
    case "D":
      result= delete_value(getData);
      break;
    default:
      flag=false;
      return HtmlService.createHtmlOutputFromFile("crud_test.html");
  }  
  if(flag) return ContentService.createTextOutput(getData.callback + "(" + JSON.stringify(result) + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function insert_value(e){
  var ss    = SpreadsheetApp.openById(e.database);
  var sheet = ss.getSheetByName(e.table);
  var id    = 0;
  var name  = e.row[1];
  var flag  = 1;
  var lr    = sheet.getLastRow();
  //buscar máximo valor del id
  for(var i=1;i<=lr;i++){
    var id1 = sheet.getRange(i, 2).getValue();
    if(id1>id) id=id1;
  }
  e.row[0]=id+1;
  //añadir una nueva fila con los parámetros dados por el cliente
  var d = new Date();
  var currentTime= d.toLocaleString();
  var dataToInsert=[currentTime];
  dataToInsert = dataToInsert.concat(e.row);
  console.log('insert: data= '+JSON.stringify(dataToInsert));
  var rowData = sheet.appendRow(dataToInsert);    //[currentTime,id+1,name]);  
  var result = "Insertion successful";
  
  var range= sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn());
  range.sort(2);
  
  var result = {
    spreadsheet : ss.getName(),
    sheet       : sheet.getName(),
    action      : "insert",
    result      : "Insertion succesful!",
    data        : read_sheet(sheet)
  };
  return result;  
}

function update_value(e){
  var ss     = SpreadsheetApp.openById(e.database);
  var sheet  = ss.getSheetByName(e.table);
  var id     = e.row[0];
  //var name   = e.row[1];
  var flag   = 0;
  var result = "id not found";
  var lr     = sheet.getLastRow();
  var rid    = 0;
  
  for(var i=1;i<=lr;i++){
    rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      //sheet.getRange(i,3).setValue(name);  
      sheet.getRange(i,2,1,e.row.length).setValues([e.row]);
      result="value updated successfully";   //sheet.getR
      flag=1;
    }
  }  //  sheet.getRange(row, column, numRows, numColumns).setV

  result = {
    spreadsheet : ss.getName(),
    sheet       : sheet.getName(),
    action      : "update",
    result      : result,
    data        : read_sheet(sheet)
  };
    
  return result
}

function delete_value(e){
  var ss     = SpreadsheetApp.openById(e.database);
  var sheet  = ss.getSheetByName(e.table);
  var id     = e.row[0];
  var flag   = 0;
  var lr     = sheet.getLastRow();
  var result = "Something wrong happened";
  
  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.deleteRow(i);
      result="value deleted successfully";
      flag=1;
    }
  }
  result = {
    spreadsheet : ss.getName(),
    sheet       : sheet.getName(),
    action      : "delete",
    result      : result,
    data        : read_sheet(sheet)
  };
  return result
}

function read_value(e){
  var ss     = SpreadsheetApp.openById(e.database);
  var sheet  = ss.getSheetByName(e.table);
  var result = {
    spreadsheet : ss.getName(),
    sheet       : sheet.getName(),
    action      : "read",
    result      : "complete!",
    data        : read_sheet(sheet)
  };
  console.log(' read_value: data= '+JSON.stringify(result));
  return result 
}

function read_sheet(sheet){
  //lee una hoja y la devuelve en formato json
  var values = sheet.getDataRange().getValues();
  var rows   = values.length;
  var cols   = values[0].length;
  var data   = [];
  var cells  = [];
  
  for (var i = 0; i < rows; i++){
    cells=[];  
    for(var j = 1 ; j < cols; j++){ cells.push(values[i][j]); }
    data.push(cells); 
  }
  console.log('data : '+JSON.stringify(data));
  return data;
}
