<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
<script setup></script>
<style>
html {
	box-sizing: border-box;
}
*,
*:before,
*:after {
	box-sizing: inherit;
	font-family: "poppins";
}
.text-center {
	text-align: center;
	margin-bottom: 5rem;
}
#__nuxt {
	width: 500px;
	margin: 0 auto;
}
button {
	background-color: rgb(66, 88, 212);
	padding: 0.75rem 1.5rem;
	border-radius: 0.25rem;
	border: 0;
	color: white;
	cursor: pointer;
	font-weight: 600;
}
input {
	padding: 0.5rem;
	width: 100%;
	margin-bottom: 2rem;
}
</style>
