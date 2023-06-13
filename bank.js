const express = require('express')
const app = express()
var mysql=require('mysql')
app.set('view engine','ejs');
var con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'bankdb'
});
con.connect()
app.get('/',function(req,res){
res.render("Home")

})

app.get('/accountS', function(req, res) 
{
  if (req.query.submit) 
  {
    var ac=req.query.ac
    var pin=req.query.p
    con.query(`select * from acc where acno='${ac}' && pin='${pin}'`,function(err,result){
      if(!err)
      {
        if(result.length>0)
        {
          con.query(`select * from summary where acno='${ac}'`,function(err,result){
            if(!err)
            {
       res.render("AccountSummary",{msg:"",data:result,st:true});
            }
            else
            res.send("Error"+err)
          })
        }
        else
        res.render("AccountSummary",{msg:"Invalid Account or Pin",st:false})
      }
      else
      res.send("Err  "+err)
    })
  } 
  else {
    res.render("AccountSummary",{msg:"",st:false});
  }
})

app.get('/about',function(req,res){
    res.render("About")
})
 app.get('/create',function(req,res){
    if(req.query.submit)
    {
        con.query("select * from acc",function(err,result){
 if(!err)
{
    var ac="SBI";
    var x=result.length;
 if(x>0)
 {
   x=x+101
    ac=ac+x;
 }
 else
 ac="SBI101";

 var p = req.query.p;
  var n = req.query.n;
 var f = req.query.f;
 var em = req.query.em;

 var ph = req.query.ph;
 var g = req.query.g;
 var c = req.query.c;
 var s = req.query.s;
 var ct = req.query.ct;
 var a = req.query.a;
 con.query(`insert into acc values('${ac}','${p}','${n}','${f}','${em}','${ph}','${g}','${c}','${s}','${ct}','${a}')`,function(err,result){
 if(!err)
 res.render("Create",{msg:"Account Open Succesfully with account number "+ac})
 else
 res.send("Error "+err)

 })
 }

         })
        
     }
    else
    res.render("Create",{msg:""})
})
app.get('/pchange', function(req, res) {
  if (req.query.submit) {
    var ac = req.query.ac;
    var p = req.query.pin;
    var np = req.query.npin;

    con.query(`select * from acc where acno='${ac}' && pin='${p}'`, function(err, result) {
      if (!err) {
        if (result.length > 0) {
          con.query(`update acc set pin='${np}' where acno='${ac}'`, function(err, result) {
            if (!err)
              res.render("Changepin", { msg: "Pin changed successfully" });
            else
              res.send("Error: " + err);
          });
        } else {
          res.render("Changepin", { msg: "Invalid account or pin" });
        }
      } else {
        res.send("Error: " + err);
      }
    });
  } else {
    res.render("Changepin", { msg: "" });
  }
});
 

app.get('/balance', function(req, res) {
if (req.query.submit) {
  var ac = req.query.ac;
  var p = req.query.p;

  con.query(`select * from acc where acno='${ac}' && pin='${p}'`, function(err, result) {
    if (!err) {
      if (result.length > 0) {
        var cmt = result[0].Amount;
  
        res.render("Balance", { msg: cmt });
        
      } else {
        res.render("Balance", { msg: "Invalid account or pin" });
      }
    } else {
      res.send("Error: " + err);
    }
  });
} else {
  res.render("Balance", { msg: "" });
}
});


