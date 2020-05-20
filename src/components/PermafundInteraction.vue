<template>
    <div class="container">
        <q-input filled v-model="address" label="Recipient Address" />
        <div class="btnContainer">
            <q-btn color="primary" label="Create" class="btn" @click="createClicked" />
            <q-btn color="primary" label="Donate" class="btn" @click="donateClicked" />
            <q-btn color="primary" label="Pay Interest" class="btn" @click="payInterestClicked" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'PermafundInteraction',
  data () {
    return {
      address: ''
    }
  },
  methods: {
    createClicked: function () {
      console.log(this.address)
    },
    donateClicked: function () {
      console.log(this.address)
    },
    payInterestClicked: function () {
      console.log(this.address)
    }
  }
}
</script>

<style scoped>
.container {
    width: 100%;
}

.btnContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 10px;
}
.btn {
    width: 150px;
    max-width: 150px;
}
</style>
