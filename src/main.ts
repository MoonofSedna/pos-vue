import { createApp } from "vue";
import { createPinia } from "pinia";
import { plugin, defaultConfig } from "@formkit/vue";
import config from "../formkit.config";
// components
import App from "./App.vue";
import router from "./router";
// vuefire
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase";
// styles
import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(plugin, defaultConfig(config));
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(router);

app.mount("#app");
