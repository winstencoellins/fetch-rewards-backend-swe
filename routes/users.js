import express from 'express';

const router = express.Router();

let users = []
let uniqueId = 1
var spendOutput = null

/***************************  USER *************************************/
/**
 * GET method: Get the list of users that use the services.
 */
router.get('/', (req, res) => {
    res.send(users);
})

/**
 * POST method: Assign new ID to new user that 
 * sign - up to use the services.
 */
router.post('/', (req, res) => {
    const user = { id: uniqueId, transactions: [] }
    users.push(user) 
    res.status(200).send(`Successfully added new user with id ${uniqueId}`)
    uniqueId += 1
})

/************************* USER/:ID ************************************/
/**
 * GET method: Gets the user with certain ID.
 * Returns error message if user with certain ID not found.
 */
router.get('/:id', (req, res) => {
    const { id } = req.params
    let userFound = null

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            userFound = users[i]
            break
        }
    }

    // Error handling
    if (userFound == null) {
        res.status(404).send(`Error 404: User with id ${id} not found. Please enter a valid user id.`)
    } else {
        res.send(userFound)
    }

})

/*************************** USER/:ID/TRANSACTIONS *************************************/
/**
 * GET method: Gets the certain user's transactions
 * Returns error message if user is not found.
 */
router.get('/:id/transactions', (req, res) => {
    const { id } = req.params
    let userTransaction = null

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            userTransaction = users[i].transactions
            break
        }
    }

    // Error handling
    if (userTransaction == null) {
        res.status(404).send(`Error 404: User with id ${id} not found. Please enter a valid user id.`)
    } else {
        res.send(userTransaction)
    }
})

/**
 * POST method: Sends data of the transaction to the user's transaction data
 * Return:
 * - Error 404 if user not found
 * - Error 422 if the data entered to the user is not valid
 */
router.post('/:id/transactions', (req, res) => {
    const { id } = req.params
    const r = req.body
    var idx = null

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            idx = i
            break
        }
    }

    // Error handling
    if (idx == null) {
        res.status(404).send(`Error 404: User with id ${id} not found. Please enter a valid user id.`)
    } else if (!(r.hasOwnProperty('payer')) || !(r.hasOwnProperty('points')) || (!(r.hasOwnProperty('timestamp'))) || (!(typeof r.payer == "string") || !(typeof r.points == "number") || !(typeof r.timestamp == "string"))) {
        res.status(422).send(`Error 422: Missing or invalid user's property. Please make sure that you enter a valid data. Each user's transaction need to have 'payer': <string>, 'points': <number>, and 'timestamp': <string> properties.`)
    } else {
        users[idx].transactions.push(r)
        res.status(200).send(`Successfully added transaction data to user id ${id}.`)
    }
})

/********************** USERS/:ID/SPEND *******************************/
/**
 * GET method: returns the desired output after the POST method
 * is executed.
 * Returns error message if user not found.
 */
router.get('/:id/spend', (req, res) => {
    const { id } = req.params
    var checkIdx = null

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            checkIdx = i
            break
        }
    }


    if (checkIdx == null) {
        res.status(404).send(`Error 404: User with id ${id} not found. Please enter a valid user id.`)
    } else {
        res.send(spendOutput)
    }

})

/**
 * POST method: Sends data and should return error message
 * if data entered is not in accordance to the desired input
 */
router.post('/:id/spend', (req, res) => {
    const { id } = req.params
    let points = req.body.points
    let idxOfUser = null
    let spend = {}
    var output = []

    // Points error handling
    if (typeof points != "number" || points < 0) {
        res.status(422).send(`Error 422: Unprocessable entity, user should have the data of 'points' or data entered to the 'points' is invalid. Please enter a valid data.`)
    }

    // Get the id of user
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            users[i].transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            idxOfUser = i
            break
        }
    }

    // User not found error handling
    if (idxOfUser == null) {
        res.status(404).send(`Error 404: User with id ${id} not found. Please enter a valid user id.`)
    }

    let t = users[idxOfUser].transactions

    /**
     * Filtering where the points will be spent
     * Output: {<payer name>: <points>}
     */
    for (let j = 0; j < t.length; j++) {
        if (!(spend.hasOwnProperty(t[j].payer))) {
            if (t[j].points < points) {
                spend[t[j].payer] = t[j].points
                points -= t[j].points
            } else {
                spend[t[j].payer] = points
                break
            }
        } else {
            if (t[j].points < points) {
                spend[t[j].payer] += t[j].points
                points -= t[j].points
            } else {
                spend[t[j].payer] = points
                break
            }
        }
    }

    /**
     * Output: {"payer": <string>, "points": <number>}
     */
    for (const s in spend) {
        output.push({
            payer: s,
            points: -spend[s]
        })
    }

    var transactionHolder = {}

    /**
     * Sum all of the total points from transactions for balance route
     * Output: {<payer name>: <points>}
     */
    for (let j = 0; j < t.length; j++) {
        if (!(transactionHolder.hasOwnProperty(t[j].payer))) {
            transactionHolder[t[j].payer] = t[j].points
        } else {
            transactionHolder[t[j].payer] += t[j].points
        }
    }

    /**
     * Compare and output for balance route
     * Output: {<payer name>: <points>}
     */
    for (const trans in transactionHolder) {
        if (spend.hasOwnProperty(trans)) {
            transactionHolder[trans] -= spend[trans]
        } else {
            continue
        }
    }

    // To display in GET method of spend route
    spendOutput = output
    
    // Append balance to user's data
    if (!(t.hasOwnProperty('balance'))) {
        users[idxOfUser].balance = transactionHolder
    }

    transactionHolder = {} // Reset to empty dict / object

    res.status(200).send(`Succesfully added points.`)
})

/*************************** USERS/:ID/BALANCE ************************/
/**
 * GET method: Gets the output of the balance.
 * Returns error message if id not found
 */
router.get('/:id/balance', (req, res) => {
    const { id } = req.params
    var usrId = null

    for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
            usrId = i
            break
        }
    }

    if (usrId == null) {
        res.status(404).send(`Error 404: User with id ${id} not found. Please enter a valid user id.`)
    } else {
        res.send(users[usrId].balance)
    }
})

// Need to change the logic of spend and balance

export default router;