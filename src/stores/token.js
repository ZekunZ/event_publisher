//define store
import { defineStore } from "pinia";
import { ref } from "vue";
/* 
    first parameter: name , should be unique
    second parameter: method, in the methods it should define the content of the state

    return: method
*/
export const useTokenStore = defineStore(
  "token",
  () => {
    //define the reactive state
    const token = ref("");

    const setToken = (newToken) => {
      token.value = newToken;
    };

    const removeToken = () => {
      token.value = "";
    };

    return {
      token,
      setToken,
      removeToken,
    };
  },
  {
    persist: true,
  }
);
