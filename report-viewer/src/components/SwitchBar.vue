<template>
    <div id="switch-bar">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item switch-bar-text mt-1" @click="changeToOverview()"><a style="text-decoration: none;" href="#">Overview</a></li>
                <li class="breadcrumb-item switch-bar-text mt-1" @click="changeToRoundDetail()" v-if="isRoundDetailShow"><a style="text-decoration: none;" href="#">{{`${roundDetailVersionName} ( ${new Date(roundDetailTime).toLocaleString()} )`}}</a></li>
                <li class="breadcrumb-item active switch-bar-text mt-1" v-if="isTestDetailShow">{{testDetaildeviceName + ' , ' + testDetaildeviceLanguage}}</li>

                <div id="run-fail-button" class="btn-group" v-show="isRunFailButtonShow">
                    <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" @click="refreshAvaiableVersions()">
                        Run Fail Case
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" style="text-decoration:none;" href="#" v-for="(version,index) in availableVersions" :key="`${version.name}${index}`" @click="runFailCase(version)">
                            {{`${version.name} (${version.type}) (${version.platform})`}}
                        </a>
                    </div>
                </div>
            </ol>
        </nav>
    </div>
</template>


<script>

import AppiumService from '@/services/AppiumService.js'

export default {
    
    data () {
        return {
            mode : 'overview',
            roundDetailTime: '',
            roundDetailVersionName: '',
            testDetaildeviceName: '',
            testDetaildeviceLanguage: '',
            isRoundDetailShow: false,
            isTestDetailShow: false,
            isRunFailButtonShow: false,
            availableVersions: []
        }
    },

    methods: {

        changeModeStatus (mode) {
            this.mode = mode
            this.isRoundDetailShow = this.mode === 'round-detail' || this.mode === 'test-detail'
            this.isTestDetailShow = this.mode === 'test-detail'
            this.isRunFailButtonShow = !this.isTestDetailShow && this.isRoundDetailShow
        },

        changeToRoundDetailFromMain (time, version_name) {
            this.roundDetailTime = time
            this.roundDetailVersionName = version_name
            this.changeModeStatus('round-detail')
        },

        changeToTestDetailFromMain (device, language) {
            this.mode = 'test-detail'
            this.testDetaildeviceName = device
            this.testDetaildeviceLanguage = language
            this.changeModeStatus('test-detail')
        },

        changeToOverview () {
            this.$emit('changeMode', {mode:'overview'})
            this.changeModeStatus('overview')
        },

        changeToRoundDetail () {
            this.$emit('changeMode', {mode:'round-detail', time: this.roundDetailTime})
            this.changeModeStatus('round-detail')
        },

        async refreshAvaiableVersions () {
            const response = await AppiumService.getAvailable()
            this.availableVersions = response.data.available.versions
            const reversed_versions = []
            for (let i = this.availableVersions.length - 1 ; i >= 0; i--) {
                reversed_versions.push(this.availableVersions[i]);
            } 
            this.availableVersions = reversed_versions
        },

        async runFailCase (version) {
            try {
                const response = await AppiumService.runFailCaseByTime(version.name, this.roundDetailTime, version.type === 'real device')
                const success = response.data.status
                if (success) {
                    alert('appium is starting running the fail case')
                } else {
                    alert(response.data.error)
                }
            } catch (error) {
                alert(`run fail error: ${error.response.data.error}`)
            }
        }
    }
}
</script>


<style>

.switch-bar-text {
    font-size:20px;
    font-weight: bold;
}

#run-fail-button {
    margin-left: 34%;
}

#run-fail-button button{
    font-weight: bold;
}

</style>
