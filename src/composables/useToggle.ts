import { computed, ref } from "vue";

export default function useToggle() {
  const isOpen = ref("false");
  const animation = ref(false);

  const onOpen = (id: string) => {
    isOpen.value = id;
    setTimeout(() => (animation.value = true), 200);
  };

  const onClose = () => {
    animation.value = false;
    setTimeout(() => (isOpen.value = ""), 200);
  };

  const isAnimated = computed(() => {
    return animation.value ? "animate" : "";
  });

  return {
    isOpen,
    onOpen,
    onClose,
    isAnimated,
  };
}
