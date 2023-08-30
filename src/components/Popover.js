import React, { useState } from "react";
import { Button, Popover } from "antd";
import styles from "../styles/style.less";
import { Input } from "antd";
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterFetchNumber,
  setFilterState,
} from "../actions/filter.action.js";
import axios from "axios";
import axiosData from "../utils/axiosData.js";
import Loading from "./Loading";
import {
  getAllAppUpdates,
  setFetchNumber,
  getAnUpdate,
} from "../actions/appupdate.action";

const baseURL = process.env.REACT_APP_BASE_URL;
const appUpdateUrl = `${baseURL}/rbq-admin/appVersion/mobile`;

const PopoverComponent = (props) => {
  const storeFilter = useSelector((state) => state.filter);
  const appUpdate = useSelector((state) => state.appUpdate);
  const { filterFetchLimit, filterStates: filterState } = storeFilter;
  const dispatch = useDispatch();
  const [IDData, setDataId] = useState("");
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);

  const { singleUpdate, allUpdates } = appUpdate;
  const {
    headerText,
    buttonText,
    className,
    dataId,
    fetchData,
    popChange,
    updateVisible,
    placement,
    updateLoading,
  } = props;
  const [visible, setVisible] = React.useState(false);
  const hide = () => {
    setVisible(() => false);
  };

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };
  const onChange = (event) => {
    const { name, value } = event.target;
    dispatch(setFilterState({ [name]: value }));
  };

  const clearFilter = () => {
    return {
      platformType: "",
      appType: "",
      releaseDate: "",
      versionId: "",
      versionNumber: "",
      redirectUrl: "",
    };
  };
  const {
    platformType,
    appType,
    releaseDate,
    versionId,
    versionNumber,
    redirectUrl,
  } = filterState;

  const appData = {
    appType,
    releaseDate,
    versionId,
    versionNumber,
    appUpdateId: IDData,
    platformType,
    redirectUrl,
  };
  const createData = {
    appType,
    releaseDate,
    versionId,
    versionNumber,
    platformType,
    redirectUrl,
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(() => true);
      appData.appUpdateId = IDData;
      const data = {
        method: "PUT",
        body: appData,
        url: appUpdateUrl,
      };
      const result = await axiosData(data);
      const updatedData = result?.data;
      const cloned = [...allUpdates];
      const indexedData = cloned.findIndex(
        (data) => data._id === updatedData._id,
      );
      cloned.splice(indexedData, 1, updatedData);

      dispatch(getAllAppUpdates(cloned));
      dispatch(setFilterState(clearFilter()));
      hide();
      addToast("App Version Updated", {
        appearance: "success",
        autoDismiss: true,
      });
      setLoading(() => false);
    } catch (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(() => false);
    }
  };
  const createHandler = async (e) => {
    e.preventDefault();
    dispatch(setFilterState(clearFilter()));
    const controller = axios.CancelToken.source();
    try {
      setLoading(() => true);
      const data = {
        method: "POST",
        body: createData,
        url: appUpdateUrl,
      };
      const result = await axiosData(data);
      if (result.status === "success") {
        hide();
        addToast("New App Version Created", {
          appearance: "success",
          autoDismiss: true,
        });
        fetchData(controller);
      }
      return setLoading(() => false);
    } catch (error) {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
      setLoading(() => false);
    }
  };

  const content = (
    <div className="min-h-40vh text-center" style={{ width: 350 }}>
      <h3
        className="uppercase mb-4 font-extrabold text-base"
        style={{ color: "#161745" }}
      >
        {headerText}
      </h3>
      <div>{props.children}</div>
      <div className="flex justify-center items-center">
        <Button
          className="text-white mr-4 flex-1"
          style={{ backgroundColor: "#161745", color: "#ffffff" }}
          onClick={
            headerText === "Create New App Version"
              ? createHandler
              : submitHandler
          }
          disabled={updateLoading || loading}
        >
          Submit
        </Button>
        <Button
          className="flex-1"
          style={{ border: "#161745 1px solid", color: "#161745" }}
          onClick={() => dispatch(setFilterState(clearFilter()))}
          disabled={updateLoading || loading}
        >
          Clear
        </Button>
      </div>
    </div>
  );
  return (
    <div className={className}>
      <Popover
        content={content}
        trigger="click"
        placement={placement ?? "left"}
        // overlayClassName="filter-container"
        visible={updateVisible || visible}
        onVisibleChange={popChange || handleVisibleChange}
      >
        <Button
          className={`text-white mr-4`}
          style={{ backgroundColor: "#161745", color: "#ffffff" }}
          onClick={(e) => {
            if (headerText === "Create New App Version") {
              return setVisible(() => true);
            }
            setVisible(() => true);
            const data = allUpdates.find((update) => {
              return update._id === e.currentTarget.dataset.dataid;
            });

            dispatch(
              setFilterState({
                platformType: data?.platformType,
                appType: data?.appType,
                releaseDate: data?.releaseDate,
                versionId: data?.versionId,
                versionNumber: data?.versionNumber,
                redirectUrl: data?.redirectUrl,
              }),
            );
            return setDataId(e.currentTarget.dataset.dataid);
          }}
          data-dataid={dataId}
        >
          {buttonText}
        </Button>
      </Popover>
      {loading && <Loading />}
    </div>
  );
};

export default PopoverComponent;
