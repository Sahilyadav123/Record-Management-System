const { default: mongoose } = require("mongoose");
const CertificateSchema = require("../models/certificate.schema")


const uploadCertificate = async (req, res) => {
    try {
        console.log(req.body);
        const certificate = new CertificateSchema({
            user: new mongoose.Types.ObjectId(req.body.user),  // user is the student id
            certificateUrl: req.body.certificateUrl,
            issueDate: req.body.issueDate,
            school: new mongoose.Types.ObjectId(req.body.school),  // school is the admin id
            description: req.body.desc
        });
        const result = await certificate.save();
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getStudentCertificates = async (req, res) => {
    try {
        const certificates = await CertificateSchema.find({ user: req.params.id });
        console.log(certificates);
        res.send({ certificates });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    uploadCertificate,
    getStudentCertificates
}