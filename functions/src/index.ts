import * as functions from "firebase-functions";
// import { db } from './init';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello blogs!", { structuredData: true });
    response.send("Hello from Jacko!");
});

export const onDeleteVenueStorage =
    functions
        .firestore.document('venues/{venueId}')
        .onCreate(async (snap, context: any) => {
            functions.logger.debug(
                `Running add course trigger for courseId ${context.params.venueId}`
            )
        })
//# sourceMappingURL=index.js.map
