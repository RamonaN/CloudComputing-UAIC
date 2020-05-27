var express = require('express');
const fetch=require('node-fetch');
const converter=require('json-2-csv');
var router = express.Router();
router.get('/', function(req, res, next) {

    res.render('reccomender',{});
  });
router.post("/",(req,res,next)=>{
  const titlu=req.body.titlu;
  const autor=req.body.autor;
  const an=req.body.an;
  const categorie=req.body.categorie;
  const editor=req.body.editor;
  const userId = req.user.profile.id;
  //console.log(nume,an,categorie,userId);
  var url="https://ussouthcentral.services.azureml.net/workspaces/ce6a4cb74bc442ac842a9fe757b34621/services/08eaeb4fac8348f2a332a9a0fc575e37/execute?api-version=2.0&details=true"

  var headers={
    "Content-type":'application/json',
    "Authorization":"Bearer 2woSTMYuRGOHQ3hxhJysi+guQmDiA/swwcPOksdCxTkX7bgOwVoyOh6tuA68deZmkKO1eW6nP+thG4tddTqepA=="
  }

  const filter={
    "titlu":titlu,
    "autor":autor,
    "an":an,
    "editor":editor,
    "categorie":categorie,
  };
  (async () => {
    try {
        const csv = await converter.json2csvAsync(filter);
        let data={
          "GlobalParameters": {
            "user_id": userId,
            "filter":csv
        }}
        console.log(data);
        fetch(url, { method: 'POST', headers: headers, body: JSON.stringify(data)})
        .then((res) => {
           return res.json()
      })
      .then((json) => {
        var recomandari=[];
        console.log(json.Results.predict.value);
        if(json.Results.predict.value.Values.length!==0){
          for(var  i=0;i<json.Results.predict.value.Values[0].length/2;i++ ){
            var object={"isbn":json.Results.predict.value.Values[0][i]}
            recomandari.push(object);
          }
          res.render("reccomender",{"isbn":recomandari});
        }
        else{
         
          res.render("reccomender",{"error":"No predictions available"})
        }
      
      
        // Do something with the returned data.
      });

    } catch (err) {
        console.log(err);
    }
})();
})
  
  module.exports = router;