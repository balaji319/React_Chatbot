'use strict'

const dialogflow = require('dialogflow')
const config = require('../config/keys')
const structjson = require('./structjson')
const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionId;
const langaugeCode = config.dialgFlowSessionLanaugeCode;


const credentials = {
    client_email : config.googleClientEmail,
    private_key:config.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectId, credentials});



module.exports = {
    textQuery : async function(text, userID, parameters) {
        let sessionPath = sessionClient.sessionPath(projectId, sessionId+userID);
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

    eventQuery : async function(event,userID, parameters = {}) {
        let self = module.exports
        let sessionPath = sessionClient.sessionPath(projectId, sessionId+userID);
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