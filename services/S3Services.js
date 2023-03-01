const AWS =  require('aws-sdk')

const uploadToS3 = (data, fileName) => {
    try {
    const BUCKET_NAME = '=';
    const IAM_USER_KEY = '=';
    const IAM_USER_SECRET = '';

    let s3Bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

   
        var params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body:data,
            ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3Bucket.upload(params, (err, s3response) => {
                if(err) {
                    console.log('Something went wrong', err)
                    reject(err)
                } else {
                    console.log('Success', s3response)
                    resolve(s3response.Location)
                }
            })
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err })
    }
}

module.exports = {
    uploadToS3
}