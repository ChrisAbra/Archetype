var data = [
      {
        "name": "Group 1",
        "scoreFields": [
          {
            "rule": {
              "operator": "&&"
            },
            "fieldName": "ESRC_Nomination__c",
            "longName": "ESRC Nomination",
            "picklist": "select",
            "options": [
              {
                "value": "Option 1",
                "description": "Option 1"
              },
              {
                "value": "Option 2",
                "description": "Option 2"
              }
            ],
            "optGroups": [
              
            ],
            "required": true
          },
          {
            "rule": {
              "operator": "&&",
              "rules": [
                {
                  "condition": "==",
                  "field": {
                    "type": "picklist",
                    "name": "ESRC_Nomination__c",
                    "label": "ESRC Nomination",
                    "isUpdateable": true,
                    "isRestrictedPicklist": true,
                    "options": [
                      {
                        "active": true,
                        "defaultValue": false,
                        "label": "Yes",
                        "value": "Yes"
                      },
                      {
                        "active": true,
                        "defaultValue": false,
                        "label": "No",
                        "value": "No"
                      }
                    ],
                    "object": "TargetX_Reader__Application_Review__c",
                    "componenttype": "field",
                    "originaltype": "picklist",
                    "available": true
                  },
                  "data": "Option 1",
                  "object": "TargetX_Reader__Application_Review__c"
                }
              ]
            },
            "fieldName": "Employer__c",
            "longName": "Employer",
            "picklist": "text",
            "options": [
              {
                "description": "",
                "id": "",
                "value": ""
              }
            ],
            "conditional": true
          },
          {
            "rule": {
              "operator": "&&"
            },
            "fieldName": "Degree__c",
            "longName": "Degree",
            "picklist": "select2",
            "conditional": false,
            "optGroups": [
              {
                "options": [
                  {
                    "description": "Group 1",
                    "id": "",
                    "value": "Group 1"
                  }
                ],
                "rule": {
                  "operator": "&&",
                  "rules": [
                    {
                      "condition": "==",
                      "field": {
                        "type": "picklist",
                        "name": "ESRC_Nomination__c",
                        "label": "ESRC Nomination",
                        "isUpdateable": true,
                        "isRestrictedPicklist": true,
                        "options": [
                          {
                            "active": true,
                            "defaultValue": false,
                            "label": "Yes",
                            "value": "Yes"
                          },
                          {
                            "active": true,
                            "defaultValue": false,
                            "label": "No",
                            "value": "No"
                          }
                        ],
                        "object": "TargetX_Reader__Application_Review__c",
                        "componenttype": "field",
                        "originaltype": "picklist",
                        "available": true
                      },
                      "data": "Option 1",
                      "object": "TargetX_Reader__Application_Review__c"
                    }
                  ]
                }
              },
              {
                "options": [
                  {
                    "value": "Group 2",
                    "description": "Group 2"
                  }
                ],
                "rule": {
                  "operator": "&&",
                  "rules": [
                    {
                      "condition": "==",
                      "field": {
                        "type": "picklist",
                        "name": "ESRC_Nomination__c",
                        "label": "ESRC Nomination",
                        "isUpdateable": true,
                        "isRestrictedPicklist": true,
                        "options": [
                          {
                            "active": true,
                            "defaultValue": false,
                            "label": "Yes",
                            "value": "Yes"
                          },
                          {
                            "active": true,
                            "defaultValue": false,
                            "label": "No",
                            "value": "No"
                          }
                        ],
                        "object": "TargetX_Reader__Application_Review__c",
                        "componenttype": "field",
                        "originaltype": "picklist",
                        "available": true
                      },
                      "data": "Option 2",
                      "object": "TargetX_Reader__Application_Review__c"
                    }
                  ]
                }
              }
            ],
            "options": [
              {
                "description": "",
                "id": "",
                "value": ""
              }
            ]
          }
        ]
      },
      {
        "name": "Group 2",
        "scoreFields": [
          
        ]
      }
    ]