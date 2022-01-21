const aws = require("aws-sdk"); // comes by default
const db = new aws.DynamoDB(); // db client

const tableName = process.env.USERTABLE; //* Env variable set in AWS cloud

//* Function which saves a new user into Dynamo DB Users model
//* Saves into Users AFTER user confirmes their email
exports.handler = async (event) => {
  //? @event: event.request.userAttributes.(sub, phone_number, email)

  //* if no sub
  if (!event.request?.userAttributes?.sub) {
    console.log("No sub provided");
    return;
  }

  const now = new Date();
  const timestamp = now.getTime(); //* sets to seconds (Type: Number)

  /**
   **create object to save into db:
   ** Dynamo DB: save into db by setting the value into an object with
   ** the key representing the type. All values must be submitted as a
   ** string
   */
  const userItem = {
    __typename: { S: "User" },
    _lastChangedAt: { N: timestamp.toString() },
    _version: { N: "1" },
    createdAt: { S: now.toISOString() }, //* create string based timestamp
    updatedAt: { S: now.toISOString() },
    id: { S: event.request.userAttributes.sub },
    name: { S: event.request.userAttributes.email },
  };

  //* params which tell the put func what to set and where to set
  const params = {
    Item: userItem, //* obj to put into db
    TableName: tableName,
  };

  //* save into db
  try {
    await db.putItem(params).promise();
    console.log("Saved new user into Users Table successfully.");
  } catch (error) {
    console.log("Could not save new user into Users Table: ", error);
  }
};
