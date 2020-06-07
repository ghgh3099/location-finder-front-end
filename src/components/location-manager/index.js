import Vue from "vue/dist/vue.min.js";
import _ from "lodash";
import template from "./template.html";
import api from "../../services/api";
import "!style-loader!css-loader!./style.css";
import toastr from "toastr/build/toastr.min";

const componentName = "location-manager";
const component = {
    props: {},
    data: () => ({
        locations: [],
        selectedIndex: -1,
        filterText: "",
        selectedLocation: null,
        newLocation: null
    }),
    template,
    mounted() {
        this.$nextTick(async () => {
            this.locations = await api.getAllLocations();
        })
    },
    methods: {
        displayLocation: function(loc) {
            let str = "";
            if (loc.Address && loc.Address.length)
                str += loc.Address + ", ";
            str += `${loc.City}, ${loc.Country}`;
            return str;
        },
        openInMap: function(loc) {
            let place = loc.Address.split(" ").join("+");
            place += ",+" + loc.City.split(" ").join("+");
            place += ",+" + loc.Country.split(" ").join("+");
            const latLng = (loc.lat && loc.lng) ? `@${loc.lat},${loc.lng},15z`:'';
            const url = `https://www.google.com/maps/place/${place}/${latLng}`;
            window.open(url, '_blank');
        },
        getFilteredList: function(locations, filterText) {
            if (!filterText.length)
                return locations;
            const tokens = filterText.split(" ").filter(w => w.length);
            return locations
                .filter(l => {
                    const test = `${l.Address}, ${l.City}, ${l.Country}`.toLowerCase();
                    return tokens.some(w => test.includes(w));
                })
        },
        addNewLocation: function() {
            this.selectedLocation = null;
            this.selectedIndex = -1;
            this.newLocation = {};
        },
        deleteAllLocations: async function() {
            const res = confirm("Are you sure to delete all the locations");
            if (res != true) return;
            for(const loc of this.locations) {
                try {
                    await api.deleteLocation(loc._id);
                } catch (e) {
                    console.error(`Can not delete ${loc.Address}, ${loc.City}, ${loc.Country}.`);
                }
            }
            toastr.success("Delete all locations done");
            this.selectedLocation = null;
            this.selectedIndex = -1;
            this.locations = await api.getAllLocations();
        },
        deleteCurrentLocation: async function() {
            if (this.selectedLocation && this.selectedLocation._id) {
                const result = await api.deleteLocation(this.selectedLocation._id);
                this.selectedLocation = null;
                this.selectedIndex = -1;
                this.locations = await api.getAllLocations();
            }
        },
        saveLocation: async function(location) {
            // save new location
            if (!location._id) {
                try {
                const result = await api.createLocation(location);
                this.newLocation = null;
                } catch (e) {
                    toastr.error("Cannot create new location", "Create Error");
                    return;
                }
            }
            this.selectedLocation = null;
            this.selectedIndex = -1;
            this.locations = await api.getAllLocations();
        },
        importLocations: async function() {
            // read file
            const fileEle = document.createElement('input');
            const self = this;
            fileEle.type = 'file';
            fileEle.onchange = function(e) {
                const reader = new FileReader();
                reader.onload = async function(_e) {
                    try {
                        const data = JSON.parse(_e.target.result);
                        for (const loc of data) {
                            try {
                                await api.createLocation(loc);
                            } catch(e)  {
                                toastr.error(`location ${loc.Address}, ${loc.City}, ${loc.Country} is existed`);
                            }
                        }
                        toastr.success("Import done");
                        setTimeout(async () => {
                            self.selectedLocation = null;
                            self.selectedIndex = -1;
                            self.locations = await api.getAllLocations();
                        }, 100)
                    } catch (e) {
                        console.error(e);
                        toastr.error("Cannot parse imported file", "Parse Error");
                    }
                }
                reader.readAsText(fileEle.files[0]);
            }
            fileEle.click();
        },
        exportLocations: async function() {
            // download file
            const data = JSON.stringify(this.locations.map(l => ({
                Address: l.Address,
                City: l.City,
                Country: l.Country,
                lat: l.lat,
                lng: l.lng
            })));
            const blob = new Blob([data], {type: 'text/plain'});
            const url = window.URL.createObjectURL(blob);
            const aEle = document.createElement('a');
            aEle.href = url;
            aEle.download = "backup-location.json";
            aEle.click();
        }
    }
};

Vue.component(componentName, component);
export default component;
