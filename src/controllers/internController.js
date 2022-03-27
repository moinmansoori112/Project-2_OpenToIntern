const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModels")



// validation//

const isValid = function (value) {
  if (typeof value == undefined || value == null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}


// create intern//

const createIntern = async function (req, res) {
try
  {let data = req.body;

  if (Object.keys(data).length > 0) {


    if (!isValid(data.email)) { return res.status(400).send({ status: false, msg: "Email is required" }) }
    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))) {
      return res.status(400).send({ status: false, msg: "Please provide a valid email" })
    }

    if (!isValid(data.name)) { return res.status(400).send({ status: false, msg: "First name is required" }) }

    if (!isValid(data.mobile)) { return res.status(400).send({ status: false, msg: "Mobile number is required" }) }

    if (!(/^[6-9]\d{9}$/.test(data.mobile))) {
      return res.status(400).send({ status: false, msg: "please provide a valid moblie Number" })
    }

    if (!isValid(data.collegeName)) { return res.status(400).send({ status: false, msg: "College name is required" }) }

    let dupli = await internModel.findOne({ email: data.email })

    if (dupli) { return res.status(400).send({ status: false, msg: "Email already exists" }) }


    let dupliMobile = await internModel.findOne({ mobile: data.mobile })

    if (dupliMobile) { return res.status(400).send({ status: false, msg: "Mobile Number already exists" }) }

    const collegeName = data.collegeName
    
    const collegeId = await collegeModel.findOne({ name: collegeName })
    
    const newDataCollege = collegeId._id
    

    const savedData = { name: data.name, email: data.email, mobile: data.mobile, collegeId: newDataCollege }
    const resultIntern = await internModel.create(savedData)
    res.status(201).send(resultIntern)


  } else {
    return res.status(400).send({ ERROR: "BAD REQUEST" })
  }}

 catch (err) {

  return res.status(500).send({ ERROR: err.message })

}
}



module.exports.createIntern = createIntern;