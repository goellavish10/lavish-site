Sometimes in your web application, you need to expose some data to the client's browser but need it back with the subsequent API requests made but also sensitive data and you don't want the user to manipulate or understand it.

Here comes the significant role of the encryption of data. In this article, we'll study the need for encrypting the data sent to the client and how to do it.

Now if you have done any Cryptography course you must have learnt about it, but it's really easy and if you don't know anything regarding it let's go step by step.

**Cryptography** is the art of practising secure communication between two parties. In our case, the two parties are two computers one is the server and the second is the browser where the user exists. It has two parts:

-   Encryption: The information is converted into a secret code which has no meaning
    
-   Decryption: The encoded meaningless data is converted back to meaningful information.
    

## Why do we need encryption-decryption in web applications?

For example, if you have an API system to log in to the user but the dashboard page or the profile page is on some other domain, how will you maintain the state of the user logged in and which user is logged in?

1.  One method is to maintain some kind of session with a session store and continue that session on the redirected domain by interconnecting the session stores. _seems a little too complicated..._
    
2.  The second method is to send the information from the server to the client during the redirect request and during the redirect, that information is passed in through headers or cookies or through URL Params which will be read by the server again on the different domain and understand whatever information is passed.
    

Now, both the methods are correct and have their own usage but we'll implement the second one and understand the functionality of encryption and decryption.

So, in the second method, you need to send some sensitive information through the URL params or say HTTP Headers, but when you send anything to the client it is easily accessible. It can compromise the security of your server, database and the whole application. Since that information can contain User ID, JWT Data or some other secure token etc and it becomes necessary to hide it!

Here comes the role of encryption and decryption.

## How do encryption and decryption work?

Suppose you have data as follows:

```
userId: '070808080032rf071r70',
jwt: 'ioq010.90d09.12nd',
isAuth: 'true',
redirectUri: 'your-domain'
```

You want all this information, while you redirect your user from the login page to the dashboard, in the HTTP Headers. But the user id and jwt token are sensitive information and if a user is a smart hacker, they can backtrack and make possible attacks on your application.

So to prevent this, instead of sending the above data, we send them this:

```
userId: 'd2jd928d2ej209e91',
jwt: '9jd89dj83dn3n83jd',
isAuth: 'okokaoijve',
redirectUri: 'f09jf09jf'
```

I guess you are so confused right now. 😂😂

And that is our exact purpose!! We don't want the user to know this information so we make it completely random and non-understandable.

But how will our server understand it?

So, this is not completely random data. Cryptography has various industry-standard algorithms defined and designed to encrypt the data. So, the information regarding the algorithm used for encrypting the information is stored on our server. Hence, when the client (browser) sends back this useless-looking information to our server we'll already have an algorithm to reverse engineer these random pieces of data to the useful information we actually wanted.

In this way, we added a security step to our application, we saved it from getting manipulated by the user and we added an extra layer of security from hackers without doing some advanced stuff.

Okay, now that you have understood why it is necessary and useful, let's actually implement it.

I am sharing an example of NodeJS ahead and if you want to implement a similar thing in any other language just search about encryption-decryption modules in the server-side language of your choice, and you'll definitely find some packages or posts to help you exactly with it!

Otherwise, you can carry on with the example and implement it on your own in your choice of server-side language.

## NodeJS Encryption-Decryption Example

We are going to use the `crypto` package built into NodeJS for encryption and decryption. To read more about encryption and decryption algorithms with `crypto`, click [here](https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/)

### Encrypt-Decrypt

I defined a simple API URL below where the `bookingId` and `userId` is the URL Params.

```
app.post("/booking/:bookingId/:userId", async (req,res)=>{
  try{
    const booking = await Booking.findById(req.params.bookingId);
    const user = await User.findById(req.params.userId);

// required operations...
  } catch (e) {
    console.log(e)
  }
})
```

But this is very easy for a user at the front end to see. The Booking ID and User Id will have to be present somewhere inside the browser at the frontend for receiving it at the backend.

Here comes our encrypt-decrypt function.

```
//Checking the crypto module
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = "dDfgr26inFrtgab9ahLoR3b9@cFFC01B";
const keyhex = Buffer.from(key);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv("aes-256-cbc", keyhex, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// Decrypting text
function decrypt(obj) {
  let iv = Buffer.from(obj.iv, "hex");
  let encryptedText = Buffer.from(obj.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", keyhex, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
```

Let's understand the code:

1.  Defining the encryption algorithm and key:

```
const algorithm = "aes-256-cbc";
const key = "dDfgr26inFrtgab9ahLoR3b9@cFFC01B";
const keyhex = Buffer.from(key);
```

Here, you specify the encryption algorithm as AES-256-CBC, which is a widely used symmetric encryption algorithm. The key is a secret passphrase used for encryption and decryption. The key is converted to a buffer using `Buffer.from()` to match the expected format.

1.  Generating the initialization vector (IV):

```
const iv = crypto.randomBytes(16);
```

The initialization vector (IV) is a random value used to ensure that each encryption operation produces a unique result. This code `crypto.randomBytes()` generates a 16-byte random value for the IV.

1.  Encrypting text:

```
function encrypt(text) {
  let cipher = crypto.createCipheriv("aes-256-cbc", keyhex, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}
```

The `encrypt` function takes a `text` parameter and returns an object containing the IV and the encrypted data. It creates a cipher using `crypto.createCipheriv()` the specified algorithm, key, and IV. The `cipher.update()` method encrypts the input text and `cipher.final()` finalizes the encryption. The encrypted data is concatenated and returned as a hex string.

1.  Decrypting text:

```
function decrypt(obj) {
  let iv = Buffer.from(obj.iv, "hex");
  let encryptedText = Buffer.from(obj.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", keyhex, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

The `decrypt` function takes the encrypted object (containing the IV and encrypted data) as input and returns the decrypted text. It first converts the IV and encrypted data from hex strings to buffers. Then, it creates a decipher using `crypto.createDecipheriv()` with the same algorithm, key, and IV. The `decipher.update()` method decrypts the encrypted text, and `decipher.final()` finalizes the decryption. The decrypted data is concatenated, converted to a string, and returned.

Thus in this way we can send the encrypted `bookingId` and `userId` to the frontend alongside their respective `iv`.

We easily secure our data as the Algorithm used, `keyhex` (which is required at the time of decryption) are private to our servers and thus the client cannot understand the data stored in browsers.  
But you might be having a question in mind that if we have `bookingId` and `userId` we need to separately store `iv` each time for each variable we encrypt. Thus the solution to this is generating a random and secure `iv` and storing it in `.env` file and importing it while calling the `encrypt()` and `decrypt()` functions so it prevents sharing of `iv` with clients and gives us the flexibility to encrypt as many variables as we want without worrying to manage multiple IV's.

## Conclusion

Encryption and decryption of data play a vital role in ensuring the security and privacy of sensitive information in web applications. One of the primary use cases of encryption is in secure communication over the internet. By encrypting data before transmitting it, web apps can prevent unauthorized parties from intercepting and understanding the information, safeguarding it from eavesdropping attacks. Encryption is also crucial in protecting user credentials, such as passwords and personal identification information, stored in databases. By encrypting this data, web apps add an extra layer of defense, making it significantly harder for hackers to access and exploit sensitive user information.

We learnt how we can do it and do try implementing it on your own. For any help you can mention here in comments or reach out to me on my socials.

Cheers
