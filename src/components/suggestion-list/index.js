import Vue from "vue/dist/vue.min.js";
import _ from "lodash";
import template from "./template.html";
import api from "../../services/api";
import "!style-loader!css-loader!./style.css";

const componentName = "suggestion-list";
const component = {
    props: { "searchString": String, "onClickSuggest": Function, "onComponentMounted":Function },
    data: () => ({
        suggestions: [],
        showSpinner: false,
        selectedIndex: 0
    }),
    template,
    mounted() {
        this.$nextTick(() => {
            this.onComponentMounted(this);
        })
    },
    watch: {
        searchString: function() {
            this.showSpinner = true;
            this.updateSuggestionDebounced(this.searchString);
        }
    },
    methods: {
        updateSuggestionDebounced: _.debounce(function(searchString) {
            if (!searchString || !searchString.length) {
                this.suggestions = [];
                this.showSpinner = false;
                this.selectedIndex = 0;
                return;
            };
            api.search(searchString)
                .then(locations => {
                    this.suggestions = locations;
                    this.showSpinner = false;
                    this.selectedIndex = 0;
                })
        }, 1000),
        displaySuggestion: function(suggest) {
            let str = "";
            if (suggest.Address && suggest.Address.length)
                str += suggest.Address + ", ";
            str += `${suggest.City}, ${suggest.Country}`;
            return str;
        },
        clickSuggestion: function(suggest) {
            this.onClickSuggest(suggest);
        },
        changeSelection: function(index) {
            this.selectedIndex = index;
        },
        openInMap: function(suggest) {
            const dest = [suggest.Address, suggest.City, suggest.Country].join(", ");
            this.$modal.show("location-direction", {destLoc: dest});
            return ;
            let place = suggest.Address.split(" ").join("+");
            place += ",+" + suggest.City.split(" ").join("+");
            place += ",+" + suggest.Country.split(" ").join("+");
            const latLng = (suggest.lat && suggest.lng) ? `@${suggest.lat},${suggest.lng},15z`:'';
            const url = `https://www.google.com/maps/place/${place}/${latLng}`;
            window.open(url, '_blank');
        }
    }
};

Vue.component(componentName, component);
export default component;
