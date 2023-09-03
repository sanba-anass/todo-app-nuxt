export default defineNuxtRouteMiddleware((to, from) => {
	const user = useSupabaseUser();
	if (user._object.$ssupabase_user !== null && to.path !== "/") {
		return navigateTo("/");
	} else if (
		user._object.$ssupabase_user === null &&
		to.path !== "/account/login"
	) {
		return navigateTo("/account/login");
	}
});
