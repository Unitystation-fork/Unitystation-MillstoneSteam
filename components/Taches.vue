<template>
    <div>
        
    </div>
    <div class="list" >
        <input class="space colorBlack" type="text">
        <select class="space colorBlack" name="level">
            <option class="colorBlack" value="">Fait</option>
            <option class="colorBlack" value="">En cours</option>
        </select>
        <p class="space">X Supprimer la tache</p>
    </div>
    <h1 v-if="showForm.value = true" >o no</h1>
    <h1 v-else>o no</h1>

    
</template>

<script>
export default{

}
</script>


<style>
.list{
    
    display: flex;
    justify-content: flex-start;
    max-width: 75%;
    margin: 0 auto;
    margin-top: 5rem;
    padding: 30px;
}

.space{
    margin-right: 50px;
}

.colorBlack{
    color: black;
}
</style>