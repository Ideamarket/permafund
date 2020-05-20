<template>
    <div class="container">
        <q-input filled v-model="address" label="Recipient Address" />
        <div class="btnContainer">
            <q-btn color="primary" label="Create" class="btn" :disable="buttonsDisabled" @click="createClicked" />
            <q-btn color="primary" label="Pay Interest" class="btn" :disable="buttonsDisabled" @click="payInterestClicked" />
        </div>
        <q-input filled v-model="donateAmount" label="Donation in DAI" style="margin-top: 45px;"/>
        <div class="btnContainer">
            <q-btn color="primary" label="Donate" class="btn" :disable="buttonsDisabled" @click="donateClicked" />
        </div>
    </div>
</template>

<script>
export default {
  name: 'PermafundInteraction',
  data () {
    return {
      address: '',
      donateAmount: '',
      buttonsDisabled: false
    }
  },
  methods: {
    createClicked: function () {
      this.buttonsDisabled = true
      this.$store.dispatch('permafund/create', this.address)
        .then(() => {
          this.$q.notify({
            message: 'Permafund created!',
            type: 'positive',
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
        })
        .catch((err) => {
          this.$q.notify({
            message: err.toString(),
            type: 'negative',
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
      this.$store.dispatch('permafund/donate', {
        recipientAddress: this.address,
        amount: this.donateAmount
      })
        .then(() => {
          this.$q.notify({
            message: 'Donated!',
            type: 'positive',
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
        })
        .catch((err) => {
          this.$q.notify({
            message: err.toString(),
            type: 'negative',
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
        })
        .finally(() => {
          this.buttonsDisabled = false
        })
    },
    payInterestClicked: function () {
      this.buttonsDisabled = true
      this.$store.dispatch('permafund/payInterest', this.address)
        .then(() => {
          this.$q.notify({
            message: 'Interest paid!',
            type: 'positive',
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
        })
        .catch((err) => {
          this.$q.notify({
            message: err.toString(),
            type: 'negative',
            actions: [
              { label: 'Dismiss', color: 'white', handler: () => { /* ... */ } }
            ]
          })
        })
        .finally(() => {
          this.buttonsDisabled = false
        })
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
    justify-content: space-around;
    margin-top: 10px;
}
.btn {
    width: 150px;
    max-width: 150px;
}
</style>
