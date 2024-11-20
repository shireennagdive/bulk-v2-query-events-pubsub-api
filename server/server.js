import { createServer } from 'lwr';
import PubSubApiClient from 'salesforce-pubsub-api-client';
import WebSocketService from './services/webSocketService.js';
import SalesforceClient from './services/salesforceClient.js';
import Configuration from './services/configuration.js';
import BulkV2QueryResource from "./api/bulkV2QueryResources.js";

const BULK_V2_QUERY_JOB_EVENT = '/event/BulkApi2JobEvent';
import bodyParser from 'body-parser';
async function start() {

    Configuration.checkConfig();

    // Configure server
    const lwrServer = createServer();
    const app = lwrServer.getInternalServer();
    const wss = new WebSocketService();

    //Connect to Salesforce
     const sfClient = new SalesforceClient();
    const connection = await sfClient.authenticate(Configuration.getLoginUrl(), Configuration.getUsername(), Configuration.getPassword(), Configuration.getApiVersion());


    const pubSubClient = await connectToPubSubAPI();
    //Subscribe to Bulk API V2 Query Job events
    await subscribeToBulkV2QueryEvents(pubSubClient, wss);

    buildBulkV2QueryNodeResources(connection, app);
    wss.connect(lwrServer.server); // HTTP and WebSocket Listen

    lwrServer
        .listen(({ port, serverMode }) => {
            console.log(
                `App listening on port ${port} in ${serverMode} mode\n`
            );
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });

}

function buildBulkV2QueryNodeResources(connection, app) {
    const bulkV2RestResource = new BulkV2QueryResource(connection);

    app.use(bodyParser.json());

    app.post('/api/createJob', (request, response) => {
        bulkV2RestResource.createJob(request, response);
    });

    app.get('/api/getJobInfo/:jobId', (request, response) => {
        bulkV2RestResource.getJobInfo(request, response);
    });

    app.get('/api/downloadResults/:jobId/results', (request, response) => {
        bulkV2RestResource.downloadAResultPage(request, response);
    });

    app.get('/api/downloadResults/:jobId/resultPages', (request, response) => {
        console.log("here")
        bulkV2RestResource.getResultPages(request, response);
    });

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next();
    });
}

async function subscribeToBulkV2QueryEvents(pubSubClient, wss) {
    const bulkV2QueryJobEventEmitter = await pubSubClient.subscribe(BULK_V2_QUERY_JOB_EVENT, null);
    bulkV2QueryJobEventEmitter.on('data', (bulkV2QueryJobEvent) => {
        wss.broadcast(JSON.stringify(bulkV2QueryJobEvent.payload));
    })
}

async function connectToPubSubAPI() {
    // Connect to Pub Sub API
    const pubSubClient = new PubSubApiClient();
    await pubSubClient.connect();
    return pubSubClient;
}
start();