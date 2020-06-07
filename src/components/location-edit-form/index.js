import Vue from "vue/dist/vue.min.js";
import _ from "lodash";
import template from "./template.html";
import api from "../../services/api";
import "!style-loader!css-loader!./style.css";
import toastr from "toastr/build/toastr.min";

const componentName = "location-edit-form";
const component = {
    props: { 'title': String, 'location': Object, 'onSaveLocation': Function },
    data: () => ({ }),
    template,
    mounted() {
        this.$nextTick(() => { })
    },
    watch: { },
    methods: {
        onFormSubmit: async function(event) {
            console.log("submit event");
            event.preventDefault();

            //check requirement
            if (!this.location.City || !this.location.Country) {
                toastr.warning("City and Country is required. Please try again", "Missing Required Fields");
                return;
            }

            if (this.location._id)
                await api.updateLocation(this.location._id, this.location);

            this.onSaveLocation(this.location);
        }
    }
};

Vue.component(componentName, component);
export default component;
