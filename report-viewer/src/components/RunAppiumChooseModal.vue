<template>
    <div class="modal fade bd-example-modal-lg" id="runAppiumChooseModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Run Appium</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body row">
                <div class="row col-8">
                    <div class="col-6">
                        <h5>Device</h5>
                        <div class="form-check"  v-for="emulator in available.ios_emulators" :key="emulator">
                            <input class="form-check-input" type="checkbox"  name="deviceRadios" :value="emulator"
                                @click="checkBoxClick(emulator, 'device'); changeDeviceType(EMULATOR, PLATFORM_IOS)"
                                :disabled="isDeviceInputDisabled(EMULATOR, PLATFORM_IOS)">
                            <label class="form-check-label" for="defaultCheck1">{{`${emulator} (emulator)`}}</label>
                        </div>
                        <div class="form-check"  v-for="real_device in available.ios_real_devices" :key="real_device">
                            <input class="form-check-input" type="checkbox"  name="deviceRadios" :value="real_device" 
                                @click="checkBoxClick(real_device, 'device'); changeDeviceType(REAL_DEVICE, PLATFORM_IOS)" 
                                :disabled="isDeviceInputDisabled(REAL_DEVICE, PLATFORM_IOS)">
                            <label class="form-check-label" for="defaultCheck1">{{`${real_device} (real device)`}}</label>
                        </div>
                        <div class="form-check"  v-for="emulator in available.android_emulators" :key="emulator">
                            <input class="form-check-input" type="checkbox"  name="deviceRadios" :value="emulator"
                                @click="checkBoxClick(emulator, 'device'); changeDeviceType(EMULATOR, PLATFORM_ANDROID)"
                                :disabled="isDeviceInputDisabled(EMULATOR, PLATFORM_ANDROID)">
                            <label class="form-check-label" for="defaultCheck1">{{`${emulator} (emulator)`}}</label>
                        </div>
                        <div class="form-check"  v-for="real_device in available.android_real_devices" :key="real_device">
                            <input class="form-check-input" type="checkbox"  name="deviceRadios" :value="real_device" 
                                @click="checkBoxClick(real_device, 'device'); changeDeviceType(REAL_DEVICE, PLATFORM_ANDROID)" 
                                :disabled="isDeviceInputDisabled(REAL_DEVICE, PLATFORM_ANDROID)">
                            <label class="form-check-label" for="defaultCheck1">{{`${real_device} (real device)`}}</label>
                        </div>
                    </div>
                    <div class="col-3">
                        <h5>Language</h5>
                        <div class="form-check"  v-for="language in available.languages" :key="language">
                            <input class="form-check-input" type="checkbox" :value="language" @click="checkBoxClick(language, 'language')">
                            <label class="form-check-label" for="defaultCheck1">{{language}}</label>
                        </div>
                    </div>
                    <div class="col-3" style="margin-top:2px;">
                        <h5>Flow</h5>
                        <div class="form-check"  v-for="flow_name in available.ios_flow_names" :key="flow_name+PLATFORM_IOS">
                            <input class="form-check-input" type="checkbox" name="flowRadios" :value="flow_name" @click="checkBoxClick(flow_name, 'flow')">
                            <label class="form-check-label" for="defaultCheck1">{{flow_name}} (iOS)</label>
                        </div>
                        <div class="form-check"  v-for="flow_name in available.android_flow_names" :key="flow_name+PLATFORM_ANDROID">
                            <input class="form-check-input" type="checkbox" name="flowRadios" :value="flow_name" @click="checkBoxClick(flow_name, 'flow')">
                            <label class="form-check-label" for="defaultCheck1">{{flow_name}} (android)</label>
                        </div>
                    </div>
                    <div class="offset-8 col-4 mt-3" @click="addJobToChoosed()"><button class="btn btn-primary">Choose</button></div>
                </div>
                <div class="row col-4">
                    <div class="col-7 mt-2" style="height: 35px;"><h5>Choosed</h5></div>
                    <div class="btn-group col-4 mb-3" style="height: 35px;">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                            {{
                                (choosedVersion === undefined) ? 'Version' : 
                                `${choosedVersion.name} ( ${choosedVersion.platform} )`
                            }}
                        </button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" href="#" v-for="(version, index) in available.versions" :key="`${index}`" 
                                @click="choosedVersion=version" style="text-decoration: none;">
                                {{`${version.name} (${version.type}) (${version.platform})`}}
                            </a>
                        </div>
                    </div>
                    <div class="col-12 choosed-jobs-block">
                        <div class="row col-12 mr-4" style="padding:0px;" v-for="job in choosedJobs" :key="`${job.device_name} , ${job.language}, ${job.flow_name}`">
                            <div class="col-10">{{`${job.device_name} , ${job.language}, ${job.flow_name}`}}</div>
                            <div class="col-2"><button class="btn btn-danger" @click="removeJobFromChoosed(job.device_name, job.language, job.flow_name)">✘</button></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" data-dismiss="modal" @click="runAppium()">Run</button>
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
            checkedItem: {
                device: [],
                language: [],
                flow: []
            },

            available:{
                ios_emulators: [],
                android_emulators: [],
                ios_real_devices: [],
                android_real_devices: [],
                ios_flow_names: [],
                android_flow_names: [],
                languages: [],
                versions: [],
            },
            choosedJobs: [],
            choosedVersion: undefined,
            chooseRealDeviceOrEmulator: '',
            choosedPlatform: '',
            EMULATOR: 'emulator',
            REAL_DEVICE: 'real device',
            PLATFORM_IOS: 'iOS',
            PLATFORM_ANDROID: 'android',
        }
    },

    mounted () {
        this.refreshAvailbale()
    },

    methods: {
        async refreshAvailbale () {
            const response = await AppiumService.getAvailable()
            this.available.ios_emulators = response.data.available.ios_emulators
            this.available.android_emulators = response.data.available.android_emulators
            this.available.ios_real_devices = response.data.available.ios_real_devices
            this.available.android_real_devices = response.data.available.android_real_devices
            this.available.ios_flow_names = response.data.available.ios_flow_names
            this.available.android_flow_names = response.data.available.android_flow_names
            this.available.languages = response.data.available.languages
            this.available.versions = response.data.available.versions
            const reversed_versions = []
            for (let i = this.available.versions.length - 1 ; i >= 0; i--) {
                reversed_versions.push(this.available.versions[i]);
            }
            this.available.versions = reversed_versions
        },

        isDeviceInputDisabled(type, platform) {
            return (this.chooseRealDeviceOrEmulator !== type && this.chooseRealDeviceOrEmulator !== '')
                || (this.choosedPlatform !== platform && this.choosedPlatform !== '')
        },

        checkBoxClick(name, type) {
            if (!this.checkedItem[type].includes(name)) {
                this.checkedItem[type].push(name)
            } else {
                this.checkedItem[type].splice(this.checkedItem[type].indexOf(name),1)
            }
        },

        changeDeviceType (type, platform) {
            if (this.checkedItem.device.length === 0) {
                this.chooseRealDeviceOrEmulator = ''
                this.choosedPlatform = ''
            } else {
                this.chooseRealDeviceOrEmulator = type
                this.choosedPlatform = platform
                this.choosedJobs = []
            }
        },

        addJobToChoosed () {
            if (this.checkedItem.device.length === 0) {
                alert('please choose at least one device')
            }
            else if (this.checkedItem.language.length === 0) {
                alert('please choose at least one language')
            }
            else if (this.checkedItem.flow.length === 0) {
                alert('please choose at least one flow')
            }
            for (const device of this.checkedItem.device) 
                for (const language of this.checkedItem.language) 
                    for (const flow of this.checkedItem.flow) {
                        if (this._.find(this.choosedJobs, {device_name: device, flow_name: flow, language: language}))
                            continue
                        this.choosedJobs.push({
                            device_name: device,
                            flow_name: flow,
                            language: language
                        })
                    }
        },

        removeJobFromChoosed (device_name, language, flow_name) {
            for (let i = 0; i < this.choosedJobs.length; i++) {
                if (this.choosedJobs[i].device_name === device_name && this.choosedJobs[i].language === language && this.choosedJobs[i].flow_name === flow_name) {
                    this.choosedJobs.splice(i,1)
                }
            }
        },

        isDeviceSameType () {
            return (
                    (this.chooseRealDeviceOrEmulator === this.REAL_DEVICE && this.choosedVersion.type === this.REAL_DEVICE)
                    || 
                    (this.chooseRealDeviceOrEmulator === this.EMULATOR && this.choosedVersion.type === this.EMULATOR)
                )
        },

        isPlatformSameType () {
            return (
                    (this.choosedPlatform === this.PLATFORM_ANDROID && this.choosedVersion.platform === this.PLATFORM_ANDROID)
                    ||
                    (this.choosedPlatform === this.PLATFORM_IOS && this.choosedVersion.platform === this.PLATFORM_IOS)
                );
        },

        async runAppium () {
            if (!this.isDeviceSameType() || !this.isPlatformSameType()) {
                alert('choosed device and version should be the same type (all emulator or all real device)')
                return
            }
            try {
                const real_device = this.chooseRealDeviceOrEmulator === this.REAL_DEVICE
                await AppiumService.runSpecific(
                    this.choosedVersion.name, this.choosedJobs , real_device, this.choosedVersion.platform)
            } catch (error) {
                alert(error.response.data.error)
            }
            this.choosedJobs = []
            this.$emit('runAppium')
        }
    }
}

</script>

<style>

.choosed-jobs-block {
    height: 23vh;
    overflow: scroll;
}
</style>
