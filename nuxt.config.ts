// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	modules: [
		"@vue-macros/nuxt",
		"@nuxtjs/supabase",
		// ...
	],

	nitro: {
		preset: "deno_deploy",
	},
	//@ts-ignore
	supabase: {
		redirect: false,
	},
});
