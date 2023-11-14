const express=require('express'); // importing the required module;
const app=express();
const port =3000; // defined a variable named port 
const { Dirent } = require('fs') // another function
// const { PythonShell } = require('python-shell');
const path=require('path');
const https=require('https');
const bodyParser=require('body-parser') // this is the body parser used to read the input given by user
app.set('view engine', 'ejs'); // this is for ejs template used to give the output in html form'
app.use(express.static("public")); // used to user bootstrap files'
app.use(bodyParser.urlencoded({extended:true}));
const mongoose = require("mongoose");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



const { Schema } = mongoose;


const userSchema = new Schema({
  email: String,
  user:  String,
  password: String
});

// const secret = "thisisthesecret";
// userSchema.plugin(encrypt, { encryptionKey: secret,  encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

app.get('/', function(req, res){
  res.render("index")
  // res.sendFile(path.join(__dirname,'index.html')); //here we should choose the form of method post else our project will not work;
})

app.get('/wishlist', function(req, res){
  res.render("wishlist")
  // res.sendFile(path.join(__dirname,'index.html')); //here we should choose the form of method post else our project will not work;
})

// app.get('/Recommended Problems', function(req, res){
//   res.render("Recommended_problems")
//   // res.sendFile(path.join(__dirname,'index.html')); //here we should choose the form of method post else our project will not work;
// })


app.get('/login', function(req, res){
  res.render("login");
  // res.sendFile(path.join(__dirname,'login.html')); //here we should choose the form of method post else our project will not work;
})

app.get('/register', function(req, res){
  res.render("register");
  // res.sendFile(path.join(__dirname,'register.html')); //here we should choose the form of method post else our project will not work;
})

