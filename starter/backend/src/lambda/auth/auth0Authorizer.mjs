import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://phucbv3.us.auth0.com/.well-known/jwks.json'

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  const { data } = await Axios.get(jwksUrl)
  const publicKeys = data.keys
  const selectedKey = publicKeys.find(key => key.kid === jwt.header.kid)

  if (!selectedKey) {
    throw new Error('No matching key found in the JWKS endpoint')
  }

  const pemCertificate = selectedKey.x5c[0]
  const certificate = `-----BEGIN CERTIFICATE-----\n${pemCertificate}\n-----END CERTIFICATE-----`
  const decodedToken = await verify(token, certificate)

  return decodedToken

}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

async function verify(token, certificate) {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}