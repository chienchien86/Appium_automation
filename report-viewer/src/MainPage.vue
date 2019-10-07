<template>
    <div id="main-page" class="container">
        <div class="row">
            <div class="col-9 mb-4"><h2>Appium AutoTest</h2></div>
            <router-link class="col-1" :to="{name: 'report-view-page'}"><button type="button" @click="changePage('report-view-page')" class="btn btn-outline-dark" v-bind:class="getPageButtonClass('report-view-page')"><h5 style="margin-bottom:0px;">Report</h5></button></router-link>
            <router-link class="col-1" :to="{name: 'control-page'}"><button type="button" @click="changePage('control-page')" class="btn btn-outline-dark" v-bind:class="getPageButtonClass('control-page')"><h5 style="margin-bottom:0px;">Control</h5></button></router-link>
        </div>
        <transition :name="transitionName">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'main-page',

    data () {
        return {
            currentPage: 'report-view-page',
            transitionName: 'slide-right'
        }
    },

    mounted () {
        this.currentPage = this.$route.name
    },

    watch: {
        $route (to, from){
            this.currentPage = to.name
            if (to.name === 'report-view-page') {
                this.transitionName = 'slide-right'
            } else if (to.name === 'control-page') {
                this.transitionName = 'slide-left'
            }
        }
    },

    methods: {

        getPageButtonClass (pageName) {
            return {
                active: pageName === this.currentPage
            }
        },

        changePage (pageName) {
            this.currentPage = pageName
        }
    }

}
</script>

<style>
.slide-left-enter-active,
.slide-right-enter-active {
    transition-duration: 0.6s;
    transition-property: height, opacity, transform;
    transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
    overflow: hidden;
}
.slide-left-leave-active,
.slide-right-leave-active {
    transition-duration: 0.15s;
    transition-property: height, opacity, transform;
    transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
    overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
    opacity: 0;
    transform: translate(10em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
    opacity: 0;
    transform: translate(-10em, 0);
}
</style>
