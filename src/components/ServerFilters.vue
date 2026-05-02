<script setup lang="ts">
import { sortOptions } from '../constants/bpservers'
import type { Filters } from '../types/bpservers'

const filters = defineModel<Filters>({ required: true })
</script>

<template>
	<section class="filters" aria-label="Server filters">
		<div class="visibility">
			<label>
				Whitelist:
				<select v-model="filters.whitelist">
					<option value="any">Any</option>
					<option value="disabled">Disabled</option>
					<option value="enabled">Enabled</option>
				</select>
			</label>

			<label>
				Validation:
				<select v-model="filters.validation">
					<option value="any">Any</option>
					<option value="valid">Valid</option>
					<option value="invalid">Invalid</option>
				</select>
			</label>

			<label>
				Version:
				<select v-model="filters.updated">
					<option value="any">Any</option>
					<option value="current">Current</option>
					<option value="outdated">Outdated</option>
				</select>
			</label>

			<label>
				Hide Empty:
				<input v-model="filters.hideEmpty" type="checkbox" />
				<span class="checkmark"></span>
			</label>

			<label>
				Hide Full:
				<input v-model="filters.hideFull" type="checkbox" />
				<span class="checkmark"></span>
			</label>
		</div>

		<div class="sorting">
			<label>
				Sort by:
				<select v-model="filters.sorting" class="no-margin">
					<option v-for="(label, value) in sortOptions" :key="value" :value="value">
						{{ label }}
					</option>
				</select>
			</label>

			<input id="asc" v-model="filters.sortingOrder" type="radio" value="asc" />
			<label class="label-button" for="asc" title="Ascending">&#9650;</label>

			<input id="desc" v-model="filters.sortingOrder" type="radio" value="desc" />
			<label class="label-button" for="desc" title="Descending">&#9660;</label>
		</div>
	</section>
</template>
