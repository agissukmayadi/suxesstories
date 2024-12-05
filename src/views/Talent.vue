<template>
    <div class="container py-4 ">
        <h3>Talent</h3>

        <!-- Search and Filter Section -->
        <div class="row mb-3">
            <div class="col-md-10">
                <div class="input-group">
                    <!-- Input Field -->
                    <input type="text" class="form-control" v-model="search" placeholder="Search" />
                    <!-- Icon Search -->
                    <span class="input-group-text">
                        <i class="bi bi-search text-white"></i>
                    </span>
                </div>
            </div>
            <div class="col-md-2 d-flex">
                <button class="btn btn-1" @click="toggleFilter">
                    <i class="bi bi-funnel"></i> Filter
                </button>
            </div>
        </div>

        <!-- Filter Section -->
        <div v-if="showFilter" class="row mb-4">
            <div class="col-md-4">
                <select class="form-select" v-model="selectedEvent">
                    <option value="" disabled selected>Select Event</option>
                    <option value="Physics Happy Day">Physics Happy Day</option>
                    <option value="Women Strong">Women Strong</option>
                    <option value="Insights Quest">Insights Quest</option>
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-select" v-model="selectedTest">
                    <option value="" disabled selected>Select Test</option>
                    <option value="Negotiation Skill Test">Negotiation Skill Test</option>
                    <option value="CFIT 3">CFIT 3</option>
                    <option value="5pf Tipologi">5pf Tipologi</option>
                </select>
            </div>
            <div class="col-md-4">
                <select class="form-select" v-model="selectedCompany">
                    <option value="" disabled selected>Select Company</option>
                    <option value="PT. Cipta Semesta">PT. Cipta Semesta</option>
                    <option value="PT. Cipta Angkasa">PT. Cipta Angkasa</option>
                    <option value="Yayasan Peduli Lansia">Yayasan Peduli Lansia</option>
                </select>
            </div>
        </div>

        <!-- Talent Table -->
        <table class="table table-striped table-hover">
            <thead>
                <tr>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Event</th>
                    <th>Test</th>
                    <th>Download</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="talent in filteredTalents" :key="talent.email">
                    <td>{{ talent.name }}</td>
                    <td>{{ talent.email }}</td>
                    <td>{{ talent.event }}</td>
                    <td>
                        <a href="#" @click.prevent="showTestModal(talent)" class="text" style="color:#265c7f ;">
                            Lihat Hasil Test
                        </a>
                    </td>
                    <td>
                        <button class="btn btn-link text" style="color:#265c7f ;" @click="showDownloadModal(talent)">
                            Download
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Test Modal -->
        <div class="modal fade" id="testModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header btn-primary text-white">
                        <h5 class="modal-title">Hasil test</h5>
                        <button type="button" class="btn-close text-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Lihat Hasil Test</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary text-white d-flex justify-content-between" type="button">
                                5pf Tipologi <span class="ms-2"> &gt; </span>
                            </button>
                            <button class="btn btn-primary text-white d-flex justify-content-between" type="button">
                                5pf Tipologi <span class="ms-2"> &gt; </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Download Modal -->
        <div class="modal fade" id="downloadModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header btn-primary text-white">
                        <h5 class="modal-title">Download</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-check d-flex justify-content-between align-items-center">
                            <label class="form-check-label" for="checkAll">
                                Download Semua
                            </label>
                            <input class="form-check-input ms-2" type="checkbox" id="checkAll" v-model="selectAll"
                                @change="toggleSelectAll" />
                        </div>
                        <div class="form-check mt-2 d-flex justify-content-between align-items-center"
                            v-for="(file, index) in files" :key="index">
                            <label class="form-check-label" :for="'file' + index">
                                {{ file }}
                            </label>
                            <input class="form-check-input ms-2" type="checkbox" :id="'file' + index"
                                v-model="selectedFiles" :value="file" />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel
                        </button>
                        <button class="btn btn-primary" @click="downloadFiles">
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>
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
            selectedCompany: "",
            selectedTalent: {},
            selectAll: false,
            selectedFiles: [],
            files: ["5pf Tipologi", "Negotiation Skill Test", "CFIT 3"],
            talents: [
                {
                    name: "Suci Amalia",
                    email: "admin@gmail.com",
                    event: "Insights Quest",
                    test: "Negotiation Skill Test",
                    company: "PT. Cipta Semesta",
                },
                {
                    name: "Admin",
                    email: "admin2@gmail.com",
                    event: "Insights Quest",
                    test: "CFIT 3",
                    company: "PT. Cipta Angkasa",
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
                const matchesEvent =
                    !this.selectedEvent || talent.event === this.selectedEvent;
                const matchesTest = !this.selectedTest || talent.test === this.selectedTest;
                const matchesCompany =
                    !this.selectedCompany || talent.company === this.selectedCompany;

                return matchesSearch && matchesEvent && matchesTest && matchesCompany;
            });
        },
    },
    methods: {
        toggleFilter() {
            this.showFilter = !this.showFilter;
        },
        showTestModal(talent) {
            this.selectedTalent = talent;
            const testModal = new bootstrap.Modal(document.getElementById("testModal"));
            testModal.show();
        },
        showDownloadModal(talent) {
            this.selectedTalent = talent;
            const downloadModal = new bootstrap.Modal(document.getElementById("downloadModal"));
            downloadModal.show();
        },
        toggleSelectAll() {
            this.selectedFiles = this.selectAll ? [...this.files] : [];
        },
        downloadFiles() {
            alert("Downloading: " + this.selectedFiles.join(", "));
        },
    },
};
</script>

<style scoped>
.input-group-text {
    background-color: #265c7f;
}

.btn-primary {
    background-color: #265c7f;
    border: none;
}

.btn-1 {
    background-color: #265c7f;
    color: white;
}
</style>
