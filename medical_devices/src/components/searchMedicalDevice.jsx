import React, {createRef, useState} from "react";
import { Button } from "reactstrap";
import { View, TextInput } from 'react-native';

import axios from "axios";
import "./styles/searchMedicalDevice.css";
import {DEVICE_INFO_URL, EUDAMED_URL, FDA_URL} from "../constants";

class SearchMedicalDevice extends React.Component {

  constructor() {
    super();
    this.state = {
      fdaTableInfo: [],
      eudamedTableInfo: [],
      tableInfo: [],
      renderTables: false,
      showAllDevices: false,
      searchValue: "",
    }
    this.searchInputRef = createRef();
  }

  componentDidMount() {
    this.searchInputRef.current.focus();
  }

  /**
   * Fetches medical device information from different URLs based on the search value provided by the user.
   * Updates the state with the retrieved data to render tables accordingly.
   * It also set the state to show the tables with duplicates to false, in case a table is already on the screen and it's a new search.
   */
  getMedicalDevicesInfo() {
    this.setState({showAllDevices: false});

    axios.get(FDA_URL, {
      params: {
        device_name: this.state.searchValue,
      }
    }).then((res) => this.setState({ fdaTableInfo: res.data, renderTables: true }));

    axios.get(EUDAMED_URL, {
      params: {
        device_name: this.state.searchValue,
      }
    }).then((res) => this.setState({ eudamedTableInfo: res.data, renderTables: true }));

    axios.get(DEVICE_INFO_URL, {
      params: {
        device_name: this.state.searchValue,
      }
    }).then((res) => this.setState({ tableInfo: res.data, renderTables: true }));
  }

  /**
   * Clears the page by resetting the the information on all the tables. It also passes the state renderTables to false who is responsible for rendering the tables.
   */
  clearPage = () => {
    this.setState({eudamedTableInfo: [], fdaTableInfo: [], tableInfo: [], renderTables: false});
  }

