import Api from '@/services/Api'
export default {

    async getReportOverview (version_name,error) {
        return Api().get(`report/overview/?version_name=${version_name}&error=${error}`)
    },

    async getDevicesLanguages (time) {
        return Api().get(`report/?time=${time}`)
    },

    async getFlows (time, device, language) {
        return Api().get(`report/flows/?time=${time}&device=${device}&language=${language}`)
    },

    async putManualError (time, device, language, flow_name, manual_error) {
        return Api().put(`report/flow/error`, {
            time, device_name: device, language, flow_name, manual_error
        })
    },

    async deleteReport (timestamp) {
        return Api().delete(`report`, {
            data: {
                timestamp
            }
        })
    }
}