app.get('/change', function(req, res) {
  if (req.query.submit) {
    var ac = req.query.ac;
    var p = req.query.p;
    var np = req.query.npin;

    con.query(`select * from acc where acno='${ac}' && pin='${p}'`, function(err, result) {
      if (!err) {
        if (result.length > 0) {
          con.query(`update acc set pin='${np}' where acno='${ac}'`, function(err, result) {
            if (!err)
              res.render("Change", { msg: "Pin changed successfully" });
            else
              res.send("Error: " + err);
          });
        } else {
          res.render("Change", { msg: "Invalid account or pin" });
        }
      } else {
        res.send("Error: " + err);
      }
    });
  } else {
    res.render("Change", { msg: "" });
  }
});
app.get('/contact',function(req,res){
    res.render("Contact")
})
app.get('/deposit',function(req,res){
  if(req.query.submit)
  {
    var ac = req.query.ac;
    var p = req.query.p;
    var d = parseInt(req.query.d);
    con.query(`select * from acc where acno = '${ac}' && pin = '${p}' `,function(err,result)
    {
     if(!err)
     {
      if(result.length>0)
      {
            var amt = parseInt(result[0].Amount);
            amt = amt+d;
            con.query(`update acc set Amount = '${amt}' where acno ='${ac}'`,function(err,result)
            {
              if(!err)
              {
                var dt = new Date().toLocaleDateString();
                con.query(`insert into summary(acno,dt,amt,des)values('${ac}','${dt}','${amt}','Deposit')`,function(err,result){
                  if(!err)
                  {
                  res.render("Deposit",{msg:"After depositing =" +d+  "your current account balance is="+amt})
                  }
                  else
                  {
                    res.send("Error"+err)
                  }
                })
     
              }
              else
              {
res.send("Error" +err)
              }
            })
      }
      else
      {
        res.render("Deposit",{msg:"Invalid account number and password"})
      }
     }
     else
     {
      res.send("Error"+err)
     }
    })
  }
  else
  {
    res.render("Deposit",{msg:""})
  }
})
app.get('/fund', function(req, res) {


  if(req.query.submit)
  {
    var ac=req.query.ac;
    var p=req.query.p;
    var at=parseInt(req.query.t);
    var act=req.query.act;
    
   
    con.query(`select * from acc where acno='${ac}' && pin='${p}'`,function(err,result){
   console.log(result)
   if(!err)
   {
   
    if(result.length>0)
    {
      var camt=parseInt(result[0].Amount);
      if(camt>=at)
      {
        con.query(`select * from acc where acno='${act}'`,function(err,result){
          if(!err)
          
          {
if(result.length>0)
{
  var tamt=parseInt(result[0].Amount)
  camt=camt-at;
  tamt=tamt+at;
  con.query(`update acc set amount='${camt}' where acno='${ac}'`,function(err,result){
    if(!err)
    {
      var dt=  new Date().toLocaleDateString();
  con.query(`insert into summary(acno,dt,amt,des)values('${ac}','${dt}','${tamt}','Fundtrans')`,function(err,result){
    res.render("Fund",{msg:"After Transfer "+at+"  Your current balance is = "+camt})
  })

      con.query(`update acc set amount='${tamt}' where acno='${act}'`,function(err,result){
        if(!err)
        {
          var dt=  new Date().toLocaleDateString();
      con.query(`insert into summary(acno,dt,amt,des)values('${ac}','${dt}','${camt}','Fundtrans')`,function(err,result){
        res.render("Fund",{msg:"Amount To Transfer "+am+"  Your Current balance is = "+camt})
      })
    }
        res.render("Fund",{msg:"After Transfer "+at+" Your Current balacne is = "+camt})

        
        res.send("Err"+err)
      })
    }
    else
    res.send("Err "+err)
  })

}
else
res.render("Fund",{msg:"Invalid Benificiary Account"})

          }
          else
          res.send("Err"+err)

        })
    }
    else
    res.render("Fund",{msg:"Insufficeint balance"})
  }
    else
        res.render("Fund",{msg:"Invalid account or Pin"})
      }
    
    else
     res.render("Fund",{msg:"Insufficient balance"})
    
    })
  }
  else
  res.render("Fund",{msg:""})
  });

app.get('/withdraw',function(req,res){
    if(req.query.submit)
    {
     var ac=req.query.ac;
     var pin=req.query.p
     var w=parseInt(req.query.w)
     con.query(`select * from acc where acno='${ac}' && pin='${pin}'`,function(err,result){
   if(!err)
   {
     if(result.length>0)
     {
       var camt=parseInt(result[0].Amount);
       console.log("Balance is = "+camt);
       if(camt>=w)
       {
         camt=camt-w;
         con.query(`update acc set amount='${camt}' where acno='${ac}' `,function(err,result){
           if(!err)
           {
            var dt = new Date().toLocaleDateString();
  con.query(`insert into summary(acno,dt,amt,des)values('${ac}','${dt}','${w}','Withdraw')`,function(err,result)
  {
    if(!err)
    res.render("Withdraw",{msg:"After witdraw "+w+" Your Current Balance is = "+camt})
  else
  res.send("Errr  "+err)
  })
             
           }
           else
           res.send("Error"+err)
         })
       }
       else
       res.render("Withdraw",{msg:"Insufficient Balance"})  
     }
     else
     res.render("Withdraw",{msg:"Invalid user Name or password"})
   }
   else
   res.send("Error "+err)
   
     })
    }
    else
     res.render("withdraw",{msg:""})
   })

  

.listen(4000)