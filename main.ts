import Firecrawl from "@mendable/firecrawl-js";
import fs from "fs";
import "dotenv/config";
import * as z from "zod";

if (!process.env.FIRECRAWL_API_KEY) {
	throw new Error("Please set the FIRECRAWL_API_KEY environment variable");
}

const app = new Firecrawl({
	apiKey: process.env.FIRECRAWL_API_KEY,
});

console.log("Scraping...");

// Define schema to extract contents into
const schema = z.object({
	company_mission: z.string(),
	supports_sso: z.boolean(),
	is_open_source: z.boolean(),
	is_in_yc: z.boolean(),
});

const result = await app.scrape("https://docs.firecrawl.dev/", {
	formats: [
		{
			type: "json",
			schema: schema,
		},
	],
});

console.log(result);

console.log("Got response", result);

if (!result.json) {
	throw new Error("No JSON result");
}

console.log("Writing last result to file...");

fs.writeFileSync("last-result.json", JSON.stringify(result.json, null, 2));

console.log("Done!");
