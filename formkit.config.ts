import { generateClasses } from "@formkit/themes";
import type { DefaultConfigOptions } from "@formkit/vue";

const config: DefaultConfigOptions = {
  config: {
    classes: generateClasses({
      global: {
        label: "block text-lg font-medium text-gray-500 mt-3",
        message: "text-red-500 text-sm mt-1",
        wrapper: "space-y-1",
        input:
          "block w-full px-3 py-2 mt-1 text-gray-700 placeholder-gray-400 border border-gray-300  rounded-full shadow-sm focus:outline-none focus:ring-pink-400 focus:border-pink-400 sm:text-md ",
        icon: "absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none",
      },
      file: {
        fileItem: "hidden",
        noFiles: "text-sm text-gray-500",
      },
      submit: {
        input:
          "$reset bg-gradient-to-r from-pink-500 via-pink-300 to-pink-500 text-white py-2 px-4 rounded-full font-bold bg-btn transition-all duration-500 ease-in hover:bg-btn-hover w-full mt-8",
      },
    }),
  },
};

export default config;
