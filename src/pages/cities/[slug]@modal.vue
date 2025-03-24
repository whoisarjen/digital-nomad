<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <OnClickOutside @trigger="$modalRouter.close()" class="bg-white w-full max-w-screen-lg rounded-2xl p-4 shadow-lg relative min-h-[64%] flex-1">
        <div class="size-full">
          <button 
            @click="$modalRouter.close()" 
            class="absolute top-8 right-8 custom-button-active rounded-full p-2 shadow-md transition-all z-50"
          >
            <lucideX class="size-5" />
          </button>
          <PageComponent />
        </div>
      </OnClickOutside>
    </div>
  </Teleport>
</template>


<script setup>
import { OnClickOutside } from '@vueuse/components'
import PageComponent from './[slug].vue'
</script>