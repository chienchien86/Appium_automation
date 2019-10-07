<template>
    <div class="modal fade" id="cancelRunModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cancel Run</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="mb-2">
                        <span style="font-size: 18px; font-weight:bold; margin-left:20px;">Version: </span>
                        <span style="font-size: 15px; margin-left:20px;">{{version_name}}</span>
                    </div>
                    <div>
                        <span style="font-size: 18px; font-weight:bold; margin-left:20px;">Time: </span>
                        <span style="font-size: 15px; margin-left:20px;">{{new Date(timestamp).toLocaleString()}}</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" @click="cancelRun()">CANCEL</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import AppiumService from '@/services/AppiumService.js'


export default {
    
    data () {
        return {
            version_name: '',
            timestamp: ''
        }
    },

    methods: {
        setContent (version_name, timestamp) {
            this.version_name = version_name
            this.timestamp = timestamp
        },

        async cancelRun () {
            await AppiumService.cancelRun(this.timestamp)
            this.$emit('cancelRunSuccessfully')
        }
    }
}
</script>

<style>

</style>
