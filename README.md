
# SWIFT CODE API
A SWIFT code, also known as a Bank Identifier Code (BIC), is a unique identifier of a bank's branch or headquarter. It ensures that international wire transfers are directed to the correct bank and branch, acting as a bank's unique address within the global financial network.

## Installation

#### Prerequisites:
- Docker

### Steps:

1. Clone the repository into a local folder.
2. Install Docker on your system (if not already installed).
3. Navigate to the project directory in the terminal.
4. Run the following command to build and start the project:
    ```bash
    docker-compose up
    ```
5. Once the project is up and running, you can access it by visiting `http://localhost:8080` in your browser.
   
## Running tests
```
  npx jest
```
**Remember! When test runs the database will be cleared**

## API Reference


### Retrieve details of a single SWIFT code whether for a headquarters or branches.
```
  GET /v1/swift-codes/{swift-code}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `swift-code` | `string` | **Required**. The SWIFT code of the bank (headquarter or branch). |

#### Response Codes

| Code     | Description  |
| :-----   | :------------|
| `200 OK` | `Successfully retrieved the SWIFT code details.`|
| `400 Bad Request` | `Swift code must be 11 characters long.`|
| `400 Bad Request` | `Invalid SWIFT code or missing required parameters.`|
| `404 Not Found` | `SWIFT code not found.`|
| `500 Internal Server Error` | `Error fetching SWIFT code details`|

#### Response structure:
```
{
    "address": string,
    "bankName": string,
    "countryISO2": string,
    "countryName": string,
    "isHeadquarter": bool,
    "swiftCode": string
    “branches”: [
            {
                "address": string,
                "bankName": string,
                "countryISO2": string,
                "isHeadquarter": bool,
                "swiftCode": string
            },
            {
                "address": string,
                "bankName": string,
                "countryISO2": string,
                "isHeadquarter": bool,
                "swiftCode": string
            }, . . .
    ]
}
```
#### Response Structure for branch swift code: 
```
{
    "address": string,
    "bankName": string,
    "countryISO2": string,
    "countryName": string,
    "isHeadquarter": bool,
    "swiftCode": string
}
```


### Return all SWIFT codes with details for a specific country (both headquarters and branches).
```
  GET /v1/swift-codes/country/{countryISO2code}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `swift-code` | `string` | **Required**. The SWIFT code of the bank (headquarter or branch). |

#### Response Codes

| Code     | Description  |
| :-----   | :------------|
| `200 OK` | `Successfully retrieved the countryISO2code details (in Response)`|
| `400 Bad Request` | `Invalid country ISO2 code or country ISO2 code not provided`|
| `404 Not Found` | `No data found for the given country ISO2 code`|
| `500 Internal Server Error` | `Error fetching SWIFT code details`|

#### Response structure:
```
{
    "countryISO2": string,
    "countryName": string,
    "swiftCodes": [
        {
            "address": string,
    		 "bankName": string,
    		 "countryISO2": string,
    		 "isHeadquarter": bool,
    		 "swiftCode": string
        },
        {
            "address": string,
    		 "bankName": string,
    		 "countryISO2": string,
    		 "isHeadquarter": bool,
    		 "swiftCode": string
        }, . . .
    ]
}
```


### Adds new SWIFT code entries to the database for a specific country.
```
  POST /v1/swift-codes/{swift-code}
```

Add to Headers:
| Key | Value     | Description                |
| :-------- | :------- | :------------------------- |
| `Content-Type` | `application/json` | **Required**.|

And body (Request structure below)

#### Request Structure:

```
{
    "address": string,
    "bankName": string,
    "countryISO2": string,
    "countryName": string,
    "isHeadquarter": bool,
    "swiftCode": string,
}
```
#### Response structure:
```
{
    "message": string,
}
```
#### Response Codes

| Code     | Description  |
| :-----   | :------------|
| `201 OK` | `SWIFT code added successfully`|
| `400 Bad Request` | `Invalid request structure`|
| `400 Bad Request` | `SWIFT code must be 11 characters long`|
| `500 Internal Server Error` | `Error adding SWIFT code, try again.`|


### Deletes swift-code data if swiftCode matches the one in the database.
```
  DELETE /v1/swift-codes/{swift-code}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `swift-code` | `string` | **Required**. The SWIFT code of the bank (headquarter or branch). |

#### Response Codes

| Code     | Description  |
| :-----   | :------------|
| `200 OK` | `SWIFT code has been deleted`|
| `400 Bad Request` | `SWIFT code not provided`|
| `404 Not Found` | `SWIFT code not found`|
| `400 Bad Request` | `Code must be  11 letters length`|
| `500 Internal Server Error` | `Error deleting SWIFT code, try again.`|

#### Response structure:
```
{
    "message": string,
}
```
## Support

For support, E-mail krystianhendzel2812@gmail.com
