<template>
    <div class="no_data">
        <img class="img" src="@/assets/images/nodae.png" />
    </div>
</template>

<script>
export default {
    name: 'Nodata',
}
</script>

<style lang="less" scoped>
.no_data{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .img{
        width: 220px;
    }
}
    
</style>