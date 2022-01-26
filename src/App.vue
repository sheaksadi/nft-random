<template>

  <v-app>

    <v-main class="body">
      <router-view/>
    </v-main>
  </v-app>

</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style>
.body{
  background-color: #232323;

}

</style>
