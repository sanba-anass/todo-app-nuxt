<template>
	<h1>logIn page</h1>
	<form @submit.prevent="login">
		<label v-if="!isValid && email !== ''" class="label" for="email"
			>this email is not valid pls try another one</label
		>
		<input
			type="email"
			id="email"
			placeholder="email"
			v-model="email"
			:class="{ valid: !isValid && email !== '', isValid: isValid }"
		/>
		<label
			v-if="!isValidPassword && password.length !== 0"
			class="label"
			for="password"
			>password is too short</label
		>
		<input
			type="password"
			id="password"
			placeholder="password"
			v-model="password"
			:class="{ isValidPassword }"
		/>
		<button
			:disabled="!((isValid && isValidPassword) as boolean)"
			type="submit"
		>
			{{ pending ? "loading..." : "logIn" }}
		</button>
	</form>
	<div>
		<span>don't have an account?</span>
		<NuxtLink class="link" to="/account/register">Register</NuxtLink>
	</div>
</template>
<script setup lang="ts">
// definePageMeta({
// 	middleware: ["auth"],
// 	// or middleware: 'auth'
// });
const supabase = useSupabaseClient();
const email = ref("");
const password = ref("");
const router = useRouter();
const user = useSupabaseUser();
const pending = ref(false);
const isValidPassword = ref(false);
const isValid = ref<boolean | null>(false);


async function login() {
	pending.value = true;
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email.value,
		password: password.value,
	});

	if (error) {
		if (error.message === "Invalid login credentials") {
			alert(
				"pls register before attempting to login! are u sure this is your account?"
			);
		}

		pending.value = false;
		return;
	}
	router.push("/");
}
watch(email, (newValue) => {
	validateEmail(newValue) ? (isValid.value = true) : (isValid.value = false);
});
watch(password, (newValue) => {
	if (newValue === "") {
		isValidPassword.value = false;
		return;
	}
	newValue.length >= 7
		? (isValidPassword.value = true)
		: (isValidPassword.value = false);
});
</script>
<style scoped>
.link {
	margin-top: 1rem;
	display: inline-block;
}
.isValidPassword {
	border: 1px solid rgb(18, 240, 103);
	outline: 1px solid rgb(18, 240, 103);
}
.label {
	font-size: 0.85rem;
	margin-bottom: 0.3rem;
	display: inline-block;
	color: red;
}
.valid {
	border: 1px solid red;
	outline: 1px solid red;
}
.isValid {
	border: 1px solid rgb(18, 240, 103);
	outline: 1px solid rgb(18, 240, 103);
}
button[disabled] {
	background-color: rgba(66, 88, 212, 0.603);
	cursor: not-allowed;
}
</style>
