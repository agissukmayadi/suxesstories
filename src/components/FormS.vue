<template>
  <div class="container mt-5">
    <div class="card shadow p-4">
      <h3>Project 1</h3>
      
      <!-- Date and Time -->
      <div class="mb-3">
        <label for="date" class="form-label">Tanggal</label>
        <div class="input-group">
          <input
            type="date"
            id="date"
            v-model="project.date"
            class="form-control"
          />
          <input
            type="time"
            v-model="project.startTime"
            class="form-control"
            placeholder="From"
          />
          <input
            type="time"
            v-model="project.endTime"
            class="form-control"
            placeholder="To"
          />
        </div>
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label for="description" class="form-label">Deskripsi</label>
        <textarea
          id="description"
          v-model="project.description"
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <!-- Tests -->
      <div class="mb-3">
        <label class="form-label">Test</label>
        <div class="d-flex flex-wrap">
          <div
            v-for="(test, index) in availableTests"
            :key="index"
            class="form-check form-check-inline"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :id="test"
              :value="test"
              v-model="project.tests"
            />
            <label class="form-check-label" :for="test">{{ test }}</label>
          </div>
        </div>
      </div>

      <!-- People -->
      <div class="mb-3">
        <label for="people" class="form-label">People</label>
        <input
          type="email"
          id="people"
          v-model="newPerson"
          class="form-control"
          placeholder="Name or email address"
          @keydown.enter.prevent="addPerson"
        />
        <div class="mt-2 d-flex flex-wrap">
          <span
            v-for="(person, index) in project.people"
            :key="index"
            class="badge bg-primary me-2"
          >
            {{ person }}
            <button
              type="button"
              class="btn-close btn-close-white ms-1"
              aria-label="Remove"
              @click="removePerson(index)"
            ></button>
          </span>
        </div>
      </div>

      <!-- Test Results -->
      <div class="mb-3">
        <label class="form-label">Hasil Test</label>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            value="Hanya untuk Company"
            v-model="project.testResult"
          />
          <label class="form-check-label">Hanya untuk Company</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            value="Kirim ke semua orang"
            v-model="project.testResult"
          />
          <label class="form-check-label">Kirim ke semua orang</label>
        </div>
      </div>

      <!-- Payment -->
      <div class="mb-3">
        <label class="form-label">Payment</label>
        <div class="input-group">
          <div class="input-group-text">
            <input
              type="checkbox"
              v-model="project.payment.enabled"
              aria-label="Enable Payment"
            />
          </div>
          <input
            type="number"
            class="form-control"
            v-model="project.payment.amount"
            :disabled="!project.payment.enabled"
            placeholder="Nominal"
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-end">
        <button class="btn btn-secondary me-2" @click="cancelEdit">Cancel</button>
        <button class="btn btn-primary" @click="saveProject">Save</button>
      </div>

      <!-- Display saved project details -->
      <div v-if="projectSaved" class="mt-4">
        <h5>Saved Project Details:</h5>
        <ul>
          <li><strong>Date:</strong> {{ project.date }}</li>
          <li><strong>Start Time:</strong> {{ project.startTime }}</li>
          <li><strong>End Time:</strong> {{ project.endTime }}</li>
          <li><strong>Description:</strong> {{ project.description }}</li>
          <li><strong>Test Results:</strong> {{ project.testResult }}</li>
          <li><strong>People:</strong> {{ project.people.join(', ') }}</li>
          <li><strong>Payment:</strong> {{ project.payment.enabled ? 'Enabled' : 'Disabled' }} - 
              {{ project.payment.amount ? project.payment.amount : 'N/A' }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      project: {
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        tests: [],
        people: [],
        testResult: "",
        payment: {
          enabled: false,
          amount: null,
        },
      },
      availableTests: [
        "5pf tipologi",
        "CFIT 3",
        "Negotiation Skill Test",
        "Achievement Motivation Profile",
        "Goal Setting Test",
      ],
      newPerson: "",
      projectSaved: false, // To track if the project has been saved
    };
  },
  methods: {
    addPerson() {
      if (this.newPerson.trim() !== "") {
        this.project.people.push(this.newPerson.trim());
        this.newPerson = "";
      }
    },
    removePerson(index) {
      this.project.people.splice(index, 1);
    },
    cancelEdit() {
      console.log("Edit cancelled");
      this.projectSaved = false; // Reset saved state if edit is canceled
    },
    saveProject() {
      console.log("Project saved", this.project);
      this.projectSaved = true; // Mark project as saved
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 600px;
  margin: auto;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

ul li {
  margin: 5px 0;
}

strong {
  font-weight: bold;
}
</style>
