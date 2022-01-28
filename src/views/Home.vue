<template>
<div >

<!--  <v-btn @click="getNft">-->
<!--    click me-->
<!--  </v-btn>-->
  <v-container align="center">
    <v-row v-masonry style="height: 100vh">
      <v-col md="3" sm="6" cols="12" v-for="url in activeNfts" >
        <v-hover v-slot="{ hover }">
          <v-card color="#232323" :href="url.permalink" target="_blank" >
          <v-img :class="blur(hover)" :src="url.imgUrl" @load="$redrawVueMasonry()">

          </v-img>
            <v-expand-transition>
              <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out grey darken-2 v-card--reveal text-h2  white--text "
                  style="height: 100%;"
              >
                <v-card-title
                    v-if="hover"
                    class="title white--text "
                >
                  {{url.name}}
                </v-card-title>
              </div>


            </v-expand-transition>



          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>

  </div>

</template>

<script>

  // import fetch from 'node-fetch';
  import axios from 'axios';
  export default {
    name: 'Home',
    data (){
      return{
        nfts: [],
        activeNfts:[],
        numberOfNfts:8,





      }
    },

    components: {

    },
    methods:{
      blur(hover ){
        if (hover){
          return "img";
        }
        else return  '';
      },
      getNtfs(limit){
        let random=Math.floor( Math.random()*10000);
        console.log(random)
        axios.get('https://api.opensea.io/api/v1/assets?order_by=sale_count&offset='+random+'&limit='+limit).then(response =>{
          let assets= response.data.assets
          let asset;
          this.nfts=[];
          for (asset of assets){
            let nftObject = {
              name: asset.name,
              previewUrl: asset.image_preview_url,
              originalUrl: asset.image_original_url,
              permalink: asset.permalink,
              description: asset.description,

            }

            console.log(asset.image_preview_url)
            if (nftObject.previewUrl)
            this.nfts.push(nftObject);

          }

          this.firstFill()
          console.log(response)

        })


      },
      getFilteredNfts(limit){
        this.getNtfs(limit)
        let isNull=true;
        let isBaseball=false;
        for (let url of this.nfts){
          if (url.previewUrl) isNull=false;

          if (url.originalUrl && url.originalUrl.toString().includes("crypto-baseball")) isBaseball= true;
        }

        if  (isNull || isBaseball){
          this.nfts=[];
          this.getNtfs(limit)
        }
      },
      async downloadImg (url){
        const image = await fetch(url);
        const imageBlob = await image.blob();
        return  URL.createObjectURL(imageBlob);

      },
      async main(){
        console.log("0000000")

        if (this.nfts.length<this.numberOfNfts+1){
          this.getFilteredNfts(50)
        }

        if (this.activeNfts.length>=this.numberOfNfts-2){

          let random = Math.floor(Math.random()*this.numberOfNfts)
          console.log("rr"+random)

          const currentNft=await this.nfts.shift();
          console.log(currentNft)
          currentNft.imgUrl=await this.downloadImg(currentNft.previewUrl)
          //this.activeNfts.assign(random,currentNft)
          this.activeNfts.splice(random,1,currentNft)
        }



        if (this.activeNfts.length>this.numberOfNfts){
          console.log("gretter than 4 "+this.activeNfts.length)
          this.activeNfts.splice(0,1)

        }


        //await this.firstFill();





      },
      async firstFill( ){
        while(this.activeNfts.length<this.numberOfNfts){
          console.log("aa"+this.activeNfts.length)
          console.log("nn"+this.nfts.length)
          const currentNft= this.nfts.shift();
          console.log(currentNft)
          currentNft.imgUrl=await this.downloadImg(currentNft.previewUrl)
          this.activeNfts.push(currentNft)


        }

      }





  },
    mounted() {
      //
      // let url;
      // let isNull=true;
      // let isBaseball=false;
      // for (url of this.nfts){
      //   if (url.previewUrl) isNull=false;
      //
      //   if (url.originalUrl && url.originalUrl.toString().includes("crypto-baseball")) isBaseball= true;
      // }
      //
      // if  (isNull || isBaseball){
      //   window.location.reload();
      // }
      //'https://api.opensea.io/api/v1/asset/0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb/'+this.ind+'/'
      //'https://api.opensea.io/api/v1/assets?order_direction=asc&offset=&limit=18'
      //'https://api.opensea.io/api/v1/assets?order_by=sale_date&order_direction=desc&offset=0&limit=20'


      this.getFilteredNfts(18);

      setInterval(this.main,5000)








    },
    computed: {


    }


  }
</script>
<style scoped>

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
.img  {
  webkit-filter: blur(4px); /* Chrome, Safari, Opera */
  filter: blur(4px);
}

</style>
