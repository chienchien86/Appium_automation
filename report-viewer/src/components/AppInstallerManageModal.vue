<template>
    <div class="modal fade" id="appInstallerManageModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">App Installer Manager</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" style="text-align:center; overflow: scroll;">
                <div v-for="(version, index) in availableVersions" :key="index" style="margin-bottom: 10px;">
                    <div style="display:inline-block; margin-right:30px;">
                        <h5>
                            {{
                                `${version.name} 
                                ( ${(version.type==='real device') ? 'real device': 'emulator'} ) 
                                (${version.platform})`
                            }}</h5>
                    </div>
                    <button class="btn btn-danger" @click="deleteAvaliableVersion(version.name, version.type, version.platform)">✘</button>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
            availableVersions: [],
        }
    },

    mounted () {
        this.refreshAvailableVersion()
    },

    methods: {
    
        async refreshAvailableVersion () {
            const response = await AppiumService.getAvailable()
            this.availableVersions = response.data.available.versions
        },

        async deleteAvaliableVersion (version_name, type, platform) {
            try {
                await AppiumService.deleteVersion(version_name, type === 'real device', platform)
            } catch (error) {
                alert(error.response.data.error)
            }
            await this.refreshAvailableVersion()
        }
    }
}


</script>

<style>

</style>
