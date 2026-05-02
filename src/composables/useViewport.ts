import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useViewport() {
	const isMobile = ref(false);

	function updateMobileState() {
		isMobile.value = window.matchMedia('(max-width: 768px)').matches;
	}

	onMounted(() => {
		updateMobileState();
		window.addEventListener('resize', updateMobileState);
	});

	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateMobileState);
	});

	return { isMobile };
}