  /**
   * Generates a table displaying FDA information.
   * Checks if rendering tables are enabled and if FDA table information is available.
   * Constructs table rows with FDA data if available, otherwise displays a message for no devices found.
   * @returns {Array} Array of JSX elements representing the FDA table or a message if no devices are found.
   */
  drawFdaTable = () => {
    const items = [];

    if (this.state.renderTables) {
      items.push(
        <div className="table-title">
          <h1>Fda Table</h1>
        </div>
      );
    }

    if (this.state.fdaTableInfo.length > 0 && this.state.renderTables) {
      items.push(
        <div>
          <table style={{overflowX: 'auto'}}>
            <thead>
            <tr>
              <th>Device Name</th>
              <th>K Number</th>
              <th>Manufacturer Name</th>
              <th>Contact</th>
              <th>Address1</th>
              <th>Address2</th>
              <th>City</th>
              <th>State</th>
              <th>Country Code</th>
              <th>Zip Code</th>
              <th>Postal Code</th>
              <th>Date Received</th>
              <th>Decision Date</th>
              <th>Decision Description</th>
              <th>Product Code</th>
              <th>Statement or Summary</th>
              <th>Clearance Type</th>
              <th>Third Party Flag</th>
              <th>Expedited Review Flag</th>
              <th>URL</th>
              <th>Device Description</th>
              <th>Medical Specialty Description</th>
              <th>Device Class</th>
              <th>Regulation Number</th>
              <th>Submission Type ID</th>
            </tr>
            </thead>
            <tbody>
            {this.state.fdaTableInfo.map(item => (
              <tr key={item["k_number"]}>
                <td>{item["device_name"]}</td>
                <td>{item["k_number"]}</td>
                <td>{item["manufacturer_name"]}</td>
                <td>{item["contact"]}</td>
                <td>{item["address1"]}</td>
                <td>{item["address2"]}</td>
                <td>{item["city"]}</td>
                <td>{item["state"]}</td>
                <td>{item["country_code"]}</td>
                <td>{item["zip_code"]}</td>
                <td>{item["postal_code"]}</td>
                <td>{item["date_received"]}</td>
                <td>{item["decision_date"]}</td>
                <td>{item["decision_description"]}</td>
                <td>{item["product_code"]}</td>
                <td>{item["statement_or_summary"]}</td>
                <td>{item["clearance_type"]}</td>
                <td>{item["third_party_flag"]}</td>
                <td>{item["expedited_review_flag"]}</td>
                <td>{item["url"]}</td>
                <td>{item["device_description"]}</td>
                <td>{item["medical_specialty_description"]}</td>
                <td>{item["device_class"]}</td>
                <td>{item["regulation_number"]}</td>
                <td>{item["submission_type_id"]}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (this.state.renderTables && this.state.fdaTableInfo.length === 0) {
      items.push(
        <div className="no-devices-found-message">
          <h4>No devices found under that name. Please try again.</h4>
        </div>
      );
    }

    return items;
  }

  /**
   * Generates a table displaying Eudamed information.
   * Checks if rendering tables are enabled and if Eudamed table information is available.
   * Constructs table rows with Eudamed data if available, otherwise displays a message for no devices found.
   * @returns {Array} Array of JSX elements representing the Eudamed table or a message if no devices are found.
   */
  drawEudamedTable = () => {
    const items = [];

    if (this.state.renderTables) {
      items.push(
        <div className="table-title">
          <h1>Eudamed Table</h1>
        </div>
      );
    }

    if (this.state.eudamedTableInfo.length > 0 && this.state.renderTables) {
      items.push(
        <div>
          <table style={{overflowX: 'auto'}}>
            <thead>
            <tr>
              <th>Device Name</th>
              <th>Basic UDI</th>
              <th>Primary DI</th>
              <th>UUID</th>
              <th>ULID</th>
              <th>Basic UDI DI Data ULID</th>
              <th>Risk Class</th>
              <th>Manufacturer Name</th>
              <th>Manufacturer SRN</th>
              <th>Device Status Type</th>
              <th>Manufacturer Status</th>
              <th>Latest Version</th>
              <th>Version Number</th>
              <th>Reference</th>
              <th>Basic UDI Data Version Number</th>
              <th>Container Package Count</th>
              <th>Authorised Representative SRN</th>
              <th>Authorised Representative Name</th>
            </tr>
            </thead>
            <tbody>
            {this.state.eudamedTableInfo.map(device => (
              <tr key={device["primary_di"]}>
                <td>{device["device_name"]}</td>
                <td>{device["basic_udi"]}</td>
                <td>{device["primary_di"]}</td>
                <td>{device["uuid"]}</td>
                <td>{device["ulid"]}</td>
                <td>{device["basic_udi_di_data_ulid"]}</td>
                <td>{device["risk_class"]}</td>
                <td>{device["manufacturer_name"]}</td>
                <td>{device["manufacturer_srn"]}</td>
                <td>{device["device_status_type"]}</td>
                <td>{device["manufacturer_status"]}</td>
                <td>{device["latest_version"]}</td>
                <td>{device["version_number"]}</td>
                <td>{device["reference"]}</td>
                <td>{device["basic_udi_data_version_number"]}</td>
                <td>{device["container_package_count"]}</td>
                <td>{device["authorised_representative_srn"]}</td>
                <td>{device["authorised_representative_name"]}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (this.state.renderTables) {
      if(this.state.eudamedTableInfo.length === 0) {
        items.push(
        <div className="no-devices-found-message">
          <h4>No devices found under that name. Please try again.</h4>
        </div>
      )}
    }

    return items;
  }

  /**
   * Generates a table based on the data from both FDA and Eudamed.
   * When a device element is not found in one of the tables it displays a message saying it was not found. 
   * @returns {Array} Array of JSX elements representing the table structure.
   */
  drawTable = () => {
    const items = [];

    if (this.state.renderTables) {
      items.push(
        <div className="table-title">
          <h1>Device Information</h1>
        </div>
      );
    }

    if (this.state.tableInfo.length > 0 && this.state.renderTables) {
      items.push(
        <div>
          <table>
            <thead>
            <tr>
              <th>Device Name</th>
              <th>K Number</th>
              <th>Manufacturer Name</th>
              <th>Contact</th>
              <th>Address 1</th>
              <th>Address 2</th>
              <th>City</th>
              <th>State</th>
              <th>Country Code</th>
              <th>Zip Code</th>
              <th>Postal Code</th>
              <th>Date Received</th>
              <th>Decision Date</th>
              <th>Decision Description</th>
              <th>Product Code</th>
              <th>Statement or Summary</th>
              <th>Clearance Type</th>
              <th>Third Party Flag</th>
              <th>Expedited Review Flag</th>
              <th>URL</th>
              <th>Device Description</th>
              <th>Medical Specialty Description</th>
              <th>Device Class</th>
              <th>Regulation Number</th>
              <th>Submission Type ID</th>
              <th>Basic UDI</th>
              <th>Primary DI</th>
              <th>UUID</th>
              <th>ULID</th>
              <th>Basic UDI DI Data ULID</th>
              <th>Risk Class</th>
              <th>Manufacturer SRN</th>
              <th>Device Status Type</th>
              <th>Manufacturer Status</th>
              <th>Latest Version</th>
              <th>Version Number</th>
              <th>Reference</th>
              <th>Basic UDI Data Version Number</th>
              <th>Container Package Count</th>
              <th>Authorised Representative SRN</th>
              <th>Authorised Representative Name</th>
            </tr>
            </thead>
            <tbody>
              {this.state.tableInfo.map((item, index) => {
                console.log(item.url)
                const tableRow = [(
                  <tr key={index}>
                    <td>{item["device_name"]}</td>
                    <td>{item["k_number"]}</td>
                    <td>{item["manufacturer_name"]}</td>
                    <td>{item["contact"]}</td>
                    <td>{item["address1"]}</td>
                    <td>{item["address2"]}</td>
                    <td>{item["city"]}</td>
                    <td>{item["state"]}</td>
                    <td>{item["country_code"]}</td>
                    <td>{item["zip_code"]}</td>
                    <td>{item["postal_code"]}</td>
                    <td>{item["date_received"]}</td>
                    <td>{item["decision_date"]}</td>
                    <td>{item["decision_description"]}</td>
                    <td>{item["product_code"]}</td>
                    <td>{item["statement_or_summary"]}</td>
                    <td>{item["clearance_type"]}</td>
                    <td>{item["third_party_flag"]}</td>
                    <td>{item["expedited_review_flag"]}</td>
                    <td><a href={item.url} target="_blank" rel="noopener noreferrer">{item.url !== undefined ? "Link" : ""}</a></td>
                    <td>{item["device_description"]}</td>
                    <td>{item["medical_specialty_description"]}</td>
                    <td>{item["device_class"]}</td>
                    <td>{item["regulation_number"]}</td>
                    <td>{item["submission_type_id"]}</td>
                    <td>{item["basic_udi"]}</td>
                    <td>{item["primary_di"]}</td>
                    <td>{item["uuid"]}</td>
                    <td>{item["ulid"]}</td>
                    <td>{item["basic_udi_di_data_ulid"]}</td>
                    <td>{item["risk_class"]}</td>
                    <td>{item["manufacturer_srn"]}</td>
                    <td>{item["device_status_type"]}</td>
                    <td>{item["manufacturer_status"]}</td>
                    <td>{item["latest_version"]}</td>
                    <td>{item["version_number"]}</td>
                    <td>{item["reference"]}</td>
                    <td>{item["basic_udi_data_version_number"]}</td>
                    <td>{item["container_package_count"]}</td>
                    <td>{item["authorised_representative_srn"]}</td>
                    <td>{item["authorised_representative_name"]}</td>
                  </tr>

                )]

                if (typeof item["primary_di"] === "undefined") {
                  tableRow.push(
                    <tr key={"eudamed-not-found"}>
                      <td
                        style={{position: "sticky", alignContent: "center", color: "red"}}
                        colSpan="41">{`Device ${item.device_name} from ${item["manufacturer_name"]} not found on Eudamed table`}</td>
                    </tr>
                  )
                }

                if (typeof item["k_number"] === "undefined") {
                  tableRow.push(
                    <tr key={"fda-not-found"}>
                      <td
                        style={{position: "sticky", alignContent: "center", color: "red"}}
                        colSpan="41">{`Device ${item.device_name} from ${item["manufacturer_name"]} not found on Fda table`}</td>
                    </tr>
                  )
                }
                return tableRow;
              })}
            </tbody>
          </table>
        </div>
      );
    }
    if (this.state.renderTables) {
      if (this.state.tableInfo.length === 0) {
        items.push(
          <div className="no-devices-found-message">
            <h4>No devices found under that name on both tables. Please try again.</h4>
          </div>
        )
      }
    }

    return items;
  }

  /**
   * Toggles the visibility of the tables that render all the entries found for the device name searched.
   */
  handleToggle = () => {
    this.setState(prevState => ({
      showAllDevices: !prevState.showAllDevices
    }));
  }

  /**
   * Renders the search interface for medical devices.
   * Allows users to input device name queries, trigger search actions, and display search results in tables.
   * Also provides options to show all the devices found (even duplicates), toggle the visibility of this tables and clear the page.
  */
  render() {
    return (
      <div>
        <View id="searchMedicalDevice">
          <TextInput
            id="searchInput"
            placeholder="Search..."
            value={this.state.searchValue}
            onChangeText={(e) => this.setState({searchValue: e})}
            onSubmitEditing={() => this.getMedicalDevicesInfo()}
            ref={this.searchInputRef}
          />
          <Button onClick={() => this.getMedicalDevicesInfo()}>Search</Button>
        </View>
        {this.state.renderTables &&
          this.drawTable()
        }
        {this.state.showAllDevices &&
          <>
            {this.drawFdaTable()}
            {this.drawEudamedTable()}
          </>
        }
        {(this.state.renderTables && this.state.tableInfo.length > 0) &&
          <div id="show-all-devices-button">
            <button onClick={this.handleToggle}>
              {this.state.showAllDevices ? 'Hide all devices' : 'Show all devices'}
            </button>
          </div>
        }
        {(this.state.renderTables || this.state.renderTables) &&
          <div id="clear-button">
            <button onClick={this.clearPage}>Clear page</button>
          </div>
        }
      </div>
    )
  }
}

export default SearchMedicalDevice;