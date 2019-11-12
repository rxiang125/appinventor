import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp();
const db = admin.database();
const ref = db.ref("/TechAuth20191016/ALLUSERS");

// FIREBASE URL: https://us-central1-simpleappauthenticator.cloudfunctions.net/simpleDbFunction
// FIREBASE REALTIMEDATABASE URL: https://simpleappauthenticator.firebaseio.com/TechAuth20191016
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.simpleDbFunction = functions.https.onRequest(async (_,res: any) => {
    ref.once("value", function(data) {
      //do some stuff once
      const re = /\"/gi;
      let ALLUSERSSTR = data.val();
      ALLUSERSSTR = ALLUSERSSTR.replace("[","");
      ALLUSERSSTR = ALLUSERSSTR.replace("]","");
      ALLUSERSSTR = ALLUSERSSTR.replace(re,"");
      const ALLUSERSARRAY = ALLUSERSSTR.split(",");
      for (const USERNUM of ALLUSERSARRAY){
          const REFDAY = db.ref("/TechAuth20191016/" + `${USERNUM}`+ "DATEDAY");
          const REFMONTH = db.ref("/TechAuth20191016/" + `${USERNUM}`+ "DATEMONTH");
          const REFYEAR = db.ref("/TechAuth20191016/" + `${USERNUM}`+ "DATEYEAR");
          const CURRENTDATE = (new Date()).getTime();
          enum DATEDUE {No, Soon, Yes};
          REFDAY.once("value",function(day){
            if(day !== null){
              REFMONTH.once("value",function(month){
                REFYEAR.once("value",function(year){
                  let DAYSTR = day.val();
                  let MONTHSTR = month.val();
                  let YEARSTR = year.val();
                  const re1 = /\\/gi;
                  DAYSTR = DAYSTR.replace("[","");
                  DAYSTR = DAYSTR.replace("]","");
                  DAYSTR = DAYSTR.replace(re,"");
                  DAYSTR = DAYSTR.replace(re1,"");
                  MONTHSTR = MONTHSTR.replace("[","");
                  MONTHSTR = MONTHSTR.replace("]","");
                  MONTHSTR = MONTHSTR.replace(re,"");
                  MONTHSTR = MONTHSTR.replace(re1,"");
                  YEARSTR = YEARSTR.replace("[","");
                  YEARSTR = YEARSTR.replace("]","");
                  YEARSTR = YEARSTR.replace(re,"");
                  YEARSTR = YEARSTR.replace(re1,"");
                  const DAYARRAY = DAYSTR.split(",");
                  const MONTHARRAY = MONTHSTR.split(",");
                  const YEARARRAY = YEARSTR.split(",");
                  const FULLDATEARRAY = []
                  const DATEDUEARRAY = []
                  let FULLDATESTR = "["
                  let DATEDUESTR = "["
                  for (let num1 = 0; num1 < DAYARRAY.length; num1 ++){
                    let REALDAY = DAYARRAY[num1]
                    let REALMONTH = MONTHARRAY[num1]
                    const REALYEAR = YEARARRAY[num1]
                    if(REALDAY.length === 1){
                      REALDAY = "0" + REALDAY
                    }
                    if(REALMONTH.length === 1){
                      REALMONTH = "0" + REALMONTH
                    }
                    const FULLDATE = (new Date(REALYEAR + "-" + REALMONTH + "-" + REALDAY + "T00:00:00")).getTime()
                    if((FULLDATE-CURRENTDATE+31557600000)>2592000000){
                      DATEDUEARRAY.push(DATEDUE.No);
                    }
                    else if(2592000000>=(FULLDATE-CURRENTDATE+31557600000) && (FULLDATE-CURRENTDATE+31557600000)>0){
                      DATEDUEARRAY.push(DATEDUE.Soon);
                    }
                    else if((FULLDATE-CURRENTDATE+31557600000)<=0){
                      DATEDUEARRAY.push(DATEDUE.Yes);
                    }
                    FULLDATEARRAY.push(FULLDATE)
                  }
                  for (const ADATE of FULLDATEARRAY){
                    FULLDATESTR = FULLDATESTR + `${ADATE}` + ","
                  }
                  FULLDATESTR = FULLDATESTR.slice(0, -1);
                  FULLDATESTR += "]"
                  for (const ADUE of DATEDUEARRAY){
                    DATEDUESTR = DATEDUESTR + `${ADUE}` + ","
                  }
                  DATEDUESTR = DATEDUESTR.slice(0, -1);
                  DATEDUESTR += "]"
                  db.ref("/TechAuth20191016/" + `${USERNUM}`+ "FULLDATE").set(FULLDATESTR).catch(err => console.log(err));
                  db.ref("/TechAuth20191016/" + `${USERNUM}`+ "DATEDUE").set(DATEDUESTR).then(res.send("SUCCESS")).catch(err => console.log(err));
                }).catch(err => console.log(err));;
              }).catch(err => console.log(err));;
            }
          }).catch(err => console.log(err));;
        };
    }).catch(err => console.log(err));;
  });
