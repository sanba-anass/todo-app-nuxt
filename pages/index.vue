<template>
	<button @click="logOut">{{ pending ? "loading..." : "LogOut" }}</button>
	<h1 class="text-center">Todo App</h1>
	<TodoList />
</template>
<script setup>
definePageMeta({
	middleware: ["auth"],
	// or middleware: 'auth'
});

const supabase = useSupabaseClient();
const router = useRouter();
const user = useSupabaseUser();
const pending = ref(false);


async function logOut() {
	pending.value = true;
	const { error } = await supabase.auth.signOut();
	if (error || user._object.$ssupabase_user !== null) {
		pending.value = false;
		return;
	}
	router.push("/account/login");
}
</script>
