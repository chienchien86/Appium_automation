import Api from '@/services/Api.js'

export default {

    async runFailCaseByTime (version_name, time, real_device) {
        return Api().post(`appium/fail`, {
            time: time,
            real_device: real_device, 
            version_name: version_name
        })
    },

    async getAvailable () {
        return Api().get(`appium/available`)
    },

    async getWaitingJobs () {
        return Api().get(`appium/jobs`)
    },

    async deleteVersion (version_name, real_device, platform) {
        return Api().delete(`appium/version`, {
            data: {
                version_name, real_device, platform
            }
        })
    },

    async cancelRun (timestamp) {
        return Api().delete(`appium/cancel`, {
            data: {
                timestamp: timestamp
            }
        })
    },

    async runSpecific (version_name, jobs, real_device, platform) {
        return Api().post(`appium/specific`, {
            version_name, jobs, real_device, platform
        })
    },

    async runAllFromAvailable (version_name, real_device) {
        return Api().post(`appium/all/available`, {
            version_name: version_name,
            real_device: real_device
        })
    },

    async uploadAppBinary (file, versionName, platform, realDevice) {
        const formData = new FormData()
        formData.append('file',file)
        return Api().post(`appium/upload/binary?version_name=${versionName}&platform=${platform}&real_device=${realDevice}`, 
        formData,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}