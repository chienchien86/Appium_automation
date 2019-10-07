<template>
    <div id="overview-test">
        <div class="row" id="overview-filter">
            <div class="col-4">
                <div class="input-group mt-3">
                    <div class="input-group-prepend">
                        <button class="btn btn-outline-secondary" type="button" id="button-addon1">Version Name</button>
                    </div>
                    <input type="text" class="form-control" v-model="version_name_query" @input="refresh()" @change="refresh()" placeholder="" aria-label="Example text with button addon" aria-describedby="button-addon1">
                </div>
            </div>
            <div class="col-4">
                <div class="dropdown  mt-3">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{(error_filter) ? 'Fail' : 'All'}}
                    </button>
                    <div class="dropdown-menu" >
                    <a class="dropdown-item" href="#" @click="onChangeErrorFilter(false)">All</a>
                    <a class="dropdown-item" href="#" @click="onChangeErrorFilter(true)">Fail</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-3"  v-for="report in reportList" :key="report.time">
                <div class="card border-success mb-3 report-card" style="max-width: 18rem;" v-bind:class="{'border-success': !report.error, 'border-danger': report.error}">
                    <div class="card-header">
                        <div class="row">
                            <h5 style="margin-bottom: 0px;" class="col-9" @click="onClickRound(report.time, report.version_name)">{{report.version_name}}</h5>
                            <div class="col-1">
                                <button class="btn btn-danger delete-button"
                                    data-toggle="modal" data-target="#deleteReportModal" 
                                    @click="triggerDeleteReportModal(new Date(report.time), report.version_name, report.platform)">✘</button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body" @click="onClickRound(report.time, report.version_name)" v-bind:class="{'text-success': !report.error, 'text-danger': report.error}">
                        <h5 class="card-title">
                            {{
                                (report.error !== 0) 
                                ? 'Total ' + report.error + ' Fail'
                                : `All success`
                            }}
                        </h5>
                        <p class="card-text">
                            <span>{{new Date(report.time).toLocaleString()}}</span>
                            <span style="color: #689bed; margin-left: 10px;">{{report.platform}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <delete-report-modal ref="deleteReportModal" @deleteReportFinish="refresh()"></delete-report-modal>
    </div>
</template>

<script>
import ReportService from '@/services/ReportService'
import DeleteReportModal from '@/components/DeleteReportModal.vue'

export default {

    components: {
        DeleteReportModal
    },

    data () {
        return {
            reportList: [],
            version_name_query: '',
            error_filter: false
        }
    },

    mounted () {

        this.refresh()
    },

    methods: {
        onClickRound (time, version_name) {
            this.$emit('switchToRound', {time, version_name})
        },

        onChangeErrorFilter (error_filter) {
            this.error_filter = error_filter
            this.refresh()
        },

        async refresh () {
            const result = await ReportService.getReportOverview(this.version_name_query, this.error_filter)
            this.reportList = result.data.reports
        },

        async triggerDeleteReportModal (time, version_name, platform) {
            this.$refs.deleteReportModal.refresh(time, version_name, platform)
        }
    }
}
</script>

<style>

#overview-filter {
    height: 80px;
    border-radius: 5px;
    margin-left: 1px;
    margin-right: 1px;
    margin-bottom: 5px;
}

.report-card {
    cursor: pointer;
}

.delete-button {
    border: 0;
    padding:1px 8px 1px 8px;
    margin:0px 0px 0px 12px;
    font-size: 17px;
    /* background-color: #999999; */
}

</style>
