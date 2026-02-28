<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ $t('dashboard.account') }}</h3>

    <template v-if="!confirming">
      <p class="text-sm text-gray-500 mb-4">{{ $t('dashboard.deleteConfirm').split('.')[0] }}.</p>
      <button
        @click="confirming = true"
        class="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
      >
        {{ $t('dashboard.deleteAccount') }}
      </button>
    </template>

    <template v-else>
      <p class="text-sm text-red-600 mb-4">{{ $t('dashboard.deleteConfirm') }}</p>
      <div class="flex items-center gap-3">
        <button
          @click="handleDelete"
          :disabled="deleting"
          class="text-sm bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <span v-if="deleting" class="flex items-center gap-2">
            <LucideLoader2 :size="14" class="animate-spin" />
          </span>
          <span v-else>{{ $t('dashboard.deleteButton') }}</span>
        </button>
        <button
          @click="confirming = false"
          class="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 transition-colors"
        >
          {{ $t('dashboard.cancel') }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const { deleteAccount } = useAuth()
const confirming = ref(false)
const deleting = ref(false)

async function handleDelete() {
  deleting.value = true
  try {
    await deleteAccount()
  } finally {
    deleting.value = false
  }
}
</script>
