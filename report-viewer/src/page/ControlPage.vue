<template>
    <div id="control-page" class="row">
        <div class="col-12 row">
            <div class="offset-6 mr-3 mb-3" style="display: inline-block;"><button class="btn btn-success" data-toggle="modal" data-target="#appInstallerManageModal">App Installer Manage ➤</button></div>
            <div class="mr-3 mb-3" style="display: inline-block;"><button class="btn btn-success" data-toggle="modal" data-target="#uploadAppModal">Upload App ➤</button></div>
            <div class="mb-3" style="display: inline-block;"><button class="btn btn-success" data-toggle="modal" data-target="#runAppiumChooseModal">Run Appium ➤</button></div>
        </div>

        <div v-if="jobs.length === 0" class="col-12" style="text-align: center; color: gray; margin-top:30px;"><h4>Appium isn't running any test</h4></div>
        <div class="col-12" v-for="(job, index) in jobs" :key="`${job.timestamp}`">        
            <div class="card border-light mb-3">
                <div class="card-header">
                    <h5 style="margin-bottom:0px;">
                        <span style="color:green;" v-if="index === 0">Running </span>
                        <span style="color:red;" v-if="index > 0">Waiting </span>
                        <span>{{`${job.version_name} ( ${new Date(job.timestamp).toLocaleString()} )`}}</span>
                        <button class="btn btn-danger" style="margin-left: 500px;" @click="onClickCancelRun(job.version_name, job.timestamp)" data-toggle="modal" data-target="#cancelRunModal">CANCEL</button>
                    </h5>
                </div>
                <div class="card-body row">
                    <div class="col-2 mb-2" v-for="flow in job.flows" :key="`${flow.device_name} , ${flow.language}, ${flow.name}`">
                        <button type="button" class="btn" v-bind:class="getStateButtonClass(flow.state)">{{`${flow.device_name} , ${flow.language}, ${flow.name}`}}</button>
                    </div>
                    <p class="card-text"></p>
                </div>
            </div>
        </div>
        <run-appium-choose-modal @runAppium="refreshWaitingJobs()"></run-appium-choose-modal>
        <app-installer-manage-modal ref="appInstallerManageModal"></app-installer-manage-modal>
        <upload-app-modal @uploadAppBinarySuccess="refreshAppInstallerMamngeModal()"></upload-app-modal>
        <cancel-run-modal ref="cancelRunModal" @cancelRunSuccessfully="refreshWaitingJobs()"></cancel-run-modal>
    </div>
</template>

<script>

import AppiumService from '@/services/AppiumService.js'
import RunAppiumChooseModal from '@/components/RunAppiumChooseModal.vue'
import AppInstallerManageModal from '@/components/AppInstallerManageModal.vue'
import CancelRunModal from '@/components/CancelRunModal.vue'
import UploadAppModal from '@/components/UploadAppModal.vue'

export default {

    components: {
        RunAppiumChooseModal,
        AppInstallerManageModal,
        CancelRunModal,
        UploadAppModal
    },

    data () {
        return {
            available:{
                emulators: [],
                real_devices: [],
                languages: [],
                version_names: []
            },
            jobs: []
        }
    },

    mounted () {
        this.refreshNewTestChooser()
        this.refreshWaitingJobs()
    },

    methods: {

        getStateButtonClass (state) {
            return {
                'btn-outline-secondary': state === 'waiting',
                'btn-outline-success': state === 'finish',
                'btn-secondary': state === 'running',
            }
        },

        async refreshNewTestChooser () {
            const response = await AppiumService.getAvailable()
            this.available.emulators = response.data.available.emulators
            this.available.real_devices = response.data.available.real_devices
            this.available.languages = response.data.available.languages
            this.available.version_names = response.data.available.version_names
            this.available.flow_names = response.data.available.flow_names
        },

        refreshAppInstallerMamngeModal () {
            this.$refs.appInstallerManageModal.refreshAvailableVersion()
        },

        async refreshWaitingJobs () {
            const response = await AppiumService.getWaitingJobs()
            this.jobs = response.data.jobs
        },

        async runAll (version_name, real_device) {
            await AppiumService.runAllFromAvailable(version_name, real_device)
            this.refreshWaitingJobs()
        },

        onClickCancelRun (version_name, timestamp) {
            this.$refs.cancelRunModal.setContent(version_name, timestamp)
        }

    }

}
</script>

<style>

</style>
