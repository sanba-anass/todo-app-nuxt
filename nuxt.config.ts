// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	modules: [
		"@vue-macros/nuxt",
		"@nuxtjs/supabase",
		// ...
	],
	routeRules: {
		"/": { redirect: "/account/login" }, // uses status code 307 (Temporary Redirect)
		"/account/login": { redirect: "/" },
	},
	supabase: {
		redirect: false,
	},
});
