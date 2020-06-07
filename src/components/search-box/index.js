import Vue from "vue/dist/vue.min.js";
import _ from "lodash";
import template from "./template.html";
import "!style-loader!css-loader!./style.css";

const componentName = "search-box";
const component = {
    props: { "openMapResult":Function, 'clearSelectedLocation': Function, "onComponentMounted": Function },
    data: () => ({
        searchString: ""
    }),
    template,
    mounted() {
        this.$nextTick(() => {
            this.onComponentMounted(this);
        })
    },
    methods: {
        clearSearch: function() {
            this.searchString = "";
        },
        triggerClickSuggestion: () => {},
        onEnterLocation: function(event) {
            if (event.keyCode == 13) {
                this.triggerClickSuggestion();
            }
        },
        onSuggestionClick: function(suggestion) {
            this.openMapResult(suggestion);
        },
        onSuggestionAreaMounted: function() {
            const [suggestionArea] = arguments;
            this.triggerClickSuggestion = () => {
                const suggest = suggestionArea.suggestions[suggestionArea.selectedIndex];
                if (!suggest) return;
                suggestionArea.clickSuggestion(suggest);
            }
        }
    }
};

Vue.component(componentName, component);
export default component;
