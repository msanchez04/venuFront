<template>
  <div class="generate-summary">
    <h2>Generate AI Summary</h2>
    <form @submit.prevent="handleGenerateSummary">
      <div class="form-group">
        <label for="user">User ID:</label>
        <input
          id="user"
          v-model="form.user"
          type="text"
          required
          placeholder="Enter user ID"
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Generating Summary..." : "Generate AI Summary" }}
      </button>
    </form>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <div v-if="summaryGenerated" class="summary-result">
      <h3>AI Summary Generated!</h3>
      <p>
        Your personalized concert statistics and recommendations have been
        generated based on your concert history.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { concertStatsAAPI } from "../../services/api.js";

const emit = defineEmits(["summary-generated"]);

const loading = ref(false);
const message = ref("");
const messageType = ref("");
const summaryGenerated = ref(false);

const form = reactive({
  user: "",
});

const handleGenerateSummary = async () => {
  loading.value = true;
  message.value = "";
  summaryGenerated.value = false;

  try {
    const response = await concertStatsAAPI.generateSummaryAI(form.user);

    if (response.error) {
      message.value = `Failed to generate summary: ${response.error}`;
      messageType.value = "error";
    } else {
      message.value = "AI summary generated successfully!";
      messageType.value = "success";
      summaryGenerated.value = true;
      emit("summary-generated", form.user);

      // Reset form
      form.user = "";
    }
  } catch (error) {
    message.value = `Failed to generate summary: ${error.message}`;
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.generate-summary {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background: #e83e8c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.summary-result {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.summary-result h3 {
  margin-top: 0;
  color: #495057;
}
</style>

