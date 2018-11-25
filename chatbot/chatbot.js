'use strict'

const dialogflow = require('dialogflow')
const config = require('../src/config/keys')
const structjson = require('./structjson')
const projectId = config.googleProjectId;

const credentials = {
    client_email : config.googleClientEmail,
    private_key:config.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectId, credentials});
const sessionPath = sessionClient.sessionPath(config.googleProjectId, config.dialogFlowSessionId);


module.exports = {
    textQuery : async function(text, parameters) {
        let self = module.exports
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: text,
                languageCode: config.dialgFlowSessionLanaugeCode,
              },
            },
            queryParams :{
                payload :{
                    data:parameters
                }
            }
          };
        let responses = await sessionClient
            .detectIntent(request)
        responses = await self.handleAction(responses)
        return responses;
    },

    eventQuery : async function(event, parameters = {}) {
        let self = module.exports
        const request = {
            session: sessionPath,
            queryInput: {
              event: {
                name: event,
                parameters: structjson.jsonToStructProto(parameters),
                languageCode: config.dialgFlowSessionLanaugeCode,
              },
            },
          };
        let responses = await sessionClient
            .detectIntent(request)
        responses = await self.handleAction(responses)
        return responses;
    },


    handleAction: function(responses){
        return responses
    }
}