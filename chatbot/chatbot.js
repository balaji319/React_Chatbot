'use strict'

const dialogflow = require('dialogflow')
const config = require('../config/keys')
const structjson = require('./structjson');
const mongoose = require('mongoose');
require('../models/Registration')
//const mongoose = require('../models/Registration')

const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionId;
const langaugeCode = config.dialgFlowSessionLanaugeCode;

const Registration = mongoose.model('registration');

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
         let queryResult = responses[0].queryResult;
        let self = module.exports();

        switch(queryResult.action) {
            case'reacommand_courses-yes':
                if(queryResult.allRequiredParamsPresent) {
                    self.saveRegistration(queryResult.parameters.fields)
                }
            break;
        }
        return responses
    },

     saveRegistration: async function(fields){
        const registrations = new Registration({
            name: fields.name.stringValue,
            address : fields.address.stringValue,
            phone : fields.phone.stringValue,
            email : fields.email.stringValue,
            dateSent : Date.now()
        })
        try {
            let reg = await registrations.save();
            console.log({reg})
        } catch(err) {
            console.log({err})
        }
    }
}