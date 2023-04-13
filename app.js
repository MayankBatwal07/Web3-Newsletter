const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https")

const app=express();
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
    const fname=req.body.firstname;
    const lname=req.body.lastname;
    const email=req.body.email;

    const data={
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:fname,
                    LNAME:lname
                }

            }
        ]
    }

    const JsonData=JSON.stringify(data);

    const url="https://us11.api.mailchimp.com/3.0/lists/5f37262130";

    const options={
        method:"POST",
        auth:"mayank:a7d952580e22cbe5587032cd3912d59cb-us11"
    }

    const request=https.request(url,options,(response)=>{
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html")
        }else{
            res.sendFile(__dirname+"/failure.html")
        }
        response.on("data",(d)=>{
            
            console.log(JSON.parse(d));
        })
    })

    request.write(JsonData);
    request.end();

    // var data={
    //     "name": "$event_name",
    //     "contact": $footer_contact_info,
    //     "permission_reminder": "permission_reminder",
    //     "email_type_option": true,
    //     "campaign_defaults": $campaign_defaults
    //   }
})

app.post("/failure",(req,res)=>{
    res.redirect("/")
})

app.listen(process.env.PORT || 8540,()=>{
    console.log("Server running at port 8540")
});


//7d952580e22cbe5587032cd3912d59cb-us11
//5f37262130