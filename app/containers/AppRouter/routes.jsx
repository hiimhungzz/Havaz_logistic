import { AuthorizedLayout, GuestLayout } from "components";
import SignIn from "containers/SignIn/Loadable";
import _ from "lodash";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Order from "containers/Order/Loadable";
import XuatHangVpVp from "containers/Bang-ke/Xuat-hang-vp-vp/Loadable";
import XuatHangXeTuyen from "containers/Bang-ke/Xuat-hang-xe-tuyen/Loadable";
import NhapHangVp from "containers/Bang-ke/Nhap-hang-vp/Loadable";
import NhapHangTaiNha from "containers/Bang-ke/Nhan-hang-tai-nha/Loadable";
import ManagementOffice from "containers/Management/Office/Loadable";
import ManagementStaff from "containers/Management/Staff/Loadable";
import ManagementVehicle from "containers/Management/Vehicle/Loadable";
import ManagementDriver from "containers/Management/Driver/Loadable";
import ManagementModeration from "containers/Management/Moderation/Loadable";
import RevenueTrip from "containers/Report/RevenueTrip/Loadable";
import RevenueDate from "containers/Report/RevenueDate/Loadable";
import RevenueStaff from "containers/Report/RevenueStaff/Loadable";
import DoanhThuVanPhongNhan from "containers/Report/DoanhThuVanPhongNhan/Loadable";
import PhatHang from "containers/Report/PhatHang/Loadable";
import RevenueCustomer from "containers/Report/RevenueCustomer/Loadable";
import RevenueOffice from "containers/Report/RevenueOffice/Loadable";
import OperateExport from "containers/Report/OperateExport/Loadable";
import OperateImport from "containers/Report/OperateImport/Loadable";
import HangNhan from "containers/Report/HangNhan/Loadable";
import TotalReport from "containers/Report/TotalReport/Loadable";
import Delivery from "containers/Delivery/Loadable";
import Cod from "containers/Cod/Loadable";
import Tracking from "containers/Tracking/Loadable";
import ChatLuong from "containers/Chat-luong/Loadable";
import Region from "containers/Price-List/Region";
import Service from "containers/Price-List/Service";
import Bill from "containers/Price-List/Bill";
import GroupCustomer from "containers/Price-List/GroupCustomer";
import Customer from "containers/Price-List/Customer";
import BillForMerchandise from "containers/Price-List/BillForMerchandise";
import BillCOD from "containers/Price-List/Bill-COD";
import DebtVehicle from "containers/Report/DebtVehicle/Loadable";
import CongNoTheoNhanVien from "containers/Report/congNoTheoNhanVien/Loadable";
import DebtCustomer from "containers/Report/DebtCustomer/Loadable";
import CollectMoney from "containers/Accountant/CollectMoney/Loadable";
import DanhSachHangNhan from "containers/Report/danhSachHangNhan/Loadable";
import DanhSachHangPhat from "containers/Report/danhSachHangPhat/Loadable";
import SupportHH from "containers/SupportHH/Loadable";
import NewFeature from "containers/SupportHH/NewFeature";
import KhoAll from "containers/Order/indexAll";
import SMS from "containers/SMS";
import DieuDo from "containers/Management/DieuDo/Loadable";

const TypeDomain = {
  'https://devhh.haivan.com/api': 'HẢI VÂN LOGISTICS',
  'https://api.cpn.haivanexpress.vn/api': 'HẢI VÂN LOGISTICS',
  'https://api.cpn.hasonhaivan.vn/api': 'HÀ SƠN HẢI VÂN LOGISTICS',
  'https://api.cpn.vungtau.havaz.vn/api': 'VÙNG TÀU LOGISTICS'
}

// Authorized router
export const MainRouter = (props) => {
  return (
    <Switch>
      {_.map(authorizedRoutes, (route, routeId) => {
        return <Route key={routeId} {...route} {...props} />;
      })}
    </Switch>);
};
// Các routes được public khi không đăng nhập
export const publicRoutes = [
  {
    path: "/signin",
    exact: true,
    layout: GuestLayout,
    component: SignIn,
  },

  // Main route, nếu chưa đăng nhập sẽ redirect về /signin
  {
    path: "/",
    layout: AuthorizedLayout,
    component: MainRouter,
  },
];

