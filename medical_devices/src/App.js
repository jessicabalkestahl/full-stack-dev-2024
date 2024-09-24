import './App.css';
import {Component, Fragment} from "react";
import SearchMedicalDevice from "./components/searchMedicalDevice";

class App extends Component {
  render() {
    return (
      <Fragment>
        <SearchMedicalDevice />
      </Fragment>
    );
  }
}

export default App;
