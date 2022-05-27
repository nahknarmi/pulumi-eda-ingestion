import * as aws from "@pulumi/aws";


// Create an AWS resource (S3 Bucket)
const fileLandingZone = new aws.s3.Bucket("file-landing-zone", {});


// When a new depository file arrives
fileLandingZone.onObjectCreated("onNewDepositoryFile", new aws.lambda.CallbackFunction<aws.s3.BucketEvent, void>("onNewDepositoryFile", {
    callback: async bucketArgs => {
        console.log("onNewDepositoryFile called");
        if (!bucketArgs.Records) {
            return;
        }

        for (const record of bucketArgs.Records) {
            console.log(`*** New Depository: file ${record.s3.object.key} was saved at ${record.eventTime}.`);
            // let kafka = new Kafka({
            //     clientId: 'FileIngester',
            //     brokers: cluster.bootstrapBrokers
            // });
            //
            // let producer = kafka.producer();
            // await producer.connect();
            // console.log("Connected to kafka - " + JSON.stringify(cluster.bootstrapBrokersTls));
            // await producer.send({
            //     topic: 'test-topic',
            //     messages: [
            //         { value: 'Hello KafkaJS user!' }
            //     ],
            // })
            // console.log("Published message.");
            //
            // await producer.disconnect();
            // console.log("Disconnected.");
        }
    },
    policies: [
        aws.iam.ManagedPolicy.AWSLambdaExecute,                 // Provides wide access to Lambda and S3
    ],
}), {filterSuffix: ".csv"});


// Export the name of the bucket
export const fileLandingZoneBucketName = fileLandingZone.id;