// Các nested routes trong route "/", truy cập sau khi đăng nhập
export const authorizedRoutes = [
  {
    path: "/orders",
    exact: true,
    component: Order,
  },
  {
    path: "/bang-ke/xuat-hang/vp-vp",
    // exact: true,
    component: XuatHangVpVp,
  },
  {
    path: "/bang-ke/xuat-hang/xe-tuyen",
    // exact: true,
    component: XuatHangXeTuyen,
  },
  {
    path: "/bang-ke/nhan-hang-tai-nha",
    component: NhapHangTaiNha,
  },
  {
    path: "/bang-ke/nhap-hang/vp",
    // exact: true,
    layout: AuthorizedLayout,
    component: NhapHangVp,
  },
  {
    path: "/management-office",
    exact: true,
    component: ManagementOffice,
  },
  {
    path: "/management-staff",
    exact: true,
    layout: AuthorizedLayout,
    component: ManagementStaff,
  },
  {
    path: "/management-vehicle",
    exact: true,
    component: ManagementVehicle,
  },
  {
    path: "/management-driver",
    exact: true,
    component: ManagementDriver,
  },
  {
    path: "/management-moderation",
    exact: true,
    component: DieuDo,
  },
  //báo cáoooooooooo
  {
    path: "/revenue-trip",
    exact: true,
    component: RevenueTrip,
  },
  {
    path: "/revenue-date",
    exact: true,
    component: RevenueDate,
  },
  {
    path: "/revenue-staff",
    exact: true,
    component: RevenueStaff,
  },
  {
    path: "/revenue-customer",
    exact: true,
    component: RevenueCustomer,
  },
  {
    path: "/revenue-office",
    exact: true,
    component: RevenueOffice,
  },

  {
    path: "/operate-import",
    exact: true,
    component: OperateImport,
  },
  {
    path: "/operate-export",
    exact: true,
    component: OperateExport,
  },
  {
    path: "/total-report",
    exact: true,
    component: TotalReport,
  },
  {
    path: "/cong-no/theo-xe",
    exact: true,
    component: DebtVehicle,
  },
  {
    path: "/cong-no/theo-nhan-vien",
    exact: true,
    component: CongNoTheoNhanVien,
  },
  {
    path: "/cong-no/theo-khach-hang",
    exact: true,
    component: DebtCustomer,
  },



  //bảng giá
  {
    path: "/price-list-region",
    exact: true,
    component: Region,
  },
  {
    path: "/price-list-service",
    exact: true,
    component: Service,
  },
  {
    path: "/price-list-bill",
    exact: true,
    component: Bill,
  },
  {
    path: "/price-list-group-customer",
    exact: true,
    component: GroupCustomer,
  },
  {
    path: "/price-list-customer",
    exact: true,
    component: Customer,
  },
  {
    path: "/delivery",
    exact: true,
    component: Delivery,
  },
  {
    path: "/cod",
    exact: true,
    component: Cod,
  },
  {
    path: "/tracking",
    exact: true,
    component: Tracking,
  },
  {
    path: "/sms",
    exact: true,
    component: SMS,
  },
  {
    path: "/tracking/:ordersCode",
    exact: true,
    component: Tracking,
  },
  {
    path: "/chat-luong",
    exact: true,
    component: ChatLuong,
  },
  {
    path: "/bill-for-merchandise",
    exact: true,
    component: BillForMerchandise,
  },
  {
    path: "/bill-for-cod",
    exact: true,
    component: BillCOD,
  },
  ////////////////// kế toán
  {
    path: "/accountant-collectmoney",
    exact: true,
    component: CollectMoney,
  },
  {
    path: "/bao-cao/doanh-thu-van-phong-nhan",
    exact: true,
    component: DoanhThuVanPhongNhan,
  },
  {
    path: "/bao-cao/phat-hang",
    exact: true,
    component: PhatHang,
  },
  {
    path: "/bao-cao/hang-nhan",
    exact: true,
    component: HangNhan,
  },
  {
    path: "/bao-cao/danh-sach-hang-nhan",
    exact: true,
    component: DanhSachHangNhan,
  },
  {
    path: "/bao-cao/danh-sach-hang-phat",
    exact: true,
    component: DanhSachHangPhat,
  },
  {
    path: "/orders/all",
    exact: true,
    component: KhoAll,
  },
  {
    path: "/support",
    exact: true,
    component: SupportHH,
  },
  {
    path: "/support/new-feature",
    exact: true,
    component: NewFeature,
  },




  // {
  //   path: "/management/dieudo",
  //   exact: true,
  //   component: DieuDo,
  // },



  {
    exact: true,
    path: "/",
    component: () => {
      return (
        <h2 className="d-flex justify-content-center align-content-center mb-0">
          {TypeDomain[process.env.REACT_APP_API_BASE_URL]}
        </h2>
      );
    },
  },
];
