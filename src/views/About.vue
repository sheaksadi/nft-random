<template>


    <!--  <v-btn @click="getNft">-->
    <!--    click me-->
    <!--  </v-btn>-->
    <v-container fill-height  >
        <v-row
            class="align-center justify-center"
            align="center"
            justify="center"
        >
          <v-col cols="3">

              <v-img
                  contain
                  v-if="activeNft"
                  v-on:mouseenter="stopCounter"
                  v-on:mouseleave="statCounter"
                  class= "rounded align-center justify-center"
                  height="100%" max-width="auto"
                  :src="activeNft.imgUrl"
                  @click="gotoPage "
              >
              </v-img>
              <h3 v-if="imgHover" class="textSubTitle">Rotation paused. Click image to check details.</h3>


            <v-skeleton-loader
                v-if="!activeNft.imgUrl"
                max-width="300"
                type="image"
                class= "rounded align-center justify-center"
                height="100%"
            ></v-skeleton-loader>

          </v-col>
            <v-col cols="3" class="white--text darken-2">
            <h2 class="textTitle">
              {{activeNft.name}}
            </h2>
              <h4 class="textSubTitle">{{nftDescription}}</h4>
          </v-col>


      </v-row>
    </v-container>



</template>

<script>

// import fetch from 'node-fetch';
import axios from 'axios';
export default {
  name: 'Home',
  data() {
    return {
      nfts: [],
      activeNft: {},
      interval: null,
      loadComplete: true,
      imgHover:false,


    }
  },

  components: {},
  methods: {
    blur(hover) {
      if (hover) {
        return "img";
      } else return '';
    },
    async getNtfs(limit) {
      let random = Math.floor(Math.random() * 10000);
      console.log(random)
      axios.get('https://api.opensea.io/api/v1/assets?order_by=sale_count&offset=' + random + '&limit=' + limit).then(async response => {
        let assets = response.data.assets
        let asset;
        this.nfts = [];
        for (asset of assets) {
          let nftObject = {
            name: asset.name,
            previewUrl: asset.image_preview_url,
            originalUrl: asset.image_original_url,
            permalink: asset.permalink,
            description: asset.description,

          }


          if (!this.nfts) {
            let currentNft = nftObject;
            currentNft.imgUrl = await this.downloadImg(currentNft.previewUrl)
            this.activeNft = currentNft;

          }

          if (nftObject.previewUrl)
            this.nfts.push(nftObject);

        }


        console.log(response)

      })


    },
    gotoPage() {
      window.open(this.activeNft.permalink, '_blank').focus()
    },

    stopCounter() {
      console.log("stop")
      this.imgHover=true;
      clearInterval(this.interval);

    },

    statCounter() {
      console.log("start")
      this.imgHover=false;
      this.interval = setInterval(this.main, 5000)

    },


    async downloadImg(url) {
      const image = await fetch(url);
      const imageBlob = await image.blob();
      return URL.createObjectURL(imageBlob);

    },
    async main() {
      if (this.nfts.length < 3) await this.getNtfs(10);

      console.log("0000000")

      let currentNft = await this.nfts.shift();
      if (!currentNft) currentNft = await this.nfts.shift();
      console.log(currentNft)
      currentNft.imgUrl = await this.downloadImg(currentNft.previewUrl)
      this.activeNft = currentNft;


      let isNull = true;
      let isBaseball = false;
      for (let url of this.nfts) {
        if (url.previewUrl) isNull = false;

        if (url.originalUrl && url.originalUrl.toString().includes("crypto-baseball")) isBaseball = true;
      }

      if (isNull || isBaseball) {
        this.nfts = [];
        this.getNtfs(12)
      }

    },
    async firstFill() {

      const currentNft = this.nfts.shift();
      console.log(currentNft)
      currentNft.imgUrl = await this.downloadImg(currentNft.previewUrl)
      this.activeNft = currentNft

    },


    async start(){

      await this.getNtfs(6);

      this.interval = setInterval(this.main, 5000)


    }


  },


  mounted() {

    this.start();

  },
  computed: {
    nftDescription() {
      if (!this.activeNft.imgUrl){
        return "loading.......";
      }

      if (this.activeNft.description && this.activeNft.description.length > 450)
        return this.activeNft.description.slice(0, 450) + "..."
      else return this.activeNft.description;


    }
  }




}
</script>
<style scoped>

.textTitle{
  font-family: 'Roboto Slab', serif;
}

.textSubTitle{
  font-family: 'Dongle', sans-serif;
}

.v-card--reveal {
  align-items: end;
  bottom: 0;
  justify-content: center;
  opacity: .5;
  position: absolute;
  width: 100%;
}
.title{
  opacity: 100 !important;
  webkit-filter: blur(0px) !important; /* Chrome, Safari, Opera */
  filter: blur(0px) !important;
}
.center {

  flex: auto;
  align-items: center;
  justify-items: center;
}

</style>
