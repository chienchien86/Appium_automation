<template>
    <div class="modal fade" id="deleteReportModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Report</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body row">
                    <div class="col-5">
                        <div style="font-size: 18px; font-weight:bold; margin-left:20px;">Time: </div>
                        <div style="font-size: 18px; font-weight:bold; margin-left:20px;">Version Name: </div>
                        <div style="font-size: 18px; font-weight:bold; margin-left:20px;">Platform: </div>
                    </div>
                    <div class="col-6">
                        <div style="font-size: 15px;">{{time.toLocaleString()}}</div>
                        <div style="font-size: 15px;">{{version_name}}</div>
                        <div style="font-size: 15px;">{{platform}}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" @click="deleteReport()">DELETE</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import ReportService from '@/services/ReportService.js'

export default {
    data () {
        return {
            time: '',
            version_name: '',
            platform: ''
        }
    },

    methods: {

        async refresh (time, version_name, platform) {
            this.time = time
            this.version_name = version_name
            this.platform = platform
        },

        async deleteReport () {
            await ReportService.deleteReport(this.time.valueOf());
            this.$emit('deleteReportFinish')
        }
    }
}
</script>

<style>

</style>
