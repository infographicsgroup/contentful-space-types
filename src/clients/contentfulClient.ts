import { ContentfulClientApi, createClient } from "contentful"
import { config } from "dotenv"

config()
const spaceID: string = process.env.CONTENTFUL_SPACE_ID as string
const accessToken: string = process.env.CONTENTFUL_ACCESS_TOKEN as string
const environment: string = process.env.CONTENTFUL_ENVIRONMENT || "master"
const host: string = process.env.CONTENTFUL_HOST || "cdn.contentful.com"

export default function(): ContentfulClientApi {
  return createClient({
    space: spaceID,
    environment: environment,
    accessToken: accessToken,
    host: host,
  })
}
