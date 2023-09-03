<script setup lang="ts">
import { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";

let { title, id, description, refresh, menuValue } = defineProps<{
	title: string;
	id: string;
	description: string;
	menuValue: any;
	refresh: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
}>();
const { completed } = defineModels<{
	completed: boolean;
}>();
const supabase = useSupabaseClient();
const isDeleting = ref(false);
const fail = ref(false);
const deleteTodo = async () => {
	// todoList.value = todoList.value.filter((item) => item.id !== id);
	isDeleting.value = true;
	const { data } = await useAsyncData(async () =>
		supabase.from("todo").delete().eq("id", id)
	);
	if (data.value?.error) {
		fail.value = true;
		isDeleting.value = false;
		return;
	} else {
		fail.value = false;
		await refresh();
	}

	isDeleting.value = false;
};
// watch(completed, (newValue) => {
// 	const item = todoList.value.find((item) => item.id == id);
// 	if (item) {
// 		item.completed = newValue;
// 	}
// });
const titleError = ref<string | null>(null);
const descriptionError = ref<string | null>(null);
const completedError = ref<string | null>(null);
const updateTitle = async (event: any) => {
	const value = event?.target.textContent;
	const { data, error } = await supabase
		.from("todo")
		.update({ title: value } as never)
		.eq("id", id)
		.select();
	if (error) {
		titleError.value = "update title fails";
	} else {
		titleError.value = null;
	}
};
const updateDescription = async (event: any) => {
	const value = event?.target.textContent;
	const { data, error } = await supabase
		.from("todo")
		.update({ description: value } as never)
		.eq("id", id)
		.select();
	if (error) {
		descriptionError.value = "update description fails";
	} else {
		descriptionError.value = null;
	}
};
watch(completed, async (newValue) => {
	const { data, error } = await supabase
		.from("todo")
		//@ts-ignore

		.update({ completed: newValue })
		.eq("id", id)
		.select();
	if (error) {
		completedError.value = "failed to complete something went wrong";
	} else {
		completedError.value = null;
	}
	if (!newValue) {
		completedError.value = null;
	}
});
</script>

<template>
	<div>
		<div class="flex2">
			<div class="flex">
				<input class="checkbox" type="checkbox" v-model="completed" />
				<span class="error-text">{{ completedError }}</span>
				<div class="title" @input="updateTitle" contenteditable>
					{{ title }}
				</div>
				<div class="error-text">{{ titleError }}</div>
			</div>
			<div class="BUTTONS">
				<button class="delete-button" type="button" @click="deleteTodo">
					{{ isDeleting ? "deleting..." : "delete" }}
				</button>
			</div>
		</div>
		<div class="error-text" v-if="fail">fails deleting the todo</div>
		<p @input="updateDescription" contenteditable>{{ description }}</p>
		<div class="error-text">{{ descriptionError }}</div>
	</div>
</template>

<style scoped>
.checkbox {
	width: 25px;
	height: 25px;
	flex-shrink: 0;
}
.error-text {
	margin-top: 1rem;
	color: rgb(226, 44, 44);
	text-align: center;
	font-size: 1rem;
}
.title {
	font-weight: 700;
	font-size: 1.5rem;
}
.error-text {
	color: rgb(221, 49, 49);
	font-weight: 500;
}
.delete-button {
	background-color: rgb(221, 49, 49);
}
[contenteditable] {
	padding: 0.2rem;
	width: 100%;
}
.BUTTONS {
	display: flex;
	gap: 0.5rem;
}
.item {
	display: flex;
}
.flex {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}
.flex2 {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 2rem;
}
button {
	margin-left: auto;
}
p {
	font-size: 0.9rem;
	line-height: 1.7;
}
</style>