app.post("/register", function(req, res){
  const user =req.body.userid;
  const newUser =  new User({
    email: req.body.username,
    useridd: req.body.userid,
    password: req.body.password
  });
  

  newUser.save()
    .then(() => {
      // res.render("login");
      const url = "https://codeforces.com/api/user.rating?handle=" + user + "&appid=f84c92a328190e0bc70405a4af0719490f8c3c9f";
      https.get(url, function(response) {
        let responseData = '';
    
        response.on("data", function(data) {
          responseData += data;
        }); // parsing the data in json form 
    
        response.on("end", function() {
          const userdata = JSON.parse(responseData);
          const ratings = userdata.result; // excluding the rating from json data. 
          const no_of_ratings = ratings.length; 
          const lastRating = ratings[no_of_ratings - 1].newRating;  // excluding the rating of the user.      
          let avg_rating=0;
          let ct=0;
          for(let i=no_of_ratings-1;i>Math.max(no_of_ratings-7,0);i--){
            avg_rating=avg_rating+ratings[i].newRating;
            ct=ct+1;
          }
          if(ct>0){
            avg_rating=avg_rating/ct;
          }      
          avg_rating=Math.max(800,avg_rating);
    
          const url2 = "https://codeforces.com/api/user.status?handle=" + user + "&from=1&count=10000&appid=f84c92a328190e0bc70405a4af0719490f8c3c9f";
          https.get(url2, function(response2) {
            let responseData2 = '';
    
            response2.on("data", function(data) {
              responseData2 += data;
            });
    
            response2.on("end", function() {
              const userdata2 = JSON.parse(responseData2);
              const problems = userdata2.result;
              const lastproblem = problems[0].problem.name;
    
              let myarr = [];
              let correct = [];
    
              // let taglist=[];
              const taglist = new Map();
              for (let i = 0; i < problems.length; i++) {
                if (problems[i].verdict != "OK" && !myarr.includes(problems[i].problem.name) && !correct.includes((problems[i].problem.name))) {
                  
                  myarr.push(problems[i].problem.name);
                  let lis=problems[i].problem.tags;
    
                  for(let j=0 ; j<lis.length ; j++){
                    if(!taglist.has(lis[j])){
                      taglist.set(lis[j],1);
                    }
                    else{
                      taglist.set(lis[j],taglist.get(lis[j])+1)
                    }
                  }
                }
                else if (problems[i].verdict == "OK" && !myarr.includes(problems[i].problem.name) && !correct.includes((problems[i].problem.name))) {
                  correct.push(problems[i].problem.name);
                }
              }
              let array = Array.from(taglist);
              array.sort((a, b) => a[1] - b[1]);
              let tagg=[];
              
              for(let j=array.length-1;j>Math.max(0,array.length-5);j--){
                if(array[j][0]!="implementation" ){
                  tagg.push(array[j][0]);
                }            
              }
    
              // initializing the
              const url3 = "https://codeforces.com/api/problemset.problems";
              https.get(url3, function(response3) {
                let responseData3 = '';
        
                response3.on("data", function(data) {
                  responseData3 += data;
                });
        
                response3.on("end", function() {
                  let recommended_problems=[];
                  const userdata3 = JSON.parse(responseData3);
                  const problems = userdata3.result.problems;
                  let ctt=0;
                  for(let j=0;j<1000;j++){
                    let tag_of_recom=problems[j].tags;
                    let index=problems[j].index;
                    let pr_name=problems[j].name;
                    let rating_of_problem=problems[j].rating;
                    avg_rating=Math.max(800,avg_rating);
                    if(rating_of_problem>=avg_rating && rating_of_problem<=avg_rating+300 && !correct.includes(pr_name)){
                      pr_name= pr_name + " (" + problems[j].contestId + problems[j].index +")";
                      recommended_problems.push(pr_name);
                      ctt=ctt+1;
                    }
                    if(ctt>=50){
                      break;
                    }
                  }
                  const url4 = "https://codeforces.com/api/user.info?handles="+user;
                  https.get(url4, function(response) {
                    let responseData4 = '';
    
                    response.on("data", function(data) {
                      responseData4 += data;
                    }); // parsing the data in json form 
    
                    response.on("end", function() {
                      const userdata4 = JSON.parse(responseData4); 
                      const details = userdata4.result;
                      const name = details[0].firstName + " " + details[0].lastName;
                      const maxrat = details[0].maxRating;
                      const rank=details[0].rank;
                      const maxrank=details[0].maxRank;       
                      res.render('ind', {
                        rating_value: lastRating,
                        listt: myarr,
                        tags:tagg,
                        problems_list:recommended_problems,
                        maxrank:maxrank,
                        name:name,
                        maxrat:maxrat,
                        rank:rank,
                      });  
                    })
                  })               
                });
              });                
            });
          });
        });
      });
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post("/wishlist", function(req,res){
  res.render("index");
})

app.post("/login", function(req, res){
  const username = req.body.username;
  // const user =req.body.userid;
  const password = req.body.password;

  User.findOne({ email: username })
    .then(function (foundUser) {
        // Rest of the code
        if (foundUser) {
            if (foundUser.password === password) {
              const user=foundUser.user;
              const url = "https://codeforces.com/api/user.rating?handle=" + user + "&appid=f84c92a328190e0bc70405a4af0719490f8c3c9f";
              https.get(url, function(response) {
                let responseData = '';
            
                response.on("data", function(data) {
                  responseData += data;
                }); // parsing the data in json form 
            
                response.on("end", function() {
                  const userdata = JSON.parse(responseData);
                  const ratings = userdata.result; // excluding the rating from json data. 
                  const no_of_ratings = ratings.length; 
                  const lastRating = ratings[no_of_ratings - 1].newRating;  // excluding the rating of the user.      
                  let avg_rating=0;
                  let ct=0;
                  for(let i=no_of_ratings-1;i>Math.max(no_of_ratings-7,0);i--){
                    avg_rating=avg_rating+ratings[i].newRating;
                    ct=ct+1;
                  }
                  if(ct>0){
                    avg_rating=avg_rating/ct;
                  }      
                  avg_rating=Math.max(800,avg_rating);
            
                  const url2 = "https://codeforces.com/api/user.status?handle=" + user + "&from=1&count=10000&appid=f84c92a328190e0bc70405a4af0719490f8c3c9f";
                  https.get(url2, function(response2) {
                    let responseData2 = '';
            
                    response2.on("data", function(data) {
                      responseData2 += data;
                    });
            
                    response2.on("end", function() {
                      const userdata2 = JSON.parse(responseData2);
                      const problems = userdata2.result;
                      const lastproblem = problems[0].problem.name;
            
                      let myarr = [];
                      let correct = [];
            
                      // let taglist=[];
                      const taglist = new Map();
                      for (let i = 0; i < problems.length; i++) {
                        if (problems[i].verdict != "OK" && !myarr.includes(problems[i].problem.name) && !correct.includes((problems[i].problem.name))) {
                          
                          myarr.push(problems[i].problem.name);
                          let lis=problems[i].problem.tags;
            
                          for(let j=0 ; j<lis.length ; j++){
                            if(!taglist.has(lis[j])){
                              taglist.set(lis[j],1);
                            }
                            else{
                              taglist.set(lis[j],taglist.get(lis[j])+1)
                            }
                          }
                        }
                        else if (problems[i].verdict == "OK" && !myarr.includes(problems[i].problem.name) && !correct.includes((problems[i].problem.name))) {
                          correct.push(problems[i].problem.name);
                        }
                      }
                      let array = Array.from(taglist);
                      array.sort((a, b) => a[1] - b[1]);
                      let tagg=[];
                      
                      for(let j=array.length-1;j>Math.max(0,array.length-5);j--){
                        if(array[j][0]!="implementation" ){
                          tagg.push(array[j][0]);
                        }            
                      }
            
                      // initializing the
                      const url3 = "https://codeforces.com/api/problemset.problems";
                      https.get(url3, function(response3) {
                        let responseData3 = '';
                
                        response3.on("data", function(data) {
                          responseData3 += data;
                        });
                
                        response3.on("end", function() {
                          let recommended_problems=[];
                          const userdata3 = JSON.parse(responseData3);
                          const problems = userdata3.result.problems;
                          let ctt=0;
                          for(let j=0;j<1000;j++){
                            let tag_of_recom=problems[j].tags;
                            let index=problems[j].index;
                            let pr_name=problems[j].name;
                            let rating_of_problem=problems[j].rating;
                            avg_rating=Math.max(800,avg_rating);
                            if(rating_of_problem>=avg_rating && rating_of_problem<=avg_rating+300 && !correct.includes(pr_name)){
                              pr_name= pr_name + " (" + problems[j].contestId + problems[j].index +")";
                              recommended_problems.push(pr_name);
                              ctt=ctt+1;
                            }
                            if(ctt>=50){
                              break;
                            }
                          }
                          const url4 = "https://codeforces.com/api/user.info?handles="+user;
                          https.get(url4, function(response) {
                            let responseData4 = '';
            
                            response.on("data", function(data) {
                              responseData4 += data;
                            }); // parsing the data in json form 
            
                            response.on("end", function() {
                              const userdata4 = JSON.parse(responseData4); 
                              const details = userdata4.result;
                              const name = details[0].firstName + " " + details[0].lastName;
                              const maxrat = details[0].maxRating;
                              const rank=details[0].rank;
                              const maxrank=details[0].maxRank;       
                              res.render('ind', {
                                rating_value: lastRating,
                                listt: myarr,
                                tags:tagg,
                                problems_list:recommended_problems,
                                maxrank:maxrank,
                                name:name,
                                maxrat:maxrat,
                                rank:rank,
                              });  
                            })
                          })               
                        });
                      });                
                    });
                  });
                });
              });
            }
            else {
              res.render("login");
              console.log("Incorrect password");
                // Handle the case when the password is incorrect
            }
        }
        else {
          res.render("register");
          console.log("Not Registered");
          // Handle the case when the password is incorrect
        }
    })
    .catch(function (error) {
        console.log(error);
    });  

});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})





