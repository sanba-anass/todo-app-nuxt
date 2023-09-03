<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const email = ref("");
const password = ref("");
const router = useRouter();
const pending = ref(false);
const isValidPassword = ref(false);
const isValid = ref<boolean | null>(false);
async function register() {
	if (password.value.length < 6) {
		return alert("password length should be more than 6 characters");
	}
	pending.value = true;
	const { data, error } = await supabase.auth.signUp({
		email: email.value,
		password: password.value,
	});
	if (error || !user.value) {
		alert(
			error?.message
		);
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

<template>
	<h1>register page</h1>
	<form @submit.prevent="register">
		<label v-if="!isValid && email !== ''" class="label" for="email"
			>this email is not valid pls try another one</label
		>
		<input
			:class="{ valid: !isValid && email !== '', isValid: isValid }"
			type="email"
			placeholder="email"
			v-model.trim="email"
			id="email"
		/>
		<label
			v-if="!isValidPassword && password.length !== 0"
			class="label"
			for="password"
			>password is too short</label
		>
		<input
			:class="{ isValidPassword }"
			type="password"
			placeholder="password"
			v-model="password"
			id="password"
		/>

		<button
			:disabled="!((isValid && isValidPassword) as boolean)"
			type="submit"
		>
			{{ pending ? "loading..." : "register" }}
		</button>
	</form>
	<div>
		<span>already have account?</span>
		<NuxtLink class="link" to="/account/login">LogIn</NuxtLink>
	</div>
</template>
<style scoped>
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
.link {
	margin-top: 1rem;
	display: inline-block;
}
</style>
