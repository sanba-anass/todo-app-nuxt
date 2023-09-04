// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	modules: [
		"@vue-macros/nuxt",
		"@nuxtjs/supabase",
		// ...
	],
	//@ts-ignore
	nitro: {
		preset: "netlify_edge",
	},

	supabase: {
		redirect: false,
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
	},
});
