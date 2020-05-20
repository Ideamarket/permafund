<template>
    <div class="container">
        <q-input filled v-model="address" label="Recipient Address" />
        <div class="btnContainer">
            <q-btn color="primary" label="Create" class="btn" :disable="buttonsDisabled" @click="createClicked" />
            <q-btn color="primary" label="Donate" class="btn" :disable="buttonsDisabled" @click="donateClicked" />
            <q-btn color="primary" label="Pay Interest" class="btn" :disable="buttonsDisabled" @click="payInterestClicked" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'PermafundInteraction',
  data () {
    return {
      address: '',
      buttonsDisabled: false
    }
  },
  methods: {
    createClicked: function () {
      this.buttonsDisabled = true
      this.$store.dispatch('permafund/create', this.address)
        .catch((err) => {
          this.$q.notify({
            message: err.toString(),
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
        })
        .finally(() => {
          this.buttonsDisabled = false
        })
    },
    donateClicked: function () {
      this.buttonsDisabled = true
      console.log(this.address)
    },
    payInterestClicked: function () {
      this.buttonsDisabled = true
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
