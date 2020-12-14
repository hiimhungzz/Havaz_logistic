import React from "react";
import { List, fromJS } from "immutable";
import ServiceBase from "../ServiceBase";
import { API_BASE_URL } from "../constants";
import moment from 'moment';

const _loadOrders = async (param) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url: "/v1/orders?scope=should_exported",
    method: "GET",
    data: param,
  });
};

const useLoadOrders = () => {
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [orders, setOrders] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      const param = {
        page: 1,
        per_page: 1000000,
      }
      _loadOrders(param).then((result) => {
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        setOrders(
          fromJS(result.value.data).sortBy(
            (x) => x.get("create_time") && x.get("status")
          )
        );
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, orders, setOrders, setReLoad];
};

const _loadDrivers = async (param) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url:
      "/v1/nhan-vien/list-driver-tc?page=1&per_page=1000&phone=&name=&code=&active=true",
    method: "GET",
    data: param,
  });
};

const useLoadDrivers = () => {
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [data, setData] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      _loadDrivers().then((result) => {
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        setData(fromJS(result.value.data));
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, data, setData, setReLoad];
};



// 

const _loadDriversActive = async (param) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url:
      "/v1/nhan-vien/list-driver-tc?page=1&per_page=1000&phone=&name=&code=&active=1",
    method: "GET",
    data: param,
  });
};

const useLoadDriversActive = () => {
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [data, setData] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      _loadDriversActive().then((result) => {
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        setData(fromJS(result.value.data));
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, data, setData, setReLoad];
};
// 

const _loadVehicles = async (param) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url: "/v1/xe-trung-chuyen/list?page=1&per_page=10&phone=&bks=&active=1",
    method: "GET",
    data: param,
  });
};

const useLoadVehicles = () => {
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [data, setData] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      _loadVehicles().then((result) => {
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        setData(fromJS(result.value.data));
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, data, setData, setReLoad];
};

const _loadBangKeXuatHangXeTuyen = async (param) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url: "/v1/exportings",
    method: "GET",
    data: param,
  });
};

const useLoadBangKeXhXeTuyen = () => {
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [data, setData] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      _loadBangKeXuatHangXeTuyen().then((result) => {
        console.log("vao day", result)
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        let newCTables = fromJS(result.value.data).sortBy((x) =>
          x.get("status")
        );
        setData(newCTables);
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, data, setData, setReLoad];
};

const _loadBangKeXuatHangXeTrungChuyen = async (params) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url: `v1/transshipments?scope=transshipment&filterBy[create_date]=${params.begin},${params.finish}:btw`,
    method: "GET",
    data: {},
  });
};

const useLoadBangKeXhXeTrungChuyen = (filter) => {
  const params = {
    begin: moment(filter.toJS().begin).format("YYYY-MM-DD"),
    finish: moment(filter.toJS().finish).format("YYYY-MM-DD"),
  }
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [data, setData] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      _loadBangKeXuatHangXeTrungChuyen(params).then((result) => {
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        let newCTables = fromJS(result.value.data);
        console.log("newCTables", newCTables)
        setData(newCTables);
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, data, setData, setReLoad];
};
const _loadBangKeNhapHangVp = async (param) => {
  return await ServiceBase.requestJson({
    baseURL: API_BASE_URL,
    url: "/v1/importings",
    method: "GET",
    data: param,
  });
};

const useLoadBangKeNhapHangVp = () => {
  const [reload, setReLoad] = React.useState(false);
  const [firstLoad, setFirstLoad] = React.useState(true);
  const [data, setData] = React.useState(List());
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (firstLoad || reload) {
      setLoading(true);
      _loadBangKeNhapHangVp().then((result) => {
        if (firstLoad) {
          setFirstLoad(false);
        }
        setReLoad(false);
        let newCTables = fromJS(result.value.data);
        setData(newCTables);
        setLoading(false);
      });
    }
  }, [reload, firstLoad]);

  return [loading, data, setData, setReLoad];
};

export {
  useLoadOrders,
  useLoadBangKeXhXeTuyen,
  useLoadBangKeXhXeTrungChuyen,
  useLoadDrivers,
  useLoadVehicles,
  useLoadBangKeNhapHangVp,
  useLoadDriversActive
};
