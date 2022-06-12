# Fetch Rewards Backend Software Engineering Coding Challenge
Tools Used:
- Node.js
- Express.js
- POSTMAN

## Getting Started
To get started, please clone this repository using the command below in your terminal
- `git clone <url>`

In this exercise, candidate are told to design routes that:
- Add transactions for specific payer and date -> `POST` and `GET`
- Spend points -> `POST`
- Return balances -> `GET`

The format of the routing we are going to have are:
- `localhost:5000` -> Homepage
- `localhost:5000/users` -> User list
- `localhost:5000/users/:id` -> User with certain id
- `localhost:5000/users/:id/transaction` -> Certain user id's transaction
- `localhost:5000/users/:id/spend` -> Points that certain user id's has
- `localhost:5000/users/:id/balance` -> Balance of the user id

## Tester
### Install POSTMAN
In order to do the test case, we are going to use POSTMAN. If you have not installed POSTMAN on your local machine, please install it through https://www.postman.com/

### Test Case
Before running POSTMAN method: `POST`, please change the POSTMAN -> Body to `JSON` format
#### Test 1
Test case 1 is to make sure that the initial homepage is working. 
It should show `PASS` if it works successfully.

This code below is for testing `localhost:5000` method: `GET`
```
// COPY and PASTE the code below in POSTMAN -> Tests

pm.test("Status code is 200 -> http://localhost:5000", function () {
    pm.response.to.have.status(200);
});
```
After copying and pasting the code above, click `Send`. Remember to delete the code in POSTMAN -> Tests after the test case shows `PASS`.

#### Test 2
Test Case 2 is to make sure that the `localhost:5000/users` page send request successfully and 
the data that we send is being recorded in the database. It should show `PASS` if it works successfully.

This code below is for testing `localhost:5000/users` method: `POST`
```
// COPY and PASTE the code below in POSTMAN -> Tests

pm.test("Successful POST request -> Successfully added new user / account into the services", function () {
    pm.expect(pm.response.code).to.be.oneOf([200]);
});
```
After copy and pasting the code above, click `Send`. Remember to delete the code in POSTMAN -> Tests after the test case shows `PASS`.

This code below is for testing `localhost:5000/users` method: `GET`
```
// COPY and PASTE the code below in POSTMAN -> Tests

pm.test("Checking if the user with id 1 is added to the services", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[0].id).to.eql(1);
});

pm.test("Checking if the initial transaction of the newly added account (i.e id 1) is empty", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[0].transactions).to.eql([]);
});
```
After copy and pasting the code above, click `Send`. Remember to delete the code in POSTMAN -> Tests after the test case shows `PASS`.

#### Test 3
Test Case 3 is to make sure that the `localhost:5000/users/:id/transactions` successfully send request and the data that
we send is being recorded. In this case, we will try it with user id `1`. Therefore, the HTTP will be 
`localhost:5000/users/1/transactions`. It should show `PASS` if it works successfully.

You need to copy the `JSON` provided below one by one to POSTMAN -> Body. You are expected to see all `PASS` test result when testing the `POST` in this case.

The `JSON` below is for testing `localhost:5000/users/1/transactions` method: `POST`
```
// COPY and PASTE the code below to POSTMAN -> Tests

pm.test("Successful POST request -> Successfully added new transaction data to certain user", function () {
    pm.expect(pm.response.code).to.be.oneOf([200]);
});
```

After copying and pasting the code above, copy and paste the json below one by one to POSTMAN -> Body.

```
{
    "payer": "DANNON",
    "points": 1000,
    "timestamp": "2020-11-02T14:00:00Z"
}
```

Click `Send` button, then on POSTMAN -> Body do `Ctrl + A`, and press `Backspace` on your keyboard.

```
{
    "payer": "UNILEVER",
    "points": 200,
    "timestamp": "2020-10-31T11:00:00Z"
}
```

Click `Send` button, then on POSTMAN -> Body do `Ctrl + A`, and press `Backspace` on your keyboard.

```
{
    "payer": "DANNON",
    "points": -200,
    "timestamp": "2020-10-31T15:00:00Z"
}
```

Click `Send` button, then on POSTMAN -> Body do `Ctrl + A`, and press `Backspace` on your keyboard.

```
{
    "payer": "MILLER COORS",
    "points": 10000,
    "timestamp": "2020-11-01T14:00:00Z"
}
```

Click `Send` button, then on POSTMAN -> Body do `Ctrl + A`, and press `Backspace` on your keyboard.

```
{
    "payer": "DANNON",
    "points": 300,
    "timestamp": "2020-10-31T10:00:00Z"
}
```

Click `Send` button, then on POSTMAN -> Body do `Ctrl + A`, and press `Backspace` on your keyboard.


This code below is for testing `localhost:5000/users/1/transactions` method: `GET`
```
// COPY and PASTE the code below in POSTMAN -> Tests
  
var transaction1 = { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" }
var transaction2 = { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" }
var transaction3 = { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" }
var transaction4 = { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" }
var transaction5 = { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" }

pm.test("Check if the first transaction is added to certain user's transaction data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[0]).to.eql(transaction1);
});

pm.test("Check if the second transaction is added to certain user's transaction data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[1]).to.eql(transaction2);
});

pm.test("Check if the third transaction is added to certain user's transaction data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[2]).to.eql(transaction3);
});

pm.test("Check if the fourth transaction is added to certain user's transaction data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[3]).to.eql(transaction4);
});

pm.test("Check if the fifth transaction is added to certain user's transaction data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData[4]).to.eql(transaction5);
});
```

Click the `Send` button. You are expected to see five `PASS` test case. Remember to clear the POSTMAN -> Tests.

#### Test 4
Test case 4 is to check if we successfully `POST` data from route `localhost:5000/users/1/spend`.

The code below is for testing `localhost:5000/users/1/spend` method: `POST`
```
// COPY and PASTE the code below to POSTMAN -> Tests

pm.test("Successful POST request -> Successfully added points data", function () {
    pm.expect(pm.response.code).to.be.oneOf([200]);
});
```

Copy and paste the `JSON` below to POSTMAN -> Body.
```
{
    "points": 5000
}
```
After copying and pasting, click `Send`. You are expected to see `PASS`.

#### Test 5
Test case 5 is to check whether the route `localhost:5000/users/1/spend` successfully output expected result.

The code below is for testing `localhost:5000/users/1/spend` method: `GET`
```
// COPY and PASTE the code below to POSTMAN -> Tests

var output = [{
    "payer": "DANNON",
    "points": -100
}, 
{
    "payer": "UNILEVER",
    "points": -200
},
{
    "payer": "MILLER COORS",
    "points": -4700
}]

pm.test("Check if produce the same result", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.eql(output);
});
```

Click `Send`. You are expected to see `PASS`. Remember to clear POSTMAN -> Tests

#### Test 6
Test case 6 is to check whether the route `localhost:5000/users/1/balance` successfully output expected result.

The code below is for testing `localhost:5000/users/1/balance` method: `GET`
```
// COPY and PASTE the code below to POSTMAN -> Tests

var output = {
"DANNON": 1000,
"UNILEVER": 0,
"MILLER COORS": 5300
}

pm.test("Checking balance output is similar to the result", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.eql(output);
});
```
Click `Send`. You are expected to see `PASS`. Remember to clear POSTMAN -> Tests
