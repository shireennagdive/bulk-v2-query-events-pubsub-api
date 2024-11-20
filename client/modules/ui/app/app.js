import {LightningElement, track} from 'lwc';
import {WebSocketClient} from 'utils/webSocketClient';



export default class App extends LightningElement {
    @track queryInput = 'Select Id from Account';
    @track results;
    @track radioInput;

    @track maxRecords = 500000;
    @track locator = '';

    @track temporaryVar;
    @track jobId;

    onQueryInputChange(event) {
        this.queryInput = event.target.value;
    }
    onMaxRecordsInputChange(event){
        this.maxRecords = event.target.value;
    }
    onLocatorInputChange(event){
        this.locator = event.target.value;
    }
    server = ''
    resetQuery() {
        console.log("in reset query")
        this.queryInput='Select Id,Name,Description from Account'
        this.results=''
        this.temporaryVar=''
        this.maxRecords = 500000
    }

    createJob() {
        console.log("queryInput : " + this.queryInput)
        let query = this.queryInput;
        fetch('/api/createJob', {
            method: 'POST',
            body: JSON.stringify({
                operation : "query",
                query : query,
                contentType : "CSV"
            }),
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log("data is " + JSON.stringify(data))
                this.results = JSON.stringify(data, null, 2);
                let jsonJobInfo = JSON.parse(this.results)
                this.jobId = jsonJobInfo["result"]["id"];
                console.log("jobId = " + this.jobId);
            })
            .catch(error => {
                // Update the status box with the error
                document.getElementById('statusBox').textContent = 'Error: ' + error;
            });
    }

    getJobInfo() {
        console.log("jobId = " + this.jobId);
        //let jobId = this.queryInput;
        fetch('/api/getJobInfo/' + this.jobId)
            .then(response => response.json())
            .then(data => {

               this.results = JSON.stringify(data, null, 2);
                console.log("data is " +  this.results)
                //this.results = JSON.stringify(data);

            })
            .catch(error => {
                this.results = JSON.stringify(error);
            });
    }

    downloadResults() {
        let jobId = this.jobId;
        let downloadUrl = '/api/downloadResults/' + jobId + '/results';
        if (this.radioInput === "Serial") {
            console.log("maxRecords", this.maxRecords)
            console.log("locator", this.locator)
            if (this.maxRecords !== undefined) {
                downloadUrl += '?maxRecords=' + this.maxRecords;
                if (this.locator !== '') {
                    downloadUrl += '&locator=' + this.locator;
                }
            }else{
                if (this.locator !== '') {
                    downloadUrl += '?locator=' + this.locator;
                }
            }

        fetch(downloadUrl)
            .then(response => response.json())
            .then(data => {
                console.log(JSON.stringify(data));
                this.saveDataToFile(data, 'bulk-api-results.json');
               // this.results = JSON.stringify(data, null, 1);
            })
            .catch(error => {
                this.results = JSON.stringify(data);
            });
        } else if (this.radioInput === "Parallel") {
            console.log("")
            fetch('/api/downloadResults/' + jobId + '/resultPages')
                .then(response => response.json())
                .then(data => {
                    this.results = JSON.stringify(data, null, 2);
                })
                .catch(error => {
                    this.results = JSON.stringify(data, null, 2);
                });

        }
    }

    onStepChange(event){
        this.radioInput = event.target.value;
        this.results=''
        if(this.radioInput === "Serial"){
            this.temporaryVar = true
        } else {
            this.temporaryVar = false;
        }
    }

    handleWsMessage(message) {
        console.log(message);
        if(this.radioInput === "Event"){
            if (this.results === ''){
                console.log("message", message)
                this.results = JSON.stringify(message, null, 2);
            }else {
                console.log("message", message)
                this.results += "\n\n\n"+ JSON.stringify(message, null, 2);
            }
        }

        console.log("Received message", message);
        console.log(message?.payload?.message);
    }

    connectedCallback() {
        console.log("in connected callback")
        // Get WebSocket URL
        const wsUrl =
            (window.location.protocol === 'http:' ? 'ws://' : 'wss://') +
            window.location.host +
            '/websockets';
        // Connect WebSocket
        this.ws = new WebSocketClient(wsUrl);
        this.ws.connect();
        this.ws.addMessageListener((message) => {
            this.handleWsMessage(message);
        });
    }

    disconnectedCallback()  {
        this.ws.close();
    }


    saveDataToFile(data, filename = 'output.json') {
        // Convert data to JSON string format
        const jsonString = JSON.stringify(data, null, 2);

        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a temporary anchor element
        const link = document.createElement('a');

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Set the download attribute with the filename
        link.href = url;
        link.download = filename;

        // Append the link to the body (required for Firefox)
        document.body.appendChild(link);

        // Simulate a click to trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        // Revoke the object URL after download to free up memory
        URL.revokeObjectURL(url);
    }

}

function syntaxHighlight(json){
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:\s*)?|true|false|null|\b\d+\b)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
    });


// Example usage:
    const exampleData = {
        name: "Bulk API V2 Demo",
        description: "Demonstration of saving data to file",
        results: [1, 2, 3, 4, 5]
    };



}


