
import { defuFn } from 'C:/Users/karim/Documents/Stage_UR/ProjetMilestone/Unitystation-MillstoneSteam/node_modules/defu/dist/defu.mjs'

import fs from 'fs'
require('dotenv').config()

const httpsConfig = {
    server: {
      https: {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH)
      }
    }
  }

const inlineConfig = {}



export default defuFn(inlineConfig, httpConfig)
