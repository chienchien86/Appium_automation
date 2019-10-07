<template>
    <div id="round-detail" class="row">
        <div class="col-6" v-for="device in devices" :key="device.name">        
            <div class="card border-light mb-3">
                <div class="card-header">
                    <h5 style="margin-bottom:0px;">
                        {{`${device.name} ( ${(device.real_device) ? 'real device' : 'emulator'})`}}
                    </h5>
                </div>
                <div class="card-body row">
                    <div class="col-2" v-for="language in device.languages" :key="language.language">
                        <div class="btn-group">
                            <button type="button" class="btn" @click="onClickLanguage(device.name, language.language)" v-bind:class="{'btn-outline-success': !language.error , 'btn-outline-danger': language.error}">{{language.language}}</button>
                            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split" @click="refreshFlow(device.name, language.language)" data-toggle="dropdown"  v-bind:class="{'btn-outline-success': !language.error , 'btn-outline-danger': language.error}"></button>
                            <div class="dropdown-menu">
                                <a class="dropdown-item" style="text-decoration: none; font-weight: bold;" href="#" v-for="flow in flows" :key="`${flow.device}${language}`">{{flow.name}}
                                    <button @click="updateManualError(device.name, language.language, flow.name, !flow.error)" class="btn" v-bind:class="{'btn-outline-success': !flow.error, 'btn-outline-danger': flow.error}" style="padding: 2px 8px 2px 8px; margin-left:20px;">
                                        {{(flow.error) ? 'error ✘': 'success ✔︎'}}
                                    </button>
                                </a>
                            </div>
                        </div>  
                    </div>
                    <p class="card-text"></p>
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
            devices: [],
            flows: []
        } 
    },

    methods: {
        async refresh (time) {
            this.time = time
            const result = await ReportService.getDevicesLanguages(time) 
            this.devices = result.data.devices_languages
        },

        onClickLanguage (device, language) {
            this.$emit('switchToTest', {time: this.time, device, language})
        },

        async refreshFlow (device, language) {
            const response = await ReportService.getFlows(this.time, device, language)
            this.flows = response.data.flows
            for (const flow of this.flows) {
                flow.error = flow.manual_error || false
                for (const action of flow.actions) {
                    if (action.error === true) {
                        flow.error = true
                    }
                }
            }
        },

        async updateManualError(device, language, flow_name, manual_error) {
            await ReportService.putManualError(this.time, device, language, flow_name, manual_error)
            this.refresh(this.time)
            this.refreshFlow(device, language)
        }
    }
}
</script>

<style>

</style>
