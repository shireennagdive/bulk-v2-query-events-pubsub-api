import Configuration from '../services/configuration.js';

export default class BulkV2QueryResource {
    constructor(connection) {
        this.connection = connection;
    }

    async getJobInfo(request, response){
        let jobId = request.params.jobId;
        const result = await this.connection.request(Configuration.getLoginUrl()+'services/data/v61.0/jobs/query/'+jobId);
        response.send( {result} )
    }

    async createJob(request, response){
        const result = await this.connection.requestPost(Configuration.getLoginUrl()+'services/data/v61.0/jobs/query', request.body);
        response.send( {result} )
    }

    async downloadAResultPage(request, response){

        let jobId = request.params.jobId;
        let maxRecords = request.query.maxRecords;
        let locator = request.query.locator;
        let url = Configuration.getLoginUrl() + 'services/data/v61.0/jobs/query/' + jobId + '/results';
        if (maxRecords !== undefined) {
            url += '?maxRecords=' + maxRecords;
            if (locator !== undefined) {
                url += '&locator=' + locator;
            }
        } else {
            url += '?locator=' + locator;
        }
        const result = await this.connection.request(url);
        response.send( {result} )
    }

    async getResultPages(request, response){
        let jobId = request.params.jobId;
        const result = await this.connection.request(Configuration.getLoginUrl()+'services/data/v61.0/jobs/query/'+jobId+'/resultPages');
        response.send( {result} )
    }

}