import axios from 'axios'
import config from '@/config.js'

export default () => {
    return axios.create({
        baseURL: `${config.SERVER_HOST}api`,
    })
}