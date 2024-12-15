<template>
    <div class="talent vh-100">
        <h3>Talent</h3>

        <!-- Search and Filter Section -->
        <div class="row mb-4">
            <div class="col-md-10">
                <div class="input-group">
                    <input type="text" class="form-control" v-model="search" placeholder="Search by name or email" />
                    <span class="input-group-text">
                        <i class="bi bi-search text-white"></i>
                    </span>
                </div>
            </div>
            <div class="col-md-2 d-flex">
                <button class="btn btn-secondary" style="background-color: #265c7f" @click="toggleFilter">
                    <i class="bi bi-funnel"></i> Filter
                </button>
            </div>
        </div>

        <!-- Filter Section -->
        <div v-if="showFilter" class="row mb-4">
            <div class="col-sm-6">
                <p class="mb-1">Selected Event</p>
                <select class="form-select" v-model="selectedEvent">
                    <option value="Physics Happy Day">Physics Happy Day</option>
                    <option value="Women Strong">Women Strong</option>
                    <option value="Insights Quest">Insights Quest</option>
                </select>
            </div>
            <div class="col-sm-6">
                <p class="mb-1">Selected Test</p>
                <select class="form-select" v-model="selectedTest">
                    <option value="5pf tipologi">5pf tipologi</option>
                    <option value="CFIT 3">CFIT 3</option>
                    <option value="Negotiation Skill Test">Negotiaton Skill Test</option>
                    <option value="Achievement Motivation Profile">Achievement Motivation Profile</option>
                    <option value="Goal Setting Test">Goal Setting Test</option>
                    <option value="Scholastic Aptitudes Questionnaire">Scholastic Aptitudes Questionnaire</option>
                    <option value="Personality 5.0">Personality 5.0</option>
                    <option value="Creative Problem Solving">Creative Problem Solving</option>
                    <option value="Emotional Intelligence Test">Emotional Intelligence Test</option>
                    <option value="Teaching Style Profile">Teaching Style Profile</option>
                </select>
            </div>
        </div>

        <!-- Table Section -->
        <div class="table-responsive">
            <table class="table table-striped table-hover text-center">
                <thead>
                    <tr>
                        <th>Download</th>
                        <th>Nama</th>
                        <th>Event</th>
                        <th>Test</th>
                        <th>Email</th>
                        <th>No Handphone</th>
                        <th>Tanggal Lahir</th>
                        <th>Kota Domisili</th>
                        <th>Jenis Kelamin</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="talent in filteredTalents" :key="talent.email">
                        <td>
                            <button class="btn btn-link" style="background-color: #265c7f; color: white;"
                                @click="downloadPDF(talent)">
                                <i class="bi bi-download"></i>
                            </button>
                        </td>
                        <td>{{ talent.name }}</td>
                        <td>{{ talent.event }}</td>
                        <td>{{ talent.test }}</td>
                        <td>{{ talent.email }}</td>
                        <td>{{ talent.phone }}</td>
                        <td>{{ talent.birthdate }}</td>
                        <td>{{ talent.city }}</td>
                        <td>{{ talent.gender }}</td>
                    </tr>
                    <tr v-if="filteredTalents.length === 0">
                        <td colspan="9" class="text-center">No data found</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            search: "",
            showFilter: false,
            selectedEvent: "",
            selectedTest: "",
            talents: [
                {
                    name: "Suci Amalia",
                    birthdate: "1995-08-25",
                    city: "Surabaya",
                    phone: "08123456789",
                    gender: "Perempuan",
                    email: "admin@gmail.com",
                    event: "Insights Quest",
                    test: "Negotiation Skill Test",
                },
                {
                    name: "Admin",
                    birthdate: "1992-03-15",
                    city: "Jakarta",
                    phone: "08129876543",
                    gender: "Laki-laki",
                    email: "admin2@gmail.com",
                    event: "Insights Quest",
                    test: "CFIT 3",
                },
                {
                    name: "Selina Dita",
                    birthdate: "2004-04-15",
                    city: "Surabaya",
                    phone: "08129876543",
                    gender: "Perempuan",
                    email: "admin3@gmail.com",
                    event: "Women Strong",
                    test: "Creative Problem Solving",
                },
                {
                    name: "Selina Dita",
                    birthdate: "2004-04-15",
                    city: "Surabaya",
                    phone: "08129876543",
                    gender: "Perempuan",
                    email: "admin3@gmail.com",
                    event: "Physics Happy Day",
                    test: "Scholastic Aptitudes Questionnaire",
                },
                {
                    name: "Selina Dita",
                    birthdate: "2004-04-15",
                    city: "Surabaya",
                    phone: "08129876543",
                    gender: "Perempuan",
                    email: "admin3@gmail.com",
                    event: "Physics Happy Day",
                    test: "Teaching Style Profile",
                },
            ],
        };
    },
    computed: {
        filteredTalents() {
            return this.talents.filter((talent) => {
                const matchesSearch =
                    !this.search ||
                    talent.name.toLowerCase().includes(this.search.toLowerCase()) ||
                    talent.email.toLowerCase().includes(this.search.toLowerCase());
                const matchesEvent = !this.selectedEvent || talent.event === this.selectedEvent;
                const matchesTest = !this.selectedTest || talent.test === this.selectedTest;

                return matchesSearch && matchesEvent && matchesTest;
            });
        },
    },
    methods: {
        toggleFilter() {
            this.showFilter = !this.showFilter;
        },
        downloadPDF(talent) {
            const content = `Talent Information\n\nName: ${talent.name}\nEvent: ${talent.event}\nTest: ${talent.test}\nEmail: ${talent.email}\nPhone: ${talent.phone}\nBirthdate: ${talent.birthdate}\nCity: ${talent.city}\nGender: ${talent.gender}`;
            const blob = new Blob([content], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${talent.name}_info.pdf`;
            link.click();
        },
    },
};
</script>

<style scoped>
.btn-link {
    background-color: #265c7f;
    color: white;
}

.input-group-text {
    background-color: #265c7f;
}

.btn-primary {
    background-color: #265c7f;
    border: none;
}
</style>

