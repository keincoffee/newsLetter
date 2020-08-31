const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');


const app = express();

//pubilic folder for css and pictures
app.use(express.static("public"));
//body parser
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

//Setting up MailChimp
mailchimp.setConfig({
    //*****************************ENTER YOUR API KEY HERE******************************
    apiKey: "#####",
    //*****************************ENTER YOUR API KEY PREFIX HERE i.e.THE SERVER******************************
    server: "us17"
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const listId = "fe7eb813c0";

  const subscribingUser = {
      firstName: firstName,
      lastName: lastName,
      email: email
  };

  async function run() {
      const response = await mailchimp.lists.addListMember(listId, {
          email_address: subscribingUser.email,
          status: "subscribed",
          merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
          }
      });
      //If all goes well logging the contact's id
      res.sendFile(__dirname + "/sucess.html")
      console.log(
          `Successfully added contact as an audience member. The contact's id is ${
              response.id
          }.`
      );
  }

  //for failures
  run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.listen(3000, function() {
  console.log("Server is on port 3000");
});

// 5a7b9b682a0df6a1554d7aee694441d4-us17
//List id: fe7eb813c0
