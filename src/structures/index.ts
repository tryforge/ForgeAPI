import jwt from "jsonwebtoken";

const payload = {
    id: "705306248538488947",
};

const secret: string = "fsbetter";

const token: string = jwt.sign(payload, secret, {
    noTimestamp: true,
}).split(".").slice(1).join(".");

console.log("Generated Token:", token);

const a = jwt.verify(
  "eyJhbGciOiJIUzI1NiIsInR5cCIIkpXVCJ9." + token,
  secret,
  (err, decoded) => {
    if (err) {
      return console.log(err);
    } else {
      return decoded;
    }
  }
);
    
    console.log(a)