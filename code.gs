let MySheets  = SpreadsheetApp.getActiveSpreadsheet();
let LoginSheet  = MySheets.getSheetByName("login"); 

function doGet(e) {
  var output = HtmlService.createTemplateFromFile('login');
  
  var sess = getSession();
   if (sess.loggedIn) {
     output = HtmlService.createTemplateFromFile('main');
  }
  return output.evaluate();
}

function myURL() {
  return ScriptApp.getService().getUrl();
}


function setSession(session) {
  var sId   = Session.getTemporaryActiveUserKey();
  var uProp = PropertiesService.getUserProperties();
  uProp.setProperty(sId, JSON.stringify(session));
}


function getSession() {
  var sId   = Session.getTemporaryActiveUserKey();
  var uProp = PropertiesService.getUserProperties();
  var sData = uProp.getProperty(sId);
  return sData ? JSON.parse(sData) : { loggedIn: false };
}


function loginUser(pUID, pPassword) {
    
    if (loginCheck(pUID, pPassword)) {
      
      var sess = getSession();
      sess.loggedIn = true;
      setSession(sess);

        return 'success';
    } 
    else {
        return 'failure';
    }
}


function logoutUser() {
  var sess = getSession();
  sess.loggedIn = false;
  setSession(sess);
}


function loginCheck(pUID, pPassword) {
  let LoginPass =  false;
      let ReturnData = LoginSheet.getRange("A:A").createTextFinder(pUID).matchEntireCell(true).findAll();
        
        ReturnData.forEach(function (range) {
          let StartRow = range.getRow();
          let TmpPass = LoginSheet.getRange(StartRow, 2).getValue();
          if (TmpPass == pPassword)
          {
              LoginPass = true;
          }
        });

    return LoginPass;
}

function OpenPage(PageName)
{
    return HtmlService.createHtmlOutputFromFile(PageName).getContent();
}


function UserRegister(pUID, pPassword, pName) {
    
    let RetMsg = '';
    let ReturnData = LoginSheet.getRange("A:A").createTextFinder(pUID).matchEntireCell(true).findAll();
    let StartRow = 0;
    ReturnData.forEach(function (range) {
      StartRow = range.getRow();
    });

    if (StartRow > 0) 
    {
      RetMsg = 'danger, User Already Exists';
    }
    else
    {
      LoginSheet.appendRow([pUID, pPassword, pName]) ;  
      RetMsg = 'success, User Successfully Registered'; 
    }

    return  RetMsg;
}
