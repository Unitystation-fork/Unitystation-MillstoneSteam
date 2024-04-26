<template>
  <footer class="footerStyle">
    <div class="container">
      <div class="news">
        <h2>Nos actualités</h2>
        <a
          href="https://github.com/Unitystation-fork/Unitystation-MillstoneSteam"
          ><span class="material-symbols-outlined"> code </span> Code Source</a
        >
        <a href="https://www.unitystation.org"
          ><span class="material-symbols-outlined"> sports_esports </span>Suivre
          l'actualité d'UnityStation</a
        >
        <a href="http://site.unionrolistes.fr/"
          ><span class="material-symbols-outlined"> language </span> En savoir
          plus sur l'Union des Rôlistes</a
        >
      </div>
      <div>
        <h2>Nos réseaux sociaux</h2><br>
        <section class="links">
          <a href="https://t.co/Xv1P9jdJLR"
            ><img
              src="~/assets/img/discord-black-icon-1.png"
              alt="Notre Discord"
          /></a>
          <a href="https://twitter.com/URolistes"
            ><img
              class="twitter"
              src="~/assets/img/twitterlogo.png"
          /></a>
          <a href="https://www.facebook.com/union.rolistes/"
            ><img src="~/assets/img/facebook-logo-3-1.png" alt="Notre facebook"
          /></a>
        </section>
      </div>
      <div>
        <h2>Nous contacter</h2><br>
        <a
          href="mailto:contact.unionrolistes@gmail.com
"
          ><span class="material-symbols-outlined"> alternate_email </span>Nous
          écrire</a
        >
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footerStyle {
  /* min-height: 10em; */
  background-color:#6665d2; /*#8c9cff*/
  margin-top: 25px;
  width: 100%;
}

img {
  width: 2.5em;
  height: 2.5em;
  margin: 0 0.5em;
  filter: invert(100%);
  border-radius: 50%;
}

a {
  color: white;
  text-decoration: none;
  font-size: 1em;
  margin: 0 0.5em;
  display: block;
  cursor: pointer;
}

a:hover {
  color: #171e27;
}

span {
  font-size: 1.5em;
  margin: 0 0.2em;
  vertical-align: middle;
}

.container {
  width: 100%;
  min-height: 10em;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
.news{
  width : 40%;
}
div{
  width: 30%;
  font-size: 1.4vw;
  text-align: center;
}
.links {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
