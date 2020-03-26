import { createClient } from "contentful-management"
import { config } from "dotenv"

config()
const spaceID: string = process.env.CONTENTFUL_SPACE_ID as string
const accessToken: string = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
const environment: string = process.env.CONTENTFUL_ENVIRONMENT || "master"

export default function() {
  return createClient({
    accessToken,
  })
    .getSpace(spaceID)
    .then((space: any) => space.getEnvironment(environment))
}
