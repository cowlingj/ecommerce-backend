import hashlib
import json
import base64
import os
import sys

jsoninput = json.load(sys.stdin)

salt = os.urandom(32)

key = hashlib.pbkdf2_hmac(
  'sha256',
  bytes(jsoninput["password"], "utf-8"),
  salt,
  27500,
  64
)

secretData = json.dumps({
  "value": base64.b64encode(key).decode("utf-8"),
  "salt": base64.b64encode(salt).decode("utf-8")
})

credentialData = json.dumps({
  "hashIterations": 27500,
  "algorithm":"pbkdf2-sha256"
})

print(json.dumps({
  "secretData": secretData,
  "credentialData": credentialData
}))