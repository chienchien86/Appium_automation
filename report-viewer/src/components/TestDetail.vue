<template>
    <div class="accordion" id="accordionExample">
        <div class="card"  v-for="(flow,index) in flows" :key="flow.name">
            <div class="card-header" id="headingOne">
                <h2 class="mb-0">
                    <button class="btn" type="button" data-toggle="collapse" :data-target="'#collapse-flow-1'+index" aria-expanded="true" aria-controls="collapseOne">
                    <h5 style="margin-bottom:0px;" v-bind:class="getFlowNameClass(flow)" >
                        {{  `${flow.name}` + 
                            ((flow.error===false && flow.manual_error) ? ' ( Manual Tag Error)' : '') + 
                            ((flow.error) ? ' ( Error )': '') + 
                            ((flow.error === false && !flow.manual_error) ? ' ( Success )' : '')
                        }}
                    </h5>
                    </button>
                </h2>
            </div>
            <div :id="'collapse-flow-1' + index" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="card-body row">
                    <div class="list-group col-3" v-for="(action, action_index) in flow.actions" :key="`${action_index}`">
                        <a class="list-group-item list-group-item-action mb-3">
                            <div class="justify-content-between">
                                <div><h5 class="mb-1" v-bind:class="{'danger-color': action.error === true}">{{`# ${action_index} ${action.name}`}}</h5></div>
                                <img class="image-action" 
                                    :src="getImageSrc(flow, action)" 
                                alt="">
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '@/config.js'
import ReportService from '@/services/ReportService.js'

export default {

    data () {
        return {
            flows: [],
            device: '',
            language: '',
            server_host: config.SERVER_HOST
        }
    },

    mounted () {

    },

    methods: {

        getFlowNameClass (flow) {
            return {
                'normal-blue-color': flow.error === false && !flow.manual_error,
                'danger-color': (flow.error === true || flow.manual_error=== true)
            }
        },

        async refresh (time, device, language) {
            const result = await ReportService.getFlows(time, device, language)
            this.device = device
            this.language = language
            this.flows = result.data.flows
            for (const flow of this.flows) {
                flow.error = false
                for (const action of flow.actions) {
                    if (action.error === true) {
                        flow.error = true
                    }
                }
            }
        },

        getImageSrc(flow, action) {
            if (action.error === true && action.name !== 'Error') {
                return `${this.server_host}/AppiumErrorImage.png`
            } else {
                return `${this.server_host}${action.image_name}.png`
            }
        }
    }
}


</script>

<style>
.image-action {
    max-width: 100%;
}

.danger-color {
    color:red;
}

.normal-blue-color {
    color: #007bff;
}


</style>
