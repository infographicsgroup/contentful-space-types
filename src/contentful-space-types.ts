import render from "./renderers/render"
import renderFieldsOnly from "./renderers/renderFieldsOnly"
import path from "path"
import { outputFileSync } from "fs-extra"
import { config } from "dotenv"
import contentfulClient from "./clients/contentfulClient"
import contentfulManagementClient from "./clients/contentfulManagementClient"
config()

const meow = require("meow")

const cli = meow(
  `
  Usage
    $ contentful-space-types --output <file> <options>

  Options
    --output,      -o  Where to write to
    --poll,        -p  Continuously refresh types
    --interval N,  -i  The interval in seconds at which to poll (defaults to 15)
    --fields-only      Output a tree that _only_ ensures fields are valid
                       and present, and does not provide types for Sys,
                       Assets, or Rich Text. This is useful for ensuring raw
                       Contentful responses will be compatible with your code.

  Examples
    $ contentful-space-types -o src/types/contentful.d.ts
`,
  {
    flags: {
      output: {
        type: "string",
        alias: "o",
        required: true,
      },
      fieldsOnly: {
        type: "boolean",
        required: false,
      },
      poll: {
        type: "boolean",
        alias: "p",
        required: false,
      },
      interval: {
        type: "string",
        alias: "i",
        required: false,
      },
    },
  },
)

async function runCodegen(outputFile: string = "src/types/contentful.d.ts") {
  const client = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
    ? contentfulManagementClient
    : contentfulClient
  const environment = await client()
  const contentTypes = await environment.getContentTypes({ limit: 1000 })
  const locales = await environment.getLocales()
  const outputPath = path.resolve(process.cwd(), outputFile)

  let output
  if (cli.flags.fieldsOnly) {
    output = await renderFieldsOnly(contentTypes.items)
  } else {
    output = await render(contentTypes.items, locales.items)
  }

  outputFileSync(outputPath, output)
}

runCodegen(cli.flags.output).catch(error => {
  console.error(error)
  process.exit(1)
})

if (cli.flags.poll) {
  const intervalInSeconds = parseInt(cli.flags.interval, 10)

  if (!isNaN(intervalInSeconds) && intervalInSeconds > 0) {
    setInterval(() => runCodegen(cli.flags.output), intervalInSeconds * 1000)
  } else {
    throw new Error(`Expected a positive numeric interval, but got ${cli.flags.interval}`)
  }
}
