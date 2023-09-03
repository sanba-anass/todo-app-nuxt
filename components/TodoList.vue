<script setup>
// v-for="todo in iscompletedList
// 					? completedTodos.filter((item) =>
// 							item.title.toUpperCase().includes(searchTerm.toUpperCase())
// 					  )
// 					: todoList.filter((item) =>
// 							item.title.toUpperCase().includes(searchTerm.toUpperCase())
// 					  )"
// 				:key="todo.id"
// const todoList = useList();
const todoText = useState(() => "");
const descriptionText = useState(() => "");
const isLoadingData = useState(() => false);
const fail = ref(null);
const searchTerm = useState(() => "");
const noResults = ref(false);
const menuValue = ref("all-todos");
const validTitle = ref(false);
const validDesc = ref(false);
//  const iscompletedList = useState(() => false);
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { data, refresh } = await useAsyncData(
	async () => await supabase.from("todo").select("*")
);
watch(todoText, (newValue) => {
	newValue.length >= 7 ? (validTitle.value = true) : (validTitle.value = false);
});
watch(descriptionText, (newValue) => {
	newValue.length >= 15 ? (validDesc.value = true) : (validDesc.value = false);
});
// pending state + delete source
const addTodo = async () => {
	const todoItem = {
		title: todoText.value,
		description: descriptionText.value,
		user_id: user.value.id,
	};
	isLoadingData.value = true;

	const { error } = await supabase.from("todo").insert(todoItem);
	if (error) {
		fail.value = "server failed creating your todo pls try again";
		isLoadingData.value = false;
		return;
	} else {
		fail.value = null;
	}
	if (menuValue.value === "all-todos") {
		await refresh();
	}
	if (menuValue.value === "most-recent") {
		const { data: mostRecents } = await supabase
			.from("todo")
			.select("*")
			.order("created_at", { ascending: false });

		data.value.data = mostRecents;
	}

	isLoadingData.value = false;

	todoText.value = "";
	descriptionText.value = "";
};
watch(menuValue, async (newValue) => {
	switch (newValue) {
		case "all-todos":
			const { data: allTodos } = await supabase.from("todo").select("*");
			data.value.data = allTodos;
			break;
		case "most-recent":
			const { data: mostRecents } = await supabase
				.from("todo")
				.select("*")
				.order("created_at", { ascending: false });

			data.value.data = mostRecents;
			break;
		case "completed":
			const { data: completedTodos } = await supabase
				.from("todo")
				.select("*")
				.eq("completed", true);
			data.value.data = completedTodos;
			break;
		default:
			break;
	}
});
watch(searchTerm, async (newValue) => {
	const { data: newTodos } = await useAsyncData(() =>
		supabase
			.from("todo")
			.select("*")
			.textSearch("search_targets", `${newValue.replaceAll(" ", " & ")}`)
	);

	if (newValue === "") {
		const { data: allTodos } = await useAsyncData(() =>
			supabase.from("todo").select("*")
		);

		data.value = allTodos.value;
		noResults.value = false;

		return;
	}
	if (newTodos.value.data?.length === 0) {
		noResults.value = true;
		data.value.data = [];

		return;
	}
	noResults.value = false;
	data.value = newTodos.value;
});
// const completedTodos = computed(() =>
// 	todoList.value.filter((item) => item.completed)
// );
// const toggleTodos = () => {
// 	iscompletedList.value = !iscompletedList.value;
// };
</script>

<template>
	<div class="app">
		<div class="error-text">{{ fail }}</div>
		<form @submit.prevent="addTodo">
			<input type="text" v-model.trim="searchTerm" placeholder="search" />
			<label
				v-if="!validTitle && todoText.length !== 0"
				class="label"
				for="title"
				>title is too short</label
			>
			<input
				id="title"
				type="text"
				v-model.trim="todoText"
				placeholder="type title..."
				:class="{
					validTitle: !validTitle && todoText.length !== 0,
					titleIsValid: validTitle,
				}"
			/>
			<label
				v-if="!validDesc && descriptionText.length !== 0"
				class="label"
				for="desciption"
				>description is too short</label
			>
			<textarea
				id="desciption"
				type="text"
				v-model.trim="descriptionText"
				placeholder="type description..."
				rows="7"
				:class="{
					validTitle: !validDesc && descriptionText.length !== 0,
					titleIsValid: validDesc,
				}"
			/>
			<div class="menu">
				<label for="filter">filter:</label>

				<select v-model="menuValue" name="filter" id="filter">
					<option value="all-todos">All todos</option>
					<option value="completed">Completed</option>
					<option value="most-recent">Most Recent</option>
				</select>
			</div>

			<button :disabled="!(validDesc && validTitle)" type="submit">
				{{ isLoadingData ? "loading..." : "Add todo" }}
			</button>
		</form>
		<h3 class="error-text" v-if="noResults">no matching results</h3>
		<ul>
			<li v-for="todo in data.data">
				<TodoListItem
					:title="todo.title"
					:completed="todo.completed"
					:id="todo.id"
					:description="todo.description"
					:refresh="refresh"
					:menuValue="menuValue"
					:externalData="data"
				/>
			</li>
		</ul>

		<!-- <button class="show-button" type="button" @click="toggleTodos">
			{{ iscompletedList ? "Show All" : "Show Completed Task Only" }}
		</button> -->
	</div>
	<div class="error-text" v-if="data.error">
		something went wrong with the server
	</div>
</template>

<style scoped>
button[disabled] {
	background-color: rgba(66, 88, 212, 0.603);
	cursor: not-allowed;
}
.titleIsValid {
	border: 1px solid rgb(20, 248, 50);
	outline: 1px solid rgb(20, 248, 50);
}
.validTitle {
	border: 1px solid red;
	outline: 1px solid red;
}
.label {
	font-size: 0.9rem;
	color: red;
}
.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
.menu {
	margin-top: 1rem;
}
.menu select {
	padding: 1rem;
	width: 100%;
	margin-top: 0.75rem;
}
.menu label {
	font-size: 1.1rem;
}
.error-text {
	margin-bottom: 1rem;
	color: rgb(226, 44, 44);
	text-align: center;
}

.app {
	display: flex;
	flex-direction: column;
	align-items: center;
}
textarea {
	resize: vertical;
	padding: 0.5rem;

	width: 100%;
}
.show-button {
	background-color: rgb(14, 14, 14);
}

button {
	margin: 2rem auto;
	display: block;
}
.flex {
	padding: 1rem;
	border-radius: 0.35rem;
	display: flex;
	gap: 2rem;
	align-items: center;
	justify-content: space-between;
}
ul {
	list-style: none;
	width: 100%;
	padding: 0;
}
ul li {
	background-color: rgb(228, 230, 231);
	padding: 2rem;
	margin-bottom: 1rem;
	border-radius: 0.25rem;
}
form {
	width: 100%;
}
</style>
