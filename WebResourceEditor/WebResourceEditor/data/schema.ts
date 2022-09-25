export const jsonSchema = {
    "$schema": "http://json-schema.org/schema",
    "type": "object",
    "properties": {
        "Features": {
            "type": "array",
            "items": [
                {
                    "type": "object",
                    "properties": {
                        "Name": {
                            "type": "string"
                        },
                        "Enabled": {
                            "type": "boolean"
                        },
                        "CustomProps": {
                            "type": [
                                "array",
                                "null"
                            ],
                            "items": {}
                        }
                    },
                    "required": [
                        "Name",
                        "Enabled"
                    ]
                }
            ]
        },
        "additionalProperties": false
    },
    "required": [
        "Features"
    ],
    "additionalProperties": false
};