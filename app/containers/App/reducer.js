/*
 *
 * DemoApp reducer
 *
 */
import { Map, fromJS } from "immutable";
import Globals from "utils/globals";
import _ from "lodash";
import setupSession from "utils/setupSession";
import { browseTrip, browseRoute, browseGlobalConfig } from "./actions";
import { SET_AUTHENTICATED, LOGOUT, SET_LEFT_MENU } from "./constants";
import { normalize, schema } from "normalizr";


setupSession();
export const initialState = Map({
  isAuthenticated: Globals.isAuthenticated || false,
  profile: Globals.currentUser || {},
  appConfig: Globals.currentUser || {},
  trip: Map({
    A: [],
    B: [],
  }),
  route: Map(),
  definitions: Map(),
});

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) => {
  let nextState = state;
  const { payload } = action;
  switch (action.type) {
    case browseTrip.SUCCESS:
      let A = [];
      let B = [];
      _.forEach(payload, (trip) => {
        const drivers = trip.drivers.map((item, index) => `${index === 0 ? '' : ', '}${item.name}`)
        let itemPush = {
          trip_id: trip.trip_id,
          route_id: trip.route_id,
          day: trip.day,
          not_code: trip.not_code,
          seats: `${trip.occupy_seats}/${trip.seats}`,
          time_run: `${trip.day} - ${trip.time_run}`,
          background: trip.trip_service.color,
          license_plate: trip.trip_bus?.license_plate,
          drivers: drivers,
        };
        if (trip.direction === 1) {
          A.push(itemPush);
        } else {
          B.push(itemPush);
        }
      });
      const tripSchema = new schema.Object({
        A: new schema.Array(
          new schema.Entity("A", {}, { idAttribute: "trip_id" })
        ),
        B: new schema.Array(
          new schema.Entity("B", {}, { idAttribute: "trip_id" })
        ),
      });
      const normalizedTripData = normalize({ A, B }, tripSchema);
      state = state.set("trip", Map(normalizedTripData.entities));
      return state;
    case browseRoute.SUCCESS:
      let searchRoute = _.map(payload, (pay) => ({
        key: pay.route_id,
        label: pay.route_name,
        value: pay.route_id,
      }));

      const normalizedRouteData = normalize(
        searchRoute,
        new schema.Array(new schema.Entity("route", {}, { idAttribute: "key" }))
      );
      state = state.set("route", Map(normalizedRouteData.entities.route));
      return state;
    case browseGlobalConfig.SUCCESS:
      const export_status = new schema.Entity(
        "export_statuses",
        {},
        { idAttribute: "key" }
      );
      const transshipment_status = new schema.Entity(
        "transshipment_statuses",
        {},
        { idAttribute: "key" }
      );
      const order_status = new schema.Entity(
        "order_statuses",
        {},
        { idAttribute: "key" }
      );
      const payment_type = new schema.Entity(
        "payment_types",
        {},
        { idAttribute: "key" }
      );
      const undelivered_reason = new schema.Entity(
        "undelivered_reasons",
        {},
        { idAttribute: "key" }
      );
      const issue_types = new schema.Entity(
        "issue_types",
        {},
        { idAttribute: "key" }
      );
      const driver_status = new schema.Entity(
        "driver_statuses",
        {},
        { idAttribute: "key" }
      );
      const service_type_product = new schema.Entity(
        "service_type_product",
        {},
        { idAttribute: "id" }
      );
      const unit = new schema.Entity(
        "units",
        {},
        { idAttribute: "key" }
      );
      const issue_compensation_method = new schema.Entity(
        "issue_compensation_method",
        {},
        { idAttribute: "key" }
      );
      const issue_compensation_side = new schema.Entity(
        "issue_compensation_side",
        {},
        { idAttribute: "key" }
      );
      const issue_feepaying_side = new schema.Entity(
        "issue_feepaying_side",
        {},
        { idAttribute: "key" }
      );
      const city = new schema.Entity(
        "cities",
        {},
        { idAttribute: "key" }
      );
      const issue_statuses = new schema.Entity(
        "issue_statuses",
        {},
        { idAttribute: "key" }
      );
      const shipment_order = new schema.Entity(
        "shipment_order_statuses",
        {},
        { idAttribute: "key" }
      );
      const bill_statuses = new schema.Entity(
        "bill_statuses",
        {},
        { idAttribute: "key" }
      );
      const group_role = new schema.Entity(
        "group_role",
        {},
        { idAttribute: "key" }
      );
      const car_type = new schema.Entity(
        "car_type",
        {},
        { idAttribute: "key" }
      );
      const bill_types = new schema.Entity(
        "bill_types",
        {},
        { idAttribute: "key" }
      );
      const exporting_item_statuses = new schema.Entity(
        "exporting_item_statuses",
        {},
        { idAttribute: "key" }
      );

      const bill_payment_type = new schema.Entity(
        "bill_payment_type",
        {},
        { idAttribute: "key" }
      );

      const order_note = new schema.Entity(
        "order_note",
        {},
        { idAttribute: "key" }
      );
      const responseSchema = new schema.Object({
        export_statuses: new schema.Array(export_status),
        transshipment_statuses: new schema.Array(transshipment_status),
        order_statuses: new schema.Array(order_status),
        payment_types: new schema.Array(payment_type),
        undelivered_reasons: new schema.Array(undelivered_reason),
        driver_statuses: new schema.Array(driver_status),
        units: new schema.Array(unit),
        cities: new schema.Array(city),
        issue_types: new schema.Array(issue_types),
        service_type_product: new schema.Array(service_type_product),
        issue_compensation_method: new schema.Array(issue_compensation_method),
        issue_compensation_side: new schema.Array(issue_compensation_side),
        issue_feepaying_side: new schema.Array(issue_feepaying_side),
        issue_statuses: new schema.Array(issue_statuses),
        shipment_order_statuses: new schema.Array(shipment_order),
        bill_statuses: new schema.Array(bill_statuses),
        bill_types: new schema.Array(bill_types),
        group_role: new schema.Array(group_role),
        car_type: new schema.Array(car_type),
        exporting_item_statuses: new schema.Array(exporting_item_statuses),
        bill_payment_type: new schema.Array(bill_payment_type),
        order_note: new schema.Array(order_note),
      });
      const normalizedData = normalize(payload, responseSchema);
      state = state.set("definitions", fromJS(normalizedData.entities));
      return state;
    case SET_AUTHENTICATED:
      nextState = nextState.set(
        "isAuthenticated",
        _.get(payload, "isAuthenticated")
      );
      nextState = nextState.set("profile", _.get(payload, "profile"));
      return nextState;

    case SET_LEFT_MENU:
      nextState = nextState.set(
        "appConfig", { ...initialState.get("appConfig"), leftMenu: payload }
      );
      return nextState;

    case LOGOUT:
      Globals.clear();
      nextState = nextState.set("isAuthenticated", false);
      nextState = nextState.set("profile", {});
      return nextState;
    default:
      return state;
  }
};

export default appReducer;
