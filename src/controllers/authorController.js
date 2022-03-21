const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")



//CREATE AUTHOR
const createAuthor = async function (req, res) {
  try {

    let data = req.body;
    
    if (data) {
      let pw = data.password

      let eM = data.email

      if (eM && pw) {

        if (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(eM)) 
        
        {

          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(pw))
         
          {

            let savedData = await authorModel.create(data);
            return res.status(201).send({ Data: savedData });

          } else {
            return res.status(400).send("Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
          }
        } else {
          return res.status(400).send("not a valid email")
        }
      } else {
        return res.status(400).send("email or password is empty")
      }

    }

    else { return res.status(400).send("BAD REQUEST") }

  } catch (err) {

    return res.status(500).send({ ERROR: err.message })

  }
}
    


//AUTHOR-LOGIN
const authorLogin = async function (req, res) {

    try {

      let body = req.body
  
      if (body) {
        let authorName = req.body.email;
        if (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(authorName)) {
        
          let password = req.body.password;
          if (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) {
    let specificAuther = await authorModel.findOne({ email: authorName, password: password });

    if (!specificAuther)
      return res.status(404).send({
        status: false,
        logInFailed: "username or the password is not correct",
      });


    let token = jwt.sign(
      {
        authId: specificAuther._id,
        batch: "blogSite-phase2",
        organisation: "FunctionUp",
      },
      "blogSites-phase2", { expiresIn: "1hr" }
    );

    return res.status(201).send({ status: true, TOKEN: token });
  } else {
    return res.status(400).send("Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")
  }
} else {
  return res.status(400).send("not a valid email")
}
}

else { return res.status(400).send({ ERROR: "Bad Request" }) }

}
  catch (err) {
    return res.status(500).send({ ERROR: err.message });
  }
}



module.exports.createAuthor = createAuthor;
module.exports.authorLogin = authorLogin;
