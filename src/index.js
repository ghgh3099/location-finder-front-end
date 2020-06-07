import Vue from "vue/dist/vue.min.js";
import {Plugin} from "vue-fragment";
import _ from "lodash";
import api from "./services/api";
import components from "./components";
import toastr from "toastr/build/toastr.min";
import "!style-loader!css-loader!toastr/build/toastr.min.css";
import "!style-loader!css-loader!@fortawesome/fontawesome-free/css/all.css";

(async ()=> {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    Vue.use(Plugin);
    const googleApiKey = (await api.getGoogleAPIKey()).data;
    console.log(googleApiKey);

    new Vue({
        el: "#vue-app",
        components,
        data: {
            googleMapEmbeddedURL: `https://www.google.com/maps/embed/v1/place?q=Ha+Noi,+Viet+Nam&key=${googleApiKey}`,
            selectedLocation: null,
            show: 'dashboard'
        },
        methods: {
            clearSearch: () => {},
            onSearchBoxMounted: function() {
                const [searchBox] = arguments;
                this.clearSearch = () => {
                    searchBox.clearSearch.call(searchBox);
                }
            },
            openMapResult: function(loc) {
                let place = loc.Address.split(" ").join("+");
                place += ",+" + loc.City.split(" ").join("+");
                place += ",+" + loc.Country.split(" ").join("+");
                this.googleMapEmbeddedURL = `https://www.google.com/maps/embed/v1/place?q=${place}&key=${googleApiKey}`
                this.selectedLocation = loc;
            },
            clearSelectedLocation: function() {
                this.selectedLocation = null;
                this.clearSearch();
            },
            onSaveLocation: function(newLocation) {
                this.openMapResult(newLocation);
            }
        }
    })
})();
