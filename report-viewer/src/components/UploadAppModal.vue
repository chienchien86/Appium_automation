<template>
    <div class="modal fade" id="uploadAppModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Upload App</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked @click="platform = 'android'">
                            <label class="form-check-label" for="exampleRadios1">
                                Android
                            </label>
                            </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" @click="platform = 'iOS'">
                            <label class="form-check-label" for="exampleRadios2">
                                iOS
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input position-static" type="checkbox" name="blankRadio" id="blankRadio1" value="option1" v-model="realDevice">
                            <label class="form-check-label" for="blankRadio1">real device</label>
                        </div>
                    </div>
                    <div class="form-group mt-2">
                        <input type="text" class="form-control" id="inputEmail4" placeholder="Version Name" v-model="versionName">
                    </div>
                    <input type="file" ref="appFileInput" @change="onFileChoose()">
                    <p style="color: gray; margin-bottom: 0;" class="mt-2">If you want to upload .app folder (for iOS emulator)</p>
                    <p style="color: gray;">, you should zip it then upload</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="upload()">UPLOAD</button>
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
            fileName: '選擇檔案',
            versionName: '',
            platform: 'android',
            realDevice: false,
            isUploading: false,
        }
    },

    methods: {
        async refresh () {

        },

        onFileChoose () {
            if (this.$refs.appFileInput.files.length != 0) {
                this.fileName = this.$refs.appFileInput.files[0].name
            } else {
                this.fileName = '選擇檔案'
            }
        },

        async upload () {
            if (this.versionName === '') {
                alert('version Name should be given')
                return
            } else if (this.$refs.appFileInput.files.length === 0) {
                alert('app file should be chosen')
                return
            }
            this.isUploading = true
            try {
                await AppiumService.uploadAppBinary(this.$refs.appFileInput.files[0], this.versionName, this.platform, this.realDevice)
                alert('upload success')
                this.$emit('uploadAppBinarySuccess')
            } catch (error) {
                alert(error.response.data.error)
            }
            this.isUploading = false
        }
    }
}
</script>

<style>

</style>
