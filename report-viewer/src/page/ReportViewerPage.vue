<template>
    <div id="report-viewer-page" class="row">
        <div class="col-12">
            <switch-bar ref="switch_bar" @changeMode="onChangeModeFromSwitchBar($event)"></switch-bar>
            <transition>
                <overview ref="overview" v-show="isModeOverview" @switchToRound="onChangeModeFromOverview($event)"></overview>
            </transition>
            <transition>
                <round-detail ref="round_detail" v-show="isModeRoundDetail" @switchToTest="onChangeModeFromRoundDetail($event)"></round-detail>
            </transition>
            <transition>
                <test-detail ref="test_detail" v-show="isModeTestDetail"></test-detail>
            </transition>

        </div>
    </div>
</template>

<script>

import SwitchBar from '@/components/SwitchBar' 
import Overview from '@/components/Overview' 
import RoundDetail from '@/components/RoundDetail' 
import TestDetail from '@/components/TestDetail' 

export default {
    name: 'report-viewer-page',

    components: {
        SwitchBar,
        Overview,
        RoundDetail,
        TestDetail
    },

    data() {
        return {
            mode: 'overview',
            isModeOverview: true,
            isModeRoundDetail: false,
            isModeTestDetail: false,
        }
    },

    methods: {

        changeModeStatus (mode) {
            this.mode = mode
            this.isModeOverview = mode === 'overview'
            this.isModeRoundDetail = mode === 'round-detail'
            this.isModeTestDetail = mode === 'test-detail'
        },

        onChangeModeFromSwitchBar (event) {
            this.changeModeStatus(event.mode)
            if (event.mode === 'round-detail') {
                this.$refs.round_detail.refresh(event.time)
            }
            if (event.mode === 'overview') {
                this.$refs.overview.refresh()
            }
        },

        onChangeModeFromOverview (event) {
            this.$refs.switch_bar.changeToRoundDetailFromMain(event.time, event.version_name)
            this.changeModeStatus('round-detail')
            this.$refs.round_detail.refresh(event.time)
        },

        onChangeModeFromRoundDetail (event) {
            this.$refs.switch_bar.changeToTestDetailFromMain(event.device, event.language)
            this.changeModeStatus('test-detail')
            this.$refs.test_detail.refresh(event.time, event.device, event.language)
        }
    }
}
</script>

<style>
.v-leave {
  opacity: 1;
}
.v-leave-active {
  transition: opacity .05s
}
.v-leave-to {
  opacity: 0;
}
.v-enter {
  opacity: 0;
}
.v-enter-active {
  transition: opacity .8s
}
.v-enter-to {
  opacity: 1;
}
</style>
