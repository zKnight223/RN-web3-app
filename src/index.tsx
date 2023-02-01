import * as React from "react"
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  LogBox,
  AppState,
} from "react-native"
import { useWalletConnect } from "@walletconnect/react-native-dapp"
import Picker from "react-native-dropdown-picker"
import { Toast, ALERT_TYPE } from "react-native-alert-notification"
const Web3 = require("web3")

function Label(props: { children: any }) {
  return <Text style={styles.label}>{props.children}</Text>
}

function SubmitButton(props: { txInfo: any }) {
  const connector = useWalletConnect()

  const connectWallet = React.useCallback(() => {
    return connector.connect({ chainId: 57 })
  }, [connector])

  const appState = React.useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current)

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!")
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
      console.log("AppState", appState.current)
    })

    return () => {
      console.log("Exit")
      subscription.remove()
    }
  }, [])

  const submitTransaction = React.useCallback(() => {
    if (connector.chainId === 1 && props.txInfo.currency === "eth") {
      connector.on("chainChanged", () => {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Confirmed",
          autoClose: 5000,
        })
      })
      connector
        .sendTransaction({
          from: connector.accounts[0],
          to: props.txInfo.address,
          value: Web3.utils.toWei(Web3.utils.toBN(props.txInfo.amount)),
        })
        .then(() => {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Confirmed",
            autoClose: 5000,
          })
        })
        .catch((reason) => {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: String(reason),
            autoClose: 5000,
          })
        })
    } else if (
      Number(connector.chainId) === 56 &&
      props.txInfo.currency === "bnb"
    ) {
      connector
        .sendTransaction({
          from: connector.accounts[0],
          to: props.txInfo.address,
          value: Web3.utils.toWei(Web3.utils.toBN(props.txInfo.amount)),
        })
        .then(() => {
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Confirmed",
            autoClose: 5000,
          })
        })
        .catch((reason) => {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: String(reason),
            autoClose: 5000,
          })
        })
    }
  }, [props.txInfo])

  return (
    <>
      {!connector.connected ? (
        <TouchableOpacity onPress={connectWallet} style={styles.button}>
          <Text style={styles.buttonTitle}>Connect Wallet</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={submitTransaction} style={styles.button}>
          <Text style={styles.buttonTitle}>Submit</Text>
        </TouchableOpacity>
      )}
    </>
  )
}

export default function Layout() {
  const [address, setAddress] = React.useState<string>("")
  const [amount, setAmount] = React.useState<string>("0")
  const [open, setOpen] = React.useState<boolean>(false)
  const [currency, setValue] = React.useState(null)
  const [items, setItems] = React.useState([
    { label: "BNB", value: "bnb" },
    { label: "BUSD", value: "busd" },
    { label: "ETH", value: "eth" },
  ])

  return (
    <>
      <Text style={{ fontSize: 24, fontWeight: "600" }}>Send Crypto</Text>
      <Label>To</Label>
      <TextInput
        value={address}
        onChangeText={(value) => setAddress(value)}
        style={styles.textInput}
        placeholder="Enter Wallet Address: 0x00...000"
      />
      <Label>Currency</Label>
      <Picker
        items={items}
        setItems={setItems}
        setValue={setValue}
        value={currency}
        open={open}
        setOpen={setOpen}
        style={styles.pickerButton}
        containerStyle={styles.picker}
        dropDownContainerStyle={{
          borderColor: "purple",
        }}
        placeholder={"Select a currency"}
      />
      <Label>Amount</Label>
      <TextInput
        value={amount.toString()}
        onChangeText={(value) => setAmount(value.replace(/[^0-9.]/g, ""))}
        style={styles.textInput}
        keyboardType="numeric"
      />
      <SubmitButton txInfo={{ currency, address, amount }} />
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0cc",
    color: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "60%",
    marginTop: 40,
  },
  buttonTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  label: {
    color: "purple",
    fontSize: 16,
    fontWeight: "500",
    width: "80%",
    marginBottom: 10,
  },
  textInput: {
    color: "black",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "purple",
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    width: "80%",
    marginBottom: 25,
  },
  pickerButton: {
    borderColor: "purple",
  },
  picker: {
    width: "80%",
    borderColor: "purple",
    zIndex: 999999,
    marginBottom: 25,
  },
})
