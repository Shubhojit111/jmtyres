/* Assets.jsx — the single URL-string entry point for every photograph and the original shop mark. */
import AboutAdventure from "./images/AboutAdventure.jpg";
import AboutPassenger from "./images/AboutPassenger.jpg";
import CommercialTruck from "./images/CommercialTruck.jpg";
import ConfidenceWheel from "./images/ConfidenceWheel.jpg";
import HeroMountainDrive from "./images/HeroMountainDrive.jpg";
import InspectionWorkshop from "./images/InspectionWorkshop.jpg";
import MotorcycleWheel from "./images/MotorcycleWheel.jpg";
import PassengerSedan from "./images/PassengerSedan.jpg";
import ShopMark from "./images/ShopMark.png";
import Storefront from "./images/Storefront.jpg";
import TireStacks from "./images/TireStacks.jpg";
import TireTread from "./images/TireTread.jpg";
import WorkshopFitting from "./images/WorkshopFitting.jpg";

const asset = (image) => (typeof image === "string" ? image : image.src);

const Assets = {
  AboutAdventure: asset(AboutAdventure),
  AboutPassenger: asset(AboutPassenger),
  CommercialTruck: asset(CommercialTruck),
  ConfidenceWheel: asset(ConfidenceWheel),
  HeroMountainDrive: asset(HeroMountainDrive),
  InspectionWorkshop: asset(InspectionWorkshop),
  MotorcycleWheel: asset(MotorcycleWheel),
  PassengerSedan: asset(PassengerSedan),
  ShopMark: asset(ShopMark),
  Storefront: asset(Storefront),
  TireStacks: asset(TireStacks),
  TireTread: asset(TireTread),
  WorkshopFitting: asset(WorkshopFitting),
};

export default Assets;
